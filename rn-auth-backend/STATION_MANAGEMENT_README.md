# Fire Station Management System

## Overview

Complete Node.js/Express/MongoDB application for managing Ghana National Fire Service stations, departments, and personnel with comprehensive validation and error handling.

## 🏗️ System Architecture

```
Station (Fire Station)
├── has many Departments
│   ├── Department (Operations, Administration, Training)
│   │   ├── has many Subdivisions
│   │   │   └── Subdivision (Watch A, Watch B, HR, etc.)
│   │   └── has many Personnel
│   └── Department
└── has many Personnel (direct reference)
    └── Personnel → belongs to Station, Department, Subdivision, Rank, Role
```

## 📊 Models

### 1. Station Model
```javascript
{
  name: String,           // Optional
  call_sign: String,      // Optional, unique
  location: String,       // Optional
  location_url: String,   // Optional, Google Maps URL
  coordinates: {          // Optional
    lat: Number,          // -90 to 90
    lng: Number           // -180 to 180
  },
  region: String          // Optional
}
```

### 2. Department Model
```javascript
{
  name: String,           // Optional
  station_id: ObjectId,   // Optional, ref: Station
  description: String     // Optional
}
```

### 3. Personnel Model (FirePersonnel)
```javascript
{
  name: String,           // Optional
  rank: ObjectId,         // Optional, ref: Rank
  department: ObjectId,   // Optional, ref: Department
  subdivision: ObjectId,  // Optional, ref: Subdivision
  role: ObjectId,         // Optional, ref: Role
  station_id: ObjectId,  // Optional, ref: Station
  station: String,        // Optional (legacy field)
  region: String,        // Optional
  watchroom: String,     // Optional (Operations dept)
  crew: String           // Optional (Operations dept)
}
```

## 🔧 Controllers

### Station Controller
- `createStation()` - Create new station with coordinate validation
- `getAllStations()` - Get all stations with optional region filter
- `getStationById()` - Get station by ID with population
- `updateStation()` - Update station with validation
- `deleteStation()` - Delete station

### Department Controller
- `createDepartment()` - Create department with station validation
- `getAllDepartments()` - Get all departments with station filter
- `getDepartmentById()` - Get department with populated station
- `updateDepartment()` - Update department with station validation
- `deleteDepartment()` - Delete department
- `getDepartmentsByStation()` - Get departments by station ID

### Personnel Controller
- `createFirePersonnel()` - Create personnel with comprehensive validation
- `getAllFirePersonnel()` - Get all personnel with multiple filters
- `getFirePersonnelById()` - Get personnel by ID with full population
- `updateFirePersonnel()` - Update personnel with validation
- `deleteFirePersonnel()` - Delete personnel
- `getPersonnelByStation()` - Get personnel by station ID
- `getPersonnelByDepartment()` - Get personnel by department ID
- `getPersonnelBySubdivision()` - Get personnel by subdivision ID

## 🛣️ Routes

### Station Routes (`/api/fire/stations`)
```bash
POST   /                    # Create station
GET    /                    # Get all stations
GET    /:id                 # Get station by ID
PUT    /:id                 # Update station
DELETE /:id                 # Delete station
```

### Department Routes (`/api/fire/departments`)
```bash
POST   /                    # Create department
GET    /                    # Get all departments
GET    /station/:stationId  # Get departments by station
GET    /:id                 # Get department by ID
PUT    /:id                 # Update department
DELETE /:id                 # Delete department
```

### Personnel Routes (`/api/fire/personnel`)
```bash
POST   /                    # Create personnel
GET    /                    # Get all personnel
GET    /station/:stationId  # Get personnel by station
GET    /department/:deptId   # Get personnel by department
GET    /subdivision/:subId  # Get personnel by subdivision
GET    /:id                 # Get personnel by ID
PUT    /:id                 # Update personnel
DELETE /:id                 # Delete personnel
```

## ✅ Validation Features

### 1. ObjectId Validation
All controllers validate ObjectId format before database operations:
```javascript
if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
    });
}
```

### 2. Coordinate Validation
Station coordinates are validated for proper latitude/longitude ranges:
```javascript
if (coordinates.lat < -90 || coordinates.lat > 90) {
    return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90'
    });
}
```

### 3. Reference Validation
All foreign key references are validated for existence:
```javascript
const station = await Station.findById(station_id);
if (!station) {
    return res.status(404).json({
        success: false,
        message: 'Station not found'
    });
}
```

### 4. Business Logic Validation
Operations department personnel require watchroom and crew:
```javascript
if (subdivisionDoc.department.name === 'Operations') {
    if (!watchroom || !crew) {
        return res.status(400).json({
            success: false,
            message: 'Watchroom and crew are required for Operations department personnel'
        });
    }
}
```

## 🔍 Query Examples

### Create Station
```bash
POST /api/fire/stations
{
  "name": "Accra Central Fire Station",
  "call_sign": "ACFS-001",
  "location": "Central Business District, Accra",
  "location_url": "https://maps.google.com/?q=5.6037,-0.1870",
  "coordinates": {
    "lat": 5.6037,
    "lng": -0.1870
  },
  "region": "Greater Accra"
}
```

### Create Department
```bash
POST /api/fire/departments
{
  "name": "Operations",
  "station_id": "STATION_ID",
  "description": "Handles emergency response and fire fighting operations"
}
```

### Create Personnel
```bash
POST /api/fire/personnel
{
  "name": "Kwame Mensah",
  "rank": "RANK_ID",
  "department": "DEPT_ID",
  "subdivision": "SUBDIVISION_ID",
  "role": "ROLE_ID",
  "station_id": "STATION_ID",
  "station": "Accra Central Fire Station",
  "region": "Greater Accra",
  "watchroom": "Watch Room 1",
  "crew": "Crew 1"
}
```

