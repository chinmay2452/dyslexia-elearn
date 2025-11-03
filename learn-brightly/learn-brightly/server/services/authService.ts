import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Parent from '../models/Parent.js';
import EmailService from './emailService.js';
import { ObjectId, Db } from 'mongodb';

interface UserData {
  username: string;
  email: string;
  password: string;
  role: 'parent' | 'student';
  age?: number;
  guardianName?: string;
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthResult {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    age?: number;
    guardianName?: string;
    children?: string[];
  };
  token: string;
  message?: string;
}

interface EmailVerificationResult {
  success: boolean;
  message: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  achievementAlerts: boolean;
  progressUpdates: boolean;
  weeklyReports: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'none';
}

interface ReadingPreferences {
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  letterSpacing: number;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
}

class AuthService {
  private db: Db;
  private usersCollection: any;
  private parentsCollection: any;
  private emailService: EmailService;

  constructor(db: Db) {
    this.db = db;
    this.usersCollection = db.collection(User.collectionName);
    this.parentsCollection = db.collection(Parent.collectionName);
    this.emailService = new EmailService();
    console.log('AuthService initialized with DB:', db.databaseName);
    console.log('Users collection:', User.collectionName, this.usersCollection);
    console.log('Parents collection:', Parent.collectionName, this.parentsCollection);
  }

  async signup(userData: UserData): Promise<AuthResult> {
    const { role } = userData;
    console.log('AuthService.signup called with role:', role);
    
    if (role === 'parent') {
      console.log('Calling signupParent');
      return await this.signupParent(userData);
    } else {
      console.log('Calling signupStudent');
      return await this.signupStudent(userData);
    }
  }

  async signupParent(userData: UserData): Promise<AuthResult> {
    try {
      console.log('signupParent called with data:', userData);
      console.log('Using collection:', Parent.collectionName);
      console.log('Collection object:', this.parentsCollection);
      
      const existingUser = await this.parentsCollection.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });
  
      if (existingUser) {
        throw new Error('Parent account already exists');
      }
  
      const hashedPassword = await bcrypt.hash(userData.password, 10);
  
      const newParent = new Parent(
        userData.username,
        userData.email,
        hashedPassword,
        'parent'
      );
      
      // Set email as unverified initially
      newParent.emailVerified = false;
      
      console.log('New parent object created:', newParent);
  
      const insertResult = await this.parentsCollection.insertOne(newParent);
      console.log('Parent inserted:', insertResult);
      
      // Set email as verified for now (skip email verification)
      newParent.emailVerified = true;
      await this.parentsCollection.updateOne(
        { _id: newParent._id },
        { $set: { emailVerified: true } }
      );
      
      const token = this.generateToken(newParent);
  
