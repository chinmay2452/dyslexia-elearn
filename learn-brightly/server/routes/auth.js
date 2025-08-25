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
        
        console.log('Signup request received:', { username, email, password, role, age, guardianName });

        if (!username || !email || !password) {
            console.log('Missing basic fields:', { username: !!username, email: !!email, password: !!password });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate required fields based on role
        if (role === 'student') {
            if (!age || !guardianName) {
                console.log('Student missing fields:', { age: !!age, guardianName: !!guardianName });
                return res.status(400).json({ error: 'Age and guardian name are required for students' });
            }
        } else if (role === 'parent') {
            console.log('Parent signup - no additional fields required');
        } else {
            console.log('Invalid role:', role);
            return res.status(400).json({ error: 'Invalid role specified' });
        }

        console.log('Validation passed, calling authService.signup');
        const result = await authService.signup({
            username,
            email,
            password,
            role,
            age,
            guardianName
        });

        console.log('Signup successful:', result);
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
        
        // Check if userId query parameter is provided (for parents viewing children's scores)
        const { userId } = req.query;
        
        if (userId && user.role === 'parent') {
            // Parent is requesting a specific child's score
            const result = await authService.getDyslexiaScore(userId);
            res.json(result);
        } else {
            // User is requesting their own score
            const result = await authService.getDyslexiaScore(user.id);
            res.json(result);
        }
    } catch (error) {
        console.error('Get dyslexia score error:', error.message);
        res.status(401).json({ error: error.message });
    }
});

// Get reading preferences
router.get('/reading-preferences', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const user = await authService.verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }
        const prefs = await authService.getReadingPreferences(user.id);
        res.json({ readingPreferences: prefs });
    } catch (error) {
        console.error('Get reading preferences error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update reading preferences
router.post('/reading-preferences', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const user = await authService.verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }
        const { preferences } = req.body;
        if (!preferences) {
            return res.status(400).json({ error: 'Missing preferences' });
        }
        await authService.updateReadingPreferences(user.id, preferences);
        res.json({ success: true });
    } catch (error) {
        console.error('Update reading preferences error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update account information
router.post('/update-account', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user = await authService.verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const { username, email, age, guardianName } = req.body;
        
        // Validate required fields based on role
        if (user.role === 'student') {
            if (!username || !email || !age || !guardianName) {
                return res.status(400).json({ error: 'Missing required fields for student' });
            }
        } else if (user.role === 'parent') {
            if (!username || !email) {
                return res.status(400).json({ error: 'Missing required fields for parent' });
            }
        }

        const result = await authService.updateAccount(user.id, {
            username,
            email,
            age,
            guardianName
        });
        res.json(result);
    } catch (error) {
        console.error('Update account error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get notification settings
router.get('/notification-settings', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user = await authService.verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const settings = await authService.getNotificationSettings(user.id);
        res.json(settings);
    } catch (error) {
        console.error('Get notification settings error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update notification settings
router.post('/update-notification-settings', initAuthService, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user = await authService.verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const settings = req.body;
        const result = await authService.updateNotificationSettings(user.id, settings);
        res.json(result);
    } catch (error) {
        console.error('Update notification settings error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;