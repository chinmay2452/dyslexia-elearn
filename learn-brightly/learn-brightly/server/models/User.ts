import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

interface ReadingPreferences {
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  letterSpacing: number;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
}

interface UserData {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  age?: number;
  guardianName?: string;
  readingPreferences?: ReadingPreferences;
  emailVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

class User implements UserData {
  public _id: ObjectId;
  public username: string;
  public email: string;
  public password: string;
  public role: string;
  public age?: number;
  public guardianName?: string;
  public readingPreferences?: ReadingPreferences;
  public emailVerified: boolean;
  public createdAt: Date;
  public lastLogin?: Date;

  static collectionName: string = 'Users';

  constructor(
    username: string, 
    email: string, 
    password: string, 
    role: string = 'student', 
    age: number | null = null, 
    guardianName: string | null = null, 
    readingPreferences: ReadingPreferences | null = null
  ) {
    this._id = new ObjectId();
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.age = age || undefined;
    this.guardianName = guardianName || undefined;
    this.readingPreferences = readingPreferences || undefined;
    this.emailVerified = false;
    this.createdAt = new Date();
    this.lastLogin = undefined;
  }

  toJSON(): Omit<UserData, 'password'> {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
      age: this.age,
      guardianName: this.guardianName,
      readingPreferences: this.readingPreferences,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}

const userSchema = new mongoose.Schema({
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    achievementAlerts: { type: Boolean, default: true },
    progressUpdates: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    reminderFrequency: { type: String, enum: ['daily', 'weekly', 'none'], default: 'weekly' }
  }
});

export default User;
