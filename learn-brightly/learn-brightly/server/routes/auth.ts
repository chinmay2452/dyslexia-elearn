import express, { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const router = express.Router();
let authService: AuthService;

interface AuthenticatedRequest extends Request {
  app: any;
}

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
  role: 'parent' | 'student';
  age?: number;
  guardianName?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
  userType: 'parent' | 'student';
}

interface VerifyEmailRequestBody {
  token: string;
  email: string;
}

interface ResendVerificationRequestBody {
  email: string;
}

interface UpdateDyslexiaScoreRequestBody {
  score: number;
}

interface UpdateReadingPreferencesRequestBody {
  preferences: any;
}

interface UpdateAccountRequestBody {
  username: string;
  email: string;
  age?: number;
  guardianName?: string;
}

interface UpdateNotificationSettingsRequestBody {
  emailNotifications?: boolean;
  achievementAlerts?: boolean;
  progressUpdates?: boolean;
  weeklyReports?: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'none';
}

// Middleware to initialize AuthService with DB
const initAuthService = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!authService) {
    authService = new AuthService(req.app.locals.db);
  }
  next();
};

// Logging middleware
router.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${req.method}] ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Signup
router.post('/signup', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, age, guardianName }: SignupRequestBody = req.body;
    
    console.log('Signup request received:', { username, email, password, role, age, guardianName });

    if (!username || !email || !password) {
      console.log('Missing basic fields:', { username: !!username, email: !!email, password: !!password });
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate required fields based on role
    if (role === 'student') {
      if (!age || !guardianName) {
        console.log('Student missing fields:', { age: !!age, guardianName: !!guardianName });
        res.status(400).json({ error: 'Age and guardian name are required for students' });
        return;
      }
    } else if (role === 'parent') {
      console.log('Parent signup - no additional fields required');
    } else {
      console.log('Invalid role:', role);
      res.status(400).json({ error: 'Invalid role specified' });
      return;
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
  } catch (error: any) {
    console.error('Signup error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, userType }: LoginRequestBody = req.body;
    if (!email || !password || !userType) {
      res.status(400).json({ error: 'Missing email, password, or user type' });
      return;
    }
    
    // Validate user type
    if (userType !== 'parent' && userType !== 'student') {
      res.status(400).json({ error: 'Invalid user type. Must be either parent or student.' });
      return;
    }
    
    const result = await authService.login(email, password, userType);
    res.json(result);
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(401).json({ error: error.message });
  }
});

// Token verify
router.get('/verify', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid user' });
      return;
    }
    res.json({ user });
  } catch (error: any) {
    console.error('Verify error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update dyslexia score
router.post('/update-dyslexia-score', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid user' });
      return;
    }

    const { score }: UpdateDyslexiaScoreRequestBody = req.body;
    if (score === undefined) {
      res.status(400).json({ error: 'Missing score' });
      return;
    }

    const result = await authService.updateDyslexiaScore(user.id, score);
    res.json(result);
  } catch (error: any) {
    console.error('Update dyslexia score error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get dyslexia score
router.get('/dyslexia-score', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await authService.verifyToken(token);
    
    // Check if userId query parameter is provided (for parents viewing children's scores)
    const { userId } = req.query;
    
    if (userId && user.role === 'parent') {
      // Parent is requesting a specific child's score
      const result = await authService.getDyslexiaScore(userId as string);
      res.json(result);
    } else {
      // User is requesting their own score
      const result = await authService.getDyslexiaScore(user.id);
      res.json(result);
    }
  } catch (error: any) {
    console.error('Get dyslexia score error:', error.message);
    res.status(401).json({ error: error.message });
  }
});

// Get reading preferences
router.get('/reading-preferences', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const user = await authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid user' });
      return;
    }
    const prefs = await authService.getReadingPreferences(user.id);
    res.json({ readingPreferences: prefs });
  } catch (error: any) {
    console.error('Get reading preferences error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update reading preferences
router.post('/reading-preferences', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const user = await authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid user' });
      return;
    }
    const { preferences }: UpdateReadingPreferencesRequestBody = req.body;
    if (!preferences) {
      res.status(400).json({ error: 'Missing preferences' });
      return;
    }
    await authService.updateReadingPreferences(user.id, preferences);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Update reading preferences error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update account information
router.post('/update-account', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid user' });
      return;
    }

    const { username, email, age, guardianName }: UpdateAccountRequestBody = req.body;
    
    // Validate required fields based on role
    if (user.role === 'student') {
      if (!username || !email || !age || !guardianName) {
        res.status(400).json({ error: 'Missing required fields for student' });
        return;
      }
    } else if (user.role === 'parent') {
      if (!username || !email) {
        res.status(400).json({ error: 'Missing required fields for parent' });
        return;
      }
    }

    const result = await authService.updateAccount(user.id, {
      username,
      email,
      age,
      guardianName
    });
    res.json(result);
  } catch (error: any) {
    console.error('Update account error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get notification settings
router.get('/notification-settings', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid user' });
      return;
    }

    const settings = await authService.getNotificationSettings(user.id);
    res.json(settings);
  } catch (error: any) {
    console.error('Get notification settings error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update notification settings
router.post('/update-notification-settings', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid user' });
      return;
    }

    const settings: UpdateNotificationSettingsRequestBody = req.body;
    const result = await authService.updateNotificationSettings(user.id, settings as any);
    res.json(result);
  } catch (error: any) {
    console.error('Update notification settings error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Verify email
router.post('/verify-email', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, email }: VerifyEmailRequestBody = req.body;
    
    if (!token || !email) {
      res.status(400).json({ error: 'Token and email are required' });
      return;
    }

    const result = await authService.verifyEmail(token, email);
    res.json(result);
  } catch (error: any) {
    console.error('Email verification error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Resend verification email
router.post('/resend-verification', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email }: ResendVerificationRequestBody = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const result = await authService.resendVerificationEmail(email);
    res.json(result);
  } catch (error: any) {
    console.error('Resend verification error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Logout endpoint (optional - mainly for server-side session management)
router.post('/logout', initAuthService, async (req: Request, res: Response): Promise<void> => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return success since the client handles token removal
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
