# Ghana National Fire Service Personnel Management System

## Overview

A comprehensive Node.js + Express + MongoDB backend system for managing Ghana National Fire Service personnel, departments, ranks, roles, and administrative structure.

## Features

- ✅ Complete CRUD operations for all entities
- ✅ Authentication-protected endpoints
- ✅ Relationship management between entities
- ✅ Query filtering capabilities
- ✅ Mongoose schema validation
- ✅ Clean RESTful API design
- ✅ Operations department special fields (watchroom, crew)

## System Architecture

### Entities

1. **FirePersonnel** - Individual fire service officers
2. **Department** - Fire service departments
3. **Subdivision** - Department subdivisions (watches, units)
4. **Role** - Job roles/positions
5. **Rank** - Officer ranks/grades
6. **SuperAdmin** - Administrative managers

### Relationships

```
FirePersonnel
├── belongs to one Department
├── belongs to one Role
├── belongs to one Rank
└── located at one Station in one Region

Department
├── has many Subdivisions
├── has many FirePersonnel
└── located at one Station

Subdivision
└── belongs to one Department

SuperAdmin
├── manages many Departments
├── manages many Stations
├── has one Rank
└── has one Role
```

## API Endpoints

All endpoints require authentication (Bearer token).

### Base URL
```
Production: https://auth.ekowlabs.space/api/fire
Local: http://localhost:5000/api/fire
```

### Fire Personnel

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/personnel` | Create new personnel |
| GET | `/personnel` | Get all personnel (supports filtering) |
| GET | `/personnel/:id` | Get personnel by ID |
| PATCH | `/personnel/:id` | Update personnel |
| DELETE | `/personnel/:id` | Delete personnel |
| GET | `/personnel/department/:departmentId` | Get personnel by department |

**Query Parameters for GET /personnel:**
- `department` - Filter by department ID
- `station` - Filter by station name
- `region` - Filter by region name
- `rank` - Filter by rank ID

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/departments` | Create new department |
| GET | `/departments` | Get all departments |
| GET | `/departments/:id` | Get department by ID (includes subdivisions and personnel) |
| PATCH | `/departments/:id` | Update department |
| DELETE | `/departments/:id` | Delete department |

**Query Parameters for GET /departments:**
- `station` - Filter by station name

### Subdivisions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/subdivisions` | Create new subdivision |
| GET | `/subdivisions` | Get all subdivisions |
| GET | `/subdivisions/:id` | Get subdivision by ID |
| PATCH | `/subdivisions/:id` | Update subdivision |
| DELETE | `/subdivisions/:id` | Delete subdivision |
| GET | `/subdivisions/department/:departmentId` | Get subdivisions by department |

### Roles

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/roles` | Create new role |
| GET | `/roles` | Get all roles |
| GET | `/roles/:id` | Get role by ID |
| PATCH | `/roles/:id` | Update role |
| DELETE | `/roles/:id` | Delete role |

### Ranks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ranks` | Create new rank |
| GET | `/ranks` | Get all ranks (sorted by level) |
| GET | `/ranks/:id` | Get rank by ID |
| PATCH | `/ranks/:id` | Update rank |
| DELETE | `/ranks/:id` | Delete rank |

### Super Admins

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/superadmins` | Create new super admin |
| GET | `/superadmins` | Get all super admins |
| GET | `/superadmins/:id` | Get super admin by ID |
| PATCH | `/superadmins/:id` | Update super admin |
| DELETE | `/superadmins/:id` | Delete super admin |
| POST | `/superadmins/:id/departments/add` | Add managed department |
| POST | `/superadmins/:id/departments/remove` | Remove managed department |

**Query Parameters for GET /superadmins:**
- `region` - Filter by region
- `station` - Filter by station

## Request/Response Examples

### Create Fire Personnel

**Request:**
```bash
POST /api/fire/personnel
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Kwame Mensah",
  "rank": "507f1f77bcf86cd799439011",
  "department": "507f1f77bcf86cd799439012",
  "role": "507f1f77bcf86cd799439013",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch A",
  "crew": "Crew 1"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Fire personnel created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
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
    "role": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Operations Officer"
    },
    "station": "Accra Central Fire Station",
    "region": "Greater Accra",
    "watchroom": "Watch A",
    "crew": "Crew 1",
    "createdAt": "2025-10-27T12:00:00.000Z",
    "updatedAt": "2025-10-27T12:00:00.000Z"
  }
}
```

### Create Department

**Request:**
```bash
POST /api/fire/departments
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Operations",
  "station": "Accra Central Fire Station",
  "description": "Handles all firefighting and emergency response"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Operations",
    "station": "Accra Central Fire Station",
    "description": "Handles all firefighting and emergency response",
    "createdAt": "2025-10-27T12:00:00.000Z",
    "updatedAt": "2025-10-27T12:00:00.000Z"
  }
}
```

### Create Rank

**Request:**
```bash
POST /api/fire/ranks
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Chief Fire Officer",
  "initials": "CFO",
  "level": 10
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Rank created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Chief Fire Officer",
    "initials": "CFO",
    "level": 10,
    "createdAt": "2025-10-27T12:00:00.000Z",
    "updatedAt": "2025-10-27T12:00:00.000Z"
  }
}
```

## Testing the API

### 1. First, Login to Get Token

```bash
POST https://auth.ekowlabs.space/api/auth/login
Content-Type: application/json

