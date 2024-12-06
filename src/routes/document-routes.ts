import express from 'express';
import multer from 'multer';
import { rateLimit } from 'express-rate-limit';
import { DocumentService } from '../services/document-service';

const router = express.Router();
const documentService = new DocumentService();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Rate limiting
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
});

// Get supported file types
router.get('/supported-types', (req, res) => {
  const types = documentService.getSupportedFileTypes();
  res.json({ supportedTypes: types });
});

// Upload and parse document
router.post('/upload',
  uploadLimiter,
  upload.single('document'),
  async (req, res) => {
    try {
      const file = req.file;
      if (file) {
        res.status(400).json({ error: 'No file uploaded' });
      }

      // const result = await documentService.parseDocument(file);
      
      // if (!result.success) {
      //   res.status(400).json({ error: result.error });
      // }

      // res.json(result);
    } catch (error) {
      res.status(500).json({ error: `Upload failed: ${(error as Error).message}` });
    }
  }
);

export default router;