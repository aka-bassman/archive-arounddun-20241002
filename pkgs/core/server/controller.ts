import * as guards from "../nest/authGuards";
import {
  Access,
  Account,
  Me,
  MulterToUploadPipe,
  MyKeyring,
  Req,
  Res,
  Self,
  Signature,
  UserIp,
  getBodyPipes,
  getQueryPipes,
} from "../nest";
import {
  ArgMeta,
  GuardType,
  InternalArgType,
  Type,
  Upload,
  copySignal,
  getArgMetas,
  getControllerPath,
  getControllerPrefix,
  getGqlMetas,
  getNonArrayModel,
  getSigMeta,
} from "../base";
import { AuthGuard } from "@nestjs/passport";
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { lowerlize } from "../common/lowerlize";

const internalArgMap: {
  [key in Exclude<InternalArgType, "Parent" | "Ws" | "Job">]: (option?: unknown) => ParameterDecorator;
} = {
  // Parent: Nest.Parent,
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

export const controllerOf = (sigRef: Type, allSrvs: { [key: string]: Type }) => {
  const sigMeta = getSigMeta(sigRef);
  const gqlMetas = getGqlMetas(sigRef);
  const prefix = getControllerPrefix(sigMeta);
  const Ctrl = copySignal(sigRef);

  // 1. Inject All Services
  Object.keys(allSrvs).forEach((srv) => {
    Inject(allSrvs[srv])(Ctrl.prototype, lowerlize(srv));
  });

  // 2. Resolve Apis
  for (const gqlMeta of gqlMetas) {
    if (
      gqlMeta.guards.some((guard) => guard === "None") ||
      gqlMeta.signalOption.onlyFor === "graphql" ||
      !["Query", "Mutation"].includes(gqlMeta.type)
    )
      continue;
    const [argMetas, internalArgMetas] = getArgMetas(Ctrl, gqlMeta.key);
    internalArgMetas.forEach((internalArgMeta) => {
      const internalDecorator = internalArgMap[internalArgMeta.type] as (option) => ParameterDecorator;
      internalDecorator(internalArgMeta.option ?? {})(Ctrl.prototype, gqlMeta.key, internalArgMeta.idx);
    });

    const uploadArgMeta = argMetas.find((argMeta) => argMeta.type === "Upload");
    if (uploadArgMeta && gqlMeta.signalOption.onlyFor === "restapi") {
      const [modelRef, arrDepth] = getNonArrayModel<Type>(uploadArgMeta.returns() as Type);
      if (modelRef.prototype !== Upload.prototype) throw new Error("Upload must be Upload");
      else if (!arrDepth) throw new Error(`Only Array of Upload is allowed - ${sigMeta.refName}/${gqlMeta.key}`);
      UseInterceptors(FilesInterceptor(uploadArgMeta.name))(Ctrl.prototype, gqlMeta.key, gqlMeta.descriptor);
      UploadedFiles(MulterToUploadPipe)(Ctrl.prototype, gqlMeta.key, uploadArgMeta.idx);
    }

    const queryArgMetas = argMetas.filter((argMeta) => argMeta.type === "Query");
    queryArgMetas.forEach((argMeta: ArgMeta) => {
      const [modelRef, arrDepth] = getNonArrayModel<Type>(argMeta.returns() as Type);
      Query(argMeta.name, ...getQueryPipes(modelRef, arrDepth))(Ctrl.prototype, gqlMeta.key, argMeta.idx);
    });
    const paramArgMetas = argMetas.filter((argMeta) => argMeta.type === "Param");
    paramArgMetas.forEach((argMeta: ArgMeta) => {
      Param(argMeta.name)(Ctrl.prototype, gqlMeta.key, argMeta.idx);
    });
    const path = getControllerPath(gqlMeta, paramArgMetas);

    const bodyArgMetas = argMetas.filter((argMeta) => argMeta.type === "Body");
    if (bodyArgMetas.length)
      bodyArgMetas.forEach((argMeta: ArgMeta) => {
        Body(argMeta.name, ...getBodyPipes(argMeta))(Ctrl.prototype, gqlMeta.key, argMeta.idx);
      });

    UseGuards(
      ...gqlMeta.guards.map((guard: GuardType) => guards[guard]),
      ...(gqlMeta.signalOption.sso ? [AuthGuard(gqlMeta.signalOption.sso)] : [])
    )(Ctrl.prototype, gqlMeta.key, gqlMeta.descriptor);

    if (gqlMeta.type === "Query") Get(path)(Ctrl.prototype, gqlMeta.key, gqlMeta.descriptor);
    else if (gqlMeta.type === "Mutation") Post(path)(Ctrl.prototype, gqlMeta.key, gqlMeta.descriptor);
  }
  if (prefix) Controller(prefix)(Ctrl);
  else Controller()(Ctrl);
  return Ctrl;
};
