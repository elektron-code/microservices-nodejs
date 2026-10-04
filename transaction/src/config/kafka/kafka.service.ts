import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { KAFKA_CLIENT } from './kafka.constant';
import { KafkaEvent } from './kafka.interface';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
  ) {}

  subscribeToResponseOf(pattern: string): void {
    return this.kafkaClient.subscribeToResponseOf(pattern);
  }

  connect() {
    return this.kafkaClient.connect();
  }

  async send<Data, Result>(event: KafkaEvent<Data>): Promise<Result> {
    const req = this.kafkaClient.send(event.eventName, event.data);
    return firstValueFrom(req);
  }

  async produce(event: KafkaEvent<unknown>): Promise<void> {
    const request = this.kafkaClient.emit(event.eventName, event.data);
    await lastValueFrom(request);
  }
}