### Query Examples
```bash
# Get all stations in Greater Accra region
GET /api/fire/stations?region=Greater%20Accra

# Get all departments in a specific station
GET /api/fire/departments/station/STATION_ID

# Get all personnel in a station
GET /api/fire/personnel/station/STATION_ID

# Get all personnel in a department
GET /api/fire/personnel/department/DEPT_ID

# Get all personnel in a subdivision
GET /api/fire/personnel/subdivision/SUBDIVISION_ID

# Filter personnel by multiple criteria
GET /api/fire/personnel?station_id=STATION_ID&region=Greater%20Accra&rank=RANK_ID
```

## 📋 Response Format

All endpoints return consistent JSON responses:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "count": 5  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔐 Authentication

All Fire Service routes require authentication via JWT token:
```bash
Authorization: Bearer <JWT_TOKEN>
```

## 📊 Population Strategy

### Station Population
```javascript
.populate('departments')
.populate('personnel')
```

### Department Population
```javascript
.populate('station_id')
.populate('subdivisions')
.populate('personnel')
```

### Personnel Population
```javascript
.populate('rank')
.populate('department')
.populate('subdivision')
.populate('role')
.populate('station_id')
```

## 🗂️ Database Indexes

### Station Indexes
```javascript
{ call_sign: 1 }                    // Unique call sign
{ region: 1 }                       // Region queries
{ 'coordinates.lat': 1, 'coordinates.lng': 1 }  // Location queries
```

### Department Indexes
```javascript
{ station_id: 1 }                   // Station queries
{ name: 1 }                         // Name queries
```

### Personnel Indexes
```javascript
{ department: 1, subdivision: 1 }    // Department/subdivision queries
{ station_id: 1 }                   // Station queries
{ station: 1, region: 1 }           // Location queries
{ rank: 1 }                         // Rank queries
```

## 🚨 Error Handling

### Common Error Scenarios
1. **Invalid ObjectId Format** - 400 Bad Request
2. **Resource Not Found** - 404 Not Found
3. **Invalid Coordinates** - 400 Bad Request
4. **Missing Required Fields** - 400 Bad Request
5. **Duplicate Call Sign** - 400 Bad Request
6. **Invalid Reference** - 404 Not Found
7. **Business Rule Violation** - 400 Bad Request

### Error Response Examples
```json
{
  "success": false,
  "message": "Invalid station_id format"
}

{
  "success": false,
  "message": "Station not found"
}

{
  "success": false,
  "message": "Latitude must be between -90 and 90"
}

{
  "success": false,
  "message": "Watchroom and crew are required for Operations department personnel"
}
```

## 📁 File Structure

```
rn-auth-backend/
├── models/
│   ├── Station.js              # Station model
│   ├── Department.js           # Department model (updated)
│   ├── FirePersonnel.js        # Personnel model (updated)
│   ├── Subdivision.js         # Subdivision model
│   ├── Role.js                # Role model
│   ├── Rank.js                # Rank model
│   └── SuperAdmin.js          # SuperAdmin model
├── controllers/
│   ├── stationController.js   # Station CRUD operations
│   ├── departmentController.js # Department CRUD operations
│   ├── firePersonnelController.js # Personnel CRUD operations
│   ├── subdivisionController.js
│   ├── roleController.js
│   ├── rankController.js
│   └── superAdminController.js
├── routes/
│   ├── stationRoutes.js       # Station routes
│   ├── departmentRoutes.js    # Department routes
│   ├── firePersonnelRoutes.js # Personnel routes
│   ├── subdivisionRoutes.js
│   ├── roleRoutes.js
│   ├── rankRoutes.js
│   └── superAdminRoutes.js
├── server.js                  # Main application file
├── STATION_MANAGEMENT_TEST_DATA.json # Test data
└── STATION_MANAGEMENT_README.md # This documentation
```

## 🧪 Test Data

See `STATION_MANAGEMENT_TEST_DATA.json` for comprehensive test data including:
- 5 Fire Stations across different regions
- 6 Departments (Operations, Administration, Training)
- 7 Fire Personnel with various roles and ranks
- 9 Subdivisions (Watch teams, HR, Training)
- 9 Ranks (CFO to Fireman)
- 8 Roles (Operations Officer to Communications Officer)

## 🚀 Quick Start

1. **Install Dependencies**
```bash
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
```

2. **Set Environment Variables**
```bash
MONGO_URI=mongodb://localhost:27017/fire-service
JWT_SECRET=your-secret-key
PORT=5000
```

3. **Start Server**
```bash
npm start
```

4. **Test Endpoints**
```bash
# Create a station
curl -X POST http://localhost:5000/api/fire/stations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Test Station", "call_sign": "TEST-001"}'

# Get all stations
curl -X GET http://localhost:5000/api/fire/stations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📈 Features Summary

✅ **Complete CRUD Operations** for all entities
✅ **Comprehensive Validation** with meaningful error messages
✅ **ObjectId Validation** for all references
✅ **Coordinate Validation** for geographic data
✅ **Business Logic Validation** for Operations department
✅ **Population Strategy** for related data
✅ **Flexible Querying** with multiple filters
✅ **RESTful API Design** with proper HTTP methods
✅ **Error Handling** with consistent response format
✅ **Authentication** via JWT tokens
✅ **Database Indexing** for optimal performance
✅ **Optional Fields** as per requirements
✅ **Reference Validation** for data integrity

---

**Version**: 1.0.0  
**Last Updated**: October 27, 2025  
**Framework**: Node.js + Express + MongoDB + Mongoose
