import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { InternalAccountModule } from './internal/account/account.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, InternalAccountModule, ConfigModule.forRoot()],
})
export class AppModule {}