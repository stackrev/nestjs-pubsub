import { KafkaAdminService } from './kafka-admin.service';
import { Kafka, KafkaConfig } from 'kafkajs';

import { DynamicModule, Global, Module } from '@nestjs/common';

import { KAFKA_CLIENT, KafkaParser, KafkaPubSubService } from './';

@Global()
@Module({})
export class KafkaPubSubModule {
  static register(config: KafkaConfig): DynamicModule {
    return {
      module: KafkaPubSubModule,
      providers: [
        {
          provide: KAFKA_CLIENT,
          useFactory: () => {
            return new Kafka(config);
          },
        },
        KafkaParser,
        KafkaPubSubService,
        KafkaAdminService,
      ],
      exports: [KafkaParser, KafkaPubSubService],
    };
  }
}
