import { Provider } from '@nestjs/common';

import {
    REDIS_IO, REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT
} from './redis-pubsub.constants';

const Redis = require('ioredis');

export const RedisPubSubProviders: Provider[] = [
  {
    useFactory: () => {
      return new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DATABASE || 0,
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: () => {
      return new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DATABASE || 0,
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
  {
    useFactory: () => {
      return new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DATABASE || 0,
      });
    },
    provide: REDIS_IO,
  },
];
