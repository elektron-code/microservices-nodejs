import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';
import { KafkaService } from '../../config/kafka/kafka.service';
import {
  BalanceChangedStatus,
  EventBalanceChangedData,
  EventNameEnum,
  EventTransactionSavedData,
  TransactionStatus,
  TransactionType,
} from './transaction.types';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(params: CreateTransactionDto): Promise<void> {
    const { userId, amount, transactionType, recipient } = params;

    if (transactionType === TransactionType.TRANSFER && recipient) {
      return this.createTransferTransaction(params);
    }

    const transaction = await this.transactionRepository.createTransaction({
      userId,
      amount,
      type: transactionType,
    });

    const data: EventTransactionSavedData = {
      userId,
      amount,
      transactionId: transaction.id,
      transactionType,
    };

    await this.kafkaService.produce({
      eventName: EventNameEnum.TransactionSaved,
      data,
    });
  }

  async createTransferTransaction(params: CreateTransactionDto): Promise<void> {
    const { userId, amount, transactionType, recipient } = params;

    if (!recipient) {
      throw new BadRequestException('Recipient is required for TRANSFER');
    }

    const withdrawal = await this.transactionRepository.createTransaction({
      userId,
      amount: '-' + amount,
      type: transactionType,
    });

    const withdrawalData: EventTransactionSavedData = {
      userId,
      amount,
      transactionId: withdrawal.id,
      transactionType: TransactionType.WITHDRAWAL,
    };

    await this.kafkaService.produce({
      eventName: EventNameEnum.TransactionSaved,
      data: withdrawalData,
    });

    const deposit = await this.transactionRepository.createTransaction({
      userId: recipient,
      amount,
      type: transactionType,
    });

    const depositData: EventTransactionSavedData = {
      userId: recipient,
      amount,
      transactionId: deposit.id,
      transactionType: TransactionType.DEPOSIT,
    };

    await this.kafkaService.produce({
      eventName: EventNameEnum.TransactionSaved,
      data: depositData,
    });
  }

  async updateStatus(params: EventBalanceChangedData): Promise<void> {
    const { transactionId, status } = params;

    const transactionStatus =
      status === BalanceChangedStatus.FAILED
        ? TransactionStatus.FAILED
        : TransactionStatus.COMPLETED;

    await this.transactionRepository.updateStatus(transactionId, transactionStatus);
  }

  async getTransaction(id: string) {
    return this.transactionRepository.findById(id);
  }

  async getTransactions(params: GetTransactionsFilterDto) {
    return this.transactionRepository.findByParams(params);
  }
}