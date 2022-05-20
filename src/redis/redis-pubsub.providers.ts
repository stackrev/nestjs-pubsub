import { Provider } from '@nestjs/common';

import { RedisPubSubConfig } from './redis-pubsub.config';
import {
    REDIS_IO, REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT
} from './redis-pubsub.constants';

const Redis = require('ioredis');

export const RedisPubSubProviders: Provider[] = [
  {
    useFactory: () => {
      return new Redis(RedisPubSubConfig);
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: () => {
      return new Redis(RedisPubSubConfig);
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
  {
    useFactory: () => {
      return new Redis(RedisPubSubConfig);
    },
    provide: REDIS_IO,
  },
];
