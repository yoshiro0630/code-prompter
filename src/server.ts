import express from 'express';
import { ApiService } from './services/api-service';
import { ApiRequest } from './types/api-types';
import documentRoutes from './routes/document-routes';
import promptRoutes from './routes/prompt-routes';

const app = express();
const apiService = new ApiService();

app.use(express.json());

// Document upload and parsing routes
app.use('/api/documents', documentRoutes);

// Prompt generation routes
app.use('/api/prompts', promptRoutes);

// Existing API routes
app.get('/api/providers', (req, res) => {
  const providers = apiService.getAvailableProviders();
  res.json({ providers });
});

app.get('/api/providers/:provider/models', async (req, res) => {
  try {
    const models = await apiService.listModels(req.params.provider);
    res.json({ models });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/generate/:provider', async (req, res) => {
  try {
    const request: ApiRequest = {
      prompt: req.body.prompt,
      model: req.body.model,
      maxTokens: req.body.maxTokens,
      temperature: req.body.temperature,
    };
    const response = await apiService.generate(req.params.provider, request);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/providers/:provider/validate', async (req, res) => {
  try {
    const isValid = await apiService.validateApiKey(req.params.provider);
    res.json({ isValid });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});