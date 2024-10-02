/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { APP_INTERCEPTOR, NestFactory } from "@nestjs/core";
import { AllExceptionsFilter } from "./exceptions";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { BackendEnv, baseEnv } from "../base/baseEnv";
import { BullModule } from "@nestjs/bull";
import { CacheInterceptor, LoggingInterceptor, TimeoutInterceptor } from "./interceptors";
import { DateScalar } from "../server/gql";
import {
  DynamicModule,
  Global,
  INestApplication,
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { Logger } from "@core/common";
import { MeiliSearch } from "meilisearch";
import { MongooseModule } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { RedisIoAdapter } from "./redis-io.adapter";
import { ScheduleModule } from "@nestjs/schedule";
import { SearchDaemonModule } from "./searchDaemon";
import { createClient } from "redis";
import {
  generateJwtSecret,
  generateMeiliKey,
  generateMeiliUri,
  generateMongoUri,
  generateRedisUri,
} from "./generateSecrets";
import { graphqlUploadExpress } from "graphql-upload";
import { initMongoDB } from "./mongoose";
import { join } from "path";
import { json, urlencoded } from "body-parser";
import { verifyToken } from "./authorization";
import cookieParser from "cookie-parser";
import events from "events";
import type { RequestContext } from "./authGuards";

interface AppCreateForm {
  registerModules: (options: any) => DynamicModule[];
  registerBatches?: (options: any) => DynamicModule[];
  serverMode?: "federation" | "batch" | "all";
  env: BackendEnv;
}
export interface BackendApp {
  nestApp: INestApplication;
  close: () => Promise<void>;
}

export const createNestApp = async ({
  registerModules,
  registerBatches,
  serverMode = "federation",
  env,
}: AppCreateForm) => {
  const backendLogger = new Logger("Backend");

  // 0. Set up secretes
  const jwtSecret = generateJwtSecret(env.appName, env.environment);

  const [redisUri, mongoUri, meiliUri] = await Promise.all([
    env.redisUri ?? generateRedisUri(env),
    env.mongoUri ?? generateMongoUri({ ...env, password: env.mongo.password }),
    env.meiliUri ?? generateMeiliUri(env),
  ]);

  backendLogger.log(`connect to mongo: ${mongoUri}`);
  if (env.operationMode === "local") {
    backendLogger.log(`connect to redis: ${redisUri}`);
    backendLogger.log(`connect to mongo: ${mongoUri}`);
    backendLogger.log(`connect to meili: ${meiliUri}`);
  }

  // 1. Set up mongoose
  initMongoDB({ logging: baseEnv.environment !== "main", sendReport: false });

  // 2. Set up event emitter
  (events.EventEmitter as unknown as { defaultMaxListeners: number }).defaultMaxListeners = 100;

  // 3. Set up middleware and app
  @Injectable()
  class AuthMiddleWare implements NestMiddleware<Request, Response> {
    use(req: Request, res: Response, next: NextFunction) {
      const requestHeader = req as unknown as RequestContext;
      requestHeader.account = verifyToken(
        jwtSecret,
        requestHeader.headers.authorization ??
          (requestHeader.cookies?.jwt ? `Bearer ${requestHeader.cookies.jwt}` : undefined)
      );
      requestHeader.userAgent = requestHeader["user-agent"] as string;
      next();
    }
  }

  const redisClient = createClient({ url: redisUri });
  @Global()
  @Module({
    providers: [
      { provide: "REDIS_CLIENT", useFactory: async () => await redisClient.connect() },
      {
        provide: "MEILI_CLIENT",
        useFactory: () => new MeiliSearch({ host: meiliUri, apiKey: generateMeiliKey(env) }),
      },
      { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
    ],
    exports: ["REDIS_CLIENT", "MEILI_CLIENT"],
  })
  class SubDatabaseModule {}

  @Module({
    imports: [
      BullModule.forRoot({ redis: redisUri }),
      ScheduleModule.forRoot(),
      GraphQLModule.forRootAsync<ApolloDriverConfig>({
        imports: [],
        useFactory: () => ({
          useGlobalPrefix: true,
          autoSchemaFile: join(process.cwd(), "src/schema.gql"),
          sortSchema: true,
          playground: baseEnv.environment !== "main",
          introspection: baseEnv.environment !== "main",
          uploads: false,
          debug: false,
        }),
        driver: ApolloDriver,
      }),
      MongooseModule.forRootAsync({
        useFactory: () => ({ uri: mongoUri, autoIndex: baseEnv.environment !== "main" }),
      }),
      SubDatabaseModule,
      ...(["batch", "all"].includes(serverMode) ? [SearchDaemonModule] : []),
      ...registerModules(env),
      ...(serverMode === "federation" || !registerBatches ? [] : registerBatches(env)),
    ],
    providers: [DateScalar],
  })
  class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleWare).forRoutes({ path: "*", method: RequestMethod.ALL });
    }
  }

  // create Nestapp
  const app = await NestFactory.create(AppModule, { logger: backendLogger });
  const redisIoAdapter = new RedisIoAdapter(app, { jwtSecret });
  await redisIoAdapter.connectToRedis(redisUri);
  app.enableShutdownHooks();

  if (["federation", "all"].includes(serverMode)) {
    app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? "/backend");
    app.enableCors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      allowedHeaders:
        "DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,apollo-require-preflight",
    });
    if (env.operationMode === "cloud") app.useWebSocketAdapter(redisIoAdapter);
    app.use(json({ limit: "100mb" }));
    app.use(urlencoded({ limit: "100mb", extended: true }));
    app.use("/backend/graphql", graphqlUploadExpress());
    app.use(cookieParser());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(process.env.PORT ?? env.port ?? 8080);
    backendLogger.log(`🚀 Server is running on: ${await app.getUrl()}`);
  } else {
    await app.init();
    backendLogger.log(`🚀 Batch Server is running`);
  }
  if ((module as any).hot) {
    (module as any).hot.accept();
    (module as any).hot.dispose(() => {
      void app.close();
    });
  }
  return {
    nestApp: app,
    close: async () => {
      await app.close();
      await redisIoAdapter.destroy();
      await redisClient.quit();
    },
  };
};
