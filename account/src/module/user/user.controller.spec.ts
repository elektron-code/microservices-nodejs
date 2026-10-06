import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { KafkaService } from '../../config/kafka/kafka.service';
import { REDIS_TOKEN } from '../../config/redis/redis.constant';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});