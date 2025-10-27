# API Validation Rules

## Authentication Endpoints

### POST /api/auth/register

#### Required Fields Validation

| Field | Validation Rules | Error Message |
|-------|-----------------|---------------|
| **name** | • Must be provided<br>• Cannot be empty or only whitespace | "Name is required" |
| **phone** | • Must be provided<br>• Cannot be empty or only whitespace<br>• Must match international format<br>• Must be unique | "Phone number is required"<br>"Invalid phone number format. Use international format (e.g., +233201234567)"<br>"Phone already in use" |
| **password** | • Must be provided<br>• Minimum 6 characters | "Password must be at least 6 characters long" |

#### Phone Number Format

**Pattern:** `^\+?[1-9]\d{1,14}$`

**Valid Examples:**
- `+233201234567` (Ghana)
- `+1234567890` (USA)
- `+441234567890` (UK)
- `233201234567` (without +)

**Invalid Examples:**
- `0201234567` (starts with 0)
- `+0201234567` (digit after + is 0)
- `abc123` (contains letters)
- `+1` (too short)

#### Optional Fields

All other fields are optional and do not require validation:
- `email` (String)
- `address` (String)
- `country` (String)
- `dob` (Date - format: YYYY-MM-DD)
- `image` (String - URL)
- `ghanaPost` (String - Ghana Post GPS digital address)

### POST /api/auth/login

#### Required Fields Validation

| Field | Validation Rules | Error Message |
|-------|-----------------|---------------|
| **phone** | • Must be provided<br>• Cannot be empty or only whitespace | "Phone number is required" |
| **password** | • Must be provided<br>• Cannot be empty or only whitespace | "Password is required" |

## Error Response Format

All validation errors return HTTP status `400` with JSON:

```json
{
  "message": "Error description here"
}
```

## Validation Flow

### Registration Flow

```
1. Check if name provided and not empty
   ❌ → Return 400: "Name is required"

2. Check if phone provided and not empty
   ❌ → Return 400: "Phone number is required"

3. Validate phone format (international)
   ❌ → Return 400: "Invalid phone number format..."

4. Check if password provided and >= 6 chars
   ❌ → Return 400: "Password must be at least 6 characters long"

5. Check if phone already exists in database
   ❌ → Return 400: "Phone already in use"

✅ All validations passed → Create user account
```

### Login Flow

```
1. Check if phone provided and not empty
   ❌ → Return 400: "Phone number is required"

2. Check if password provided and not empty
   ❌ → Return 400: "Password is required"

3. Find user by phone
   ❌ → Return 404: "User not found"

4. Compare password with hashed password
   ❌ → Return 401: "Invalid credentials"

✅ All validations passed → Return token
```

## Client-Side Implementation

### JavaScript/TypeScript Example

```javascript
// Registration validation before API call
function validateRegistration(data) {
  const errors = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  // Phone validation
  if (!data.phone || data.phone.trim().length === 0) {
    errors.push('Phone number is required');
  } else {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = data.phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.push('Invalid phone number format');
    }
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Usage
const userData = {
  name: 'Jane Doe',
  phone: '+233201234567',
  password: 'securePass123'
};

const validation = validateRegistration(userData);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
} else {
  // Proceed with API call
  registerUser(userData);
}
```

## Testing Examples

### Valid Registration Request

```bash
curl -X POST https://auth.ekowlabs.space/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "+233201234567",
    "password": "securePassword123",
    "email": "jane@example.com",
    "country": "Ghana"
  }'
```

**Expected:** `201 Created` with user data and token

### Invalid Requests

#### Missing Name
```bash
curl -X POST https://auth.ekowlabs.space/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233201234567",
    "password": "securePassword123"
  }'
```
**Expected:** `400 Bad Request` - "Name is required"

#### Invalid Phone Format
```bash
curl -X POST https://auth.ekowlabs.space/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "0201234567",
    "password": "securePassword123"
  }'
```
**Expected:** `400 Bad Request` - "Invalid phone number format..."

#### Password Too Short
```bash
curl -X POST https://auth.ekowlabs.space/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "+233201234567",
    "password": "12345"
  }'
```
**Expected:** `400 Bad Request` - "Password must be at least 6 characters long"

## Security Notes

1. **Password Hashing**: All passwords are hashed with bcrypt (10 salt rounds) before storage
2. **Phone Uniqueness**: Phone numbers are unique indexes in the database
3. **Input Sanitization**: All string inputs are trimmed to prevent whitespace-only values
4. **No Sensitive Data in Errors**: Error messages don't reveal whether a phone exists during login
5. **Token Expiration**: JWT tokens expire after 24 hours

## Future Validation Enhancements

Consider adding:
- Email format validation (if email is provided)
- Password strength requirements (uppercase, lowercase, numbers, special chars)
- Name length limits (min/max)
- Country code validation for phone numbers
- Date of birth validation (reasonable age range)
- Image URL validation
- Ghana Post GPS format validation (XX-XXX-XXXX)

