import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { type GqlReqType, type ReqType, type RequestContext, getArgs, getRequest } from "./authGuards";
import { Logger } from "@core/common";
import { Observable, TimeoutError, forkJoin, from, map, of, switchMap, throwError } from "rxjs";
import { catchError, tap, timeout } from "rxjs/operators";
import { getGqlMeta } from "@core/base";
import type { RedisClientType } from "redis";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  logger = new Logger("CacheInterceptor");
  constructor(@Inject("REDIS_CLIENT") private redis: RedisClientType) {}
  async setCache(key: string, value: any, expire: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), { PX: expire });
  }
  async getCache<T = object>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const signalKey = context.getHandler().name;
    const gqlMeta = getGqlMeta(context.getClass(), signalKey);
    const cacheExpireMs = gqlMeta.signalOption.cache;
    if (gqlMeta.type !== "Query" || !cacheExpireMs) {
      if (cacheExpireMs) this.logger.warn(`CacheInterceptor: ${signalKey} is not Query endpoint or cache is not set`);
      return next.handle();
    }
    const args = getArgs(context);
    const cacheKey = `signal:${signalKey}:${JSON.stringify(args)}`;
    const cacheResult$ = from(this.getCache(cacheKey));
    return forkJoin([cacheResult$]).pipe(
      switchMap(([cacheResult]) => {
        if (cacheResult) {
          this.logger.trace(`CacheHit-${cacheKey}`);
          return of(cacheResult);
        } else
          return next.handle().pipe(
            map((resData) => {
              void this.setCache(cacheKey, resData, cacheExpireMs);
              this.logger.trace(`CacheSet-${cacheKey}`);
              return resData as object;
            })
          );
      })
    );
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlMeta = getGqlMeta(context.getClass(), context.getHandler().name);
    const timeoutMs = gqlMeta.signalOption.timeout ?? 30000;
    if (timeoutMs === 0) return next.handle();
    return next.handle().pipe(
      timeout(timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) return throwError(() => new RequestTimeoutException());
        return throwError(() => err as Error);
      })
    );
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger = new Logger("IO");
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlReq: GqlReqType | undefined = context.getArgByIndex(3);
    const req: ReqType = getRequest(context);
    const reqType = gqlReq?.parentType?.name ?? req.method;
    const reqName = gqlReq?.fieldName ?? req.url;
    const before = Date.now();
    const ip = GqlExecutionContext.create(context).getContext<{ req: RequestContext }>().req.ip;
    this.logger.debug(`Before ${reqType}-${reqName} / ${ip} / ${before}`);
    return next.handle().pipe(
      tap(() => {
        const after = Date.now();
        this.logger.debug(`After  ${reqType}-${reqName} / ${ip} / ${after} (${after - before}ms)`);
      })
    );
  }
}
