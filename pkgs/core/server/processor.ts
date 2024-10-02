import {
  ArgMeta,
  GqlMeta,
  InternalArgMeta,
  Type,
  deserializeArg,
  getArgMetas,
  getGqlMetas,
  getSigMeta,
} from "@core/base";
import { Inject } from "@nestjs/common";
import { type Logger, lowerlize } from "@core/common";
import { Process, Processor } from "@nestjs/bull";
import type { DoneCallback, Job, Queue } from "bull";

const convertProcessFunction = (
  gqlMeta: GqlMeta,
  argMetas: ArgMeta[],
  internalArgMetas: InternalArgMeta[],
  fn: (...args) => any
) => {
  return async function (this: { logger?: Logger }, job: Job<any[]>, done: DoneCallback) {
    const args: any[] = [];
    argMetas.forEach((argMeta) => {
      if (argMeta.type === "Msg") args[argMeta.idx] = deserializeArg(argMeta, job.data[argMeta.idx]);
      else throw new Error(`Invalid ArgMeta Type ${argMeta.type}`);
    });
    internalArgMetas.forEach((internalArgMeta) => {
      if (internalArgMeta.type === "Job") args[internalArgMeta.idx] = job;
      else throw new Error(`Invalid InternalArgMeta Type ${internalArgMeta.type}`);
    }),
      this.logger?.log(`Process-${gqlMeta.key} started`);
    const result = (await fn.apply(this, args)) as object;
    this.logger?.log(`Process-${gqlMeta.key} finished`);
    done(null, result); // !테스트해봐야함
  };
};

export const processorOf = (sigRef: Type, allSrvs: { [key: string]: Type }) => {
  const sigMeta = getSigMeta(sigRef);
  const serverMode = process.env.SERVER_MODE ?? "federation";
  const gqlMetas = getGqlMetas(sigRef)
    .filter((gqlMeta) => gqlMeta.type === "Process")
    .filter(
      (gqlMeta) =>
        gqlMeta.signalOption.serverType === "all" ||
        serverMode === "all" ||
        gqlMeta.signalOption.serverType === serverMode
    );
  class QueueProcessor {}

  // 1. Inject All Services
  Object.keys(allSrvs).forEach((srv) => {
    Inject(allSrvs[srv])(QueueProcessor.prototype, lowerlize(srv));
  });

  // 2. Resolve Process
  for (const gqlMeta of gqlMetas) {
    const [argMetas, internalArgMetas] = getArgMetas(sigRef, gqlMeta.key);
    const descriptor = { ...(Object.getOwnPropertyDescriptor(sigRef.prototype, gqlMeta.key) ?? {}) };
    descriptor.value = convertProcessFunction(
      gqlMeta,
      argMetas,
      internalArgMetas,
      descriptor.value as (...args) => any
    );
    Object.defineProperty(QueueProcessor.prototype, gqlMeta.key, descriptor);
    Process(gqlMeta.key)(QueueProcessor.prototype, gqlMeta.key, descriptor);
  }
  Processor(sigMeta.refName)(QueueProcessor);
  return QueueProcessor;
};

export const queueOf = (sigRef: Type, queue: Queue) => {
  const sigMeta = getSigMeta(sigRef);
  const gqlMetas = getGqlMetas(sigRef).filter((gqlMeta) => gqlMeta.type === "Process");
  for (const gqlMeta of gqlMetas) {
    if (queue[gqlMeta.key]) throw new Error(`Queue already has ${gqlMeta.key} in ${sigMeta.refName}`);
    queue[gqlMeta.key] = (...args) => queue.add(gqlMeta.key, args);
  }
  return queue;
};
