import { Injectable, Inject} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
// import axios from 'axios';

@Injectable()
export class FxRateService {
  private readonly API_KEY = process.env.FX_API_KEY;
  
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
    async getFxRate(from: string, to: string): Promise<number> {
  
    const cacheKey = `fx-${from}-${to}`;
    const cachedRate = await this.cacheManager.get<number>(cacheKey);
    if (cachedRate) return cachedRate;

    const url = `https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/${from}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const rate = response.data?.conversion_rates?.[to];
    
    console.log(`Fetching FX Rate from ${from} to ${to}`);
    console.log('API Response:', response.data);
    console.log(`FX Rate returned: ${rate}`);


    if (!rate) {
      throw new Error(`FX rate not available for ${from} to ${to}`);
    }

    await this.cacheManager.set(cacheKey, rate, 3600);
    return rate;
  }
}
