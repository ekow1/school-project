# Authentication Flow Explanation

## How User ID is Acquired for Profile Operations

All profile operations (GET, PUT, DELETE) get the user ID from the verified JWT token, **not** from the request body or URL parameters.

## Architecture

### 1. Middleware Applied at Server Level
**File: `server.js` (line 28)**
```javascript
app.use('/api/profile', verifyToken, profileRoutes);
```

This means **every route** under `/api/profile` automatically:
- ✅ Requires authentication
- ✅ Gets `req.userId` from the token
- ✅ Is protected from unauthorized access

### 2. Token Verification Middleware
**File: `middleware/verifyToken.js`**
```javascript
const verifyToken = (req, res, next) => {
    // 1. Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        // 2. Verify token with JWT_SECRET
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Extract user ID and add to request object
        req.userId = verified.id;  // ← This is the key!
        
        // 4. Continue to the next middleware/controller
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};
```

### 3. Profile Routes
**File: `routes/profileRoutes.js`**

All routes are clean and simple - no explicit authentication needed:
```javascript
import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController.js';

const router = express.Router();

// All routes automatically have req.userId from verifyToken middleware
router.get('/', getProfile);        // GET /api/profile
router.patch('/', updateProfile);   // PATCH /api/profile (partial update)
router.delete('/', deleteProfile);  // DELETE /api/profile

export default router;
```

### 4. Controllers Use req.userId
**File: `controllers/profileController.js`**

All controllers access the authenticated user via `req.userId`:

#### Get Profile
```javascript
export const getProfile = async (req, res) => {
    const user = await User.findById(req.userId).select('-password');
    // req.userId comes from token ↑
    res.status(200).json(user);
};
```

#### Update Profile
```javascript
export const updateProfile = async (req, res) => {
    const user = await User.findById(req.userId);
    // req.userId comes from token ↑
    
    // Update fields...
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
};
```

#### Delete Profile
```javascript
export const deleteProfile = async (req, res) => {
    const user = await User.findById(req.userId);
    // req.userId comes from token ↑
    
    await User.findByIdAndDelete(req.userId);
    res.status(200).json({ message: 'Profile deleted successfully' });
};
```

## Complete Request Flow

### Example: Update Profile

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Client Request                                                │
└─────────────────────────────────────────────────────────────────┘
PATCH https://auth.ekowlabs.space/api/profile
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Body:
  {
    "name": "New Name",
    "phone": "+233209876543"
  }

┌─────────────────────────────────────────────────────────────────┐
│ 2. Server receives request                                       │
└─────────────────────────────────────────────────────────────────┘
↓ Matches route: /api/profile

┌─────────────────────────────────────────────────────────────────┐
│ 3. verifyToken middleware (applied at server level)             │
└─────────────────────────────────────────────────────────────────┘
↓ Extracts token from header
↓ Verifies: jwt.verify(token, process.env.JWT_SECRET)
↓ Token payload: { id: "507f1f77bcf86cd799439011", iat: ..., exp: ... }
↓ Sets: req.userId = "507f1f77bcf86cd799439011"
↓ Calls: next()

┌─────────────────────────────────────────────────────────────────┐
│ 4. profileRoutes matches PATCH /                                 │
└─────────────────────────────────────────────────────────────────┘
↓ Routes to: updateProfile controller

┌─────────────────────────────────────────────────────────────────┐
│ 5. updateProfile controller executes                            │
└─────────────────────────────────────────────────────────────────┘
↓ Reads: req.userId = "507f1f77bcf86cd799439011"
↓ Reads: req.body = { name: "New Name", phone: "+233209876543" }
↓ Finds user: User.findById(req.userId)
↓ Validates phone number
↓ Updates user fields
↓ Saves: user.save()

