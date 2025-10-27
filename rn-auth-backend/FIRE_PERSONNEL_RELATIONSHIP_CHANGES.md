# Fire Personnel Relationship Changes

## Overview

The relationship between FirePersonnel, Subdivisions, and Departments has been **corrected** to properly reflect the organizational hierarchy.

## ✅ Correct Hierarchy (NEW)

```
Department
  ├── has many Subdivisions
  └── Subdivision
      └── has many FirePersonnel
          └── FirePersonnel belongs to one Subdivision
```

**Key Point:** FirePersonnel now belongs to a **Subdivision**, and the Subdivision belongs to a **Department**.

## ❌ Old (Incorrect) Structure

Previously, FirePersonnel had a direct reference to Department:
```javascript
FirePersonnel {
  department: ObjectId (ref: 'Department')  // Wrong!
}
```

## ✅ New (Correct) Structure

Now, FirePersonnel references Subdivision:
```javascript
FirePersonnel {
  subdivision: ObjectId (ref: 'Subdivision')  // Correct!
}
```

## Model Changes

### 1. FirePersonnel Model

**Changed:**
- `department` field → `subdivision` field
- Removed conditional validation for watchroom/crew (moved to controller)
- Updated indexes

```javascript
// OLD
department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
}

// NEW
subdivision: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subdivision',
    required: true
}
```

### 2. Department Model

**Changed:**
- Removed `personnel` virtual (no longer direct relationship)
- Kept `subdivisions` virtual

```javascript
// REMOVED
departmentSchema.virtual('personnel', {
    ref: 'FirePersonnel',
    localField: '_id',
    foreignField: 'department'
});

// KEPT
departmentSchema.virtual('subdivisions', {
    ref: 'Subdivision',
    localField: '_id',
    foreignField: 'department'
});
```

### 3. Subdivision Model

**Added:**
- `personnel` virtual relationship
- toJSON and toObject virtuals enabled

```javascript
// ADDED
subdivisionSchema.virtual('personnel', {
    ref: 'FirePersonnel',
    localField: '_id',
    foreignField: 'subdivision'
});
```

## Controller Changes

### Fire Personnel Controller

#### Create Personnel
- Changed required field from `department` to `subdivision`
- Added subdivision existence validation
- **Operations Department Validation**: Now checks if subdivision's parent department is "Operations"
- If Operations department, requires `watchroom` and `crew`

```javascript
// NEW: Check subdivision's department for Operations validation
const subdivisionDoc = await Subdivision.findById(subdivision).populate('department');
if (subdivisionDoc.department && subdivisionDoc.department.name === 'Operations') {
    if (!watchroom || !crew) {
        return res.status(400).json({ 
            success: false, 
            message: 'Watchroom and crew are required for Operations department personnel' 
        });
    }
}
```

#### Get All Personnel
- Changed filter from `department` to `subdivision`
- **Added department filter support**: If filtering by department, finds all subdivisions in that department first
- Updated populate to include nested department

```javascript
// NEW: Support both subdivision and department filtering
if (subdivision) filter.subdivision = subdivision;

if (department) {
    const subdivisions = await Subdivision.find({ department });
    filter.subdivision = { $in: subdivisions.map(s => s._id) };
}
```

#### Update Personnel
- Validates subdivision existence if updating
- Checks Operations department requirements when changing subdivision

#### New Endpoint
- **`getPersonnelBySubdivision`**: Get all personnel in a specific subdivision

```javascript
// NEW endpoint
GET /api/fire/personnel/subdivision/:subdivisionId
```

#### Enhanced Endpoint
- **`getPersonnelByDepartment`**: Now finds all subdivisions in department first, then gets all personnel

## Route Changes

### New Routes
```javascript
// NEW: Get personnel by subdivision
GET /api/fire/personnel/subdivision/:subdivisionId

// ENHANCED: Get personnel by department (through subdivisions)
GET /api/fire/personnel/department/:departmentId
```

**Note:** Route order matters! Specific routes (`/subdivision/:id`, `/department/:id`) must come before generic `/:id`.

## API Request/Response Changes

### Creating Fire Personnel

**OLD Request:**
```json
{
  "name": "John Doe",
  "rank": "RANK_ID",
  "department": "DEPARTMENT_ID",  // ❌ Old way
  "role": "ROLE_ID",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra"
}
```

**NEW Request:**
```json
{
  "name": "John Doe",
  "rank": "RANK_ID",
  "subdivision": "SUBDIVISION_ID",  // ✅ New way
  "role": "ROLE_ID",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch Room 1",     // Required for Operations dept
  "crew": "Crew 1"                 // Required for Operations dept
}
```