      return {
        user: {
          id: newParent._id.toString(),
          username: newParent.username,
          email: newParent.email,
          role: newParent.role,
          children: newParent.children
        },
        token,
        message: 'Registration successful! You are now logged in.'
      };
    } catch (error: any) {
      console.error('Error in signupParent:', error);
      throw error;
    }
  }

  async signupStudent(userData: UserData): Promise<AuthResult> {
    const existingUser = await this.usersCollection.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    });

    if (existingUser) {
      throw new Error('Student account already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User(
      userData.username,
      userData.email,
      hashedPassword,
      'student',
      userData.age,
      userData.guardianName
    );
    
    // Set email as unverified initially
    newUser.emailVerified = false;

    const insertResult = await this.usersCollection.insertOne(newUser);
    
    // Set email as verified for now (skip email verification)
    newUser.emailVerified = true;
    await this.usersCollection.updateOne(
      { _id: newUser._id },
      { $set: { emailVerified: true } }
    );
    
    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        age: newUser.age,
        guardianName: newUser.guardianName
      },
      token,
      message: 'Registration successful! You are now logged in.'
    };
  }

  async login(email: string, password: string, expectedUserType: 'parent' | 'student'): Promise<AuthResult> {
    // Try to find user in both collections
    let user = await this.usersCollection.findOne({ email });
    let collection = this.usersCollection;
    
    if (!user) {
      user = await this.parentsCollection.findOne({ email });
      collection = this.parentsCollection;
    }
    
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in. Check your inbox for the verification email.');
    }

    // Check if the user's role matches the expected user type
    if (user.role !== expectedUserType) {
      if (expectedUserType === 'student') {
        throw new Error('This email is registered as a parent account. Please use the "I am a parent" option to log in.');
      } else {
        throw new Error('This email is registered as a student account. Please use the "I am a student" option to log in.');
      }
    }

    await collection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    const token = this.generateToken(user);
    
    if (user.role === 'parent') {
      return {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          children: user.children || []
        },
        token
      };
    } else {
      return {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          age: user.age,
          guardianName: user.guardianName
        },
        token
      };
    }
  }

  generateToken(user: any): string {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      } as TokenPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
      if (!decoded || !decoded.id) {
        throw new Error('Invalid token format');
      }

      // Try to find user in both collections
      let user = await this.usersCollection.findOne({ 
        _id: new ObjectId(decoded.id) 
      });
      
      if (!user) {
        user = await this.parentsCollection.findOne({ 
          _id: new ObjectId(decoded.id) 
        });
      }
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.role === 'parent') {
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          children: user.children || []
        };
      } else {
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          age: user.age,
          guardianName: user.guardianName
        };
      }
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Invalid token');
    }
  }

  async updateDyslexiaScore(userId: string, score: number): Promise<{ success: boolean; score: number }> {
    const dysquizCollection = this.db.collection('dysquiz_percent');
    
    const result = await dysquizCollection.updateOne(
      { userId: userId },
      { 
        $set: { 
          score: score,
          lastTestDate: new Date()
        }
      },
      { upsert: true }
    );
    
    return { success: true, score };
  }

  async getDyslexiaScore(userId: string): Promise<{ score: number | null; lastTestDate: Date | null }> {
    const dysquizCollection = this.db.collection('dysquiz_percent');
    const result = await dysquizCollection.findOne({ userId: userId });
    if (result) {
      return {
        score: result.score || null,
        lastTestDate: result.lastTestDate || null
      };
    }
    return { score: null, lastTestDate: null };
  }

  async getReadingPreferences(userId: string): Promise<ReadingPreferences | null> {
    // Try to find user in both collections
    let user = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      user = await this.parentsCollection.findOne({ _id: new ObjectId(userId) });
    }
    if (!user) throw new Error('User not found');
    return user.readingPreferences || null;
  }

  async updateReadingPreferences(userId: string, preferences: ReadingPreferences): Promise<{ success: boolean }> {
    // Try to update in both collections
    let result = await this.usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { readingPreferences: preferences } }
    );
    
    if (result.modifiedCount === 0) {
      result = await this.parentsCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { readingPreferences: preferences } }
      );
    }
    
    return { success: true };
  }

  async updateAccount(userId: string, accountData: Partial<UserData>): Promise<{ user: any }> {
    // Try to update in both collections
    let result = await this.usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          username: accountData.username,
          email: accountData.email,
          age: accountData.age,
          guardianName: accountData.guardianName
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      result = await this.parentsCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            username: accountData.username,
            email: accountData.email
          }
        }
      );
    }
    
    if (result.modifiedCount === 0) {
      throw new Error('Failed to update account');
    }

    // Get updated user from appropriate collection
    let updatedUser = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!updatedUser) {
      updatedUser = await this.parentsCollection.findOne({ _id: new ObjectId(userId) });
    }
    
    if (updatedUser.role === 'parent') {
      return {
        user: {
          id: updatedUser._id.toString(),
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          children: updatedUser.children || []
        }
      };
    } else {
      return {
        user: {
          id: updatedUser._id.toString(),
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          age: updatedUser.age,
          guardianName: updatedUser.guardianName
        }
      };
    }
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      // Try to find user in both collections
      let user = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        user = await this.parentsCollection.findOne({ _id: new ObjectId(userId) });
      }
      if (!user) {
        throw new Error('User not found');
      }
      return user.notificationSettings || {
        emailNotifications: true,
        achievementAlerts: true,
        progressUpdates: true,
        weeklyReports: true,
        reminderFrequency: 'weekly'
      };
    } catch (error: any) {
      throw new Error(`Failed to get notification settings: ${error.message}`);
    }
  }

  async updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<NotificationSettings> {
    try {
      // Try to update in both collections
      let result = await this.usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { notificationSettings: settings } }
      );
      
      if (result.modifiedCount === 0) {
        result = await this.parentsCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { notificationSettings: settings } }
        );
      }
      
      if (result.modifiedCount === 0) {
        throw new Error('Failed to update notification settings');
      }
      
      // Get updated user from appropriate collection
      let updatedUser = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!updatedUser) {
        updatedUser = await this.parentsCollection.findOne({ _id: new ObjectId(userId) });
      }
      
      return updatedUser.notificationSettings;
    } catch (error: any) {
      throw new Error(`Failed to update notification settings: ${error.message}`);
    }
  }

  // Verify email with token
  async verifyEmail(token: string, email: string): Promise<EmailVerificationResult> {
    try {
      const tokenData = this.emailService.verifyToken(token);
      
      if (tokenData.email !== email) {
        throw new Error('Email does not match verification token');
      }
      
      const userData = tokenData.userData;
      
      // Update user's email verification status
      let collection = this.usersCollection;
      if (userData.role === 'parent') {
        collection = this.parentsCollection;
      }
      
      await collection.updateOne(
        { _id: userData._id },
        { $set: { emailVerified: true } }
      );
      
      // Remove the verification token
      this.emailService.removeVerificationToken(token);
      
      // Send welcome email
      await this.emailService.sendWelcomeEmail(email, userData.username, userData.role);
      
      return {
        success: true,
        message: 'Email verified successfully! You can now log in to your account.'
      };
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<EmailVerificationResult> {
    try {
      // Find user in both collections
      let user = await this.usersCollection.findOne({ email });
      let collection = this.usersCollection;
      
      if (!user) {
        user = await this.parentsCollection.findOne({ email });
        collection = this.parentsCollection;
      }
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.emailVerified) {
        throw new Error('Email is already verified');
      }
      
      // Generate new verification token and send email
      const verificationToken = this.emailService.generateVerificationToken();
      this.emailService.storeVerificationToken(email, verificationToken, user);
      
      await this.emailService.sendVerificationEmail(
        email, 
        user.username, 
        verificationToken, 
        user.role
      );
      
      return {
        success: true,
        message: 'Verification email sent successfully!'
      };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }
}

export default AuthService;
