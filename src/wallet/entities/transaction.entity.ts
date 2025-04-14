import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
    FUNDING = 'funding',
    TRANSFER = 'transfer',
    TRADE = 'trade',
  }
export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
  }

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  wallet: Wallet;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  currencyFrom?: string;

  @Column({ nullable: true })
  currencyTo?: string;

  @Column({ nullable: true })
  recipientWalletId?: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
  exchangeRate?: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
