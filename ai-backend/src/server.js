import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './middleware/logger.js';
import chatRoutes from './routes/chatRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors(
  {
    origin: "*",
    credentials: true,
  }
));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Health check endpoint for monitoring
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api', chatRoutes);

// Debug endpoint to check Swagger spec
app.get('/api/swagger-spec', (req, res) => {
  res.json(swaggerSpec);
});

// Test route to verify routing is working
app.get('/api-docs-test', (req, res) => {
  res.json({ message: 'Swagger docs route is accessible', timestamp: new Date().toISOString() });
});

// Swagger UI setup with error handling
try {
  console.log('Setting up Swagger UI...');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Fire Assistant AI API Docs'
  }));
  console.log('Swagger UI setup complete');
} catch (error) {
  console.error('Error setting up Swagger UI:', error);
  // Fallback route
  app.get('/api-docs', (req, res) => {
    res.status(500).json({ error: 'Swagger UI setup failed', details: error.message });
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 