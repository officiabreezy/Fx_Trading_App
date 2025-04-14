import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  currency: string; 

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balanceNGN: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balanceUSD: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balanceEUR: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balanceGBP: number;

  @OneToMany(() => Transaction, tx => tx.wallet)
  transactions: Transaction[];
}
