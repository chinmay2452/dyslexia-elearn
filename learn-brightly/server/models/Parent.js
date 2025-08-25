import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

class Parent {
    constructor(username, email, password, role = 'parent') {
        this._id = new ObjectId();
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = new Date();
        this.lastLogin = null;
        this.children = []; // Array to store child user IDs
        this.notificationSettings = {
            emailNotifications: true,
            achievementAlerts: true,
            progressUpdates: true,
            weeklyReports: true,
            reminderFrequency: 'weekly'
        };
    }

    static collectionName = 'parents';

    toJSON() {
        return {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role,
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