{
  "phone": "+233201234567",
  "password": "yourpassword"
}
```

Save the returned `token`.

### 2. Create Ranks (Foundation Data)

```bash
curl -X POST https://auth.ekowlabs.space/api/fire/ranks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chief Fire Officer",
    "initials": "CFO",
    "level": 10
  }'
```

### 3. Create Roles

```bash
curl -X POST https://auth.ekowlabs.space/api/fire/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Operations Officer",
    "description": "Handles firefighting operations"
  }'
```

### 4. Create Department

```bash
curl -X POST https://auth.ekowlabs.space/api/fire/departments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Operations",
    "station": "Accra Central Fire Station"
  }'
```

### 5. Create Fire Personnel

Use the IDs from previous steps:

```bash
curl -X POST https://auth.ekowlabs.space/api/fire/personnel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kwame Mensah",
    "rank": "RANK_ID_HERE",
    "department": "DEPARTMENT_ID_HERE",
    "role": "ROLE_ID_HERE",
    "station": "Accra Central Fire Station",
    "region": "Greater Accra",
    "watchroom": "Watch A",
    "crew": "Crew 1"
  }'
```

## Model Details

### FirePersonnel Schema
```javascript
{
  name: String (required),
  rank: ObjectId ref Rank (required),
  department: ObjectId ref Department (required),
  role: ObjectId ref Role (required),
  station: String (required),
  region: String (required),
  watchroom: String (required if department is Operations),
  crew: String (required if department is Operations),
  timestamps: true
}
```

### Department Schema
```javascript
{
  name: String (required, unique),
  station: String (required),
  description: String,
  timestamps: true,
  virtuals: {
    subdivisions: [Subdivision],
    personnel: [FirePersonnel]
  }
}
```

### Rank Schema
```javascript
{
  name: String (required, unique),
  initials: String (required, unique, uppercase),
  level: Number (default: 0),
  timestamps: true
}
```

## Special Features

### Operations Department Requirements

Personnel assigned to the Operations department **must** include:
- `watchroom` - Watch assignment (e.g., "Watch A", "Watch B")
- `crew` - Crew assignment (e.g., "Crew 1", "Crew 2")

These fields are validated automatically by the schema.

### Query Filtering

Many endpoints support filtering:

```bash
# Get personnel in Operations department at Accra station
GET /api/fire/personnel?department=DEPT_ID&station=Accra Central Fire Station

# Get departments at specific station
GET /api/fire/departments?station=Kumasi Fire Station

# Get super admins by region
GET /api/fire/superadmins?region=Greater Accra
```

## Error Handling

All endpoints return structured error responses:

```json
{
  "success": false,
  "message": "Error description here"
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error, missing required fields)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Database Collections

All data is stored in MongoDB:

- `firepersonnels` - Fire service personnel
- `departments` - Departments
- `subdivisions` - Department subdivisions
- `roles` - Job roles
- `ranks` - Officer ranks
- `superadmins` - Administrative managers

## File Structure

```
rn-auth-backend/
├── models/
│   ├── FirePersonnel.js
│   ├── Department.js
│   ├── Subdivision.js
│   ├── Role.js
│   ├── Rank.js
│   └── SuperAdmin.js
├── controllers/
│   ├── firePersonnelController.js
│   ├── departmentController.js
│   ├── subdivisionController.js
│   ├── roleController.js
│   ├── rankController.js
│   └── superAdminController.js
├── routes/
│   ├── firePersonnelRoutes.js
│   ├── departmentRoutes.js
│   ├── subdivisionRoutes.js
│   ├── roleRoutes.js
│   ├── rankRoutes.js
│   └── superAdminRoutes.js
├── server.js (updated with fire service routes)
├── FIRE_SERVICE_TEST_DATA.json
└── FIRE_SERVICE_README.md
```

## Integration with Existing Auth System

All Fire Service endpoints are protected using the existing authentication middleware (`verifyToken`). Users must:

1. Register/Login via `/api/auth/register` or `/api/auth/login`
2. Receive JWT token
3. Include token in all Fire Service API requests

## Ghana Regions

Supported regions:
- Greater Accra
- Ashanti
- Western
- Eastern
- Central
- Northern
- Upper East
- Upper West
- Volta
- Oti
- Bono
- Bono East
- Ahafo
- Western North
- Savannah
- North East

## Next Steps

1. **Testing**: Import test data from `FIRE_SERVICE_TEST_DATA.json`
2. **Documentation**: Test all endpoints using Postman or cURL
3. **Frontend Integration**: Build admin dashboard for managing personnel
4. **Reports**: Add endpoints for generating personnel reports
5. **Search**: Implement advanced search and filtering
6. **Swagger**: Add Swagger documentation for Fire Service endpoints

## Support

For issues or questions:
- Email: support@fireservice.gov.gh
- GitHub: https://github.com/ekow1/school-project

---

**Version**: 1.0.0  
**Last Updated**: October 27, 2025  
**Status**: ✅ Production Ready


