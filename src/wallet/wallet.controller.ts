import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,Get,Query
  } from '@nestjs/common';
  import { WalletService } from './wallet.service';
  import { FundWalletDto } from '../auth/dto/fund.wallet.dto';
  import { ConvertCurrencyDto } from '../auth/dto/convert.currency.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt.auth';
  import { VerifiedUserGuard } from '../common/guards/verified-user';
  import { TradeDto } from './dto/trade.dto';
  
  @Controller('wallet')
  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  export class WalletController {
    constructor(private readonly walletService: WalletService) {}
  
    @Post('fund')
    fundWallet(@Request() req, @Body() dto: FundWalletDto) {
      return this.walletService.fundWallet(req.user.id, dto.amount, dto.currency);
    }
  
    @Post('convert')
     async convertCurrency(@Request() req, @Body() dto: ConvertCurrencyDto  
  ) {
     const {from, to, amount} = dto;
     const userId = req.user.id;

     const updatedWallet = await this.walletService.convertCurrency(
      userId,
      from,
      to,
      amount,
    );

    return {
      message: `Converted ${amount} ${from} to ${to}`,
      wallet: updatedWallet,
    };
  }

  @Get()
  async getUserWallet(
    @Request() req,
    @Query('currency') currency?: string
  ){
    const userId = req.user.id;
    return this.walletService.getUserWallet(userId, currency);
  }

  @Post('trade')
  async trade(@Request() req, @Body() dto: TradeDto) {
  const { from, to, amount } = dto;
  const userId = req.user.id;

  return this.walletService.tradeCurrency(userId, from, to, amount);
}
}
