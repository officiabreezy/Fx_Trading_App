
import { IsNumber, IsString } from 'class-validator';

export class FundWalletDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string; // ✅ Make sure this is included
}

