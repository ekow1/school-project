# Fire Personnel Dual Reference Structure

## Overview

FirePersonnel now has **BOTH** `department` and `subdivision` references for optimal querying and data integrity.

## Structure

```
Department (e.g., "Operations")
  ├── has many Subdivisions
  │     ├── Subdivision (e.g., "Watch A")
  │     ├── Subdivision (e.g., "Watch B")
  │     └── Subdivision (e.g., "Watch C")
  └── has many FirePersonnel (direct reference)
        ├── FirePersonnel → belongs to Department
        └── FirePersonnel → belongs to Subdivision
```

## FirePersonnel Model

```javascript
{
  name: String,
  rank: ObjectId (ref: Rank),
  department: ObjectId (ref: Department),     // ✅ Department reference
  subdivision: ObjectId (ref: Subdivision),   // ✅ Subdivision reference
  role: ObjectId (ref: Role),
  station: String,
  region: String,
  watchroom: String,  // Required for Operations dept
  crew: String        // Required for Operations dept
}
```

## Benefits

### 1. Direct Department Queries
```javascript
// Get all personnel in a department (no need to query subdivisions first)
GET /api/fire/personnel?department=DEPT_ID
```

### 2. Direct Subdivision Queries
```javascript
// Get all personnel in a subdivision
GET /api/fire/personnel?subdivision=SUBDIVISION_ID
```

### 3. Data Integrity
The system validates that the subdivision actually belongs to the department:
```javascript
// This will fail if subdivision doesn't belong to department
{
  "department": "DEPT_A",
  "subdivision": "SUBDIVISION_B"  // Must belong to DEPT_A
}
```

### 4. Virtual Relationships Work Both Ways
```javascript
// Department can access its personnel directly
GET /api/fire/departments/:id
// Returns: { subdivisions: [...], personnel: [...] }

// Subdivision can access its personnel
GET /api/fire/subdivisions/:id
// Returns: { department: {...}, personnel: [...] }
```

## API Usage

### Creating Fire Personnel

**Request:**
```json
POST /api/fire/personnel
{
  "name": "John Doe",
  "rank": "RANK_ID",
  "department": "DEPARTMENT_ID",      // ✅ Required
  "subdivision": "SUBDIVISION_ID",    // ✅ Required (must belong to department)
  "role": "ROLE_ID",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch Room 1",        // Required if department is Operations
  "crew": "Crew 1"                    // Required if department is Operations
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "rank": { ... },
    "department": {
      "_id": "...",
      "name": "Operations",
      "station": "Accra Central Fire Station"
    },
    "subdivision": {
      "_id": "...",
      "name": "Watch A",
      "color": "#FF0000",
      "department": "..."
    },
    "role": { ... },
    "station": "Accra Central Fire Station",
    "region": "Greater Accra",
    "watchroom": "Watch Room 1",
    "crew": "Crew 1"
  }
}
```

## Validation Rules

### 1. Both References Required
```javascript
// ❌ Missing department
{
  "subdivision": "SUBDIVISION_ID"
}

// ❌ Missing subdivision
{
  "department": "DEPARTMENT_ID"
}

// ✅ Both provided
{
  "department": "DEPARTMENT_ID",
  "subdivision": "SUBDIVISION_ID"
}
```

### 2. Subdivision Must Belong to Department
```javascript
// System validates:
subdivision.department === department

// If mismatch:
{
  "success": false,
  "message": "Subdivision does not belong to the specified department"
}
```

### 3. Operations Department Requirements
```javascript
// If department is "Operations":
{
  "department": "OPERATIONS_DEPT_ID",
  "subdivision": "WATCH_A_ID",
  "watchroom": "Watch Room 1",  // ✅ Required
  "crew": "Crew 1"              // ✅ Required
}

// If department is NOT "Operations":
{
  "department": "ADMIN_DEPT_ID",
  "subdivision": "HR_ID"
  // watchroom and crew optional
}
```

## Query Filtering

### Filter by Department
```bash
GET /api/fire/personnel?department=DEPT_ID
# Returns all personnel with that department
```

### Filter by Subdivision
```bash
GET /api/fire/personnel?subdivision=SUBDIVISION_ID
# Returns all personnel with that subdivision
```

### Combined Filters
```bash
GET /api/fire/personnel?department=DEPT_ID&station=Accra&region=Greater%20Accra
# All filters work together
```

