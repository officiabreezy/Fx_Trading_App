
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth';
// import { VerifiedUserGuard } from '../common/guards/verified-user';
import { TransactionService } from './transaction.service';

@Controller('transactions')
 @UseGuards(JwtAuthGuard) // 🔐 Both guards applied
export class TransactionController {
    constructor (private readonly transactionService: TransactionService) {}

    @Get()
    async getWalletTransactions(@Request() req) {
        const walletId = req.user.walletId;
        return this.transactionService.getTransactionsByWallet(walletId);
      }
 }
