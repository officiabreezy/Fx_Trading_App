import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth';
import { VerifiedUserGuard } from '../common/guards/verified-user';
import { FxRateService } from './fx-rate.service';

@Controller('fx')
@UseGuards(JwtAuthGuard, VerifiedUserGuard)
export class FxRateController {
  constructor(private readonly fxRateService: FxRateService) {}

  @Get('rate')
  async getRate(@Query('from') from: string, @Query('to') to: string) {
    const rate = await this.fxRateService.getFxRate(from, to);
    return { from, to, rate };
  }
}