import { Module } from '@nestjs/common';

import { RedisPubSubProviders } from './redis-pubsub.providers';
import { RedisPubSubService } from './redis-pubsub.service';

@Module({
  providers: [...RedisPubSubProviders, RedisPubSubService],
  exports: [...RedisPubSubProviders, RedisPubSubService],
})
export class RedisPubSubModule {}
