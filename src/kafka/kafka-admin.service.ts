import { Kafka, Admin, AdminConfig, ITopicConfig } from 'kafkajs';
import { Inject, Injectable } from '@nestjs/common';
import { KAFKA_CLIENT } from './kafka-pubsub.constants';

export type CreateTopicsOptions = {
  validateOnly?: boolean;
  waitForLeaders?: boolean;
  timeout?: number;
  topics: ITopicConfig[];
};

export type DeleteTopicsOptions = {
  topics: string[];
  timeout?: number;
};

@Injectable()
export class KafkaAdminService {
  public admin: Admin;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly client: Kafka,
  ) {}

  public async bootstrap(config?: AdminConfig): Promise<KafkaAdminService> {
    this.getAdmin(config);
    await this.connect();
    return this;
  }

  public async listTopics(): Promise<string[]> {
    return await this.admin.listTopics();
  }

  public async createTopics(options: CreateTopicsOptions): Promise<boolean> {
    if (!this.admin) {
      throw new Error('Admin is not initialized');
    }

    return await this.admin.createTopics(options);
  }

  public async deleteTopics(options: DeleteTopicsOptions): Promise<void> {
    if (!this.admin) {
      throw new Error('Admin is not initialized');
    }

    return await this.admin.deleteTopics(options);
  }

  public getAdmin(config?: AdminConfig) {
    if (!this.admin) {
      this.admin = this.client.admin(config);
    }

    return this;
  }

  public async connect(): Promise<KafkaAdminService> {
    this.admin && (await this.admin.connect());
    return this;
  }

  public async disconnect(): Promise<void> {
    this.admin && (await this.admin.disconnect());
    this.admin = null;
  }
}

export { Admin, AdminConfig, ITopicConfig };
