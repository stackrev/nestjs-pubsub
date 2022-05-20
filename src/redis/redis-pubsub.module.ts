import { Global, Module } from '@nestjs/common';

import { RedisPubSubProviders } from './redis-pubsub.providers';
import { RedisPubSubService } from './redis-pubsub.service';

@Global()
@Module({
  providers: [...RedisPubSubProviders, RedisPubSubService],
  exports: [...RedisPubSubProviders, RedisPubSubService],
})
export class RedisPubSubModule {}
