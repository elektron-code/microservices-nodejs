import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserKafkaController } from './user.kafka-controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../../config/redis/redis.module';
import { KafkaModule } from '../../config/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    DatabaseModule,
    RedisModule,
    KafkaModule,
  ],
  controllers: [UserController, UserKafkaController],
  providers: [UserService, UserRepository],
})
export class UserModule {}