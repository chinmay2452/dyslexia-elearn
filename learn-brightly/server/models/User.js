import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

class User {
    constructor(username, email, password, role = 'student', age = null, guardianName = null, readingPreferences = null) {
        this._id = new ObjectId();
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.age = age;
        this.guardianName = guardianName;
        this.readingPreferences = readingPreferences;
        this.createdAt = new Date();
        this.lastLogin = null;
    }

    static collectionName = 'Users';

    toJSON() {
        return {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role,
            age: this.age,
            guardianName: this.guardianName,
            readingPreferences: this.readingPreferences,
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