### Specific Endpoints

```bash
# Get all personnel in a department
GET /api/fire/personnel/department/:departmentId

# Get all personnel in a subdivision
GET /api/fire/personnel/subdivision/:subdivisionId
```

## Workflow Example

### Step 1: Create Department
```bash
POST /api/fire/departments
{
  "name": "Operations",
  "station": "Accra Central Fire Station"
}
# Response: { _id: "DEPT_ID", ... }
```

### Step 2: Create Subdivision
```bash
POST /api/fire/subdivisions
{
  "name": "Watch A",
  "color": "#FF0000",
  "department": "DEPT_ID"
}
# Response: { _id: "SUBDIVISION_ID", department: "DEPT_ID", ... }
```

### Step 3: Create Personnel
```bash
POST /api/fire/personnel
{
  "name": "John Doe",
  "rank": "RANK_ID",
  "department": "DEPT_ID",           // ✅ Same as subdivision's department
  "subdivision": "SUBDIVISION_ID",    // ✅ Belongs to DEPT_ID
  "role": "ROLE_ID",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch Room 1",
  "crew": "Crew 1"
}
```

### Step 4: Query Personnel

```bash
# By department
GET /api/fire/personnel?department=DEPT_ID

# By subdivision
GET /api/fire/personnel?subdivision=SUBDIVISION_ID

# Get department with all personnel and subdivisions
GET /api/fire/departments/DEPT_ID
# Returns: { subdivisions: [...], personnel: [...] }
```

## Update Operations

### Update Both Department and Subdivision
```bash
PATCH /api/fire/personnel/:id
{
  "department": "NEW_DEPT_ID",
  "subdivision": "NEW_SUBDIVISION_ID"  // Must belong to NEW_DEPT_ID
}
```

### Update Only Subdivision
```bash
PATCH /api/fire/personnel/:id
{
  "subdivision": "NEW_SUBDIVISION_ID"
}
# System validates that new subdivision belongs to current department
```

### Update Only Department
```bash
PATCH /api/fire/personnel/:id
{
  "department": "NEW_DEPT_ID",
  "subdivision": "NEW_SUBDIVISION_ID"  // Must also update subdivision
}
# Must provide subdivision that belongs to new department
```

## Error Handling

### 1. Subdivision Not Found
```json
{
  "success": false,
  "message": "Subdivision not found"
}
```

### 2. Subdivision-Department Mismatch
```json
{
  "success": false,
  "message": "Subdivision does not belong to the specified department"
}
```

### 3. Missing Operations Fields
```json
{
  "success": false,
  "message": "Watchroom and crew are required for Operations department personnel"
}
```

### 4. Missing Required Fields
```json
{
  "success": false,
  "message": "All required fields (name, rank, department, subdivision, role, station, region) must be provided"
}
```

## Database Indexes

Optimized indexes for fast queries:
```javascript
// Compound index for department and subdivision
{ department: 1, subdivision: 1 }

// Index for location queries
{ station: 1, region: 1 }

// Index for rank queries
{ rank: 1 }
```

## Virtual Relationships

### Department → Personnel
```javascript
// Department model has virtual 'personnel' field
department.personnel  // Returns all FirePersonnel with this department
```

### Department → Subdivisions
```javascript
// Department model has virtual 'subdivisions' field
department.subdivisions  // Returns all Subdivisions in this department
```

### Subdivision → Personnel
```javascript
// Subdivision model has virtual 'personnel' field
subdivision.personnel  // Returns all FirePersonnel in this subdivision
```

## Test Data Structure

```json
{
  "name": "Kwame Mensah",
  "rank": "CFO",
  "department": "Operations",          // ✅ Department reference
  "subdivision": "Watch A",            // ✅ Subdivision reference
  "role": "Operations Officer",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch Room 1",
  "crew": "Crew 1"
}
```

## Summary

✅ **Dual References**: Personnel has both department and subdivision
✅ **Data Integrity**: System validates subdivision belongs to department
✅ **Fast Queries**: Direct queries by department or subdivision
✅ **Virtual Relations**: Both Department and Subdivision can access their personnel
✅ **Flexible Filtering**: Query by department, subdivision, station, region, or rank
✅ **Automatic Validation**: Operations department automatically requires watchroom and crew

---

**Version**: 3.0.0  
**Last Updated**: October 27, 2025  
**Structure**: Dual reference (department + subdivision)


