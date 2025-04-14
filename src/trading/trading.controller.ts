
// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt.auth';
// import { VerifiedUserGuard } from '../common/guards/verified-user';

// @Controller('trading')
// @UseGuards(JwtAuthGuard, VerifiedUserGuard) // 🔐 Both guards applied
// export class TradingController {
//   @Get('rates')
//   getRates() {
//     return { message: 'Real-time FX rates for verified users only' };
//   }
// }
