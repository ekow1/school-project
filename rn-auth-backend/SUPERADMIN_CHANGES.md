# Super Admin Model Changes - Summary

## What Changed

The SuperAdmin model was updated to use a **username/password authentication system** instead of the previous fire service structure (rank, role, station, region).

## New SuperAdmin Structure

### Fields

```javascript
{
  username: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  name: String (required),
  email: String (required, unique, lowercase),
  managedDepartments: [ObjectId] (optional - refs to Department),
  managedStations: [String] (optional),
  isActive: Boolean (default: true)
}
```

### Removed Fields
- `station` (String)
- `region` (String)
- `rank` (ObjectId ref)
- `role` (ObjectId ref)
- `phone` (String)

### Added Fields
- `username` (String, required, unique)
- `password` (String, required, hashed)
- `isActive` (Boolean, default: true)

## New Authentication Endpoints

### 1. Register Super Admin
```
POST /api/fire/superadmin/register
```
**Public** - No authentication required

**Request:**
```json
{
  "username": "admin1",
  "password": "Admin123!",
  "name": "John Doe",
  "email": "john@fireservice.gov.gh"
}
```

### 2. Login Super Admin
```
POST /api/fire/superadmin/login
```
**Public** - No authentication required

**Request:**
```json
{
  "username": "admin1",
  "password": "Admin123!"
}
```

**Returns:** JWT token valid for 7 days

### 3. Change Password
```
POST /api/fire/superadmin/:id/change-password
```
**Protected** - Requires JWT token

**Request:**
```json
{
  "oldPassword": "Admin123!",
  "newPassword": "NewPassword123!"
}
```

## Updated Endpoints

All existing endpoints were updated:

### Protected Endpoints (require JWT token):
- `GET /api/fire/superadmin` - Get all super admins
- `GET /api/fire/superadmin/:id` - Get super admin by ID
- `PATCH /api/fire/superadmin/:id` - Update super admin
- `DELETE /api/fire/superadmin/:id` - Delete super admin
- `POST /api/fire/superadmin/:id/departments/add` - Add managed department
- `POST /api/fire/superadmin/:id/departments/remove` - Remove managed department

## Key Changes

### 1. Model Updates (`models/SuperAdmin.js`)
- Added username field (required, unique, lowercase)
- Added password field (required, hashed)
- Made email required (was optional)
- Removed rank, role, station, region, phone fields
- Added isActive boolean flag
- Added indexes on username and email

### 2. Controller Updates (`controllers/superAdminController.js`)
- Added bcrypt and jwt imports
- Renamed `createSuperAdmin` logic to register with password hashing
- Added `loginSuperAdmin` function
- Added `changePassword` function
- Updated all responses to exclude password (`.select('-password')`)
- Updated validation for new required fields
- Updated all populate queries to remove rank/role

### 3. Route Updates (`routes/superAdminRoutes.js`)
- Added `/register` route (public)
- Added `/login` route (public)
- Added `/:id/change-password` route (protected)
- Added `verifyToken` middleware to protected routes
- Reorganized routes by public/protected

### 4. Server Updates (`server.js`)
- Changed route path from `/api/fire/superadmins` to `/api/fire/superadmin`
- Routes now handle their own authentication (mixed public/protected)

### 5. Test Data Updates (`FIRE_SERVICE_TEST_DATA.json`)
- Updated super admin examples with username/password
- Removed rank, role, station, region, phone fields
- Updated to match new structure

## Security Features

✅ **Password Hashing**: bcrypt with 10 salt rounds
✅ **JWT Tokens**: 7-day expiration
✅ **Role in Token**: `role: 'superadmin'` for identification
✅ **Username Normalization**: Converted to lowercase automatically
✅ **Password Never Exposed**: Excluded from all responses
✅ **Account Deactivation**: `isActive` flag instead of deletion
✅ **Password Validation**: Minimum 6 characters
✅ **Old Password Verification**: Required for password changes

## Migration Guide

### For Existing Databases

If you have existing SuperAdmin records, they need to be migrated:

1. **Backup your database first!**

2. **Drop existing SuperAdmin collection:**
```javascript
db.superadmins.drop()
```

3. **Create new Super Admins via API:**
```bash
curl -X POST http://localhost:5000/api/fire/superadmin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "password": "SecurePassword123!",
    "name": "System Administrator",
    "email": "admin@fireservice.gov.gh"
  }'
```

### For New Deployments

Just create your first super admin:

```bash
curl -X POST http://localhost:5000/api/fire/superadmin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "ChangeMe123!",
    "name": "Initial Admin",
    "email": "admin@fireservice.gov.gh"
  }'
```

## Example Usage Flow

### 1. Register First Admin
```bash
POST /api/fire/superadmin/register
{
  "username": "admin1",
  "password": "Admin123!",
  "name": "John Doe",
  "email": "john@fireservice.gov.gh"
}
```

### 2. Login
```bash
POST /api/fire/superadmin/login
{
  "username": "admin1",
  "password": "Admin123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { ... }
}
```

### 3. Use Token for Protected Operations
```bash
GET /api/fire/superadmin
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Files Modified

1. ✅ `models/SuperAdmin.js` - Complete restructure
2. ✅ `controllers/superAdminController.js` - Added auth functions
3. ✅ `routes/superAdminRoutes.js` - Added public routes
4. ✅ `server.js` - Updated route path
5. ✅ `FIRE_SERVICE_TEST_DATA.json` - Updated test data
6. ✅ `SUPERADMIN_AUTH_GUIDE.md` - New documentation
7. ✅ `README.md` - Added link to auth guide

## Breaking Changes

⚠️ **All existing SuperAdmin endpoints changed:**

### Old Structure (No longer valid):
```json
{
  "name": "John Doe",
  "station": "Headquarters",
  "region": "Greater Accra",
  "rank": "RANK_ID",
  "role": "ROLE_ID",
  "email": "john@example.com",
  "phone": "+233501234567"
}
```

### New Structure:
```json
{
  "username": "admin1",
  "password": "Admin123!",
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Benefits

1. ✅ **Separate Admin Authentication** - Independent from regular users
2. ✅ **Longer Token Expiry** - 7 days vs 1 day for users
3. ✅ **Simpler Structure** - Only essential admin fields
4. ✅ **Better Security** - Dedicated admin credentials
5. ✅ **Account Management** - Can deactivate without deletion
6. ✅ **Role Identification** - Token includes `role: 'superadmin'`

## Testing

See **[SUPERADMIN_AUTH_GUIDE.md](./SUPERADMIN_AUTH_GUIDE.md)** for:
- Complete API documentation
- Request/response examples
- curl commands
- Postman setup
- Error handling

---

**Version**: 2.0.0  
**Last Updated**: October 27, 2025  
**Breaking Changes**: Yes - Complete model restructure  
**Migration Required**: Yes - For existing databases