┌─────────────────────────────────────────────────────────────────┐
│ 6. Response sent back to client                                 │
└─────────────────────────────────────────────────────────────────┘
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "New Name",
    "phone": "+233209876543",
    ...
  }
}
```

## Why This Design is Secure

### ✅ Advantages

1. **No Identity Spoofing**
   - User cannot pretend to be someone else
   - User ID comes from verified token, not request

2. **Single Source of Truth**
   - User identity is determined by who is logged in (token)
   - Not from URL parameters or request body

3. **Automatic Protection**
   - All profile routes are automatically authenticated
   - No need to remember to add verifyToken to each route

4. **Clean API Design**
   - No user ID in URLs: `DELETE /api/profile` (not `DELETE /api/profile/:userId`)
   - Cleaner, more RESTful endpoints

5. **Prevents Privilege Escalation**
   - User A cannot update/delete User B's profile
   - Even if they know User B's ID

### ❌ What Won't Work (By Design)

#### Attempting to Update Another User's Profile
```javascript
// ❌ This won't work - user ID is not from request body
PUT /api/profile
Body: {
  "userId": "someone_elses_id",  // Ignored!
  "name": "Hacker"
}

// ✅ System uses token's user ID instead
// Only updates the authenticated user's profile
```

#### Attempting to Delete Another User's Profile
```javascript
// ❌ This won't work - URL parameter not used
DELETE /api/profile/someone_elses_id

// ✅ System uses token's user ID instead
// Only deletes the authenticated user's profile
```

## Token Structure

### Token Creation (at Login/Registration)
**File: `controllers/authController.js`**
```javascript
// When user logs in or registers
const token = jwt.sign(
    { id: user._id },           // Payload: user's MongoDB ID
    process.env.JWT_SECRET,     // Secret key for signing
    { expiresIn: '1d' }        // Token expires in 24 hours
);

// Token structure:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header
// .eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTYzMDU0MDg0MiwiZXhwIjoxNjMwNjI3MjQyfQ  ← Payload (contains user ID)
// .9kX_7J5KZ8Y4bQ_3kF7Lq4mN2dR8vT6wP1xY4sZ7vA8  ← Signature
```

### Token Payload (Decoded)
```json
{
  "id": "507f1f77bcf86cd799439011",  // User's MongoDB _id
  "iat": 1630540842,                  // Issued at (timestamp)
  "exp": 1630627242                   // Expires at (timestamp)
}
```

## API Endpoints Summary

All these endpoints use `req.userId` from the token:

| Method | Endpoint | Description | User ID Source |
|--------|----------|-------------|----------------|
| GET | `/api/profile` | Get logged-in user's profile | `req.userId` from token |
| PATCH | `/api/profile` | Partially update logged-in user's profile | `req.userId` from token |
| DELETE | `/api/profile` | Delete logged-in user's account | `req.userId` from token |

## Testing Examples

### Get Profile
```bash
curl -X GET https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile (Partial Update)
```bash
curl -X PATCH https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "phone": "+233209876543"
  }'
```

### Delete Profile
```bash
curl -X DELETE https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Scenarios

### No Token Provided
```bash
curl -X GET https://auth.ekowlabs.space/api/profile
```
**Response (401):**
```json
{
  "message": "Access Denied"
}
```

### Invalid Token
```bash
curl -X GET https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer invalid_token_here"
```
**Response (400):**
```json
{
  "message": "Invalid Token"
}
```

### Expired Token
```bash
curl -X GET https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer expired_token_here"
```
**Response (400):**
```json
{
  "message": "Invalid Token"
}
```

## Best Practices

1. **Always Include Token**: Store JWT token after login and include it in all authenticated requests

2. **Token Storage**:
   - Mobile: Use secure storage (AsyncStorage with encryption or SecureStore)
   - Web: Use httpOnly cookies or secure localStorage

3. **Token Refresh**: Implement token refresh mechanism when tokens expire

4. **Logout**: Clear stored tokens when user logs out

5. **Handle 401 Errors**: Redirect to login when receiving 401 Unauthorized

## Related Files

- `server.js` - Middleware application
- `middleware/verifyToken.js` - Token verification logic
- `routes/profileRoutes.js` - Profile route definitions
- `controllers/profileController.js` - Profile operation handlers
- `controllers/authController.js` - Token generation (login/register)

## Conclusion

✅ **Yes, the user ID is acquired from the verified token for:**
- GET /api/profile
- PATCH /api/profile (partial update)
- DELETE /api/profile

This ensures security and prevents users from modifying other users' data.

