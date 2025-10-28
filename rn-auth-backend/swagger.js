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
- **Authentication System**: User registration, login, and profile management with OTP verification
- **OTP Management**: SMS-based verification using Arkesel SMS API
- **Station Management**: Complete CRUD operations with intelligent upsert functionality
- **Department Management**: Station-based department organization
- **Personnel Management**: Fire service personnel with dual reference structure
- **Fire Service Entities**: Ranks, Roles, Subdivisions, and Super Admin management
- **Smart Duplicate Detection**: Prevents duplicate stations using coordinates, location, or phone number
- **Bulk Operations**: Efficient handling of multiple stations/departments/personnel
- **Data Validation**: Comprehensive validation with meaningful error messages
- **JWT Authentication**: Secure token-based authentication
- **Ghana Post GPS**: Support for Ghana Post digital addressing
- **Phone Verification**: SMS OTP verification for account activation and password reset

### Authentication Flow
**3-Step Registration Process:**
1. **Register** → Creates inactive user account and sends OTP
2. **Verify Phone** → Verifies OTP and activates account
3. **Login** → Authenticates with phone and password

**Password Reset Flow:**
1. **Forgot Password** → Sends OTP to registered phone
2. **Reset Password** → Verifies OTP and updates password

### OTP Service
- **Provider**: Arkesel SMS API
- **Environment Variable**: ARKSEND (API key)
- **Purposes**: registration, password_reset, phone_verification
- **Expiry**: 5 minutes (configurable)
- **Max Attempts**: 5 per OTP
- **Rate Limiting**: 2-minute cooldown between requests

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
        description: 'User authentication endpoints with OTP verification. 3-step flow: Register → Verify Phone → Login',
      },
      {
        name: 'OTP Management',
        description: 'SMS OTP generation, verification, and management using Arkesel SMS API. Supports registration, password reset, and phone verification.',
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
            country: {
              type: 'string',
              description: 'User country (defaults to Ghana)',
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
              example: 'https://example.com/profile.jpg',
            },
            ghanaPost: {
              type: 'string',
              description: 'Ghana Post GPS digital address',
              example: 'GA-184-1234',
            },
            isPhoneVerified: {
              type: 'boolean',
              description: 'Phone verification status',
              example: false,
            },
            phoneVerifiedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Phone verification timestamp',
            },
            isActive: {
              type: 'boolean',
              description: 'Account activation status',
              example: false,
            },
            lastLoginAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
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
                isPhoneVerified: {
                  type: 'boolean',
                  description: 'Phone verification status',
                  example: true,
                },
                phoneVerifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Phone verification timestamp',
                  example: '2024-01-01T00:02:30.000Z',
                },
                lastLoginAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Last login timestamp',
                  example: '2024-01-01T00:05:00.000Z',
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
            lat: {
              type: 'number',
              format: 'float',
              description: 'Station latitude (stored in database)',
              example: 5.6037,
            },
            lng: {
              type: 'number',
              format: 'float',
              description: 'Station longitude (stored in database)',
              example: -0.1870,
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
            latitude: {
              type: 'number',
              format: 'float',
              description: 'Station latitude (frontend sends as latitude)',
              example: 5.6037,
            },
            longitude: {
              type: 'number',
              format: 'float',
              description: 'Station longitude (frontend sends as longitude)',
              example: -0.1870,
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
        // OTP Management Schemas
        OTPGenerateRequest: {
          type: 'object',
          required: ['phone_number', 'purpose'],
          properties: {
            phone_number: {
              type: 'string',
              description: 'Phone number in international format',
              example: '+233201234567',
            },
            purpose: {
              type: 'string',
              enum: ['registration', 'password_reset', 'phone_verification'],
              description: 'Purpose of the OTP',
              example: 'phone_verification',
            },
            expiry: {
              type: 'number',
              description: 'OTP expiry time in minutes (default: 5)',
              example: 5,
            },
            length: {
              type: 'number',
              description: 'OTP code length (default: 6)',
              example: 6,
            },
            message: {
              type: 'string',
              description: 'Custom SMS message (use %otp_code% placeholder)',
              example: 'Your OTP code is %otp_code%. Valid for 5 minutes.',
            },
            sender_id: {
              type: 'string',
              description: 'SMS sender ID (default: Arkesel)',
              example: 'Arkesel',
            },
          },
        },
        OTPVerifyRequest: {
          type: 'object',
          required: ['phone_number', 'otp_code'],
          properties: {
            phone_number: {
              type: 'string',
              description: 'Phone number in international format',
              example: '+233201234567',
            },
            otp_code: {
              type: 'string',
              description: 'OTP code received via SMS',
              example: '123456',
            },
          },
        },
        OTPResendRequest: {
          type: 'object',
          required: ['phone_number', 'purpose'],
          properties: {
            phone_number: {
              type: 'string',
              description: 'Phone number in international format',
              example: '+233201234567',
            },
            purpose: {
              type: 'string',
              enum: ['registration', 'password_reset', 'phone_verification'],
              description: 'Purpose of the OTP',
              example: 'phone_verification',
            },
          },
        },
        OTPResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'OTP sent successfully',
            },
            data: {
              type: 'object',
              properties: {
                phone_number: {
                  type: 'string',
                  example: '+233201234567',
                },
                purpose: {
                  type: 'string',
                  example: 'phone_verification',
                },
                expires_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:05:00.000Z',
                },
                arkesel_response: {
                  type: 'object',
                  description: 'Response from Arkesel SMS API',
                },
              },
            },
          },
        },
        OTPVerifyResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'OTP verified successfully',
            },
            data: {
              type: 'object',
              properties: {
                phone_number: {
                  type: 'string',
                  example: '+233201234567',
                },
                verified_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:02:30.000Z',
                },
                arkesel_response: {
                  type: 'object',
                  description: 'Response from Arkesel SMS API',
                },
              },
            },
          },
        },
        OTPStatusResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                phone_number: {
                  type: 'string',
                  example: '+233201234567',
                },
                purpose: {
                  type: 'string',
                  example: 'phone_verification',
                },
                is_verified: {
                  type: 'boolean',
                  example: false,
                },
                is_expired: {
                  type: 'boolean',
                  example: false,
                },
                is_valid: {
                  type: 'boolean',
                  example: true,
                },
                attempts: {
                  type: 'number',
                  example: 0,
                },
                created_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:00:00.000Z',
                },
                expires_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:05:00.000Z',
                },
              },
            },
          },
        },
        ArkeselServiceStatus: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                service: {
                  type: 'string',
                  example: 'Arkesel OTP',
                },
                status: {
                  type: 'string',
                  example: 'available',
                },
                checked_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:00:00.000Z',
                },
                details: {
                  type: 'object',
                  description: 'Additional service details',
                },
              },
            },
          },
        },
        // Updated Authentication Schemas with OTP
        RegisterResponseWithOTP: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'User created successfully. Please verify your phone number with the OTP sent.',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011',
                },
                name: {
                  type: 'string',
                  example: 'John Doe',
                },
                phone: {
                  type: 'string',
                  example: '+233201234567',
                },
                email: {
                  type: 'string',
                  example: 'john@example.com',
                },
                isPhoneVerified: {
                  type: 'boolean',
                  example: false,
                },
                isActive: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
            otp_sent: {
              type: 'object',
              properties: {
                phone_number: {
                  type: 'string',
                  example: '+233201234567',
                },
                expires_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:05:00.000Z',
                },
              },
            },
          },
        },
        PhoneVerificationRequest: {
          type: 'object',
          required: ['phone', 'otp_code'],
          properties: {
            phone: {
              type: 'string',
              description: 'Phone number in international format',
              example: '+233201234567',
            },
            otp_code: {
              type: 'string',
              description: 'OTP code received via SMS',
              example: '123456',
            },
          },
        },
        PhoneVerificationResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Phone number verified successfully. You can now login.',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011',
                },
                name: {
                  type: 'string',
                  example: 'John Doe',
                },
                phone: {
                  type: 'string',
                  example: '+233201234567',
                },
                email: {
                  type: 'string',
                  example: 'john@example.com',
                },
                isPhoneVerified: {
                  type: 'boolean',
                  example: true,
                },
                phoneVerifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:02:30.000Z',
                },
                isActive: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['phone'],
          properties: {
            phone: {
              type: 'string',
              description: 'Phone number in international format',
              example: '+233201234567',
            },
          },
        },
        ForgotPasswordResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Password reset OTP sent successfully',
            },
            phone_number: {
              type: 'string',
              example: '+233201234567',
            },
            expires_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:05:00.000Z',
            },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['phone', 'otp_code', 'new_password'],
          properties: {
            phone: {
              type: 'string',
              description: 'Phone number in international format',
              example: '+233201234567',
            },
            otp_code: {
              type: 'string',
              description: 'OTP code received via SMS',
              example: '123456',
            },
            new_password: {
              type: 'string',
              minLength: 6,
              description: 'New password (minimum 6 characters)',
              example: 'newSecurePassword123',
            },
          },
        },
        ResetPasswordResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Password reset successfully',
            },
            phone_number: {
              type: 'string',
              example: '+233201234567',
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