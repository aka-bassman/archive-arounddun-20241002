// https://github.com/nestjs/graphql/issues/755
import * as Nest from "@nestjs/graphql";
import * as guards from "../nest/authGuards";
import { Access, Account, Me, MyKeyring, Req, Res, Self, Signature, UserIp } from "../nest";
import {
  Float,
  type GqlScalar,
  GuardType,
  ID,
  Int,
  InternalArgType,
  JSON,
  ResolveFieldMeta,
  ReturnType,
  Type,
  Upload,
  arraiedModel,
  copySignal,
  getArgMetas,
  getClassMeta,
  getFieldMetas,
  getGqlMetas,
  getNonArrayModel,
  getResolveFieldMetas,
  getSigMeta,
} from "../base";
import { GraphQLUpload } from "graphql-upload";
import { Inject, UseGuards } from "@nestjs/common";
import { capitalize } from "@core/common";
import { generateGql, generateGqlInput } from "./gql";
import { lowerlize } from "../common/lowerlize";
import GraphQLJson from "graphql-type-json";

const scalarNestReturnMap = new Map<GqlScalar, any>([
  [Upload, GraphQLUpload],
  [ID, Nest.ID],
  [Int, Nest.Int],
  [Float, Nest.Float],
  [JSON, GraphQLJson],
  [Boolean, Boolean],
  [Date, Date],
  [String, String],
  [Map, GraphQLJson],
]);
const getNestReturn = (returns: ReturnType, type: "input" | "object" = "object") => {
  const [model, arrDepth] = getNonArrayModel(returns() as Type);
  const modelRef = (scalarNestReturnMap.get(model) ??
    (type === "object" ? generateGql(model) : generateGqlInput(model))) as Type;
  return () => arraiedModel<Type>(modelRef, arrDepth);
};

const internalArgMap: { [key in Exclude<InternalArgType, "Ws" | "Job">] } = {
  Parent: Nest.Parent,
  Account,
  UserIp,
  Access,
  Signature,
  Self,
  Me,
  MyKeyring,
  Req,
  Res,
};

export const resolverOf = (sigRef: Type, allSrvs: { [key: string]: Type }) => {
  const Rsv = copySignal(sigRef);
  const sigMeta = getSigMeta(Rsv);
  const gqlMetas = getGqlMetas(Rsv);

  // 1. Inject All Services
  Object.keys(allSrvs).forEach((srv) => {
    Inject(allSrvs[srv])(Rsv.prototype, lowerlize(srv));
  });
  // 2. Resolve Query And Mutations
  for (const gqlMeta of gqlMetas) {
    if (
      gqlMeta.guards.some((guard) => guard === "None") ||
      gqlMeta.signalOption.onlyFor === "restapi" ||
      !["Query", "Mutation"].includes(gqlMeta.type)
    )
      continue;
    else if (gqlMeta.signalOption.sso) continue; // graphql does not support sso
    const [argMetas, internalArgMetas] = getArgMetas(Rsv, gqlMeta.key);
    const descriptor = Object.getOwnPropertyDescriptor(Rsv.prototype, gqlMeta.key) ?? {};

    for (const argMeta of argMetas) {
      Nest.Args({
        name: argMeta.name,
        type: getNestReturn(argMeta.returns, "input"),
        ...argMeta.argsOption,
      })(Rsv.prototype, gqlMeta.key, argMeta.idx);
    }
    for (const internalArgMeta of internalArgMetas) {
      const decorate = internalArgMap[internalArgMeta.type] as (option) => ParameterDecorator;
      decorate(internalArgMeta.option ?? {})(Rsv.prototype, gqlMeta.key, internalArgMeta.idx);
    }
    UseGuards(...gqlMeta.guards.map((guard: GuardType) => guards[guard]))(Rsv.prototype, gqlMeta.key, descriptor);
    if (gqlMeta.type === "Query")
      Nest.Query(getNestReturn(gqlMeta.returns), gqlMeta.signalOption)(Rsv.prototype, gqlMeta.key, descriptor);
    else if (gqlMeta.type === "Mutation")
      Nest.Mutation(getNestReturn(gqlMeta.returns), gqlMeta.signalOption)(Rsv.prototype, gqlMeta.key, descriptor);
  }

  // 3. Resolve Fields
  const resolveFieldMetas: ResolveFieldMeta[] = getResolveFieldMetas(Rsv);
  if (sigMeta.returns) {
    const modelRef = sigMeta.returns();
    const fieldMetas = getFieldMetas(modelRef);
    fieldMetas
      .filter((fieldMeta) => fieldMeta.isClass && !fieldMeta.isScalar)
      .forEach((fieldMeta) => {
        const classMeta = getClassMeta(fieldMeta.modelRef);
        const modelName = lowerlize(classMeta.type === "light" ? classMeta.refName.slice(5) : classMeta.refName);
        const className = capitalize(modelName);
        const serviceName = `${modelName}Service`;
        Rsv.prototype[fieldMeta.key] = async function (
          this: { [key: string]: any },
          parent: { [key: string]: object }
        ) {
          const service = this[serviceName] as { [key: string]: (...args) => Promise<object[]> };
          return fieldMeta.arrDepth
            ? await service[`load${className}Many`](parent[fieldMeta.key])
            : await service[`load${className}`](parent[fieldMeta.key]);
        };
        Nest.Parent()(Rsv.prototype, fieldMeta.key, 0);
        Nest.ResolveField(getNestReturn(() => arraiedModel(fieldMeta.modelRef, fieldMeta.arrDepth) as Type))(
          Rsv.prototype,
          fieldMeta.key,
          Object.getOwnPropertyDescriptor(Rsv.prototype, fieldMeta.key) ?? {}
        );
      });
  }

  for (const resolveFieldMeta of resolveFieldMetas) {
    const [, internalArgMetas] = getArgMetas(Rsv, resolveFieldMeta.key);
    for (const internalArgMeta of internalArgMetas) {
      const decorate = internalArgMap[internalArgMeta.type] as (option) => ParameterDecorator;
      decorate(internalArgMeta.option ?? {})(Rsv.prototype, resolveFieldMeta.key, internalArgMeta.idx);
    }
    Nest.ResolveField(getNestReturn(resolveFieldMeta.returns))(
      Rsv.prototype,
      resolveFieldMeta.key,
      Object.getOwnPropertyDescriptor(Rsv.prototype, resolveFieldMeta.key) ?? {}
    );
  }
  // 4. Apply Resolver
  sigMeta.returns ? Nest.Resolver(getNestReturn(sigMeta.returns))(Rsv) : Nest.Resolver()(Rsv);
  return Rsv;
};
