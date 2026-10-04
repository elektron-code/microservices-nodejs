import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { InternalAccountModule } from './internal/account/account.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './config/redis/redis.module';

@Module({
  imports: [AuthModule, InternalAccountModule, ConfigModule.forRoot(), RedisModule],
})
export class AppModule {}