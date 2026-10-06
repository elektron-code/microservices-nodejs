import { vi, type Mock, type Mocked } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { InternalAccountService } from '../../internal/account/account.service';
import { REDIS_TOKEN } from '../../config/redis/redis.constant';

describe('AuthService', () => {
  let service: AuthService;
  let accountService: Mocked<InternalAccountService>;
  let jwtService: Mocked<JwtService>;
  let redis: { get: Mock; set: Mock; del: Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: InternalAccountService,
          useValue: {
            verification: vi.fn(),
            GetUsersByFilter: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn().mockReturnValue('signed-token'),
            verify: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string) => {
              const map: Record<string, string> = {
                JWT_ACCESS_SECRET: 'access-secret',
                JWT_REFRESH_SECRET: 'refresh-secret',
                JWT_ALG: 'HS256',
                JWT_ACCESS_EXP: '1h',
                JWT_REFRESH_EXP: '24h',
              };
              return map[key];
            }),
          },
        },
        {
          provide: REDIS_TOKEN,
          useValue: {
            get: vi.fn(),
            set: vi.fn().mockResolvedValue(undefined),
            del: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    accountService = module.get(InternalAccountService);
    jwtService = module.get(JwtService);
    redis = module.get(REDIS_TOKEN);
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('должен выдать токены при корректном пароле и наличии кеша', async () => {
      accountService.verification.mockResolvedValue(true);
      redis.get.mockResolvedValue('user-1');

      const result = await service.login({
        login: 'testuser',
        password: 'password',
      });

      expect(result).toHaveProperty('access');
      expect(result).toHaveProperty('refresh');
      expect(accountService.GetUsersByFilter).not.toHaveBeenCalled();
    });

    it('должен обратиться к Account при отсутствии кеша и сохранить userId в Redis', async () => {
      accountService.verification.mockResolvedValue(true);
      redis.get.mockResolvedValue(null);
      accountService.GetUsersByFilter.mockResolvedValue({
        items: [
          {
            userId: 'user-1',
            login: 'testuser',
            phone: '',
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
          },
        ],
        total: 1,
      });

      await service.login({ login: 'testuser', password: 'password' });

      expect(accountService.GetUsersByFilter).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalledWith('testuser', 'user-1');
    });

    it('должен бросить UnauthorizedException при неверном пароле', async () => {
      accountService.verification.mockResolvedValue(false);

      await expect(
        service.login({ login: 'testuser', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('должен выдать новую пару токенов по валидному refresh', async () => {
      jwtService.verify.mockReturnValue({
        userId: 'user-1',
        login: 'testuser',
      } as any);
      accountService.GetUsersByFilter.mockResolvedValue({
        items: [
          {
            userId: 'user-1',
            login: 'testuser',
            phone: '',
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
          },
        ],
        total: 1,
      });

      const result = await service.refreshToken({ refresh: 'valid-refresh' });

      expect(result).toHaveProperty('access');
      expect(result).toHaveProperty('refresh');
    });

    it('должен бросить UnauthorizedException при невалидном refresh', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(
        service.refreshToken({ refresh: 'bad' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});