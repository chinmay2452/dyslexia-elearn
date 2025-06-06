import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
            user: newUser.toJSON(),
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
            user: new User(user.username, user.email, user.password, user.role).toJSON(),
            token
        };
    }

    generateToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    async verifyToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await this.usersCollection.findOne({ _id: decoded.id });
        if (!user) throw new Error('User not found');
        return new User(user.username, user.email, user.password, user.role).toJSON();
    }
}

export default AuthService;