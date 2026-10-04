import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionStatus, TransactionType } from '../transaction.types';

export class GetTransactionsFilterDto {
  @ApiProperty({ description: 'Идентификаторы транзакций', type: [String] })
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  ids?: string[];

  @ApiProperty({ description: 'Идентификаторы пользователей', type: [String] })
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  userIds?: string[];

  @ApiProperty({ description: 'Сумма', type: [String] })
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  amounts?: string[];

  @ApiProperty({ description: 'Тип транзакции', enum: TransactionType, required: false })
  @Expose()
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ description: 'Статус транзакции', enum: TransactionStatus, required: false })
  @Expose()
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({ description: '', type: Number, required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  readonly take?: number;

  @ApiProperty({ description: '', type: Number, required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  readonly skip?: number;
}