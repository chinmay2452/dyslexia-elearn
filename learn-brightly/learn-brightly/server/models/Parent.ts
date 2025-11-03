import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

interface NotificationSettings {
  emailNotifications: boolean;
  achievementAlerts: boolean;
  progressUpdates: boolean;
  weeklyReports: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'none';
}

interface ParentData {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  children: string[];
  notificationSettings: NotificationSettings;
}

class Parent implements ParentData {
  public _id: ObjectId;
  public username: string;
  public email: string;
  public password: string;
  public role: string;
  public emailVerified: boolean;
  public createdAt: Date;
  public lastLogin?: Date;
  public children: string[];
  public notificationSettings: NotificationSettings;

  static collectionName: string = 'parents';

  constructor(
    username: string, 
    email: string, 
    password: string, 
    role: string = 'parent'
  ) {
    this._id = new ObjectId();
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.emailVerified = false;
    this.createdAt = new Date();
    this.lastLogin = undefined;
    this.children = []; // Array to store child user IDs
    this.notificationSettings = {
      emailNotifications: true,
      achievementAlerts: true,
      progressUpdates: true,
      weeklyReports: true,
      reminderFrequency: 'weekly'
    };
  }

  toJSON(): Omit<ParentData, 'password'> {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
      children: this.children,
      notificationSettings: this.notificationSettings
    };
  }
}

const parentSchema = new mongoose.Schema({
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    achievementAlerts: { type: Boolean, default: true },
    progressUpdates: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    reminderFrequency: { type: String, enum: ['daily', 'weekly', 'none'], default: 'weekly' }
  }
});

export default Parent;
