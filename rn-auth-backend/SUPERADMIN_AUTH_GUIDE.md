# Super Admin Authentication Guide

## Overview

The Super Admin system provides separate authentication for administrators who manage the Ghana National Fire Service system. Super Admins have their own username/password authentication separate from regular users.

## Super Admin Model

```javascript
{
  username: String (required, unique, lowercase),
  password: String (required, hashed),
  name: String (required),
  email: String (required, unique, lowercase),
  managedDepartments: [ObjectId] (optional),
  managedStations: [String] (optional),
  isActive: Boolean (default: true)
}
```

## API Endpoints

### Base URL
```
/api/fire/superadmin
```

### 1. Register Super Admin (Public)

**Endpoint:** `POST /api/fire/superadmin/register`

**Request Body:**
```json
{
  "username": "admin1",
  "password": "Admin123!",
  "name": "John Doe",
  "email": "john@fireservice.gov.gh"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Super admin created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin1",
    "name": "John Doe",
    "email": "john@fireservice.gov.gh",
    "managedDepartments": [],
    "managedStations": [],
    "isActive": true,
    "createdAt": "2025-10-27T12:00:00.000Z",
    "updatedAt": "2025-10-27T12:00:00.000Z"
  }
}
```

**Validation:**
- Username: required, unique, converted to lowercase
- Password: required, minimum 6 characters, hashed
- Name: required
- Email: required, unique, converted to lowercase

### 2. Login Super Admin (Public)

**Endpoint:** `POST /api/fire/superadmin/login`

**Request Body:**
```json
{
  "username": "admin1",
  "password": "Admin123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin1",
    "name": "John Doe",
    "email": "john@fireservice.gov.gh",
    "managedDepartments": [],
    "managedStations": [],
    "isActive": true
  }
}
```

**Token Details:**
- Expires in: 7 days
- Payload includes: `{ id, username, role: 'superadmin' }`
- Use in Authorization header: `Bearer <token>`

### 3. Get All Super Admins (Protected)

**Endpoint:** `GET /api/fire/superadmin`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `isActive` - Filter by active status (true/false)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "admin1",
      "name": "John Doe",
      "email": "john@fireservice.gov.gh",
      "managedDepartments": [...],
      "managedStations": ["Accra Central Fire Station"],
      "isActive": true
    }
  ]
}
```

### 4. Get Super Admin By ID (Protected)

**Endpoint:** `GET /api/fire/superadmin/:id`

**Headers:**
```
Authorization: Bearer <token>
```

### 5. Update Super Admin (Protected)

**Endpoint:** `PATCH /api/fire/superadmin/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (all fields optional):**
```json
{
  "username": "newadmin1",
  "name": "John Doe Jr.",
  "email": "newemail@fireservice.gov.gh",
  "password": "NewPassword123!",
  "isActive": false
}
```

**Note:** Password is hashed automatically if provided.

### 6. Change Password (Protected)

**Endpoint:** `POST /api/fire/superadmin/:id/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "Admin123!",
  "newPassword": "NewAdmin123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 7. Delete Super Admin (Protected)

**Endpoint:** `DELETE /api/fire/superadmin/:id`

**Headers:**
```
Authorization: Bearer <token>
```

### 8. Add Managed Department (Protected)

**Endpoint:** `POST /api/fire/superadmin/:id/departments/add`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "departmentId": "507f1f77bcf86cd799439012"
}
```

### 9. Remove Managed Department (Protected)

**Endpoint:** `POST /api/fire/superadmin/:id/departments/remove`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "departmentId": "507f1f77bcf86cd799439012"
}
```

## Quick Start Examples

### 1. Register First Super Admin

```bash
curl -X POST http://localhost:5000/api/fire/superadmin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "password": "Admin123!",
    "name": "System Administrator",
    "email": "admin@fireservice.gov.gh"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/fire/superadmin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "password": "Admin123!"
  }'
```

**Save the token from the response!**

### 3. Get All Admins

```bash
TOKEN="your_token_here"

curl -X GET http://localhost:5000/api/fire/superadmin \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Change Password

```bash
curl -X POST http://localhost:5000/api/fire/superadmin/ADMIN_ID/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "Admin123!",
    "newPassword": "NewSecurePassword123!"
  }'
```

### 5. Deactivate Admin

```bash
curl -X PATCH http://localhost:5000/api/fire/superadmin/ADMIN_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

## Security Features

✅ **Password Hashing**: bcrypt with salt rounds of 10
✅ **JWT Tokens**: 7-day expiration
✅ **Username Normalization**: Converted to lowercase
✅ **Email Validation**: Unique constraint enforced
✅ **Account Status**: Can deactivate accounts
✅ **Password Never Returned**: Excluded from all responses
✅ **Password Change**: Requires old password verification

## Error Responses

### 400 - Validation Error
```json
{
  "success": false,
  "message": "Username, password, name, and email are required"
}
```

### 401 - Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 403 - Account Deactivated
```json
{
  "success": false,
  "message": "Account is deactivated"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Super admin not found"
}
```

## Postman Testing

### Step 1: Create Environment Variables
- `base_url`: `http://localhost:5000`
- `admin_token`: (empty initially)

### Step 2: Register Admin
```
POST {{base_url}}/api/fire/superadmin/register
```

### Step 3: Login
```
POST {{base_url}}/api/fire/superadmin/login

Save token to {{admin_token}}
```

### Step 4: Use Protected Endpoints
```
GET {{base_url}}/api/fire/superadmin
Authorization: Bearer {{admin_token}}
```

## Integration with Fire Service

Super Admins can:
- Manage departments (via `managedDepartments`)
- Oversee stations (via `managedStations`)
- Access all Fire Service endpoints (using their JWT token)
- Create and manage personnel, departments, ranks, roles, etc.

## Password Requirements

- Minimum 6 characters
- Recommended: Mix of uppercase, lowercase, numbers, and symbols
- Hashed using bcrypt
- Never stored in plain text

## Username Rules

- Required and unique
- Automatically converted to lowercase
- No spaces allowed
- Alphanumeric characters recommended

## Best Practices

1. **First Admin**: Create first super admin immediately after deployment
2. **Strong Passwords**: Use complex passwords for production
3. **Token Storage**: Store tokens securely (e.g., httpOnly cookies, secure storage)
4. **Regular Updates**: Change passwords periodically
5. **Deactivate, Don't Delete**: Use `isActive: false` instead of deletion
6. **Audit Logs**: Track admin actions (future enhancement)

## Differences from Regular Users

| Feature | Regular User | Super Admin |
|---------|-------------|-------------|
| Auth Field | Phone | Username |
| Token Expiry | 1 day | 7 days |
| Can Manage | Own profile | Fire Service system |
| Role in Token | user | superadmin |

## Production Deployment

1. Create first super admin via API
2. Immediately change the password
3. Store credentials securely
4. Limit super admin accounts
5. Use environment-specific credentials
6. Enable HTTPS for token security

---

**Version**: 1.0.0  
**Last Updated**: October 27, 2025  
**Status**: ✅ Production Ready


