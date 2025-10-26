import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fire Assistant AI Chat API',
      version: '1.0.0',
      description: 'API documentation for Fire Assistant AI Chat Backend',
    },
    servers: [
      {
        url: 'https://ai.ekowlabs.space/api',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec; 