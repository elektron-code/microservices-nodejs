import { Controller, Get, Param, Post, Query, Body, NotFoundException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<void> {
    return this.transactionService.create(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<TransactionDto> {
    const transaction = await this.transactionService.getTransaction(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return {
      id: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
    };
  }

  @Get()
  async getTransactions(
    @Query() query: GetTransactionsFilterDto,
  ): Promise<{ items: TransactionDto[]; total: number }> {
    const { items, total } = await this.transactionService.getTransactions(query);

    return {
      items: items.map((t) => ({
        id: t.id,
        userId: t.userId,
        amount: t.amount,
        type: t.type,
        status: t.status,
      })),
      total,
    };
  }
}