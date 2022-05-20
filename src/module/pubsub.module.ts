import { Global, Module } from '@nestjs/common';

import { RedisPubSubModule } from '../redis/redis-pubsub.module';

@Global()
@Module({
  imports: [RedisPubSubModule],
  exports: [RedisPubSubModule],
})
export class PubSubModule {}
