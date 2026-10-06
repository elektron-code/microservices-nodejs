import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { KafkaService } from '../../config/kafka/kafka.service';
import { EventNameEnum, TransactionType } from './transaction.types';

describe('TransactionService', () => {
  let service: TransactionService;
  let kafkaService: KafkaService;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            createTransaction: vi.fn().mockResolvedValue({
              id: 'test-id',
              userId: 'user-1',
              amount: '100',
              type: TransactionType.DEPOSIT,
            }),
            findByParams: vi.fn(),
            findById: vi.fn(),
            updateStatus: vi.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            produce: vi.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: vi.fn().mockReturnValue({
              connect: vi.fn(),
              startTransaction: vi.fn(),
              commitTransaction: vi.fn(),
              rollbackTransaction: vi.fn(),
              release: vi.fn(),
              manager: {
                save: vi.fn(),
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    kafkaService = module.get<KafkaService>(KafkaService);
    transactionRepository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a DEPOSIT transaction and publish event', async () => {
    await service.create({
      userId: 'user-1',
      amount: '100',
      transactionType: TransactionType.DEPOSIT,
    });

    expect(transactionRepository.createTransaction).toHaveBeenCalledWith({
      userId: 'user-1',
      amount: '100',
      type: TransactionType.DEPOSIT,
    });

    expect(kafkaService.produce).toHaveBeenCalledWith({
      eventName: EventNameEnum.TransactionSaved,
      data: {
        userId: 'user-1',
        amount: '100',
        transactionId: 'test-id',
        transactionType: TransactionType.DEPOSIT,
      },
    });
  });
});