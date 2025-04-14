import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { WalletService } from './wallet.service';
  import { FundWalletDto } from '../auth/dto/fund.wallet.dto';
  import { ConvertCurrencyDto } from '../auth/dto/convert.currency.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt.auth';
  import { VerifiedUserGuard } from '../common/guards/verified-user';
  
  @Controller('wallet')
  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  export class WalletController {
    constructor(private readonly walletService: WalletService) {}
  
    @Post('fund')
    fundWallet(@Request() req, @Body() dto: FundWalletDto) {
      return this.walletService.fundWallet(req.user.id, dto.amount, dto.currency);
    }
  
    @Post('convert')
    convertCurrency(@Request() req, @Body() dto: ConvertCurrencyDto) {
      return this.walletService.convertCurrency(
        req.user.id,
        dto.from,
        dto.to,
        dto.amount
      );
    }
  }
  