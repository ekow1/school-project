# Auth Backend API Features

## 📋 User Model Fields

### Required Fields
- ✅ **name** - User's full name
- ✅ **phone** - Unique phone number (used for login)
- ✅ **password** - Hashed password

### Optional Fields
- ✅ **email** - Email address
- ✅ **address** - Street address
- ✅ **country** - Country of residence (defaults to "Ghana" if not provided)
- ✅ **dob** - Date of birth (Date format)
- ✅ **image** - Profile image URL
- ✅ **ghanaPost** - Ghana Post GPS digital address (String, e.g., "GA-184-1234")

### Auto-generated Fields
- ✅ **_id** - MongoDB ObjectId
- ✅ **createdAt** - Account creation timestamp
- ✅ **updatedAt** - Last update timestamp

## 🔗 API Endpoints

### 1. Authentication Endpoints

#### POST /api/auth/register
**Register a new user**

- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",                                        // Required
    "phone": "+233201234567",                                  // Required (unique)
    "password": "securePassword123",                           // Required
    "email": "janedoe@example.com",                           // Optional
    "address": "East Legon, Accra",                           // Optional
    "country": "Ghana",                                        // Optional
    "dob": "1992-05-15",                                      // Optional
    "image": "https://randomuser.me/api/portraits/women/44.jpg", // Optional
    "ghanaPost": "GA-184-1234"                                // Optional (Ghana Post GPS address)
  }
  ```
- **Response**: Returns JWT token and user data
- **Status Codes**:
  - `201` - User created successfully
  - `400` - Phone already in use
  - `500` - Server error

#### POST /api/auth/login
**Login existing user**

- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "phone": "+1234567890",
    "password": "password123"
  }
  ```
- **Response**: Returns JWT token
- **Status Codes**:
  - `200` - Login successful
  - `401` - Invalid credentials
  - `404` - User not found
  - `500` - Server error

### 2. Profile Endpoints (Protected)

All profile endpoints require Bearer token authentication:
```
Authorization: Bearer <your-jwt-token>
```

#### GET /api/profile
**Get current user profile**

- **Authentication**: Required
- **Response**: Returns complete user profile (without password)
- **Status Codes**:
  - `200` - Profile retrieved successfully
  - `401` - Unauthorized (invalid/missing token)
  - `404` - User not found
  - `500` - Server error

#### PUT /api/profile
**Update user profile**

- **Authentication**: Required
- **Request Body**: Any combination of updatable fields
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "country": "Canada",
    "dob": "1992-05-15",
    "image": "https://example.com/image.jpg",
    "ghanaPost": "AK-039-5678"
  }
  ```
- **Note**: Fields not provided remain unchanged
- **Response**: Returns success message and updated user object
- **Status Codes**:
  - `200` - Profile updated successfully
  - `401` - Unauthorized
  - `404` - User not found
  - `500` - Server error

#### DELETE /api/profile
**Delete user account**

- **Authentication**: Required
- **Response**: Returns success message
- **Status Codes**:
  - `200` - Profile deleted successfully
  - `401` - Unauthorized
  - `404` - User not found
  - `500` - Server error

### 3. Health Check Endpoint

#### GET /api/health
**Check service status**

- **Authentication**: Not required
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "Auth backend is running",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Status Codes**:
  - `200` - Service is healthy

## 🔐 Security Features

### Password Security
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Password never returned in API responses
- ✅ Password excluded from profile queries

### JWT Tokens
- ✅ Tokens valid for 24 hours
- ✅ Signed with secret key (JWT_SECRET)
- ✅ Contains user ID in payload
- ✅ Required for protected routes

### CORS
- ✅ Configured to allow mobile app access
- ✅ Credentials support enabled
- ✅ Preflight requests handled

## 📊 Response Format

### Success Responses
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Responses
```json
{
  "message": "Error description"
}
```

## 🎯 Use Cases

### Complete User Registration Flow
1. User submits registration form
2. API creates account and returns JWT token + user data
3. App stores token for authenticated requests
4. User immediately logged in (no separate login needed)

### Profile Update Flow
1. User modifies profile information
2. App sends PUT request with updated fields
3. API updates only provided fields
4. Returns updated profile

### Account Deletion Flow
1. User requests account deletion
2. App sends DELETE request with auth token
3. API permanently deletes user account
4. All user data removed from database

## 🌐 Base URLs

- **Production**: `https://auth.ekowlabs.space`
- **Development**: `http://localhost:5000`

## 📚 API Documentation

Interactive API documentation available at:
- **Production**: https://auth.ekowlabs.space/api-docs
- **Development**: http://localhost:5000/api-docs

## 🔄 Data Validation

### Phone Number
- Must be unique
- Used as primary identifier for login
- Format not strictly enforced (flexible for international numbers)

### Email
- Optional field
- No format validation (flexible)
- Can be null/empty

### Date of Birth
- Stored as Date type in MongoDB
- Should be provided in ISO date format: `YYYY-MM-DD`

### GPS Address
- Object with two fields:
  - **address**: Full address description (String)
  - **ghanaPost**: Ghana Post GPS code (String)
- Ghana Post format: XX-XXX-XXXX
  - First 2 letters: Region code (e.g., GA=Greater Accra, AK=Ashanti)
  - Next 3 digits: Area code
  - Last 4 digits: Specific location code
- Example:
  ```json
  {
    "address": "Accra, Greater Accra Region, Ghana",
    "ghanaPost": "GA-184-1234"
  }
  ```

### Image
- Stored as string (URL)
- No file upload handling (expects URL)
- Can link to external image storage

## 🛠️ Client Implementation Notes

### Storing JWT Token
```javascript
// After login/register
const { token, user } = response.data;
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));
```

### Making Authenticated Requests
```javascript
const token = localStorage.getItem('authToken');
fetch('https://auth.ekowlabs.space/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Updating Profile
```javascript
// Only send fields that changed
const updates = {
  name: "New Name",
  country: "New Country"
};

fetch('https://auth.ekowlabs.space/api/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updates)
});
```

## 📱 Mobile App Integration

This API is designed for React Native/Expo mobile applications with:
- ✅ Token-based authentication
- ✅ Optional email (phone-first approach)
- ✅ GPS location support
- ✅ Profile image support
- ✅ Flexible data model (optional fields)
- ✅ CORS enabled for mobile requests

