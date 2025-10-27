# Profile Update Guide

## Overview
Users can now update **ALL** profile fields including the phone number through the `PUT /api/profile` endpoint.

## Authentication Required
All profile update operations require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Updatable Fields

### All Fields Can Be Updated:
1. ✅ **name** - User's full name
2. ✅ **phone** - Phone number (unique, validated)
3. ✅ **email** - Email address
4. ✅ **address** - Street address
5. ✅ **country** - Country of residence
6. ✅ **dob** - Date of birth (YYYY-MM-DD)
7. ✅ **image** - Profile image URL
8. ✅ **ghanaPost** - Ghana Post GPS address

## Phone Number Update

### Special Validation for Phone Updates

When updating the phone number:

1. **Format Validation**: Must be in international format
   - Pattern: `^\+?[1-9]\d{1,14}$`
   - Examples: `+233201234567`, `+1234567890`

2. **Uniqueness Check**: New phone number must not be used by another user
   - Returns `400` error if phone is already taken

3. **No Change Optimization**: If the new phone equals the current phone, no validation is performed

### Phone Update Examples

#### ✅ Valid Phone Update
```bash
curl -X PUT https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233209876543"
  }'
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+233209876543",
    "email": "john@example.com",
    ...
  }
}
```

#### ❌ Invalid Phone Format
```bash
curl -X PUT https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0201234567"
  }'
```

**Response (400):**
```json
{
  "message": "Invalid phone number format. Use international format (e.g., +233201234567)"
}
```

#### ❌ Phone Already In Use
```bash
curl -X PUT https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233201234567"
  }'
```

**Response (400):**
```json
{
  "message": "Phone number already in use"
}
```

## Complete Profile Update Example

### Update Multiple Fields at Once

```javascript
// JavaScript/React Native Example
const updateProfile = async (token, updates) => {
  try {
    const response = await fetch('https://auth.ekowlabs.space/api/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Profile update failed:', error.message);
    throw error;
  }
};

// Usage
const updates = {
  name: "Jane Doe",
  phone: "+233209876543",
  email: "jane.doe@example.com",
  country: "Ghana",
  dob: "1992-05-15",
  image: "https://example.com/new-avatar.jpg",
  ghanaPost: "GA-184-1234"
};

updateProfile(userToken, updates)
  .then(result => {
    console.log('Profile updated:', result.user);
  })
  .catch(error => {
    console.error('Update failed:', error);
  });
```

## Partial Updates

You can update any combination of fields. Fields not included in the request remain unchanged:

### Update Only Name and Email
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

### Update Only Phone
```json
{
  "phone": "+233209876543"
}
```

### Update Only Ghana Post Address
```json
{
  "ghanaPost": "GA-999-9999"
}
```

## Error Handling

### Possible Error Responses

| Status Code | Error Message | Cause |
|------------|---------------|-------|
| `400` | "Invalid phone number format..." | Phone number doesn't match international format |
| `400` | "Phone number already in use" | Another user is using this phone number |
| `401` | "Token is not valid" | Invalid or expired JWT token |
| `404` | "User not found" | User account doesn't exist |
| `500` | Internal server error | Server-side error |

### Error Handling Example

```javascript
const handleProfileUpdate = async (updates) => {
  try {
    const result = await updateProfile(token, updates);
    showSuccessMessage(result.message);
    updateLocalUserData(result.user);
  } catch (error) {
    if (error.message === 'Phone number already in use') {
      showError('This phone number is already registered to another account');
    } else if (error.message.includes('Invalid phone number format')) {
      showError('Please use international phone format (e.g., +233201234567)');
    } else if (error.message === 'Token is not valid') {
      // Redirect to login
      redirectToLogin();
    } else {
      showError('Failed to update profile. Please try again.');
    }
  }
};
```

## Best Practices

### 1. Validate on Client Side First
```javascript
const validatePhoneFormat = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

if (updates.phone && !validatePhoneFormat(updates.phone)) {
  alert('Invalid phone number format');
  return;
}
```

### 2. Handle Token Expiration
```javascript
const updateWithTokenRefresh = async (updates) => {
  try {
    return await updateProfile(token, updates);
  } catch (error) {
    if (error.message === 'Token is not valid') {
      // Attempt to refresh token or redirect to login
      const newToken = await refreshAuthToken();
      return await updateProfile(newToken, updates);
    }
    throw error;
  }
};
```

### 3. Confirm Before Phone Change
```javascript
const confirmPhoneChange = async (newPhone) => {
  const confirmed = await showConfirmDialog(
    'Change Phone Number',
    `Are you sure you want to change your phone to ${newPhone}? This is used for login.`
  );
  
  if (confirmed) {
    await updateProfile(token, { phone: newPhone });
  }
};
```

### 4. Update Local State After Success
```javascript
const [user, setUser] = useState(null);

const handleUpdate = async (updates) => {
  const result = await updateProfile(token, updates);
  // Update local state with new user data
  setUser(result.user);
  // Also update stored user data if using AsyncStorage/localStorage
  await saveUserToStorage(result.user);
};
```

## Testing Checklist

- [ ] Update name successfully
- [ ] Update phone to a new valid number
- [ ] Update phone to an invalid format (should fail)
- [ ] Update phone to one already in use (should fail)
- [ ] Update email
- [ ] Update country (should accept any value, defaults to Ghana)
- [ ] Update date of birth
- [ ] Update profile image URL
- [ ] Update Ghana Post address
- [ ] Update multiple fields at once
- [ ] Update with invalid/expired token (should fail with 401)
- [ ] Update with partial data (only some fields)
- [ ] Clear optional fields by sending empty string/null

## Security Notes

1. **Phone as Login Credential**: Since phone is used for login, changing it is a sensitive operation
2. **Token Required**: All updates require valid authentication
3. **Uniqueness Enforced**: System prevents duplicate phone numbers
4. **Password Update**: To change password, use a separate password change endpoint (if implemented)
5. **Session Validity**: Changing phone doesn't invalidate existing JWT tokens

## API Response Structure

### Success Response
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "phone": "+233209876543",
    "email": "jane.doe@example.com",
    "address": "East Legon, Accra",
    "country": "Ghana",
    "dob": "1992-05-15",
    "image": "https://example.com/avatar.jpg",
    "ghanaPost": "GA-184-1234",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2025-10-27T12:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "message": "Phone number already in use"
}
```

## Related Documentation

- [API_FEATURES.md](./API_FEATURES.md) - Complete API documentation
- [VALIDATION_RULES.md](./VALIDATION_RULES.md) - Validation rules and patterns
- [README.md](./README.md) - General setup and usage
- [CHANGELOG_GHANAPOST.md](./CHANGELOG_GHANAPOST.md) - Recent changes to the API

