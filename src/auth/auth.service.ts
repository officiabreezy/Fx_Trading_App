import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword); // Compares the plain password with the hashed one
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {email},
      relations: ['wallets'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email address');
    }
  
    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
  
    return user;
  }
  
   async register(registerDto: RegisterDto): Promise<User> {
    // Check if the user already exists
    const existingUser  = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser ) {
      throw new ConflictException('Email already in use');
    }

    const user = new User();
    user.email = registerDto.email;
    user.password = await bcrypt.hash(registerDto.password, 10);
    
    // Generate OTP
    const otp = this.generateOtp();
    user.otp = otp;
    user.isVerified = false; // Ensure the user is not verified upon registration

    await this.userRepository.save(user);
    console.log('User saved, sending OTP...');
    await this.emailService.sendOtp(user.email, otp);

    return user;
  }

  async verifyOtp(email: string, otp: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otp !== otp) {
      throw new ConflictException('Invalid OTP');
    }

    user.isVerified = true;
    user.otp = ''; // Clear OTP after verification
    await this.userRepository.save(user);

    return user;
  }

  private generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp); // Log OTP to check if it's valid
  return otp;
  };
}
