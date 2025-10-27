import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Backend API',
      version: '1.0.0',
      description: `
## Authentication Backend API

A secure authentication backend API built with Node.js, Express, and MongoDB for React Native applications.

### Features
- User registration with email (optional), phone, name, password, and address
- User login with JWT token generation
- Protected routes with JWT authentication
- User profile management
- Health check endpoint

### Authentication
Protected routes require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

Tokens are valid for 24 hours after login.

### Base URL
- **Production**: https://auth.ekowlabs.space
- **Development**: http://localhost:5000
      `.trim(),
      contact: {
        name: 'API Support',
        url: 'https://github.com/ekow1/school-project',
      },
      license: {
        name: 'ISC',
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints (register and login)',
      },
      {
        name: 'Profile',
        description: 'User profile management endpoints (requires authentication)',
      },
      {
        name: 'Health',
        description: 'Service health check endpoints',
      },
    ],
    servers: [
      {
        url: 'https://auth.ekowlabs.space',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'phone', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the user',
            },
            name: {
              type: 'string',
              description: 'The user name',
            },
            phone: {
              type: 'string',
              description: 'The user phone number',
            },
            email: {
              type: 'string',
              description: 'The user email (optional)',
            },
            password: {
              type: 'string',
              description: 'The user password',
            },
            address: {
              type: 'string',
              description: 'The user address',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'phone', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123',
            },
            address: {
              type: 'string',
              example: '123 Main St, City, Country',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['phone', 'password'],
          properties: {
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'User ID',
                  example: '507f1f77bcf86cd799439011',
                },
                name: {
                  type: 'string',
                  description: 'User name',
                  example: 'John Doe',
                },
                phone: {
                  type: 'string',
                  description: 'User phone number',
                  example: '+1234567890',
                },
                email: {
                  type: 'string',
                  description: 'User email (optional)',
                  example: 'john.doe@example.com',
                },
                address: {
                  type: 'string',
                  description: 'User address (optional)',
                  example: '123 Main St, City, Country',
                },
              },
            },
          },
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'User created successfully',
            },
            token: {
              type: 'string',
              description: 'JWT token for authentication',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'User ID',
                  example: '507f1f77bcf86cd799439011',
                },
                name: {
                  type: 'string',
                  description: 'User name',
                  example: 'John Doe',
                },
                phone: {
                  type: 'string',
                  description: 'User phone number',
                  example: '+1234567890',
                },
                email: {
                  type: 'string',
                  description: 'User email (optional)',
                  example: 'john.doe@example.com',
                },
                address: {
                  type: 'string',
                  description: 'User address (optional)',
                  example: '123 Main St, City, Country',
                },
              },
            },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'User name',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              description: 'User phone number',
              example: '+1234567890',
            },
            email: {
              type: 'string',
              description: 'User email (optional)',
              example: 'john.doe@example.com',
            },
            address: {
              type: 'string',
              description: 'User address (optional)',
              example: '123 Main St, City, Country',
            },
            country: {
              type: 'string',
              description: 'User country (optional)',
              example: 'USA',
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth (optional)',
              example: '1990-01-01',
            },
            image: {
              type: 'string',
              description: 'Profile image URL (optional)',
              example: 'https://example.com/images/profile.jpg',
            },
            gpsAddress: {
              type: 'string',
              description: 'Ghana Post GPS digital address (optional)',
              example: 'GA-184-1234',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message here',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
              description: 'Health status of the service',
            },
            message: {
              type: 'string',
              example: 'Auth backend is running',
              description: 'Status message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'Server timestamp',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js', './server.js'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };