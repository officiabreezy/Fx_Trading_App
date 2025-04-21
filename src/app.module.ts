import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getDatabaseConfig } from './config/database';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { FxRateModule } from './fx-rate/fx-rate.module';
// import { TradingController } from './trading/trading.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { FxRateService } from './fx-rate/fx-rate.service';
import { FxRateController } from './fx-rate/fx-rate.controller';
// import { TransactionModule } from './transactions/transaction.module';

import {config} from 'dotenv';
import { TransactionModule } from './transactions/transaction.module';
config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getDatabaseConfig()),//+
    AuthModule,
    WalletModule,
    HttpModule,
    FxRateModule,
    TransactionModule,
    CacheModule.register({
      isGlobal: true,
      ttl:3600,
    }),
  ],
  providers: [FxRateService],
  controllers: [FxRateController],
  // controllers: [TradingController]
})
export class AppModule {}
