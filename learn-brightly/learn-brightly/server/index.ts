import express, { Application } from 'express';
import cors from 'cors';
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/files.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, './config.env') });

// Validate required environment variables
const requiredEnvVars: string[] = ['ATLAS_URI', 'JWT_SECRET'];
const missingEnvVars: string[] = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const client: MongoClient = new MongoClient(process.env.ATLAS_URI as string);

interface AppLocals {
  db: Db;
}

declare global {
  namespace Express {
    interface Application {
      locals: AppLocals;
    }
  }
}

async function startServer(): Promise<void> {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.ATLAS_URI ? 'Present' : 'Missing');
        
        await client.connect();
        console.log('Connected to MongoDB successfully');

        // Store database connection in app.locals
        const db: Db = client.db('learn-brightly');
        app.locals.db = db;
        console.log('Database connection stored in app.locals');

        // Ensure Users collection exists
        const collections = await db.listCollections().toArray();
        const collectionNames: string[] = collections.map(c => c.name);
        console.log('Available collections:', collectionNames);

        if (!collectionNames.includes('Users')) {
            console.log('Creating Users collection...');
            await db.createCollection('Users');
            console.log('Users collection created');
        }

        if (!collectionNames.includes('parents')) {
            console.log('Creating parents collection...');
            await db.createCollection('parents');
            console.log('parents collection created');
        }

        // Routes
        app.use('/api/auth', authRoutes);
        app.use('/api', fileRoutes);
        console.log('Auth routes mounted at /api/auth');
        console.log('File routes mounted at /api');

        // Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

startServer();
