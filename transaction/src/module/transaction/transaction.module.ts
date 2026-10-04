import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionKafkaController } from './transaction.kafka-controller';
import { KafkaModule } from '../../config/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    ConfigModule,
    KafkaModule,
  ],
  controllers: [TransactionController, TransactionKafkaController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}