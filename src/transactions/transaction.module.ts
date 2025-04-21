import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../wallet/entities/transaction.entity';
import { TransactionService} from './transaction.service';
import {TransactionController} from './transaction.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction])],
    providers: [TransactionService],
    controllers: [TransactionController],
  })
  export class TransactionModule {}