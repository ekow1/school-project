# Frontend Authentication Flow Implementation Guide

## 🎯 Complete 3-Step Authentication Flow

This guide provides the complete frontend implementation for the 3-step authentication process:
1. **Sign Up** → Create account (inactive)
2. **OTP Verification** → Activate account
3. **Login** → Access the app

## 🌐 Complete API Routes Reference

### **Base URL**
```
https://your-backend-domain.com/api
```

### **Authentication Routes**

#### **1. User Registration (Step 1)**
```bash
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "phone": "+233201234567",
  "email": "john@example.com",
  "password": "securePassword123",
  "address": "East Legon, Accra",
  "country": "Ghana",
  "dob": "1992-05-15",
  "image": "https://example.com/profile.jpg",
  "ghanaPost": "GA-184-1234"
}

Response (201):
{
  "message": "User created successfully. Please verify your phone number with the OTP sent.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+233201234567",
    "email": "john@example.com",
    "isPhoneVerified": false,
    "isActive": false
  },
  "otp_sent": {
    "phone_number": "233201234567",
    "expires_at": "2025-10-28T01:20:30.864Z"
  }
}
```

#### **2. Phone Verification (Step 2)**
```bash
POST /api/auth/verify-phone
Content-Type: application/json

Request Body:
{
  "phone": "+233201234567",
  "otp_code": "123456"
}

Response (200):
{
  "message": "Phone number verified successfully. You can now login.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+233201234567",
    "email": "john@example.com",
    "isPhoneVerified": true,
    "phoneVerifiedAt": "2025-10-28T01:15:45.123Z",
    "isActive": true
  }
}
```

#### **3. User Login (Step 3)**
```bash
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "phone": "+233201234567",
  "password": "securePassword123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+233201234567",
    "email": "john@example.com",
    "address": "East Legon, Accra",
    "country": "Ghana",
    "dob": "1992-05-15",
    "image": "https://example.com/profile.jpg",
    "ghanaPost": "GA-184-1234",
    "isPhoneVerified": true,
    "phoneVerifiedAt": "2025-10-28T01:15:45.123Z",
    "lastLoginAt": "2025-10-28T01:20:30.864Z"
  }
}
```

#### **4. Forgot Password**
```bash
POST /api/auth/forgot-password
Content-Type: application/json

Request Body:
{
  "phone": "+233201234567"
}

Response (200):
{
  "message": "Password reset OTP sent successfully",
  "phone_number": "233201234567",
  "expires_at": "2025-10-28T01:20:30.864Z"
}
```

#### **5. Reset Password**
```bash
POST /api/auth/reset-password
Content-Type: application/json

Request Body:
{
  "phone": "+233201234567",
  "otp_code": "123456",
  "new_password": "newSecurePassword123"
}

Response (200):
{
  "message": "Password reset successfully",
  "phone_number": "233201234567"
}
```

### **OTP Management Routes**

#### **6. Generate OTP**
```bash
POST /api/otp/generate
Content-Type: application/json

Request Body:
{
  "phone_number": "+233201234567",
  "purpose": "phone_verification",
  "expiry": 5,
  "length": 6,
  "message": "Your OTP code is %otp_code%. Valid for 5 minutes.",
  "sender_id": "Arkesel"
}

Response (200):
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone_number": "233201234567",
    "purpose": "phone_verification",
    "expires_at": "2025-10-28T01:20:30.864Z",
    "arkesel_response": {
      "code": "123456",
      "message": "OTP sent successfully"
    }
  }
}
```

#### **7. Verify OTP**
```bash
POST /api/otp/verify
Content-Type: application/json

Request Body:
{
  "phone_number": "+233201234567",
  "otp_code": "123456"
}

Response (200):
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "phone_number": "233201234567",
    "verified_at": "2025-10-28T01:15:45.123Z",
    "arkesel_response": {
      "status": "success",
      "message": "OTP verified"
    }
  }
}
```

#### **8. Resend OTP**
```bash
POST /api/otp/resend
Content-Type: application/json

Request Body:
{
  "phone_number": "+233201234567",
  "purpose": "phone_verification"
}

Response (200):
{
  "success": true,
  "message": "OTP resent successfully",
  "data": {
    "phone_number": "233201234567",
    "purpose": "phone_verification",
    "expires_at": "2025-10-28T01:20:30.864Z"
  }
}
```

