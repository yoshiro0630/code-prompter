import express from 'express';
import { PromptGenerator } from '../services/prompt/prompt-generator';
import { ApiService } from '../services/api-service';
import { DocumentService } from '../services/document-service';

const router = express.Router();
const apiService = new ApiService();
const promptGenerator = new PromptGenerator(apiService);
const documentService = new DocumentService();

// Initialize stages for a document
router.post('/init', async (req, res) => {
  try {
    const documentId = req.body.documentId;
    const result = await documentService.parseDocument(req.body.document);
    
    if (!result.success || !result.document) {
      res.status(400).json({ error: result.error || 'Failed to parse document' });
    }

    const promptDocumentId = await promptGenerator.initializeStages(result.document);
    const stages = promptGenerator.getStages(promptDocumentId);

    res.json({ 
      documentId: promptDocumentId,
      stages 
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Generate prompt for a specific stage
router.post('/generate', async (req, res) => {
  try {
    const prompt = await promptGenerator.generatePrompt({
      documentId: req.body.documentId,
      stageId: req.body.stageId,
      context: req.body.context
    });

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get all stages for a document
router.get('/:documentId/stages', (req, res) => {
  try {
    const stages = promptGenerator.getStages(req.params.documentId);
    res.json({ stages });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update stage content
router.put('/stages/:stageId', (req, res) => {
  try {
    promptGenerator.updateStageContent(req.params.stageId, req.body.content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;