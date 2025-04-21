// src/transactions/transaction.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../wallet/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { wallet: { id: walletId } },
      order: { createdAt: 'DESC' },
    });
  }
}
