## Nest Sockedis

> **`Nestjs`**, **`Publish`**, **`Subscribe`**, **`Redis`**, **`Kafka`**
>
> &NewLine;
> A library for much **easier** implementation of **Publish/Subscribe** in the **NestJs** framework

> ### implement operations with:
>
> - ✅ **Redis**
> - ✅ **Kafka**

### Installation

```bash
# npm
$ npm install --save nestjs-pubsub

# yarn
$ yarn add nestjs-pubsub
```

&NewLine;

## Getting Started

> ## Redis Pub/Sub

> Import **RedisPubSubModule** in the root module of the application. `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisPubSubModule } from 'nestjs-pubsub';

@Module({
  imports: [
    RedisPubSubModule.register({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: +process.env.REDIS_PORT || 6379,
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD,
      db: +process.env.REDIS_DATABASE || 0,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

&NewLine;

> Inject **RedisPubSubService** into `your.service.ts`

&NewLine;

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { RedisPubSubService } from 'nestjs-pubsub';

@Injectable()
export class YourService {
  constructor(private readonly redisService: RedisPubSubService) {
    this.redisService.onEvent('your_event_name').subscribe(({ message }) => {
      console.log('income data as string', message);
      // Parse your data if you need!
      // const data = JSON.parse(message)

      // Your handler code here ...
    });
  }

  // Publish data
  async publish(eventName: string, data: unknown): Promise<any> {
    return await this.redisService.publish(eventName, data);
  }

  async get(key: string): Promise<any> {
    return await this.redisService.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    await this.redisService.set(key, value);
  }

  async hashSet(key: string, value: any): Promise<any> {
    return await this.redisService.hashSet(key, value);
  }

  async hashGet(key: string) {
    return await this.redisService.hashGet(key);
  }
}
```

&NewLine;

> ## Kafka Pub/Sub

> Import **KafkaPubSubModule** in the root module of the application. `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaPubSubModule } from 'nestjs-pubsub';

@Module({
  imports: [
    KafkaPubSubModule.register({
      clientId: 'my-app',
      brokers: ['kafka1:9092', 'kafka2:9092'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

&NewLine;

> Inject **KafkaPubSubService** into `your.service.ts`

&NewLine;

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { KafkaPubSubService } from 'nestjs-pubsub';

@Injectable()
export class YourService {
  constructor(private readonly kafkaService: KafkaPubSubService) {
    this.kafkaService
      .onEvent({ topics: ['test-topic'] })
      .subscribe(({ value, attributes, headers }) => {
        console.log('your data', value);

        // Your handler code here ...
      });
  }

  // Publish data
  async publish(topic: string, data: unknown): Promise<any> {
    return await this.kafkaService.publish(topic, data);
  }
}
```

&NewLine;

##### Change Log

> See [Changelog](CHANGELOG.md) for more information.

##### Contributing

> Contributions welcome! See [Contributing](CONTRIBUTING.md).

##### Author

> **Mostafa Gholami** [`mst-ghi`](https://github.com/mst-ghi)
