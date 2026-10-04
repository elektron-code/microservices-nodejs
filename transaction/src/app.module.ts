import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './module/transaction/transaction.module';
import { DatabaseModule } from './module/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TransactionModule,
  ],
})
export class AppModule {}