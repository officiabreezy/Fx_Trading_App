import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Wallet} from './entities/wallet.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { User} from '../auth/entities/user.entity';
import { FxRateModule } from 'src/fx-rate/fx-rate.module';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User, Transaction]),
 FxRateModule,
],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}