import { MongoClient, Db, GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, './config.env') });

let client: MongoClient | null = null;
let database: Db | null = null;
let uploadsBucket: GridFSBucket | null = null;

export async function initDb(): Promise<{ client: MongoClient; db: Db; bucket: GridFSBucket }> {
  if (client && database && uploadsBucket) {
    return { client, db: database, bucket: uploadsBucket };
  }

  const uri = process.env.ATLAS_URI;
  if (!uri) {
    throw new Error('ATLAS_URI is not set in environment');
  }

  client = new MongoClient(uri);
  await client.connect();
  console.log('[db] Connected to MongoDB');

  database = client.db('learn-brightly');
  console.log('[db] Using database: learn-brightly');

  // Create GridFS bucket named 'uploads'
  uploadsBucket = new GridFSBucket(database, { bucketName: 'uploads' });
  console.log('[db] GridFS bucket initialized: uploads');

  return { client, db: database, bucket: uploadsBucket };
}

export function getDb(): Db {
  if (!database) throw new Error('Database not initialized. Call initDb() first.');
  return database;
}

export function getBucket(): GridFSBucket {
  if (!uploadsBucket) throw new Error('GridFS bucket not initialized. Call initDb() first.');
  return uploadsBucket;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    console.log('[db] MongoDB connection closed');
    client = null;
    database = null;
    uploadsBucket = null;
  }
}


