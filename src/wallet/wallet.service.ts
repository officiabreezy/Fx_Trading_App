import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';  // Update the path as needed
import { User } from '../auth/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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
      wallet.currency = currency; 
      wallet.balanceNGN = 0;
      wallet.balanceUSD = 0;
      wallet.balanceEUR = 0;
      wallet.balanceGBP = 0;
    }

    switch (currency) {
      case 'NGN':
        wallet.balanceNGN += amount;
        break;
      case 'USD':
        wallet.balanceUSD += amount;
        break;
      case 'EUR':
        wallet.balanceEUR += amount;
        break;
      case 'GBP':
        wallet.balanceGBP += amount;
        break;
      default:
        throw new Error('Invalid currency');
    }

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
      if (!user) {
        throw new Error('User not found');
      }
  
      let wallet = await this.walletRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      if (!wallet) {
        throw new Error('Wallet not found');
      }
  
      const conversionRates = {
        'USD': { 'NGN': 800, 'EUR': 0.92, 'GBP': 0.75 },
        'EUR': { 'USD': 1.09, 'NGN': 870, 'GBP': 0.82 },
        'GBP': { 'USD': 1.33, 'EUR': 1.22, 'NGN': 1150 },
        'NGN': { 'USD': 0.0013, 'EUR': 0.0011, 'GBP': 0.00087 },
      };
  
      if (!conversionRates[from] || !conversionRates[from][to]) {
        throw new Error('Invalid currency conversion');
      }
  
      const convertedAmount = amount * conversionRates[from][to];
      switch (to) {
        case 'NGN':
          wallet.balanceNGN += convertedAmount;
          break;
        case 'USD':
          wallet.balanceUSD += convertedAmount;
          break;
        case 'EUR':
          wallet.balanceEUR += convertedAmount;
          break;
        case 'GBP':
          wallet.balanceGBP += convertedAmount;
          break;
        default:
          throw new Error('Invalid currency');
      }
  
      await this.walletRepository.save(wallet);
      return wallet;
    } catch (error) {
      console.error('Error during conversion:', error.message);
      throw new Error('An error occurred while processing the currency conversion');
    }
  };
}