#### **9. Get OTP Status**
```bash
GET /api/otp/status/233201234567

Response (200):
{
  "success": true,
  "data": {
    "phone_number": "233201234567",
    "purpose": "phone_verification",
    "is_verified": false,
    "is_expired": false,
    "is_valid": true,
    "attempts": 0,
    "created_at": "2025-10-28T01:15:30.864Z",
    "expires_at": "2025-10-28T01:20:30.864Z"
  }
}
```

#### **10. Check Service Status**
```bash
GET /api/otp/service-status

Response (200):
{
  "success": true,
  "data": {
    "service": "Arkesel OTP",
    "status": "available",
    "checked_at": "2025-10-28T01:20:30.864Z"
  }
}
```

### **Profile Management Routes (Protected)**

#### **11. Get User Profile**
```bash
GET /api/profile
Authorization: Bearer <jwt_token>

Response (200):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+233201234567",
    "email": "john@example.com",
    "address": "East Legon, Accra",
    "country": "Ghana",
    "dob": "1992-05-15",
    "image": "https://example.com/profile.jpg",
    "ghanaPost": "GA-184-1234",
    "isPhoneVerified": true,
    "phoneVerifiedAt": "2025-10-28T01:15:45.123Z",
    "lastLoginAt": "2025-10-28T01:20:30.864Z"
  }
}
```

#### **12. Update User Profile**
```bash
PATCH /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

Request Body:
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "address": "New Address, Accra",
  "image": "https://example.com/new-profile.jpg"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "phone": "+233201234567",
    "email": "johnsmith@example.com",
    "address": "New Address, Accra",
    "country": "Ghana",
    "dob": "1992-05-15",
    "image": "https://example.com/new-profile.jpg",
    "ghanaPost": "GA-184-1234",
    "isPhoneVerified": true,
    "phoneVerifiedAt": "2025-10-28T01:15:45.123Z",
    "lastLoginAt": "2025-10-28T01:20:30.864Z"
  }
}
```

#### **13. Delete User Profile**
```bash
DELETE /api/profile
Authorization: Bearer <jwt_token>

Response (200):
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

### **Fire Service Management Routes (Protected)**

#### **14. Station Management**
```bash
# Get all stations
GET /api/fire/stations
Authorization: Bearer <jwt_token>

# Get station by ID
GET /api/fire/stations/:id
Authorization: Bearer <jwt_token>

# Create station
POST /api/fire/stations
Authorization: Bearer <jwt_token>
Content-Type: application/json

# Update station
PUT /api/fire/stations/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

# Delete station
DELETE /api/fire/stations/:id
Authorization: Bearer <jwt_token>

# Bulk create stations
POST /api/fire/stations/bulk
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### **15. Personnel Management**
```bash
# Get all personnel
GET /api/fire/personnel
Authorization: Bearer <jwt_token>

# Get personnel by ID
GET /api/fire/personnel/:id
Authorization: Bearer <jwt_token>

# Create personnel
POST /api/fire/personnel
Authorization: Bearer <jwt_token>
Content-Type: application/json

# Update personnel
PUT /api/fire/personnel/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

# Delete personnel
DELETE /api/fire/personnel/:id
Authorization: Bearer <jwt_token>
```

### **Error Response Format**

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### **Common HTTP Status Codes**

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (invalid credentials)
- **403** - Forbidden (account not active)
- **404** - Not Found
- **500** - Internal Server Error

## 📱 React Native Implementation

### **1. Authentication Context**

