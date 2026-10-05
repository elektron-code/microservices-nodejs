import * as dotenv from 'dotenv';
import { KafkaOptions, Transport } from '@nestjs/microservices';

dotenv.config({ path: '.env' });

export const kafkaOptionsFactory = (): KafkaOptions => {
  const clientId = process.env.KAFKA_CLIENT_ID;
  const brokers = process.env.KAFKA_CLIENT_BROKERS;
  const groupId = process.env.KAFKA_CONSUMER_GROUP_ID;

  if (!clientId || !brokers || !groupId) {
    throw new Error(
      'Kafka env variables are not set: KAFKA_CLIENT_ID, KAFKA_CLIENT_BROKERS, KAFKA_CONSUMER_GROUP_ID',
    );
  }

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers: brokers.split(','),
      },
      consumer: {
        groupId,
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  };
  
};