import {
    Consumer, ConsumerConfig, ConsumerSubscribeTopics, EachMessagePayload, Kafka, KafkaConfig,
    KafkaMessage, Producer, ProducerConfig
} from 'kafkajs';
import { Observable, Observer } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

import { KafkaParserConfig, PubSubServiceInterface } from '../contracts';
import { KafkaHeaders } from './kafka-headers.enum';
import { KAFKA_CLIENT, KAFKA_PAYLOAD_PARSER } from './kafka-pubsub.constants';
import { KafkaParser } from './kafka-pubsub.parser';

@Injectable()
export class KafkaPubSubService implements PubSubServiceInterface {
  protected producer: Producer;
  protected consumer: Consumer;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly client: Kafka,
    @Inject(KAFKA_PAYLOAD_PARSER)
    private readonly parser: KafkaParser,
  ) {}

  public async onEvent(
    subscription: ConsumerSubscribeTopics,
  ): Promise<Observable<KafkaMessage>> {
    await this.consumer.subscribe(subscription);

    return new Observable((observer: Observer<KafkaMessage>) => {
      this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          observer.next(this.payloadParser(payload));
        },
      });
    });
  }

  public payloadParser(payload: EachMessagePayload): KafkaMessage {
    const rawMessage = this.parser.parse<KafkaMessage>(
      Object.assign(payload.message, {
        topic: payload.topic,
        partition: payload.partition,
      }),
    );

    if (isUndefined(rawMessage.headers[KafkaHeaders.CORRELATION_ID])) {
      return;
    }

    return rawMessage;
  }

  public async publish(topic: string, messages: any): Promise<any> {
    await this.producer.send({ topic, messages });
  }

  public createNewClient(config: KafkaConfig): Kafka {
    return new Kafka(config);
  }

  public createNewParser(config?: KafkaParserConfig): KafkaParser {
    return new KafkaParser(config);
  }

  public createProducerConsumer(
    producerConfig?: ProducerConfig,
    consumerConfig?: ConsumerConfig,
    recreate: boolean = false,
  ): KafkaPubSubService {
    this.getProducer(producerConfig, recreate);
    this.getConsumer(consumerConfig, recreate);

    return this;
  }

  public getProducer(
    config?: ProducerConfig,
    recreate: boolean = false,
  ): Producer {
    if (!this.client) {
      throw new Error('Kafka client not created');
    }

    if (!this.producer || recreate) {
      this.producer = this.client.producer(config);
    }

    return this.producer;
  }

  public getConsumer(
    config: ConsumerConfig,
    recreate: boolean = false,
  ): Consumer {
    if (!this.client) {
      throw new Error('Kafka instance not created');
    }

    if (!this.consumer || recreate) {
      this.consumer = this.client.consumer(config);
    }

    return this.consumer;
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  public async disconnect(): Promise<void> {
    this.producer && (await this.producer.disconnect());
    this.consumer && (await this.consumer.disconnect());
    this.producer = null;
    this.consumer = null;
  }
}
