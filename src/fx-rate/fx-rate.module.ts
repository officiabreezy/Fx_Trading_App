// fx-rate.module.ts
import { Module } from '@nestjs/common';
import { FxRateService } from './fx-rate.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FxRateService],
  exports: [FxRateService],
})
export class FxRateModule {}
