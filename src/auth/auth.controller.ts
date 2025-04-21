import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify')
  async verify(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @Post('login')

    async login(@Body() body: { email: string; password: string }) {
      const user = await this.authService.login(body.email, body.password);
      

    const userPayload = {
      sub: user.id,
      email: user.email,
      verified: user.isVerified,
      walletId: user.wallets[0]?.id,
    };

    const token = await this.jwtService.signAsync(userPayload);

    return {
      access_token: token,
    };
  }
}
