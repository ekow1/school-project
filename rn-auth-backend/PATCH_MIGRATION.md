# Migration to PATCH for Profile Updates

## Date: October 27, 2025

## Summary
Changed profile update endpoint from `PUT` to `PATCH` to correctly implement partial updates and prevent data loss.

## What Changed

### HTTP Method
- **Before**: `PUT /api/profile`
- **After**: `PATCH /api/profile`

### Why This Change?

**PUT vs PATCH in RESTful APIs:**
- **PUT**: Replace entire resource (all fields must be provided)
- **PATCH**: Partial update (only provided fields are updated)

Since our API only updates the fields that are sent in the request (partial update), **PATCH is the correct HTTP method**.

## Problem Solved

### Issue: Data Loss During Updates
When using the update endpoint, some fields were getting lost or not updated correctly.

**Root Causes:**
1. Inconsistent field checking in controller (some fields used `if (field)`, others used `if (field !== undefined)`)
2. Using PUT method suggested full replacement, but implementation was partial update

### Fix Applied

**1. Consistent Field Checking**
```javascript
// Before (inconsistent)
if (name) user.name = name;                    // ❌ Empty string won't update
if (email !== undefined) user.email = email;   // ✅ Correct

// After (consistent)
if (name !== undefined) user.name = name;      // ✅ All fields check !== undefined
if (email !== undefined) user.email = email;   // ✅ Consistent
```

**2. Changed HTTP Method to PATCH**
```javascript
// Before
router.put('/', updateProfile);

// After
router.patch('/', updateProfile);
```

## How Partial Updates Work

### Only Update What You Send

**Example 1: Update Only Name**
```bash
PATCH /api/profile
{
  "name": "New Name"
}
```
**Result**: Only `name` is updated, all other fields remain unchanged.

**Example 2: Update Name and Phone**
```bash
PATCH /api/profile
{
  "name": "New Name",
  "phone": "+233209876543"
}
```
**Result**: Only `name` and `phone` are updated, all other fields remain unchanged.

**Example 3: Update All Fields**
```bash
PATCH /api/profile
{
  "name": "Jane Doe",
  "phone": "+233209876543",
  "email": "jane@example.com",
  "address": "123 Main St",
  "country": "Ghana",
  "dob": "1992-05-15",
  "image": "https://example.com/avatar.jpg",
  "ghanaPost": "GA-184-1234"
}
```
**Result**: All provided fields are updated.

## Implementation Details

### Controller Logic
```javascript
export const updateProfile = async (req, res) => {
    const { name, phone, email, address, country, dob, image, ghanaPost } = req.body;
    
    const user = await User.findById(req.userId);
    
    // Update fields only if provided (partial update)
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (address !== undefined) user.address = address;
    if (country !== undefined) user.country = country;
    if (dob !== undefined) user.dob = dob;
    if (image !== undefined) user.image = image;
    if (ghanaPost !== undefined) user.ghanaPost = ghanaPost;
    
    await user.save();
    // ...
};
```

### Key Points

1. **`!== undefined` Check**: Allows setting fields to empty string, null, or 0 if needed
2. **Fields Not Sent**: Remain unchanged in database
3. **Explicit Updates**: Only fields in request body are touched
4. **MongoDB Save**: Mongoose only updates changed fields

## Client-Side Usage

### JavaScript/React Native Example

```javascript
// Update only name
await fetch('https://auth.ekowlabs.space/api/profile', {
  method: 'PATCH',  // ← Changed from PUT
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Name'
  })
});

// Update multiple fields
await fetch('https://auth.ekowlabs.space/api/profile', {
  method: 'PATCH',  // ← Changed from PUT
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    phone: '+233209876543',
    country: 'Ghana'
  })
});
```

### cURL Example

```bash
# Update only email
curl -X PATCH https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"newemail@example.com"}'

# Update multiple fields
curl -X PATCH https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Jane Doe",
    "phone":"+233209876543",
    "country":"Ghana"
  }'
```

## Breaking Changes

### For API Clients

**⚠️ HTTP Method Change Required**

Clients must update their requests from `PUT` to `PATCH`:

```javascript
// Before
fetch(url, { method: 'PUT', ... })

// After
fetch(url, { method: 'PATCH', ... })
```

**✅ No Data Structure Changes**
- Request body format remains the same
- Response format remains the same
- Only the HTTP method changed

