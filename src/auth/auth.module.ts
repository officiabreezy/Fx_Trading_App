import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Registers the User entity
    EmailModule, // Assuming you use EmailModule for OTP/notifications
    ConfigModule.forRoot(), // Loads environment variables from .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT_SECRET from .env
        signOptions: { expiresIn: '1h' }, // Set JWT expiration time
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy], // Register AuthService and JwtStrategy
  controllers: [AuthController], // Register AuthController
  exports: [AuthService], // Optionally export AuthService if needed in other modules
})
export class AuthModule {}
