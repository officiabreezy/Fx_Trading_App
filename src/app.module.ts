import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getDatabaseConfig } from './config/database';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { FxRateModule } from './fx-rate/fx-rate.module';
import { TradingController } from './trading/trading.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { FxService } from './fx/fx.service';
import { FxController } from './fx/fx.controller';
// import { TransactionModule } from './transactions/transaction.module';

import {config} from 'dotenv';
config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getDatabaseConfig()),//+
    AuthModule,
    WalletModule,
    HttpModule,
    FxRateModule,
    CacheModule.register({
      isGlobal: true,
      ttl:3600,
    }),
  ],
  providers: [FxService],
  controllers: [TradingController,FxController],
})
export class AppModule {}
