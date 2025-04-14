import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Wallet} from './entities/wallet.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { User} from '../auth/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User])],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}