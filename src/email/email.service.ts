import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
 private transporter;

 constructor() {
  this.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
    // tls: {
    //     rejectUnauthorized: false,
    // },
  });
 }
  async sendOtp(email: string, otp: string) {
    console.log('Sending OTP...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', email);
    console.log('OTP:', otp);

    try {
    console.log('Sending OTP to:', email);

    const mailOptions = {
    // await this.transporter.sendMail({
      from: `"FX Wallet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Hi there,Your One-Time Password (OTP) for verifying your FX Wallet account is: ${otp}
      This OTP will expire in 10 minutes. If you did not request this, please ignore this email.
      Regards,
      FX Wallet Team`,
    };

    await this.transporter.sendMail(mailOptions);
    console.log('OTP Sent successfully')
} catch (error) {
    console.error('error sending OTP:', error);
   };
  };
}