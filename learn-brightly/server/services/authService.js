import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ObjectId } from 'mongodb';

class AuthService {
    constructor(db) {
        this.db = db;
        this.usersCollection = db.collection(User.collectionName);
        console.log('AuthService initialized with DB:', db.databaseName);
    }

    async signup(userData) {
        const existingUser = await this.usersCollection.findOne({
            $or: [{ email: userData.email }, { username: userData.username }]
        });
    
        if (existingUser) {
            throw new Error('User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(userData.password, 10);
    
        // Pass all user data including age and guardianName
        const newUser = new User(
            userData.username,
            userData.email,
            hashedPassword,
            userData.role || 'student',
            userData.age,
            userData.guardianName
        );
    
        const insertResult = await this.usersCollection.insertOne(newUser);
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
            token
        };
    }

    async login(email, password) {
        const user = await this.usersCollection.findOne({ email });
        if (!user) throw new Error('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        await this.usersCollection.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        const token = this.generateToken(user);
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

    generateToken(user) {
        return jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded || !decoded.id) {
                throw new Error('Invalid token format');
            }

            const user = await this.usersCollection.findOne({ 
                _id: new ObjectId(decoded.id) 
            });
            
            if (!user) {
                throw new Error('User not found');
            }

            return {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                role: user.role,
                age: user.age,
                guardianName: user.guardianName
            };
        } catch (error) {
            console.error('Token verification error:', error);
            throw new Error('Invalid token');
        }
    }

    async updateDyslexiaScore(userId, score) {
        const dysquizCollection = this.db.collection('dysquiz_percent');
        
        const result = await dysquizCollection.updateOne(
            { userId: userId },
            { 
                $set: { 
                    score: score,
                    lastTestDate: new Date()
                }
            },
            { upsert: true } // This will create a new document if it doesn't exist
        );
        
        return { success: true, score };
    }

    async getDyslexiaScore(userId) {
        const dysquizCollection = this.db.collection('dysquiz_percent');
        const result = await dysquizCollection.findOne({ userId: userId });
        return result || { score: null, lastTestDate: null };
    }

    async getReadingPreferences(userId) {
        const user = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) throw new Error('User not found');
        return user.readingPreferences || null;
    }

    async updateReadingPreferences(userId, preferences) {
        const result = await this.usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { readingPreferences: preferences } }
        );
        return { success: true };
    }

    async updateAccount(userId, accountData) {
        const result = await this.usersCollection.updateOne(
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
            throw new Error('Failed to update account');
        }

        const updatedUser = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
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

    async getNotificationSettings(userId) {
        try {
            const user = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
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
        } catch (error) {
            throw new Error(`Failed to get notification settings: ${error.message}`);
        }
    }

    async updateNotificationSettings(userId, settings) {
        try {
            const result = await this.usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: { notificationSettings: settings } }
            );
            if (result.modifiedCount === 0) {
                throw new Error('Failed to update notification settings');
            }
            const updatedUser = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
            return updatedUser.notificationSettings;
        } catch (error) {
            throw new Error(`Failed to update notification settings: ${error.message}`);
        }
    }
}

export default AuthService;