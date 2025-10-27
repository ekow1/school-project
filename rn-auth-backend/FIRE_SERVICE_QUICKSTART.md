# Fire Service System - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Ensure Server is Running

Your backend is already configured! The Fire Service routes are integrated into your existing auth backend.

```bash
cd rn-auth-backend
npm start
```

Server should be running on `http://localhost:5000`

### Step 2: Get Authentication Token

First, login or register to get your JWT token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233201234567",
    "password": "yourpassword"
  }'
```

Save the `token` from the response.

### Step 3: Create Foundation Data (In Order)

#### 3.1 Create Ranks
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/fire/ranks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chief Fire Officer",
    "initials": "CFO",
    "level": 10
  }'

curl -X POST http://localhost:5000/api/fire/ranks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Station Officer",
    "initials": "SO",
    "level": 5
  }'
```

Save the rank IDs.

#### 3.2 Create Roles
```bash
curl -X POST http://localhost:5000/api/fire/roles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Operations Officer",
    "description": "Handles firefighting operations"
  }'
```

Save the role ID.

#### 3.3 Create Department
```bash
curl -X POST http://localhost:5000/api/fire/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Operations",
    "station": "Accra Central Fire Station",
    "description": "Handles firefighting and emergency response"
  }'
```

Save the department ID.

#### 3.4 Create Fire Personnel
```bash
curl -X POST http://localhost:5000/api/fire/personnel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kwame Mensah",
    "rank": "RANK_ID",
    "department": "DEPARTMENT_ID",
    "role": "ROLE_ID",
    "station": "Accra Central Fire Station",
    "region": "Greater Accra",
    "watchroom": "Watch A",
    "crew": "Crew 1"
  }'
```

### Step 4: Retrieve Data

```bash
# Get all personnel
curl -X GET http://localhost:5000/api/fire/personnel \
  -H "Authorization: Bearer $TOKEN"

# Get all ranks
curl -X GET http://localhost:5000/api/fire/ranks \
  -H "Authorization: Bearer $TOKEN"

# Get all departments
curl -X GET http://localhost:5000/api/fire/departments \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Complete Test Data Script

Use this bash script to populate all test data:

```bash
#!/bin/bash

# Set your token here
TOKEN="YOUR_TOKEN_HERE"
BASE_URL="http://localhost:5000/api/fire"

echo "Creating Ranks..."
RANK_CFO=$(curl -s -X POST $BASE_URL/ranks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Chief Fire Officer","initials":"CFO","level":10}' | jq -r '.data._id')

RANK_SO=$(curl -s -X POST $BASE_URL/ranks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Station Officer","initials":"SO","level":5}' | jq -r '.data._id')

echo "Ranks created: CFO=$RANK_CFO, SO=$RANK_SO"

echo "Creating Roles..."
ROLE_OPS=$(curl -s -X POST $BASE_URL/roles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Operations Officer","description":"Firefighting operations"}' | jq -r '.data._id')

echo "Role created: $ROLE_OPS"

echo "Creating Department..."
DEPT_OPS=$(curl -s -X POST $BASE_URL/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Operations","station":"Accra Central Fire Station"}' | jq -r '.data._id')

echo "Department created: $DEPT_OPS"

echo "Creating Personnel..."
curl -X POST $BASE_URL/personnel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\":\"Kwame Mensah\",
    \"rank\":\"$RANK_CFO\",
    \"department\":\"$DEPT_OPS\",
    \"role\":\"$ROLE_OPS\",
    \"station\":\"Accra Central Fire Station\",
    \"region\":\"Greater Accra\",
    \"watchroom\":\"Watch A\",
    \"crew\":\"Crew 1\"
  }"

echo "Done! Personnel created."
```

## 🔥 Test All Endpoints

### Personnel Endpoints
```bash
# Create
POST /api/fire/personnel

# Get all (with filters)
GET /api/fire/personnel?station=Accra Central Fire Station

# Get one
GET /api/fire/personnel/:id

# Update
PATCH /api/fire/personnel/:id

# Delete
DELETE /api/fire/personnel/:id
```

### Department Endpoints
```bash
POST /api/fire/departments
GET /api/fire/departments
GET /api/fire/departments/:id
PATCH /api/fire/departments/:id
DELETE /api/fire/departments/:id
```

### Rank Endpoints
```bash
POST /api/fire/ranks
GET /api/fire/ranks
GET /api/fire/ranks/:id
PATCH /api/fire/ranks/:id
DELETE /api/fire/ranks/:id
```

### Role Endpoints
```bash
POST /api/fire/roles
GET /api/fire/roles
GET /api/fire/roles/:id
PATCH /api/fire/roles/:id
DELETE /api/fire/roles/:id
```

## 🎯 Common Operations

### Filter Personnel by Department
```bash
curl "http://localhost:5000/api/fire/personnel?department=DEPT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Department with Subdivisions
```bash
curl "http://localhost:5000/api/fire/departments/DEPT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Update Personnel Information
```bash
curl -X PATCH "http://localhost:5000/api/fire/personnel/PERSON_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "station": "Kumasi Fire Station",
    "region": "Ashanti"
  }'
```

## ⚠️ Important Notes

1. **Authentication Required**: All Fire Service endpoints require JWT token
2. **Operations Department**: Must include `watchroom` and `crew` fields
3. **IDs Required**: Most operations need valid rank, role, and department IDs
4. **Order Matters**: Create ranks and roles before creating personnel

## 📊 Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Fire Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api/fire"
    },
    {
      "key": "token",
      "value": "YOUR_TOKEN_HERE"
    }
  ]
}
```

## 🐛 Troubleshooting

### "Access Denied" Error
- Make sure you're including the Bearer token in Authorization header
- Verify token hasn't expired (tokens expire after 24 hours)

### "All required fields must be provided"
- Check that all required fields are included in request
- For Operations department, include `watchroom` and `crew`

### "Invalid ObjectId"
- Ensure you're using valid MongoDB ObjectIds for references
- Double-check that ranks, roles, departments exist before creating personnel

## 📚 Next Steps

1. ✅ Test all CRUD operations
2. ✅ Import full test data from `FIRE_SERVICE_TEST_DATA.json`
3. ✅ Build frontend interface
4. ✅ Add search and reporting features
5. ✅ Deploy to production

## 🔗 Related Documentation

- [Complete API Documentation](./FIRE_SERVICE_README.md)
- [Test Data](./FIRE_SERVICE_TEST_DATA.json)
- [Auth API Documentation](./README.md)

---

**Ready to Go!** 🎉 Your Fire Service backend is fully functional.


