import { IsNumber, IsString, IsIn, Min } from 'class-validator';

export class ConvertCurrencyDto {
  @IsString()
  @IsIn(['NGN', 'USD', 'EUR','GBP'])
  from: string;

  @IsString()
  @IsIn(['NGN', 'USD', 'EUR','GBP'])
  to: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
