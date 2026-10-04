import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../transaction.types';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Идентификатор пользователя', type: String })
  @Expose()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Сумма', type: String })
  @Expose()
  @IsString()
  amount: string;

  @ApiProperty({ description: 'Тип транзакции', enum: TransactionType })
  @Expose()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty({ description: 'Идентификатор получателя', type: String, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  recipient?: string;
}