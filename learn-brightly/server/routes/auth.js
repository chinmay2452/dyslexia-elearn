import express from 'express';
import AuthService from '../services/authService.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const router = express.Router();
let authService;

// Middleware to initialize AuthService with DB
const initAuthService = (req, res, next) => {
    if (!authService) {
        authService = new AuthService(req.app.locals.db);
    }
    next();
};

// Logging middleware
router.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    console.log('Body:', req.body);
    next();
});

// Signup
router.post('/signup', initAuthService, async (req, res) => {
    try {
        const { username, email, password, role, age, guardianName } = req.body;

        if (!username || !email || !password || !age || !guardianName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await authService.signup({
            username,
            email,
            password,
            role,
            age,
            guardianName
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', initAuthService, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(401).json({ error: error.message });
    }
});

// Token verify
router.get('/verify', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user = await authService.verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Verify error:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Update dyslexia score
router.post('/update-dyslexia-score', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user = await authService.verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const { score } = req.body;
        if (score === undefined) {
            return res.status(400).json({ error: 'Missing score' });
        }

        const result = await authService.updateDyslexiaScore(user.id, score);
        res.json(result);
    } catch (error) {
        console.error('Update dyslexia score error:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Get dyslexia score
router.get('/dyslexia-score', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user = await authService.verifyToken(token);
        const result = await authService.getDyslexiaScore(user.id);
        res.json(result);
    } catch (error) {
        console.error('Get dyslexia score error:', error.message);
        res.status(401).json({ error: error.message });
    }
});

export default router;