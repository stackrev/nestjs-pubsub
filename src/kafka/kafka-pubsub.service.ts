import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  EachMessagePayload,
  Kafka,
  KafkaConfig,
  KafkaMessage,
  Producer,
  ProducerBatch,
  ProducerConfig,
  ProducerRecord,
  RecordMetadata,
  CompressionTypes,
} from 'kafkajs';
import { Observable, Observer } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';

import { KafkaParserConfig, PubSubServiceInterface } from '../contracts';
import { KAFKA_CLIENT, KAFKA_PAYLOAD_PARSER } from './kafka-pubsub.constants';
import { KafkaParser } from './kafka-pubsub.parser';

@Injectable()
export class KafkaPubSubService implements PubSubServiceInterface {
  public producer: Producer;
  public consumer: Consumer;

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

    return rawMessage;
  }

  public async publish(record: ProducerRecord): Promise<RecordMetadata[]> {
    return await this.producer.send(record);
  }

  public async publishBatch(batch: ProducerBatch): Promise<RecordMetadata[]> {
    return await this.producer.sendBatch(batch);
  }

  public createNewClient(config: KafkaConfig): Kafka {
    return new Kafka(config);
  }

  public createNewParser(config?: KafkaParserConfig): KafkaParser {
    const prs = new KafkaParser();
    return prs.config(config);
  }

  public async bootstrap(
    consumerConfig?: ConsumerConfig,
    producerConfig?: ProducerConfig,
    recreate = false,
  ): Promise<KafkaPubSubService> {
    this.createConsumerProducer(consumerConfig, producerConfig, recreate);
    await this.connect();

    return this;
  }

  public createConsumerProducer(
    consumerConfig?: ConsumerConfig,
    producerConfig?: ProducerConfig,
    recreate = false,
  ): KafkaPubSubService {
    this.getConsumer(consumerConfig, recreate);
    this.getProducer(producerConfig, recreate);

    return this;
  }

  public getProducer(config?: ProducerConfig, recreate = false): Producer {
    if (!this.client) {
      throw new Error('Kafka client not created');
    }

    if (!this.producer || recreate) {
      this.producer = this.client.producer(config);
    }

    return this.producer;
  }

  public getConsumer(config: ConsumerConfig, recreate = false): Consumer {
    if (!this.client) {
      throw new Error('Kafka instance not created');
    }

    if (!this.consumer || recreate) {
      this.consumer = this.client.consumer(config);
    }

    return this.consumer;
  }

  public async connect(): Promise<KafkaPubSubService> {
    this.producer && (await this.producer.connect());
    this.consumer && (await this.consumer.connect());

    return this;
  }

  public async disconnect(): Promise<void> {
    this.producer && (await this.producer.disconnect());
    this.consumer && (await this.consumer.disconnect());
    this.producer = null;
    this.consumer = null;
  }
}

export {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  EachMessagePayload,
  Kafka,
  KafkaConfig,
  KafkaMessage,
  Producer,
  ProducerBatch,
  ProducerConfig,
  ProducerRecord,
  RecordMetadata,
  CompressionTypes,
};
