import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Parent from '../models/Parent.js';
import { ObjectId } from 'mongodb';

class AuthService {
    constructor(db) {
        this.db = db;
        this.usersCollection = db.collection(User.collectionName);
        this.parentsCollection = db.collection(Parent.collectionName);
        console.log('AuthService initialized with DB:', db.databaseName);
        console.log('Users collection:', User.collectionName, this.usersCollection);
        console.log('Parents collection:', Parent.collectionName, this.parentsCollection);
    }

    async signup(userData) {
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

    async signupParent(userData) {
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
            
            console.log('New parent object created:', newParent);
        
            const insertResult = await this.parentsCollection.insertOne(newParent);
            console.log('Parent inserted:', insertResult);
            
            const token = this.generateToken(newParent);
        
            return {
                user: {
                    id: newParent._id.toString(),
                    username: newParent.username,
                    email: newParent.email,
                    role: newParent.role,
                    children: newParent.children
                },
                token
            };
        } catch (error) {
            console.error('Error in signupParent:', error);
            throw error;
        }
    }

    async signupStudent(userData) {
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
            { upsert: true }
        );
        
        return { success: true, score };
    }

    async getDyslexiaScore(userId) {
        const dysquizCollection = this.db.collection('dysquiz_percent');
        const result = await dysquizCollection.findOne({ userId: userId });
        return result || { score: null, lastTestDate: null };
    }

    async getReadingPreferences(userId) {
        // Try to find user in both collections
        let user = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            user = await this.parentsCollection.findOne({ _id: new ObjectId(userId) });
        }
        if (!user) throw new Error('User not found');
        return user.readingPreferences || null;
    }

    async updateReadingPreferences(userId, preferences) {
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

    async updateAccount(userId, accountData) {
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

    async getNotificationSettings(userId) {
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
        } catch (error) {
            throw new Error(`Failed to get notification settings: ${error.message}`);
        }
    }

    async updateNotificationSettings(userId, settings) {
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
        } catch (error) {
            throw new Error(`Failed to update notification settings: ${error.message}`);
        }
    }
}

export default AuthService;