```javascript
// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStep, setAuthStep] = useState('register'); // 'register', 'otp', 'login'

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData, token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setAuthStep('register');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    authStep,
    setAuthStep,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### **2. Complete API Service**

```javascript
// apiService.js
const API_BASE_URL = 'https://your-backend-url.com/api';

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ===== AUTHENTICATION ROUTES =====

  // Step 1: Register
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Step 2: Verify OTP
  async verifyOTP(phone, otpCode) {
    return this.request('/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify({ phone, otp_code: otpCode }),
    });
  }

  // Step 3: Login
  async login(phone, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  }

  // Forgot Password
  async forgotPassword(phone) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  // Reset Password
  async resetPassword(phone, otpCode, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ phone, otp_code: otpCode, new_password: newPassword }),
    });
  }

  // ===== OTP MANAGEMENT ROUTES =====

  // Generate OTP
  async generateOTP(phoneNumber, purpose = 'phone_verification', options = {}) {
    return this.request('/otp/generate', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        purpose,
        expiry: 5,
        length: 6,
        message: 'Your OTP code is %otp_code%. Valid for 5 minutes.',
        sender_id: 'Arkesel',
        ...options,
      }),
    });
  }

  // Verify OTP
  async verifyOTPCode(phoneNumber, otpCode) {
    return this.request('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode }),
    });
  }

  // Resend OTP
  async resendOTP(phoneNumber, purpose = 'phone_verification') {
    return this.request('/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, purpose }),
    });
  }

  // Get OTP Status
  async getOTPStatus(phoneNumber) {
    return this.request(`/otp/status/${phoneNumber}`, {
      method: 'GET',
    });
  }

  // Check Service Status
  async checkServiceStatus() {
    return this.request('/otp/service-status', {
      method: 'GET',
    });
  }

  // ===== PROFILE MANAGEMENT ROUTES =====

  // Get User Profile
  async getProfile() {
    return this.request('/profile', {
      method: 'GET',
    });
  }

  // Update User Profile
  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Delete User Profile
  async deleteProfile() {
    return this.request('/profile', {
      method: 'DELETE',
    });
  }

  // ===== FIRE SERVICE MANAGEMENT ROUTES =====

  // Station Management
  async getStations(region = null) {
    const endpoint = region ? `/fire/stations?region=${region}` : '/fire/stations';
    return this.request(endpoint, { method: 'GET' });
  }

  async getStationById(id) {
    return this.request(`/fire/stations/${id}`, { method: 'GET' });
  }

  async createStation(stationData) {
    return this.request('/fire/stations', {
      method: 'POST',
      body: JSON.stringify(stationData),
    });
  }

  async updateStation(id, stationData) {
    return this.request(`/fire/stations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stationData),
    });
  }

  async deleteStation(id) {
    return this.request(`/fire/stations/${id}`, { method: 'DELETE' });
  }

  async bulkCreateStations(stationsArray) {
    return this.request('/fire/stations/bulk', {
      method: 'POST',
      body: JSON.stringify({ stations: stationsArray }),
    });
  }

  // Personnel Management
  async getPersonnel(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/fire/personnel?${queryParams}` : '/fire/personnel';
    return this.request(endpoint, { method: 'GET' });
  }

  async getPersonnelById(id) {
    return this.request(`/fire/personnel/${id}`, { method: 'GET' });
  }

  async createPersonnel(personnelData) {
    return this.request('/fire/personnel', {
      method: 'POST',
      body: JSON.stringify(personnelData),
    });
  }

  async updatePersonnel(id, personnelData) {
    return this.request(`/fire/personnel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(personnelData),
    });
  }

  async deletePersonnel(id) {
    return this.request(`/fire/personnel/${id}`, { method: 'DELETE' });
  }

  async getPersonnelByStation(stationId) {
    return this.request(`/fire/personnel/station/${stationId}`, { method: 'GET' });
  }

  async getPersonnelByDepartment(departmentId) {
    return this.request(`/fire/personnel/department/${departmentId}`, { method: 'GET' });
  }

  async getPersonnelBySubdivision(subdivisionId) {
    return this.request(`/fire/personnel/subdivision/${subdivisionId}`, { method: 'GET' });
  }

  // Department Management
  async getDepartments(stationId = null) {
    const endpoint = stationId ? `/fire/departments/station/${stationId}` : '/fire/departments';
    return this.request(endpoint, { method: 'GET' });
  }

  async getDepartmentById(id) {
    return this.request(`/fire/departments/${id}`, { method: 'GET' });
  }

  async createDepartment(departmentData) {
    return this.request('/fire/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  }

  async updateDepartment(id, departmentData) {
    return this.request(`/fire/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData),
    });
  }

  async deleteDepartment(id) {
    return this.request(`/fire/departments/${id}`, { method: 'DELETE' });
  }

  // Subdivision Management
  async getSubdivisions(departmentId = null) {
    const endpoint = departmentId ? `/fire/subdivisions/department/${departmentId}` : '/fire/subdivisions';
    return this.request(endpoint, { method: 'GET' });
  }

  async getSubdivisionById(id) {
    return this.request(`/fire/subdivisions/${id}`, { method: 'GET' });
  }

  async createSubdivision(subdivisionData) {
    return this.request('/fire/subdivisions', {
      method: 'POST',
      body: JSON.stringify(subdivisionData),
    });
  }

  async updateSubdivision(id, subdivisionData) {
    return this.request(`/fire/subdivisions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subdivisionData),
    });
  }

  async deleteSubdivision(id) {
    return this.request(`/fire/subdivisions/${id}`, { method: 'DELETE' });
  }

  // Role Management
  async getRoles() {
    return this.request('/fire/roles', { method: 'GET' });
  }

  async getRoleById(id) {
    return this.request(`/fire/roles/${id}`, { method: 'GET' });
  }

  async createRole(roleData) {
    return this.request('/fire/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  async updateRole(id, roleData) {
    return this.request(`/fire/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async deleteRole(id) {
    return this.request(`/fire/roles/${id}`, { method: 'DELETE' });
  }

  // Rank Management
  async getRanks() {
    return this.request('/fire/ranks', { method: 'GET' });
  }

  async getRankById(id) {
    return this.request(`/fire/ranks/${id}`, { method: 'GET' });
  }

  async createRank(rankData) {
    return this.request('/fire/ranks', {
      method: 'POST',
      body: JSON.stringify(rankData),
    });
  }

  async updateRank(id, rankData) {
    return this.request(`/fire/ranks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rankData),
    });
  }

  async deleteRank(id) {
    return this.request(`/fire/ranks/${id}`, { method: 'DELETE' });
  }

  // Super Admin Management
  async registerSuperAdmin(superAdminData) {
    return this.request('/fire/superadmin/register', {
      method: 'POST',
      body: JSON.stringify(superAdminData),
    });
  }

  async loginSuperAdmin(username, password) {
    return this.request('/fire/superadmin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getSuperAdmins() {
    return this.request('/fire/superadmin', { method: 'GET' });
  }

  async getSuperAdminById(id) {
    return this.request(`/fire/superadmin/${id}`, { method: 'GET' });
  }

  async updateSuperAdmin(id, superAdminData) {
    return this.request(`/fire/superadmin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(superAdminData),
    });
  }

  async deleteSuperAdmin(id) {
    return this.request(`/fire/superadmin/${id}`, { method: 'DELETE' });
  }

  async changeSuperAdminPassword(id, oldPassword, newPassword) {
    return this.request(`/fire/superadmin/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }
}

export default new ApiService();
```

### **3. Step 1: Registration Screen**

```javascript
// RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useAuth } from './AuthContext';
import ApiService from './apiService';

const RegisterScreen = () => {
  const { setAuthStep } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    country: 'Ghana',
    dob: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    if (!formData.password) {
      Alert.alert('Error', 'Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      const response = await ApiService.register(userData);
      
      Alert.alert(
        'Success',
        'Account created successfully! Please verify your phone number.',
        [
          {
            text: 'OK',
            onPress: () => {
              setAuthStep('otp');
              // Store phone for OTP verification
              AsyncStorage.setItem('pendingPhone', formData.phone);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number (+233201234567)"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email (Optional)"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Address (Optional)"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setAuthStep('login')}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default RegisterScreen;
```

### **4. Step 2: OTP Verification Screen**

```javascript
// OTPScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import ApiService from './apiService';

const OTPScreen = () => {
  const { setAuthStep } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    loadPendingPhone();
    startResendTimer();
  }, []);

  const loadPendingPhone = async () => {
    try {
      const pendingPhone = await AsyncStorage.getItem('pendingPhone');
      if (pendingPhone) {
        setPhone(pendingPhone);
      }
    } catch (error) {
      console.error('Error loading phone:', error);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60); // 60 seconds cooldown
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete OTP code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.verifyOTP(phone, otpCode);
      
      Alert.alert(
        'Success',
        'Phone number verified successfully! You can now login.',
        [
          {
            text: 'OK',
            onPress: () => {
              setAuthStep('login');
              AsyncStorage.removeItem('pendingPhone');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
      // Reset OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      await ApiService.resendOTP(phone);
      Alert.alert('Success', 'OTP sent successfully!');
      startResendTimer();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phone}
        </Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.resendButton, resendTimer > 0 && styles.resendDisabled]}
          onPress={handleResendOTP}
          disabled={resendTimer > 0 || isLoading}
        >
          <Text style={styles.resendText}>
            {resendTimer > 0 
              ? `Resend OTP in ${resendTimer}s` 
              : 'Resend OTP'
            }
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setAuthStep('register')}
        >
          <Text style={styles.backText}>← Back to Registration</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 16,
  },
});

export default OTPScreen;
```

### **5. Step 3: Login Screen**

```javascript
// LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useAuth } from './AuthContext';
import ApiService from './apiService';

const LoginScreen = () => {
  const { login, setAuthStep } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.phone.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.login(formData.phone, formData.password);
      
      // Store user data and token
      await login(response.user, response.token);
      
      Alert.alert('Success', 'Login successful!');
    } catch (error) {
      if (error.message.includes('not active')) {
        Alert.alert(
          'Account Not Active',
          'Please verify your phone number first.',
          [
            {
              text: 'Verify Phone',
              onPress: () => {
                setAuthStep('otp');
                // Store phone for OTP verification
                AsyncStorage.setItem('pendingPhone', formData.phone);
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Login Failed', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.prompt(
      'Forgot Password',
      'Enter your phone number to reset password',
      async (phone) => {
        if (phone) {
          try {
            await ApiService.forgotPassword(phone);
            Alert.alert('Success', 'Password reset OTP sent to your phone');
            // Navigate to password reset screen
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        }
      }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setAuthStep('register')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default LoginScreen;
```

### **6. Main Authentication Navigator**

```javascript
// AuthNavigator.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';
import RegisterScreen from './RegisterScreen';
import OTPScreen from './OTPScreen';
import LoginScreen from './LoginScreen';

const AuthNavigator = () => {
  const { isLoading, authStep } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  switch (authStep) {
    case 'register':
      return <RegisterScreen />;
    case 'otp':
      return <OTPScreen />;
    case 'login':
      return <LoginScreen />;
    default:
      return <RegisterScreen />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default AuthNavigator;
```

### **7. App.js Integration**

```javascript
// App.js
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import AuthNavigator from './AuthNavigator';
import MainApp from './MainApp'; // Your main app component

const AppContent = () => {
  const { user, token } = useAuth();

  if (token && user) {
    return <MainApp />;
  }

  return <AuthNavigator />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
```

## 🔄 Complete Flow Summary

### **Step 1: Registration**
1. User fills registration form
2. Call `POST /api/auth/register`
3. Account created (inactive)
4. OTP automatically sent
5. Navigate to OTP screen

### **Step 2: OTP Verification**
1. User enters 6-digit OTP
2. Call `POST /api/auth/verify-phone`
3. Account activated
4. Navigate to login screen

### **Step 3: Login**
1. User enters phone and password
2. Call `POST /api/auth/login`
3. JWT token received
4. Navigate to main app

## 🛡️ Error Handling

- **403 Forbidden**: Account not active → Redirect to OTP verification
- **401 Unauthorized**: Invalid credentials → Show error message
- **404 Not Found**: User doesn't exist → Show error message
- **500 Server Error**: Network issues → Show error message

## 📱 Key Features

- ✅ **Persistent Storage**: User stays logged in
- ✅ **Auto-focus**: OTP inputs auto-focus next field
- ✅ **Resend Timer**: 60-second cooldown for OTP resend
- ✅ **Form Validation**: Client-side validation
- ✅ **Loading States**: Visual feedback during API calls
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Navigation Flow**: Smooth transitions between steps

This implementation provides a complete, production-ready authentication flow for your React Native app! 🚀
