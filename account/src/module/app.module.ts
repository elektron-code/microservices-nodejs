import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from '../config/redis/redis.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot(), DatabaseModule, RedisModule],
})
export class AppModule {}