**Response (populated):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "rank": { ... },
    "subdivision": {
      "_id": "...",
      "name": "Watch A",
      "color": "#FF0000",
      "department": {
        "_id": "...",
        "name": "Operations",
        "station": "Accra Central Fire Station"
      }
    },
    "role": { ... },
    "station": "Accra Central Fire Station",
    "region": "Greater Accra",
    "watchroom": "Watch Room 1",
    "crew": "Crew 1"
  }
}
```

## Query Filtering

### Filter by Subdivision (Direct)
```bash
GET /api/fire/personnel?subdivision=SUBDIVISION_ID
```

### Filter by Department (Indirect - through subdivisions)
```bash
GET /api/fire/personnel?department=DEPARTMENT_ID
```
This will:
1. Find all subdivisions in that department
2. Return all personnel in those subdivisions

### Filter by Station
```bash
GET /api/fire/personnel?station=Accra%20Central%20Fire%20Station
```

### Combined Filters
```bash
GET /api/fire/personnel?department=DEPT_ID&station=Accra&region=Greater%20Accra
```

## Operations Department Validation

### When Creating Personnel
If the subdivision's parent department is **"Operations"**, then:
- `watchroom` field is **required**
- `crew` field is **required**

### When Updating Personnel
- If changing to an Operations subdivision: validates watchroom and crew
- Uses existing values if not provided in update

### Example
```javascript
// Creating personnel in Operations subdivision
{
  "subdivision": "WATCH_A_ID",  // Watch A → Operations Department
  "watchroom": "Watch Room 1",   // Required ✅
  "crew": "Crew 1"               // Required ✅
}

// Creating personnel in Admin subdivision
{
  "subdivision": "HR_ID",        // HR → Administration Department
  // watchroom and crew not required ✅
}
```

## Test Data Updates

Updated `FIRE_SERVICE_TEST_DATA.json`:

```json
{
  "name": "Kwame Mensah",
  "rank": "CFO",
  "subdivision": "Watch A",        // ✅ Changed from "department"
  "role": "Operations Officer",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch Room 1",     // Required for Operations
  "crew": "Crew 1"
}
```

## Workflow Example

### 1. Create Department
```bash
POST /api/fire/departments
{
  "name": "Operations",
  "station": "Accra Central Fire Station"
}
# Returns: DEPT_ID
```

### 2. Create Subdivision
```bash
POST /api/fire/subdivisions
{
  "name": "Watch A",
  "color": "#FF0000",
  "department": "DEPT_ID"
}
# Returns: SUBDIVISION_ID
```

### 3. Create Personnel
```bash
POST /api/fire/personnel
{
  "name": "John Doe",
  "rank": "RANK_ID",
  "subdivision": "SUBDIVISION_ID",  // ✅ Use subdivision, not department
  "role": "ROLE_ID",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch Room 1",
  "crew": "Crew 1"
}
```

### 4. Query Personnel by Department
```bash
GET /api/fire/personnel?department=DEPT_ID
# Returns all personnel in all subdivisions of this department
```

## Breaking Changes

⚠️ **Breaking Changes for Existing Data:**

1. **Field Name Change**: `department` → `subdivision` in FirePersonnel
2. **Required Field**: `subdivision` is now required (was `department`)
3. **Populate Path**: Must populate `subdivision.department` (not just `department`)
4. **Query Parameters**: Use `subdivision` or `department` (department queries through subdivisions)

## Migration Guide

### For Existing Databases

If you have existing FirePersonnel records with `department` field:

```javascript
// Step 1: Backup your database!

// Step 2: For each personnel, map department to subdivision
// This requires manual mapping or a migration script

// Step 3: Drop and recreate with new structure
db.firepersonnels.drop()

// Step 4: Recreate data with subdivision references
```

### For New Deployments

Just follow the new structure:
1. Create Departments
2. Create Subdivisions (linked to Departments)
3. Create Personnel (linked to Subdivisions)

## Benefits of New Structure

✅ **Correct Hierarchy**: Department → Subdivision → Personnel
✅ **Better Organization**: Personnel grouped by subdivision
✅ **Flexible Queries**: Can query by subdivision or department
✅ **Clearer Relationships**: One-to-many at each level
✅ **Operations Validation**: Smart validation based on subdivision's department
✅ **Scalable**: Easy to add more subdivisions without changing personnel

## Files Modified

1. ✅ `models/FirePersonnel.js` - Changed department → subdivision
2. ✅ `models/Department.js` - Removed personnel virtual
3. ✅ `models/Subdivision.js` - Added personnel virtual
4. ✅ `controllers/firePersonnelController.js` - Complete rewrite for new structure
5. ✅ `controllers/departmentController.js` - Removed personnel population
6. ✅ `controllers/subdivisionController.js` - Added personnel population
7. ✅ `routes/firePersonnelRoutes.js` - Added subdivision endpoint
8. ✅ `FIRE_SERVICE_TEST_DATA.json` - Updated test data

## Summary

The relationship has been corrected so that:
- **FirePersonnel belongs to Subdivision** (not Department directly)
- **Subdivision belongs to Department**
- **Department has many Subdivisions**

This creates a proper three-tier hierarchy that accurately reflects the organizational structure of the Ghana National Fire Service.

---

**Version**: 2.0.0  
**Last Updated**: October 27, 2025  
**Breaking Changes**: Yes - Field name and relationship structure changed  
**Migration Required**: Yes - For existing databases with personnel data


