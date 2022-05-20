## Nest Sockedis

> **`Nestjs`**, **`Publish`**, **`Subscribe`**, **`Redis`**
>
> &NewLine;
> A library for much **easier** implementation of **Publish/Subscribe** in the **NestJs** framework

> ### implement operations with:
>
> - ✅ **redis**

### Installation

```bash
# npm
$ npm install --save nestjs-pubsub

# yarn
$ yarn add nestjs-pubsub
```

&NewLine;

### Environment config

> Configures required to start inside the **.env** file

- REDIS_HOST=127.0.0.1
- REDIS_PORT=6379
- REDIS_USERNAME=username
- REDIS_PASSWORD=password
- REDIS_DATABASE=0

&NewLine;

### Getting Started

#### Redis Pub/Sub

> Import **RedisPubSubModule** in the root module of the application. `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisPubSubModule } from 'nestjs-pubsub';

@Module({
  imports: [RedisPubSubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

&NewLine;

> Inject **RedisPubSubService** into `YourService.ts`\*\*`

&NewLine;

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'nestjs-pubsub';

@Injectable()
export class YourService {
  constructor(private readonly redisService: RedisService) {
    this.redisService.onEvent('your_event_name').subscribe(({ message }) => {
      console.log('income data as string', message);
      // Parse your data if you need!
      // const data = JSON.parse(message)

      // Your handler code here ...
    });

    // Or

    this.redisService.fromEvent('your_event_name').subscribe((data) => {
      // Data conversion is done in the fromEvent method
      console.log('income data as object', data);

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

##### Change Log

> See [Changelog](CHANGELOG.md) for more information.

##### Contributing

> Contributions welcome! See [Contributing](CONTRIBUTING.md).

##### Author

> **Mostafa Gholami** [`mst-ghi`](https://github.com/mst-ghi)
