import { Injectable } from "@nestjs/common";
import { Use } from "@core/server";
import type { RedisClientType } from "redis";

@Injectable()
export class CacheClient {
  @Use("REDIS_CLIENT") redis: RedisClientType;
}
