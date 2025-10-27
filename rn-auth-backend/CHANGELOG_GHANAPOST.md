# Changelog: Ghana Post Field Update

## Date: October 27, 2025

## Summary
Updated the user profile schema to simplify the Ghana Post GPS address structure. Changed from a nested `gpsAddress` object to a single top-level `ghanaPost` string field. Also set "Ghana" as the default country for new user registrations.

## Changes Made

### 1. User Model (`models/User.js`)
**Ghana Post Field - Before:**
```javascript
gpsAddress: { 
    address: { type: String },
    ghanaPost: { type: String }
}
```

**After:**
```javascript
ghanaPost: { type: String }
```

**Country Field - Added Default:**
```javascript
country: { type: String, default: 'Ghana' }
```
- If no country is provided during registration, it will automatically default to "Ghana"

### 2. Auth Controller (`controllers/authController.js`)
- Updated `register` function to accept `ghanaPost` instead of `gpsAddress`
- Updated registration response to include all optional fields in user object
- Updated `login` function to return complete user data including `ghanaPost`

### 3. Profile Controller (`controllers/profileController.js`)
- Updated `updateProfile` function to handle `ghanaPost` instead of `gpsAddress`

### 4. Swagger Documentation (`swagger.js`)
- Updated `RegisterRequest` schema
- Updated `AuthResponse` schema
- Updated `RegisterResponse` schema
- Updated `UserProfile` schema
- Changed from nested object to simple string field

### 5. Routes Documentation (`routes/authRoutes.js`, `routes/profileRoutes.js`)
- Updated all Swagger examples to use `ghanaPost` as a top-level field
- Updated request/response examples

### 6. README and Documentation
- Updated `README.md` - All API endpoint examples
- Updated `API_FEATURES.md` - Field descriptions and examples
- Updated `VALIDATION_RULES.md` - Optional fields list

## API Request Format

### Registration Request Example
```json
{
  "name": "Jane Doe",
  "phone": "+233201234567",
  "email": "janedoe@example.com",
  "password": "securePassword123",
  "address": "East Legon, Accra",
  "country": "Ghana",
  "dob": "1992-05-15",
  "image": "https://randomuser.me/api/portraits/women/44.jpg",
  "ghanaPost": "GA-184-1234"
}
```

### Response Example
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "phone": "+233201234567",
    "email": "janedoe@example.com",
    "address": "East Legon, Accra",
    "country": "Ghana",
    "dob": "1992-05-15",
    "image": "https://randomuser.me/api/portraits/women/44.jpg",
    "ghanaPost": "GA-184-1234"
  }
}
```

## Ghana Post GPS Format
The `ghanaPost` field accepts Ghana Post GPS digital addresses in the format: `XX-XXX-XXXX`

**Examples:**
- `GA-184-1234` (Greater Accra)
- `AK-039-5678` (Ashanti - Kumasi)
- `BA-123-4567` (Brong Ahafo)

## Breaking Changes
⚠️ **This is a breaking change for existing clients**

**Old Format (Deprecated):**
```json
{
  "gpsAddress": {
    "address": "Accra, Greater Accra Region, Ghana",
    "ghanaPost": "GA-184-1234"
  }
}
```

**New Format:**
```json
{
  "ghanaPost": "GA-184-1234"
}
```

## Migration Guide for Clients

### Before (Old API)
```javascript
const userData = {
  name: "Jane Doe",
  phone: "+233201234567",
  password: "securePass123",
  gpsAddress: {
    address: "Accra, Ghana",
    ghanaPost: "GA-184-1234"
  }
};
```

### After (New API)
```javascript
const userData = {
  name: "Jane Doe",
  phone: "+233201234567",
  password: "securePass123",
  ghanaPost: "GA-184-1234"  // Simplified to single field
};
```

## Database Migration

**Note:** Existing user records in the database with the old `gpsAddress` structure will need to be migrated. A migration script should be run to:

1. Extract `ghanaPost` value from nested `gpsAddress.ghanaPost`
2. Set it to the top-level `ghanaPost` field
3. Remove the old `gpsAddress` field

### Sample Migration Script (MongoDB)
```javascript
// Migration script to run in MongoDB shell or Node.js
db.users.find({ gpsAddress: { $exists: true } }).forEach(function(user) {
  if (user.gpsAddress && user.gpsAddress.ghanaPost) {
    db.users.updateOne(
      { _id: user._id },
      {
        $set: { ghanaPost: user.gpsAddress.ghanaPost },
        $unset: { gpsAddress: "" }
      }
    );
  }
});
```

## Benefits of This Change

1. **Simplified API**: Reduced nesting makes the API cleaner and easier to use
2. **Better Performance**: Less data to transfer and store
3. **Clearer Intent**: The `ghanaPost` field name is self-explanatory
4. **Easier Validation**: Simple string field is easier to validate
5. **Consistent with Design**: Matches the flat structure of other optional fields

## Testing Checklist

- [x] User registration with `ghanaPost`
- [x] User registration without `ghanaPost` (optional)
- [x] User login returns `ghanaPost` in response
- [x] Profile update with `ghanaPost`
- [x] Profile retrieval includes `ghanaPost`
- [x] Swagger documentation displays correctly
- [x] No linter errors
- [x] All documentation updated

## Files Modified

1. `rn-auth-backend/models/User.js`
2. `rn-auth-backend/controllers/authController.js`
3. `rn-auth-backend/controllers/profileController.js`
4. `rn-auth-backend/swagger.js`
5. `rn-auth-backend/routes/authRoutes.js`
6. `rn-auth-backend/routes/profileRoutes.js`
7. `rn-auth-backend/README.md`
8. `rn-auth-backend/API_FEATURES.md`
9. `rn-auth-backend/VALIDATION_RULES.md`

## Deployment Notes

1. Deploy the backend with the updated schema
2. Run database migration script (if applicable)
3. Update client applications to use the new format
4. Update API documentation in Swagger UI
5. Notify frontend/mobile teams of the breaking change

## Next Steps

- Run the database migration script on production
- Update mobile app to use new field structure
- Update any API integration tests
- Monitor for any client errors after deployment

