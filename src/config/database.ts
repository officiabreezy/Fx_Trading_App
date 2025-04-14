 
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { User } from '../auth/entities/user.entity';
// import { Wallet } from '../wallet/entities/wallet.entity';
// import { Transaction } from '../wallet/entities/transaction.entity';

// export const databaseConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   entities: [User, Wallet, Transaction],
//   synchronize: process.env.NODE_ENV !== 'production',
// };

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Transaction } from '../wallet/entities/transaction.entity';

export const getDatabaseConfig= (): TypeOrmModuleOptions => {
        if (!process.env.DATABASE_HOST || !process.env.DATABASE_USER) {
          throw new Error('Database configuration is missing required environment variables');
        }
 return  {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD || '', // Ensure password is always a string
  database: process.env.DATABASE_NAME,
  entities: [User, Wallet, Transaction],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  // Add these additional options for better connection handling
  extra: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  // Connection retry settings
  retryAttempts: 5,
  retryDelay: 3000,
};
};