import express, { Request, Response } from 'express';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import { getBucket, initDb } from '../db.js';

const router = express.Router();

// Initialize DB/Bucket on first use
router.use(async (_req, _res, next) => {
  try {
    await initDb();
    next();
  } catch (err) {
    console.error('[files] DB init error:', err);
    next(err);
  }
});

// Use multer memory storage to stream directly to GridFS
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload - store file in GridFS
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided. Use form-data with key "file".' });
    }

    const bucket = getBucket();
    const filename = req.file.originalname;
    const contentType = req.file.mimetype;

    // Open GridFS upload stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { originalname: filename }
    });

    // Pipe buffer to GridFS
    uploadStream.end(req.file.buffer);

    // File ID is available via uploadStream.id
    uploadStream.on('finish', () => {
      console.log('[files] Upload success, fileId:', uploadStream.id.toString());
      return res.status(201).json({ fileId: uploadStream.id.toString() });
    });

    uploadStream.on('error', (err) => {
      console.error('[files] Upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    });

  } catch (error) {
    console.error('[files] POST /upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

// GET /file/:id - download by ObjectId
router.get('/file/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    const bucket = getBucket();
    const _id = new ObjectId(id);

    // Try to find file first to set headers
    const files = await bucket.find({ _id }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    const file = files[0] as any;
    if (file.contentType) {
      res.setHeader('Content-Type', file.contentType);
    }
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on('error', (err) => {
      console.error('[files] Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });

    downloadStream.on('end', () => {
      console.log('[files] Download success:', id);
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('[files] GET /file/:id error:', error);
    return res.status(500).json({ error: 'Failed to download file' });
  }
});

export default router;