### Backwards Compatibility

**Option 1: Support Both (Recommended for Transition)**

If you need to support old clients during migration:

```javascript
// In routes/profileRoutes.js
router.patch('/', updateProfile);  // New way (correct)
router.put('/', updateProfile);    // Old way (for backwards compatibility)
```

**Option 2: Immediate Migration**

Only support PATCH (current implementation):
```javascript
router.patch('/', updateProfile);  // Only PATCH supported
```

## Testing Scenarios

### Test 1: Update Single Field
```bash
PATCH /api/profile
Body: { "name": "New Name" }

Expected: Only name updated, all other fields unchanged
```

### Test 2: Update Multiple Fields
```bash
PATCH /api/profile
Body: { 
  "name": "New Name",
  "phone": "+233209876543"
}

Expected: Name and phone updated, all other fields unchanged
```

### Test 3: Set Field to Empty String
```bash
PATCH /api/profile
Body: { "address": "" }

Expected: Address set to empty string, other fields unchanged
```

### Test 4: No Fields Provided
```bash
PATCH /api/profile
Body: {}

Expected: 200 success, no fields changed
```

### Test 5: Phone Validation
```bash
PATCH /api/profile
Body: { "phone": "0201234567" }

Expected: 400 error - invalid phone format
```

## Files Modified

1. ✅ `controllers/profileController.js`
   - Fixed field checking from `if (name)` to `if (name !== undefined)`
   
2. ✅ `routes/profileRoutes.js`
   - Changed `router.put()` to `router.patch()`
   - Updated Swagger documentation
   
3. ✅ `README.md`
   - Changed PUT to PATCH in examples
   
4. ✅ `API_FEATURES.md`
   - Updated endpoint documentation
   
5. ✅ `PROFILE_UPDATE_GUIDE.md`
   - Updated all examples to use PATCH
   
6. ✅ `AUTH_FLOW_EXPLANATION.md`
   - Updated HTTP method references
   
7. ✅ Created `PATCH_MIGRATION.md`
   - This migration guide

## Benefits

1. **Correct RESTful API Design**
   - PATCH is semantically correct for partial updates
   - Follows HTTP standards

2. **No Data Loss**
   - Fields not included in request remain unchanged
   - Consistent field checking prevents accidental overwrites

3. **Better Client Experience**
   - Clients only send what they want to update
   - More efficient - less data transfer
   - Clearer intent in API calls

4. **Flexible Updates**
   - Update one field at a time
   - Update multiple fields
   - Update all fields
   - All supported with same endpoint

## Rollout Plan

### For Development Teams

1. **Update API Clients**
   ```javascript
   // Change all PUT requests to PATCH
   method: 'PUT'  →  method: 'PATCH'
   ```

2. **Test Partial Updates**
   - Test updating single fields
   - Test updating multiple fields
   - Test that unchanged fields remain unchanged

3. **Deploy Backend First**
   - Backend supports PATCH (current implementation)
   - Backend can optionally support PUT for transition period

4. **Update Clients Gradually**
   - Mobile apps
   - Web apps
   - Third-party integrations

5. **Remove PUT Support** (if added for transition)
   - After all clients migrated
   - Monitor API usage to confirm

## Verification

### How to Verify Fix Works

```bash
# 1. Create a user and login
curl -X POST https://auth.ekowlabs.space/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "phone":"+233201234567",
    "password":"test123",
    "email":"test@example.com",
    "country":"Ghana"
  }'

# Save the token from response

# 2. Update only name (other fields should NOT change)
curl -X PATCH https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# 3. Get profile to verify
curl -X GET https://auth.ekowlabs.space/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify in response:
# - name: "Updated Name" (changed)
# - email: "test@example.com" (unchanged)
# - country: "Ghana" (unchanged)
# - All other fields unchanged
```

## Summary

✅ **Problem**: Data loss during updates, inconsistent field handling
✅ **Solution**: Changed to PATCH, fixed field checking logic
✅ **Impact**: Correct RESTful API, no data loss, partial updates work properly
✅ **Breaking Change**: Clients must change HTTP method from PUT to PATCH
✅ **Benefit**: More efficient, clearer API semantics, better user experience

---

**Status**: ✅ Complete - Ready for deployment
**Version**: 1.2.0 (PATCH Update Feature)
**Author**: AI Assistant
**Date**: October 27, 2025

