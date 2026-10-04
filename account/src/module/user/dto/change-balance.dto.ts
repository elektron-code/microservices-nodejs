import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { TransactionType } from '../user.types';

export class ChangeBalanceDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    required: true,
    type: String,
  })
  @Expose()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Сумма',
    type: String,
  })
  @IsString()
  @Expose()
  amount: string;

  @ApiProperty({
    description: 'Тип транзакции',
    required: false,
    enum: TransactionType,
  })
  @Expose()
  @IsEnum(TransactionType)
  transactionType: TransactionType;
}