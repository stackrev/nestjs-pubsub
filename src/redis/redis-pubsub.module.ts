import Redis, { RedisOptions } from 'ioredis';

import { DynamicModule, Global, Module } from '@nestjs/common';

import { RedisPubSubConfig } from './redis-pubsub.config';
import {
    REDIS_IO, REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT
} from './redis-pubsub.constants';
import { RedisPubSubService } from './redis-pubsub.service';

@Global()
@Module({})
export class RedisPubSubModule {
  static register(options?: RedisOptions): DynamicModule {
    const redisOptions = options || RedisPubSubConfig;
    return {
      module: RedisPubSubModule,
      providers: [
        {
          useFactory: () => {
            return new Redis(redisOptions);
          },
          provide: REDIS_SUBSCRIBER_CLIENT,
        },
        {
          useFactory: () => {
            return new Redis(redisOptions);
          },
          provide: REDIS_PUBLISHER_CLIENT,
        },
        {
          useFactory: () => {
            return new Redis(redisOptions);
          },
          provide: REDIS_IO,
        },
        RedisPubSubService,
      ],
      exports: [RedisPubSubService],
    };
  }
}
