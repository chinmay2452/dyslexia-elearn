import nodemailer, { Transporter } from 'nodemailer';
import crypto from 'crypto';

interface VerificationTokenData {
  email: string;
  userData: any;
  createdAt: Date;
  expiresAt: Date;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter;
  private verificationTokens: Map<string, VerificationTokenData>;

  constructor() {
    // Create transporter for email sending
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });
    
    // In-memory storage for verification tokens (in production, use Redis or database)
    this.verificationTokens = new Map();
  }

  // Generate verification token
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email
  async sendVerificationEmail(email: string, username: string, token: string, role: string): Promise<boolean> {
    const verificationLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}&email=${email}`;
    
    const mailOptions: MailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Verify Your Email - Learn Brightly',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #A38BFE;">Welcome to Learn Brightly! 🌟</h2>
          <p>Hello ${username},</p>
          <p>Thank you for signing up as a ${role === 'parent' ? 'parent' : 'student'} on Learn Brightly!</p>
          <p>To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #A38BFE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account with Learn Brightly, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This email was sent by Learn Brightly. If you have any questions, please contact our support team.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Store verification token
  storeVerificationToken(email: string, token: string, userData: any): void {
    this.verificationTokens.set(token, {
      email,
      userData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
  }

  // Verify token and get user data
  verifyToken(token: string): VerificationTokenData {
    const tokenData = this.verificationTokens.get(token);
    
    if (!tokenData) {
      throw new Error('Invalid verification token');
    }
    
    if (new Date() > tokenData.expiresAt) {
      this.verificationTokens.delete(token);
      throw new Error('Verification token has expired');
    }
    
    return tokenData;
  }

  // Remove verification token after successful verification
  removeVerificationToken(token: string): void {
    this.verificationTokens.delete(token);
  }

  // Send welcome email after successful verification
  async sendWelcomeEmail(email: string, username: string, role: string): Promise<boolean> {
    const mailOptions: MailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to Learn Brightly! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #A38BFE;">Welcome to Learn Brightly, ${username}! 🎉</h2>
          <p>Your email has been successfully verified and your ${role === 'parent' ? 'parent' : 'student'} account is now active!</p>
          <p>You can now:</p>
          <ul>
            ${role === 'parent' 
              ? '<li>Monitor your children\'s learning progress</li><li>View detailed reports and analytics</li><li>Access educational resources</li>'
              : '<li>Take dyslexia assessments</li><li>Play educational games</li><li>Access reading materials</li>'
            }
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/auth" 
               style="background-color: #A38BFE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Start Learning Now
            </a>
          </div>
          <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Learn Brightly - Empowering learning for everyone
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email as it's not critical
      return false;
    }
  }
}

export default EmailService;
