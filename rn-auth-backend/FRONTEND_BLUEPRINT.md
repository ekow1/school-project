# Frontend Blueprint: Fire Service Management API

This document provides a comprehensive guide for integrating with the Fire Service Management API endpoints for Departments, Personnel, Units, Ranks, and Roles.

**Base URL**: `http://localhost:5000/api/fire` (or your production URL)

**Note**: All endpoints are public (no authentication required)

---

## Table of Contents

1. [Department](#department)
2. [Personnel (FirePersonnel)](#personnel-firepersonnel)
3. [Unit (Subdivision)](#unit-subdivision)
4. [Rank](#rank)
5. [Role](#role)
6. [Data Relationships](#data-relationships)
7. [Common Response Formats](#common-response-formats)

---

## Department

### Base Endpoint
```
/api/fire/departments
```

### Data Model

```typescript
interface Department {
  _id: string;
  name: string;              // Optional
  station_id: string;        // ObjectId reference to Station (Optional)
  description: string;       // Optional
  station?: Station;         // Virtual - populated station object
  units?: Unit[];            // Virtual - array of units in this department
  personnel?: Personnel[];   // Virtual - array of personnel in this department
  createdAt: string;         // ISO date string
  updatedAt: string;         // ISO date string
}
```

### Endpoints

#### 1. Create Department
```http
POST /api/fire/departments
Content-Type: application/json

{
  "name": "Operations",
  "station_id": "507f1f77bcf86cd799439012",
  "description": "Handles emergency response operations"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Operations",
    "station_id": "507f1f77bcf86cd799439012",
    "description": "Handles emergency response operations",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Departments
```http
GET /api/fire/departments?station_id=507f1f77bcf86cd799439012
```

**Query Parameters**:
- `station_id` (optional): Filter by station ID

**Response** (200 OK):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Operations",
      "station_id": "507f1f77bcf86cd799439012",
      "description": "Handles emergency response operations",
      "units": [...],      // Populated if available
      "personnel": [...],  // Populated if available
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Get Department by ID
```http
GET /api/fire/departments/:id
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Operations",
    "station_id": "507f1f77bcf86cd799439012",
    "description": "Handles emergency response operations",
    "station": {...},      // Populated station object
    "units": [...],        // Populated units array
    "personnel": [...],    // Populated personnel array
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Get Departments by Station
```http
GET /api/fire/departments/station/:stationId
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### 5. Update Department
```http
PUT /api/fire/departments/:id
Content-Type: application/json

{
  "name": "Updated Operations",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {...}
}
```

#### 6. Delete Department
```http
DELETE /api/fire/departments/:id
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

---

## Personnel (FirePersonnel)

### Base Endpoint
```
/api/fire/personnel
```

### Data Model

```typescript
interface Personnel {
  _id: string;
  name: string;                    // Required
  rank: string | Rank;             // ObjectId reference to Rank (Required) - Populated as Rank object
  department?: string | Department; // ObjectId reference to Department (Optional) - Populated as Department object
  unit?: string | Unit;            // ObjectId reference to Unit (Optional) - Populated as Unit object
  role?: string | Role;            // ObjectId reference to Role (Optional) - Populated as Role object
  station_id?: string | Station;   // ObjectId reference to Station (Optional) - Populated as Station object
  station: string;                 // Required - Station name as string
  createdAt: string;               // ISO date string
  updatedAt: string;               // ISO date string
}
```

### Endpoints

#### 1. Create Personnel
```http
POST /api/fire/personnel
Content-Type: application/json

{
  "name": "Kwame Mensah",
  "rank": "507f1f77bcf86cd799439011",
  "department": "507f1f77bcf86cd799439012",
  "subdivision": "507f1f77bcf86cd799439013",  // Note: API accepts 'subdivision' but stores as 'unit'
  "role": "507f1f77bcf86cd799439014",
  "station_id": "507f1f77bcf86cd799439015",
  "station": "Accra Central Fire Station"
}
```

**Request Fields**:
- `name` (required): Personnel name
- `rank` (required): Rank ID
- `department` (optional): Department ID
- `subdivision` (optional): Unit ID (accepted as 'subdivision' for backward compatibility)
- `role` (optional): Role ID
- `station_id` (optional): Station ObjectId
- `station` (required): Station name as string

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Fire personnel created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Kwame Mensah",
    "rank": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Chief Fire Officer",
      "initials": "CFO"
    },
    "department": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Operations"
    },
    "unit": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Watch A"
    },
    "role": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Operations Officer"
    },
    "station_id": {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Accra Central Fire Station"
    },
    "station": "Accra Central Fire Station",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Rules**:
- If `unit` is provided, it must belong to the specified `department`
- Both `name`, `rank`, and `station` are required

#### 2. Get All Personnel
```http
GET /api/fire/personnel?department=507f1f77bcf86cd799439012&subdivision=507f1f77bcf86cd799439013&station_id=507f1f77bcf86cd799439015&rank=507f1f77bcf86cd799439011
```

**Query Parameters**:
- `department` (optional): Filter by department ID
- `subdivision` (optional): Filter by unit ID (accepted as 'subdivision')
- `station_id` (optional): Filter by station ID
- `station` (optional): Filter by station name
- `rank` (optional): Filter by rank ID

**Response** (200 OK):
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Kwame Mensah",
      "rank": {...},
      "department": {...},
      "unit": {...},
      "role": {...},
      "station_id": {...},
      "station": "Accra Central Fire Station",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Get Personnel by ID
```http
GET /api/fire/personnel/:id
```

#### 4. Get Personnel by Station
```http
GET /api/fire/personnel/station/:stationId
```

#### 5. Get Personnel by Department
```http
GET /api/fire/personnel/department/:departmentId
```

#### 6. Get Personnel by Unit (Subdivision)
```http
GET /api/fire/personnel/subdivision/:subdivisionId
```

**Note**: Route parameter uses `subdivisionId` but returns personnel with `unit` field

#### 7. Update Personnel
```http
PUT /api/fire/personnel/:id
Content-Type: application/json

{
  "name": "Kwame Mensah Updated",
  "rank": "507f1f77bcf86cd799439011",
  "subdivision": "507f1f77bcf86cd799439013"  // Accepted as 'subdivision', stored as 'unit'
}
```

#### 8. Delete Personnel
```http
DELETE /api/fire/personnel/:id
```

---

## Unit (Subdivision)

### Base Endpoint
```
/api/fire/subdivisions
```

**Note**: The API route uses `/subdivisions` but the entity is conceptually a "Unit"

### Data Model

```typescript
interface Unit {
  _id: string;
  name: string;                  // Required
  color: string;                 // Default: "#000000"
  department: string | Department; // ObjectId reference to Department (Required) - Populated as Department object
  groupNames: string[];          // Optional array of group names
  personnel?: Personnel[];       // Virtual - array of personnel in this unit
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
}
```

### Endpoints

#### 1. Create Unit
```http
POST /api/fire/subdivisions
Content-Type: application/json

{
  "name": "Watch A",
  "color": "#FF0000",
  "department": "507f1f77bcf86cd799439011",
  "groupNames": ["Group 1", "Group 2"]  // Optional
}
```

**Request Fields**:
- `name` (required): Unit name
- `color` (optional): Color code (default: "#000000")
- `department` (required): Department ID
- `groupNames` (optional): Array of group name strings

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Unit created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Watch A",
    "color": "#FF0000",
    "department": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Operations"
    },
    "groupNames": ["Group 1", "Group 2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Rules**:
- Unit name must be unique within the same department
- Department is required

#### 2. Get All Units
```http
GET /api/fire/subdivisions
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Watch A",
      "color": "#FF0000",
      "department": {...},
      "groupNames": ["Group 1", "Group 2"],
      "personnel": [...],  // Populated if available
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Get Unit by ID
```http
GET /api/fire/subdivisions/:id
```

**Response** includes populated `department` and `personnel` arrays

#### 4. Get Units by Department
```http
GET /api/fire/subdivisions/department/:departmentId
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### 5. Update Unit
```http
PATCH /api/fire/subdivisions/:id
Content-Type: application/json

{
  "name": "Watch A Updated",
  "color": "#00FF00",
  "groupNames": ["Group 1", "Group 2", "Group 3"]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Unit updated successfully",
  "data": {...}
}
```

#### 6. Delete Unit
```http
DELETE /api/fire/subdivisions/:id
```

---

## Rank

### Base Endpoint
```
/api/fire/ranks
```

### Data Model

```typescript
interface Rank {
  _id: string;
  name: string;        // Required, Unique
  initials: string;    // Required, Unique, Uppercase (e.g., "CFO")
  level: number;       // Optional, Default: 0
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}
```

### Endpoints

#### 1. Create Rank
```http
POST /api/fire/ranks
Content-Type: application/json

{
  "name": "Chief Fire Officer",
  "initials": "CFO",
  "level": 10
}
```

**Request Fields**:
- `name` (required, unique): Full rank name
- `initials` (required, unique): Rank initials (automatically uppercase)
- `level` (optional): Numeric level for ranking

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Rank created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Chief Fire Officer",
    "initials": "CFO",
    "level": 10,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Ranks
```http
GET /api/fire/ranks
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Chief Fire Officer",
      "initials": "CFO",
      "level": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Get Rank by ID
```http
GET /api/fire/ranks/:id
```

#### 4. Update Rank
```http
PATCH /api/fire/ranks/:id
Content-Type: application/json

{
  "name": "Chief Fire Officer (Updated)",
  "level": 11
}
```

#### 5. Delete Rank
```http
DELETE /api/fire/ranks/:id
```

---

## Role

### Base Endpoint
```
/api/fire/roles
```

### Data Model

```typescript
interface Role {
  _id: string;
  name: string;        // Required, Unique
  description?: string; // Optional
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}
```

### Endpoints

#### 1. Create Role
```http
POST /api/fire/roles
Content-Type: application/json

{
  "name": "Operations Officer",
  "description": "Handles emergency response operations"
}
```

**Request Fields**:
- `name` (required, unique): Role name
- `description` (optional): Role description

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Operations Officer",
    "description": "Handles emergency response operations",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Roles
```http
GET /api/fire/roles
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Operations Officer",
      "description": "Handles emergency response operations",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Get Role by ID
```http
GET /api/fire/roles/:id
```

#### 4. Update Role
```http
PATCH /api/fire/roles/:id
Content-Type: application/json

{
  "name": "Operations Officer (Updated)",
  "description": "Updated description"
}
```

#### 5. Delete Role
```http
DELETE /api/fire/roles/:id
```

---

## Data Relationships

### Entity Hierarchy

```
Station
  └── Department
      └── Unit
          └── Personnel (assigned to unit)
              ├── Rank (required)
              └── Role (optional)
```

### Relationship Details

1. **Station → Department**
   - One Station can have many Departments
   - Department references Station via `station_id`

2. **Department → Unit**
   - One Department can have many Units
   - Unit references Department via `department` (required)
   - Unit name must be unique within a department

3. **Unit → Personnel**
   - One Unit can have many Personnel
   - Personnel references Unit via `unit` field
   - Personnel must belong to the unit's department

4. **Personnel Relationships**:
   - `rank` (required): References Rank
   - `department` (optional): References Department
   - `unit` (optional): References Unit (must belong to department if both provided)
   - `role` (optional): References Role
   - `station_id` (optional): References Station
   - `station` (required): Station name as string

### Querying with Relationships

**Example: Get all personnel in a department with their units**
```javascript
// 1. Get department
const department = await fetch('/api/fire/departments/:departmentId').then(r => r.json());

// 2. Get units in department
const units = await fetch(`/api/fire/subdivisions/department/${department.data._id}`).then(r => r.json());

// 3. Get personnel in department
const personnel = await fetch(`/api/fire/personnel/department/${department.data._id}`).then(r => r.json());

// Personnel will have populated rank, department, unit, role, and station_id
```

**Example: Create personnel with all relationships**
```javascript
// Step 1: Ensure all referenced entities exist
const rank = await fetch('/api/fire/ranks', {
  method: 'POST',
  body: JSON.stringify({
    name: "Chief Fire Officer",
    initials: "CFO",
    level: 10
  })
});

const role = await fetch('/api/fire/roles', {
  method: 'POST',
  body: JSON.stringify({
    name: "Operations Officer"
  })
});

// Step 2: Create personnel
const personnel = await fetch('/api/fire/personnel', {
  method: 'POST',
  body: JSON.stringify({
    name: "Kwame Mensah",
    rank: rank.data._id,
    department: "507f1f77bcf86cd799439012",
    subdivision: "507f1f77bcf86cd799439013",  // Note: API accepts 'subdivision'
    role: role.data._id,
    station: "Accra Central Fire Station"
  })
});
```

---

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### List Response
```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Error Response (500 Server Error)
```json
{
  "success": false,
  "message": "Internal server error message"
}
```

---

## Important Notes for Frontend Developers

1. **Field Naming Consistency**:
   - API accepts `subdivision` in Personnel requests but stores/returns as `unit`
   - Always check the response to see the actual field name (`unit`)

2. **Required Fields**:
   - **Personnel**: `name`, `rank`, `station` are required
   - **Unit**: `name`, `department` are required
   - **Rank**: `name`, `initials` are required (both unique)
   - **Role**: `name` is required (unique)

3. **Populated Fields**:
   - Use query parameters or populate options to get related data
   - Department returns `units` and `personnel` as virtual fields
   - Unit returns `personnel` as virtual field
   - Personnel returns populated objects for `rank`, `department`, `unit`, `role`, `station_id`

4. **Unique Constraints**:
   - Rank `name` and `initials` must be unique
   - Role `name` must be unique
   - Unit `name` must be unique within the same department

5. **No Authentication Required**:
   - All endpoints are public
   - No Authorization headers needed

6. **CORS**:
   - API supports CORS with credentials
   - Origin is set to allow all (`*`)

---

## Example Frontend Implementation (JavaScript/TypeScript)

### TypeScript Interfaces

```typescript
// types/fireService.ts

export interface Department {
  _id: string;
  name?: string;
  station_id?: string;
  description?: string;
  station?: Station;
  units?: Unit[];
  personnel?: Personnel[];
  createdAt: string;
  updatedAt: string;
}

export interface Personnel {
  _id: string;
  name: string;
  rank: Rank | string;
  department?: Department | string;
  unit?: Unit | string;  // Note: API returns 'unit' not 'subdivision'
  role?: Role | string;
  station_id?: Station | string;
  station: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  _id: string;
  name: string;
  color: string;
  department: Department | string;
  groupNames: string[];
  personnel?: Personnel[];
  createdAt: string;
  updatedAt: string;
}

export interface Rank {
  _id: string;
  name: string;
  initials: string;
  level?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### API Service Class

```typescript
// services/fireServiceApi.ts

const API_BASE = 'http://localhost:5000/api/fire';

export class FireServiceAPI {
  // Department endpoints
  static async getDepartments(stationId?: string) {
    const url = stationId 
      ? `${API_BASE}/departments?station_id=${stationId}`
      : `${API_BASE}/departments`;
    const res = await fetch(url);
    return res.json();
  }

  static async createDepartment(data: Partial<Department>) {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // Personnel endpoints
  static async getPersonnel(filters?: {
    department?: string;
    subdivision?: string;  // Note: query uses 'subdivision'
    station_id?: string;
    rank?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.department) params.append('department', filters.department);
    if (filters?.subdivision) params.append('subdivision', filters.subdivision);
    if (filters?.station_id) params.append('station_id', filters.station_id);
    if (filters?.rank) params.append('rank', filters.rank);
    
    const url = `${API_BASE}/personnel${params.toString() ? '?' + params : ''}`;
    const res = await fetch(url);
    return res.json();
  }

  static async createPersonnel(data: {
    name: string;
    rank: string;
    station: string;
    department?: string;
    subdivision?: string;  // API accepts 'subdivision'
    role?: string;
    station_id?: string;
  }) {
    const res = await fetch(`${API_BASE}/personnel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // Unit endpoints
  static async getUnits(departmentId?: string) {
    const url = departmentId
      ? `${API_BASE}/subdivisions/department/${departmentId}`
      : `${API_BASE}/subdivisions`;
    const res = await fetch(url);
    return res.json();
  }

  static async createUnit(data: {
    name: string;
    department: string;
    color?: string;
    groupNames?: string[];
  }) {
    const res = await fetch(`${API_BASE}/subdivisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // Rank endpoints
  static async getRanks() {
    const res = await fetch(`${API_BASE}/ranks`);
    return res.json();
  }

  static async createRank(data: {
    name: string;
    initials: string;
    level?: number;
  }) {
    const res = await fetch(`${API_BASE}/ranks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // Role endpoints
  static async getRoles() {
    const res = await fetch(`${API_BASE}/roles`);
    return res.json();
  }

  static async createRole(data: {
    name: string;
    description?: string;
  }) {
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
}
```

---

## Frontend UI Recommendations

### 1. Department Management
- **List View**: Show departments with station, unit count, personnel count
- **Form**: Name, Station selector, Description textarea
- **Filters**: Filter by station

### 2. Personnel Management
- **List View**: Table with Name, Rank, Department, Unit, Role, Station
- **Form**: 
  - Name (required)
  - Rank dropdown (required) - fetch from `/api/fire/ranks`
  - Station text input (required)
  - Department dropdown (optional) - fetch from `/api/fire/departments`
  - Unit dropdown (optional) - fetch from `/api/fire/subdivisions/department/:departmentId`
  - Role dropdown (optional) - fetch from `/api/fire/roles`
- **Filters**: Department, Unit, Station, Rank

### 3. Unit Management
- **List View**: Cards or list showing name, color badge, department, group names
- **Form**: 
  - Name (required)
  - Department selector (required)
  - Color picker (default: #000000)
  - Group names array (add/remove groups)
- **Validation**: Ensure unit name is unique within department

### 4. Rank Management
- **List View**: Table with Name, Initials, Level
- **Form**: 
  - Name (required, unique)
  - Initials (required, unique) - auto-uppercase
  - Level (optional number)
- **Sorting**: Consider sorting by level

### 5. Role Management
- **List View**: Table with Name, Description
- **Form**: 
  - Name (required, unique)
  - Description (optional textarea)

---

## Error Handling Examples

```typescript
try {
  const response = await FireServiceAPI.createPersonnel({
    name: "John Doe",
    rank: "invalid-rank-id",
    station: "Test Station"
  });
  
  if (!response.success) {
    // Handle error
    console.error(response.message);
    // Display to user: "Rank not found" or similar
  }
} catch (error) {
  // Network error
  console.error("Network error:", error);
}

// Handle validation errors
if (response.message.includes("required")) {
  // Highlight required fields in form
}

if (response.message.includes("already exists")) {
  // Show duplicate name error
}
```

---

This blueprint provides everything needed to integrate with the Fire Service Management API. For additional details, refer to the Swagger documentation at `/api-docs` when the server is running.
