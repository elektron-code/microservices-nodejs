import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InternalAccountModule  } from '../../internal/account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../../config/redis/redis.module';

@Module({
  imports: [InternalAccountModule, JwtModule, ConfigModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}