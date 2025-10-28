import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fire Service Management API',
      version: '2.0.0',
      description: `
## Fire Service Management API

A comprehensive backend API for managing Ghana National Fire Service stations, departments, and personnel built with Node.js, Express, and MongoDB.

### Features
- **Authentication System**: User registration, login, and profile management
- **Station Management**: Complete CRUD operations with intelligent upsert functionality
- **Department Management**: Station-based department organization
- **Personnel Management**: Fire service personnel with dual reference structure
- **Fire Service Entities**: Ranks, Roles, Subdivisions, and Super Admin management
- **Smart Duplicate Detection**: Prevents duplicate stations using coordinates, location, or phone number
- **Bulk Operations**: Efficient handling of multiple stations/departments/personnel
- **Data Validation**: Comprehensive validation with meaningful error messages
- **JWT Authentication**: Secure token-based authentication
- **Ghana Post GPS**: Support for Ghana Post digital addressing

### Authentication
Protected routes require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

Tokens are valid for 7 days after login.

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
        description: 'User profile management endpoints (requires authentication). Supports GET (retrieve), PATCH (partial update), and DELETE (remove) operations.',
      },
      {
        name: 'Stations',
        description: 'Fire station management with intelligent upsert functionality. Prevents duplicates using coordinates, location, or phone number.',
      },
      {
        name: 'Departments',
        description: 'Department management linked to fire stations. Supports CRUD operations and station-based filtering.',
      },
      {
        name: 'Personnel',
        description: 'Fire service personnel management with dual reference structure (station + department/subdivision).',
      },
      {
        name: 'Subdivisions',
        description: 'Subdivision management within departments. Supports CRUD operations and department-based filtering.',
      },
      {
        name: 'Ranks',
        description: 'Fire service rank management (CFO, DO, SO, etc.) with initials support.',
      },
      {
        name: 'Roles',
        description: 'Fire service role management (Operations Officer, Driver, Paramedic, etc.).',
      },
      {
        name: 'Super Admin',
        description: 'Super administrator management with authentication and department/station management capabilities.',
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
              description: 'Phone number in international format',
              pattern: '^\\+?[1-9]\\d{1,14}$',
              example: '+233201234567',
            },
            email: {
              type: 'string',
              description: 'Email address (optional)',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (minimum 6 characters)',
              example: 'securePassword123',
            },
            address: {
              type: 'string',
              example: 'East Legon, Accra',
            },
            country: {
              type: 'string',
              default: 'Ghana',
              example: 'Ghana',
            },
            dob: {
              type: 'string',
              format: 'date',
              example: '1992-05-15',
            },
            image: {
              type: 'string',
              example: 'https://randomuser.me/api/portraits/women/44.jpg',
            },
            ghanaPost: {
              type: 'string',
              description: 'Ghana Post GPS digital address',
              example: 'GA-184-1234',
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
                country: {
                  type: 'string',
                  description: 'User country (optional, defaults to "Ghana")',
                  example: 'Ghana',
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
                ghanaPost: {
                  type: 'string',
                  description: 'Ghana Post GPS digital address (optional)',
                  example: 'GA-184-1234',
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
                country: {
                  type: 'string',
                  description: 'User country (optional, defaults to "Ghana")',
                  example: 'Ghana',
                },
                dob: {
                  type: 'string',
                  format: 'date',
                  description: 'Date of birth (optional)',
                  example: '1992-05-15',
                },
                image: {
                  type: 'string',
                  description: 'Profile image URL (optional)',
                  example: 'https://randomuser.me/api/portraits/women/44.jpg',
                },
                ghanaPost: {
                  type: 'string',
                  description: 'Ghana Post GPS digital address (optional)',
                  example: 'GA-184-1234',
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
              description: 'User country (optional, defaults to "Ghana")',
              example: 'Ghana',
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
            ghanaPost: {
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
        ProfileUpdateRequest: {
          type: 'object',
          description: 'Partial update request - only provided fields will be updated',
          properties: {
            name: {
              type: 'string',
              description: 'User name',
              example: 'Jane Doe',
            },
            phone: {
              type: 'string',
              description: 'Phone number in international format (must be unique)',
              pattern: '^\\+?[1-9]\\d{1,14}$',
              example: '+233209876543',
            },
            email: {
              type: 'string',
              description: 'Email address',
              example: 'jane@example.com',
            },
            address: {
              type: 'string',
              description: 'Street address',
              example: '123 Main St',
            },
            country: {
              type: 'string',
              description: 'Country of residence',
              example: 'Ghana',
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth',
              example: '1992-05-15',
            },
            image: {
              type: 'string',
              description: 'Profile image URL',
              example: 'https://example.com/new-avatar.jpg',
            },
            ghanaPost: {
              type: 'string',
              description: 'Ghana Post GPS digital address',
              example: 'GA-184-1234',
            },
          },
        },
        ProfileUpdateResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Profile updated successfully',
            },
            user: {
              $ref: '#/components/schemas/UserProfile',
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
        Station: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Station ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Station name',
              example: 'Accra Central Fire Station',
            },
            call_sign: {
              type: 'string',
              description: 'Station call sign (unique)',
              example: 'ACFS-001',
            },
            location: {
              type: 'string',
              description: 'Station location description',
              example: 'Central Business District, Accra',
            },
            location_url: {
              type: 'string',
              description: 'Google Maps URL for station location',
              example: 'https://maps.google.com/?q=5.6037,-0.1870',
            },
            coordinates: {
              type: 'object',
              description: 'Station coordinates (flexible object format - accepts any coordinate structure)',
              example: {
                latitude: 5.6037,
                longitude: -0.1870
              },
              additionalProperties: true
            },
            region: {
              type: 'string',
              description: 'Station region',
              example: 'Greater Accra',
            },
            phone_number: {
              type: 'string',
              description: 'Station phone number',
              example: '+233302123456',
            },
            departments: {
              type: 'array',
              description: 'Departments in this station',
              items: {
                $ref: '#/components/schemas/Department',
              },
            },
            personnel: {
              type: 'array',
              description: 'Personnel in this station',
              items: {
                $ref: '#/components/schemas/FirePersonnel',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        StationCreateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Station name',
              example: 'Accra Central Fire Station',
            },
            call_sign: {
              type: 'string',
              description: 'Station call sign (unique)',
              example: 'ACFS-001',
            },
            location: {
              type: 'string',
              description: 'Station location description',
              example: 'Central Business District, Accra',
            },
            location_url: {
              type: 'string',
              description: 'Google Maps URL for station location',
              example: 'https://maps.google.com/?q=5.6037,-0.1870',
            },
            coordinates: {
              type: 'object',
              description: 'Station coordinates (flexible object format - accepts any coordinate structure)',
              example: {
                latitude: 5.6037,
                longitude: -0.1870
              },
              additionalProperties: true
            },
            region: {
              type: 'string',
              description: 'Station region',
              example: 'Greater Accra',
            },
            phone_number: {
              type: 'string',
              description: 'Station phone number',
              example: '+233302123456',
            },
          },
        },
        StationBulkRequest: {
          type: 'object',
          required: ['stations'],
          properties: {
            stations: {
              type: 'array',
              description: 'Array of stations to create/update',
              items: {
                $ref: '#/components/schemas/StationCreateRequest',
              },
            },
          },
        },
        StationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Station created successfully',
            },
            data: {
              $ref: '#/components/schemas/Station',
            },
            action: {
              type: 'string',
              enum: ['created', 'updated', 'skipped'],
              description: 'Action performed on the station',
            },
          },
        },
        StationBulkResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Bulk operation completed. Created: 2, Updated: 1, Skipped: 1, Errors: 0',
            },
            results: {
              type: 'object',
              properties: {
                created: {
                  type: 'array',
                  description: 'Stations that were created',
                  items: {
                    type: 'object',
                    properties: {
                      index: { type: 'number' },
                      data: { $ref: '#/components/schemas/Station' },
                      action: { type: 'string', example: 'created' },
                    },
                  },
                },
                updated: {
                  type: 'array',
                  description: 'Stations that were updated',
                  items: {
                    type: 'object',
                    properties: {
                      index: { type: 'number' },
                      data: { $ref: '#/components/schemas/Station' },
                      action: { type: 'string', example: 'updated' },
                    },
                  },
                },
                skipped: {
                  type: 'array',
                  description: 'Stations that were skipped',
                  items: {
                    type: 'object',
                    properties: {
                      index: { type: 'number' },
                      data: { $ref: '#/components/schemas/Station' },
                      action: { type: 'string', example: 'skipped' },
                    },
                  },
                },
                errors: {
                  type: 'array',
                  description: 'Stations that had errors',
                  items: {
                    type: 'object',
                    properties: {
                      index: { type: 'number' },
                      data: { $ref: '#/components/schemas/StationCreateRequest' },
                      error: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        Department: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Department ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Department name',
              example: 'Operations',
            },
            station_id: {
              type: 'string',
              description: 'Station ID this department belongs to',
              example: '507f1f77bcf86cd799439012',
            },
            description: {
              type: 'string',
              description: 'Department description',
              example: 'Handles emergency response and fire fighting operations',
            },
            station: {
              $ref: '#/components/schemas/Station',
            },
            subdivisions: {
              type: 'array',
              description: 'Subdivisions in this department',
              items: {
                $ref: '#/components/schemas/Subdivision',
              },
            },
            personnel: {
              type: 'array',
              description: 'Personnel in this department',
              items: {
                $ref: '#/components/schemas/FirePersonnel',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        FirePersonnel: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Personnel ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Personnel name',
              example: 'Kwame Mensah',
            },
            rank: {
              $ref: '#/components/schemas/Rank',
            },
            department: {
              $ref: '#/components/schemas/Department',
            },
            subdivision: {
              $ref: '#/components/schemas/Subdivision',
            },
            role: {
              $ref: '#/components/schemas/Role',
            },
            station_id: {
              type: 'string',
              description: 'Station ID',
              example: '507f1f77bcf86cd799439012',
            },
            station: {
              type: 'string',
              description: 'Station name',
              example: 'Accra Central Fire Station',
            },
            region: {
              type: 'string',
              description: 'Region',
              example: 'Greater Accra',
            },
            watchroom: {
              type: 'string',
              description: 'Watchroom (required for Operations department)',
              example: 'Watch Room 1',
            },
            crew: {
              type: 'string',
              description: 'Crew (required for Operations department)',
              example: 'Crew 1',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Subdivision: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Subdivision ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Subdivision name',
              example: 'Watch A',
            },
            color: {
              type: 'string',
              description: 'Subdivision color',
              example: '#FF0000',
            },
            department: {
              $ref: '#/components/schemas/Department',
            },
            personnel: {
              type: 'array',
              description: 'Personnel in this subdivision',
              items: {
                $ref: '#/components/schemas/FirePersonnel',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Rank: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Rank ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Rank name',
              example: 'Chief Fire Officer',
            },
            initials: {
              type: 'string',
              description: 'Rank initials',
              example: 'CFO',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Role ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Role name',
              example: 'Operations Officer',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        SuperAdmin: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Super Admin ID',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              description: 'Admin username',
              example: 'admin1',
            },
            name: {
              type: 'string',
              description: 'Admin full name',
              example: 'Dr. Emmanuel Ofosu',
            },
            email: {
              type: 'string',
              description: 'Admin email',
              example: 'emmanuel.ofosu@fireservice.gov.gh',
            },
            managedDepartments: {
              type: 'array',
              description: 'Departments managed by this admin',
              items: {
                $ref: '#/components/schemas/Department',
              },
            },
            managedStations: {
              type: 'array',
              description: 'Stations managed by this admin',
              items: {
                type: 'string',
                example: 'Accra Central Fire Station',
              },
            },
            isActive: {
              type: 'boolean',
              description: 'Admin account status',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        // Fire Service Request/Response Schemas
        DepartmentCreateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Department name',
              example: 'Operations',
            },
            station_id: {
              type: 'string',
              description: 'Station ID this department belongs to',
              example: '507f1f77bcf86cd799439012',
            },
            description: {
              type: 'string',
              description: 'Department description',
              example: 'Handles emergency response and fire fighting operations',
            },
          },
        },
        DepartmentResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Department created successfully',
            },
            data: {
              $ref: '#/components/schemas/Department',
            },
          },
        },
        FirePersonnelCreateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Personnel name',
              example: 'Kwame Mensah',
            },
            rank: {
              type: 'string',
              description: 'Rank ID',
              example: '507f1f77bcf86cd799439011',
            },
            department: {
              type: 'string',
              description: 'Department ID',
              example: '507f1f77bcf86cd799439012',
            },
            subdivision: {
              type: 'string',
              description: 'Subdivision ID',
              example: '507f1f77bcf86cd799439013',
            },
            role: {
              type: 'string',
              description: 'Role ID',
              example: '507f1f77bcf86cd799439014',
            },
            station_id: {
              type: 'string',
              description: 'Station ID',
              example: '507f1f77bcf86cd799439015',
            },
            station: {
              type: 'string',
              description: 'Station name',
              example: 'Accra Central Fire Station',
            },
            region: {
              type: 'string',
              description: 'Region',
              example: 'Greater Accra',
            },
            watchroom: {
              type: 'string',
              description: 'Watchroom (required for Operations department)',
              example: 'Watch Room 1',
            },
            crew: {
              type: 'string',
              description: 'Crew (required for Operations department)',
              example: 'Crew 1',
            },
          },
        },
        FirePersonnelResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Fire personnel created successfully',
            },
            data: {
              $ref: '#/components/schemas/FirePersonnel',
            },
          },
        },
        SubdivisionCreateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Subdivision name',
              example: 'Watch A',
            },
            color: {
              type: 'string',
              description: 'Subdivision color',
              example: '#FF0000',
            },
            department: {
              type: 'string',
              description: 'Department ID',
              example: '507f1f77bcf86cd799439011',
            },
          },
        },
        SubdivisionResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Subdivision created successfully',
            },
            data: {
              $ref: '#/components/schemas/Subdivision',
            },
          },
        },
        RankCreateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Rank name',
              example: 'Chief Fire Officer',
            },
            initials: {
              type: 'string',
              description: 'Rank initials',
              example: 'CFO',
            },
          },
        },
        RankResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Rank created successfully',
            },
            data: {
              $ref: '#/components/schemas/Rank',
            },
          },
        },
        RoleCreateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Role name',
              example: 'Operations Officer',
            },
          },
        },
        RoleResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Role created successfully',
            },
            data: {
              $ref: '#/components/schemas/Role',
            },
          },
        },
        SuperAdminCreateRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Admin username',
              example: 'admin1',
            },
            password: {
              type: 'string',
              description: 'Admin password',
              example: 'securePassword123',
            },
            name: {
              type: 'string',
              description: 'Admin full name',
              example: 'Dr. Emmanuel Ofosu',
            },
            email: {
              type: 'string',
              description: 'Admin email',
              example: 'emmanuel.ofosu@fireservice.gov.gh',
            },
          },
        },
        SuperAdminLoginRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Admin username',
              example: 'admin1',
            },
            password: {
              type: 'string',
              description: 'Admin password',
              example: 'securePassword123',
            },
          },
        },
        SuperAdminResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Super admin created successfully',
            },
            data: {
              $ref: '#/components/schemas/SuperAdmin',
            },
          },
        },
        SuperAdminAuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
            token: {
              type: 'string',
              description: 'JWT token for authentication',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            admin: {
              $ref: '#/components/schemas/SuperAdmin',
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