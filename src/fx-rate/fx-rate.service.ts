import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FxRateService {
  async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    return response.data.rates[toCurrency];
  }
}
