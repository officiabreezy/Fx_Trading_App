import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';  // Update the path as needed
import { User } from '../auth/entities/user.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';
import { FxRateService } from 'src/fx-rate/fx-rate.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private fxRateService: FxRateService,
  ) {}

  private formatDecimal(value: any): number {
    const numValue = typeof value === 'number' ? value : Number(value);
    return parseFloat(numValue.toFixed(2));
  }

  async fundWallet(userId: string, amount: number, currency: string){
    try {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    let wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!wallet) {
      wallet = new Wallet();
      wallet.user = user;
      // wallet.currency = currency; 
      wallet.balance = 0;
      wallet.balanceNGN = 0;
      wallet.balanceUSD = 0;
      wallet.balanceEUR = 0;
      wallet.balanceGBP = 0;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error('Invalid amount');
    }

    switch (currency) {
      case 'NGN':
        const currentNGN = typeof wallet.balanceNGN === 'number' ? wallet.balanceNGN : Number(wallet.balanceNGN);
        wallet.balanceNGN = this.formatDecimal(currentNGN + parsedAmount);
        wallet.balance = wallet.balanceNGN; // Update the default balance
        break;
      case 'USD':
        const currentUSD = typeof wallet.balanceUSD === 'number' ? wallet.balanceUSD : Number(wallet.balanceUSD);
        wallet.balanceUSD = this.formatDecimal(currentUSD + parsedAmount);
        break;
      case 'EUR':
        const currentEUR = typeof wallet.balanceEUR === 'number' ? wallet.balanceEUR : Number(wallet.balanceEUR);
        wallet.balanceEUR = this.formatDecimal(currentEUR + parsedAmount);
        break;
      case 'GBP':
        const currentGBP = typeof wallet.balanceGBP === 'number' ? wallet.balanceGBP : Number(wallet.balanceGBP);
        wallet.balanceGBP = this.formatDecimal(currentGBP + parsedAmount);
        break;
      default:
        throw new BadRequestException('Invalid currency');
    }

    wallet.balance = Number(wallet.balanceNGN);

    await this.walletRepository.save(wallet);
    return wallet;
  } catch (error) {
    console.error('error funding wallet:', error);
    throw new Error('an error occur proceessing the wallet funding')
  }
  }
  async convertCurrency(
    userId: string,
    from: string,
    to: string,
    amount: number,
  ): Promise<Wallet> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
  
      const wallet = await this.walletRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      if (!wallet) throw new NotFoundException('Wallet not found');
  
      const rate = await this.fxRateService.getFxRate(from, to);
      const convertedAmount = this.formatDecimal(amount * rate);
  
      // Deduct from the source currency
    switch (from) {
      case 'NGN':
        const currentNGN = Number(wallet.balanceNGN);
        if (currentNGN < amount) {
          throw new BadRequestException('Insufficient NGN balance');
        }
        wallet.balanceNGN = this.formatDecimal(currentNGN - amount);
        break;
      case 'USD':
        const currentUSD = Number(wallet.balanceUSD);
        if (currentUSD < amount) {
          throw new BadRequestException('Insufficient USD balance');
        }
        wallet.balanceUSD = this.formatDecimal(currentUSD - amount);
        break;
      case 'EUR':
        const currentEUR = Number(wallet.balanceEUR);
        if (currentEUR < amount) {
          throw new BadRequestException('Insufficient EUR balance');
        }
        wallet.balanceEUR = this.formatDecimal(currentEUR - amount);
        break;
      case 'GBP':
        const currentGBP = Number(wallet.balanceGBP);
        if (currentGBP < amount) {
          throw new BadRequestException('Insufficient GBP balance');
        }
        wallet.balanceGBP = this.formatDecimal(currentGBP - amount);
        break;
      default:
        throw new BadRequestException('Invalid source currency');
    }

  
      // Add to the target currency
      switch (to) {
        case 'NGN':
          wallet.balanceNGN = this.formatDecimal(Number(wallet.balanceNGN) + convertedAmount);
          break;
        case 'USD':
          wallet.balanceUSD = this.formatDecimal(Number(wallet.balanceUSD) + convertedAmount);
          break;
        case 'EUR':
          wallet.balanceEUR = this.formatDecimal(Number(wallet.balanceEUR) + convertedAmount);
          break;
        case 'GBP':
          wallet.balanceGBP = this.formatDecimal(Number(wallet.balanceGBP) + convertedAmount);
          break;
        default:
          throw new BadRequestException('Invalid target currency');
      }
  
  
      return await this.walletRepository.save(wallet);
    } catch (error) {
      console.error('Error during conversion:', error.message);
      throw new Error('An error occurred while processing the currency conversion');
    }
  }

  async getUserWallet(userId: string, currency?:string){
    const wallet = await this.walletRepository.findOne({
      where: { user: {id: userId }},
      relations:['user'],
    })

    if(!wallet){
      throw new NotFoundException('wallet not found');
    }

    if(currency){
      const currencyKey = `balance${currency.toUpperCase()}`;
      if(!(currencyKey in wallet)){
        throw new BadRequestException('Unsupported currency');
      }

      return {
        currency: currency.toUpperCase(),
        balance: wallet[currencyKey],
      };
    }
  return wallet;
} 

async tradeCurrency(userId: string, from: string, to: string, amount: number) {
  const wallet = await this.walletRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });

  if (!wallet) throw new NotFoundException('Wallet not found');
  if (from === to) throw new BadRequestException('Cannot convert to the same currency');

  const fromKey = `balance${from.toUpperCase()}`;
  const toKey = `balance${to.toUpperCase()}`;
  const fromBalance = Number(wallet[fromKey]);

  if (fromBalance < amount) {
    throw new BadRequestException(`Insufficient ${from} balance`);
  }

  const rate = await this.fxRateService.getFxRate(from, to); // Assume this returns a number
  const convertedAmount = Number((amount * rate).toFixed(2));

  // Update wallet balances
  wallet[fromKey] = fromBalance - amount;
  wallet[toKey] = Number(wallet[toKey]) + convertedAmount;

  // Save wallet update
  await this.walletRepository.save(wallet);

  // Create transaction record
  const transaction = this.transactionRepository.create({
    wallet,
    type: TransactionType.TRADE,
    amount,
    currencyFrom: from,
    currencyTo: to,
    exchangeRate: rate,
    description: `Traded ${amount} ${from} to ${convertedAmount} ${to}`,
  });

  await this.transactionRepository.save(transaction);

  return {
    wallet,
    transaction,
    message: `Successfully traded ${amount} ${from} to ${convertedAmount} ${to}`,
  };
}
} 