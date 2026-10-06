import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { KafkaService } from '../../config/kafka/kafka.service';
import { REDIS_TOKEN } from '../../config/redis/redis.constant';
import {
  BalanceChangedStatus,
  EventNameEnum,
  TransactionType,
} from './user.types';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let kafkaService: KafkaService;

  const mockUser = {
    login: 'testuser',
    phone: '79001110101',
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    email: 'test@example.com',
    passwordHash: 'hash',
    passwordSalt: 'salt',
    balance: '1000',
    isDeleted: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            checkExistUser: vi.fn(),
            createUser: vi.fn(),
            findById: vi.fn(),
            findByLogin: vi.fn(),
            changeBalance: vi.fn(),
            deleteUser: vi.fn(),
            findAndCount: vi.fn(),
            updateUser: vi.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            produce: vi.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: REDIS_TOKEN,
          useValue: {
            del: vi.fn().mockResolvedValue(undefined),
            get: vi.fn(),
            set: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('должен создать нового пользователя', async () => {
      vi.spyOn(userRepository, 'checkExistUser').mockResolvedValue(false);
      vi.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser as any);

      await service.create({
        login: 'testuser',
        password: 'password',
        phone: '79001110101',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        email: 'test@example.com',
      });

      expect(userRepository.createUser).toHaveBeenCalled();
    });

    it('должен бросить ConflictException, если пользователь уже существует', async () => {
      vi.spyOn(userRepository, 'checkExistUser').mockResolvedValue(true);

      await expect(
        service.create({
          login: 'testuser',
          password: 'password',
          phone: '79001110101',
          firstName: 'Иван',
          lastName: 'Иванов',
          middleName: 'Иванович',
          email: 'test@example.com',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('changeBalanceFromKafka', () => {
    it('должен увеличить баланс при DEPOSIT и опубликовать COMPLETED', async () => {
      vi.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as any);
      vi.spyOn(userRepository, 'changeBalance').mockResolvedValue(undefined);

      await service.changeBalanceFromKafka({
        userId: 'user-1',
        amount: '500',
        transactionId: 'tx-1',
        transactionType: TransactionType.DEPOSIT,
      });

      expect(userRepository.changeBalance).toHaveBeenCalledWith({
        userId: 'user-1',
        balance: '1500',
      });
      expect(kafkaService.produce).toHaveBeenCalledWith({
        eventName: EventNameEnum.BalanceChanged,
        data: {
          transactionId: 'tx-1',
          status: BalanceChangedStatus.COMPLETED,
        },
      });
    });

    it('должен опубликовать FAILED при недостатке средств', async () => {
      vi.spyOn(userRepository, 'findById').mockResolvedValue({
        ...mockUser,
        balance: '100',
      } as any);

      await service.changeBalanceFromKafka({
        userId: 'user-1',
        amount: '500',
        transactionId: 'tx-2',
        transactionType: TransactionType.WITHDRAWAL,
      });

      expect(userRepository.changeBalance).not.toHaveBeenCalled();
      expect(kafkaService.produce).toHaveBeenCalledWith({
        eventName: EventNameEnum.BalanceChanged,
        data: {
          transactionId: 'tx-2',
          status: BalanceChangedStatus.FAILED,
        },
      });
    });

    it('должен опубликовать FAILED, если пользователь не найден', async () => {
      vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await service.changeBalanceFromKafka({
        userId: 'unknown',
        amount: '100',
        transactionId: 'tx-3',
        transactionType: TransactionType.DEPOSIT,
      });

      expect(kafkaService.produce).toHaveBeenCalledWith({
        eventName: EventNameEnum.BalanceChanged,
        data: {
          transactionId: 'tx-3',
          status: BalanceChangedStatus.FAILED,
        },
      });
    });
  });

  describe('remove', () => {
    it('должен логически удалить пользователя и очистить Redis', async () => {
      vi.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as any);
      vi.spyOn(userRepository, 'deleteUser').mockResolvedValue(undefined);

      await service.remove('user-1');

      expect(userRepository.deleteUser).toHaveBeenCalledWith('user-1');
    });

    it('должен бросить NotFoundException, если пользователя нет', async () => {
      vi.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(service.remove('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});