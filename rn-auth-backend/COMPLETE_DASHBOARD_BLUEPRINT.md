# 🔥 Ghana National Fire Service - Complete Dashboard Blueprint

## 📋 Overview
A comprehensive admin dashboard utilizing ALL backend models from your GNFS system, providing complete management capabilities for the entire fire service operation.

---

## 🏗️ Complete System Architecture

### **Backend Models Integration**
```typescript
// All Models Used in Dashboard
interface DashboardModels {
  // Core Models
  User: UserModel;                    // Citizens reporting incidents
  FireReport: FireReportModel;        // Incident reports
  Station: StationModel;              // Fire stations
  
  // Organizational Models
  Department: DepartmentModel;        // Station departments
  Subdivision: SubdivisionModel;      // Department subdivisions
  FirePersonnel: FirePersonnelModel;  // Fire service personnel
  Rank: RankModel;                    // Personnel ranks
  Role: RoleModel;                    // Personnel roles
  
  // Administrative Models
  SuperAdmin: SuperAdminModel;        // System administrators
  OTP: OTPModel;                      // Phone verification
}
```

---

## 🎯 Complete Dashboard Layout

### **Main Navigation Structure**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS Admin Dashboard                                    👤 Admin User ▼  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 Dashboard │ 🚨 Reports │ 🏢 Stations │ 👥 Personnel │ 🏛️ Organization │ 📈 Analytics │ ⚙️ Admin │ 🔐 OTP │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Dashboard Overview Section

### **Key Metrics Dashboard**
```typescript
interface DashboardMetrics {
  // System Overview
  totalStations: number;
  totalPersonnel: number;
  totalDepartments: number;
  totalSubdivisions: number;
  
  // Incident Metrics
  activeReports: number;
  pendingReports: number;
  resolvedToday: number;
  averageResponseTime: number;
  
  // Personnel Metrics
  activePersonnel: number;
  personnelByRank: { rank: string; count: number }[];
  personnelByRole: { role: string; count: number }[];
  
  // Station Performance
  stationPerformance: {
    stationId: string;
    stationName: string;
    responseTime: number;
    activeReports: number;
    personnelCount: number;
  }[];
  
  // Recent Activity
  recentReports: FireReport[];
  recentPersonnelChanges: FirePersonnel[];
  systemAlerts: SystemAlert[];
}
```

### **Dashboard Cards Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 GNFS System Overview                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ Stations│ │Personnel│ │Reports  │ │Dept.    │ │Subdiv.  │ │Response│    │
│ │   25    │ │   150   │ │   12    │ │   45    │ │   120   │ │ 4.2min │    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                    📈 System Performance Trends                        │ │
│ │  [Multi-line chart: Reports, Response Time, Personnel Activity]        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────────┐ │
│ │ 🚨 Recent       │ │ 👥 Personnel    │ │ 🏢 Station Performance          │ │
│ │    Reports      │ │    Activity     │ │  [Bar chart by station]         │ │
│ │ • Fire - Accra  │ │ • New Assignment│ │                                 │ │
│ │ • Rescue - Kumasi│ │ • Rank Change   │ │                                 │ │
│ │ • Medical - Tamale│ │ • Station Transfer│ │                                 │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 Fire Reports Management (Cards Layout)

### **Fire Report Card with Complete Data**
```typescript
interface FireReportCardData {
  // Basic Incident Info
  _id: string;
  incidentType: string;
  incidentName: string;
  description?: string;
  
  // Location Details
  location: {
    coordinates: { latitude: number; longitude: number };
    locationUrl?: string;
    locationName?: string;
  };
  
  // Station Assignment (Populated)
  station: {
    _id: string;
    name: string;
    call_sign?: string;
    location: string;
    region?: string;
    phone_number?: string;
  };
  
  // Reporter Info (Populated)
  userId: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  
  // Status & Priority
  status: 'pending' | 'responding' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  
  // Timing
  reportedAt: string;
  responseTime?: number;
  resolvedAt?: string;
  
  // Impact Assessment
  estimatedCasualties: number;
  estimatedDamage: 'minimal' | 'moderate' | 'severe' | 'extensive';
  
  // Personnel Assignment (Populated)
  assignedPersonnel: {
    _id: string;
    name: string;
    rank: { name: string; initials: string };
    role: { name: string; description?: string };
    station: string;
  }[];
  
  // Additional Info
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### **Enhanced Fire Report Card Design**
```
┌─────────────────────────────────────────────────────────────┐
│ 🚨 Fire Reports Management                                 │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search: [________________] 📅 Date: [____] 🏢 Station: [▼] │
│ Status: [All ▼] Priority: [All ▼] Type: [All ▼] Personnel: [▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔥 HIGH PRIORITY                    ⏸️ PENDING          │ │
│ │ Building Fire - Central Market                        │ │
│ │                                                         │ │
│ │ 📍 Central Market, Accra                              │ │
│ │ 🏢 Ghana Fire Service Station - Madina (GF-001)        │ │
│ │ 👤 John Doe (+233201234567)                           │ │
│ │                                                         │ │
│ │ ⏰ Reported: 2 minutes ago                             │ │
│ │ 🚨 Estimated: 0 casualties, minimal damage             │ │
│ │                                                         │ │
│ │ 👥 Assigned Personnel:                                │ │
│ │ • Chief Fire Officer (CFO) - Station Commander        │ │
│ │ • Senior Fire Officer (SFO) - Rescue Specialist       │ │
│ │                                                         │ │
│ │ [Respond] [Assign More] [View Details] [Add Notes]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🚑 MEDIUM PRIORITY                   🔄 RESPONDING     │ │
│ │ Car Accident - Ring Road                               │ │
│ │                                                         │ │
│ │ 📍 Ring Road, Kumasi                                   │ │
│ │ 🏢 Ghana Fire Service Station - Kumasi (GF-002)        │ │
│ │ 👤 Jane Smith (+233209876543)                          │ │
│ │                                                         │ │
│ │ ⏰ Reported: 15 minutes ago                             │ │
│ │ ⚡ Response Time: 4.2 minutes                         │ │
│ │ 🚨 Estimated: 2 casualties, moderate damage            │ │
│ │                                                         │ │
│ │ 👥 Assigned Personnel:                                │ │
│ │ • Fire Officer (FO) - Emergency Response               │ │
│ │ • Leading Firefighter (LFF) - Medical Aid              │ │
│ │                                                         │ │
│ │ [Update Status] [Add Personnel] [View Details] [Notes] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 📄 Page 1 of 5  [◀ Previous] [Next ▶]                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏢 Stations Management (Table Layout)

### **Complete Station Table with All Data**
```typescript
interface StationTableData {
  // Basic Station Info
  _id: string;
  name: string;
  call_sign?: string;
  location: string;
  region?: string;
  
  // Contact & Location
  phone_number?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  location_url?: string;
  
  // Organizational Structure (Populated)
  departments: {
    _id: string;
    name: string;
    description?: string;
    subdivisions: {
      _id: string;
      name: string;
      color: string;
    }[];
  }[];
  
  // Personnel (Populated)
  personnel: {
    _id: string;
    name: string;
    rank: { name: string; initials: string; level: number };
    role: { name: string; description?: string };
    department: { name: string };
    subdivision: { name: string; color: string };
  }[];
  
  // Performance Metrics
  activeReportsCount: number;
  averageResponseTime: number;
  personnelCount: number;
  departmentCount: number;
  subdivisionCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### **Enhanced Station Table Design**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏢 Stations Management                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ [+ Add Station] 🔍 Search: [________________] 📊 Export [▼] 🗺️ Map View [▼] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Station Name │ Call Sign │ Location │ Region │ Personnel │ Departments │ │
│ │ Phone │ Response Time │ Reports │ Actions │                           │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Ghana Fire    │ GF-001    │ Madina   │ Greater│ 15 (3 dept)│ 3 dept     │ │
│ │ Service       │           │          │ Accra  │           │            │ │
│ │ Station -     │           │          │        │           │            │ │
│ │ Madina        │           │          │        │           │            │ │
│ │               │           │          │        │           │            │ │
│ │ +233302123456 │ 4.2 min   │ 3 active │ [Edit] │           │            │ │
│ │               │           │          │ [View] │           │            │ │
│ │               │           │          │ [Delete] │         │            │ │
│ │               │           │          │ [Manage] │         │            │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Ghana Fire    │ GF-002    │ Kumasi   │ Ashanti│ 12 (2 dept)│ 2 dept     │ │
│ │ Service       │           │          │        │           │            │ │
│ │ Station -     │           │          │        │           │            │ │
│ │ Kumasi        │           │          │        │           │            │ │
│ │               │          │          │        │           │            │ │
│ │ +233322123456 │ 5.1 min   │ 2 active │ [Edit] │           │            │ │
│ │               │           │          │ [View] │           │            │ │
│ │               │           │          │ [Delete] │         │            │ │
│ │               │           │          │ [Manage] │         │            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 📄 Showing 1-10 of 25 stations                                             │
│ [◀ Previous] [Next ▶]                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 Personnel Management (Hybrid Layout)

### **Personnel Directory with Complete Data**
```typescript
interface PersonnelData {
  // Basic Info
  _id: string;
  name: string;
  
  // Organizational Assignment (Populated)
  rank: {
    _id: string;
    name: string;
    initials: string;
    level: number;
  };
  role: {
    _id: string;
    name: string;
    description?: string;
  };
  department: {
    _id: string;
    name: string;
    description?: string;
    station: {
      _id: string;
      name: string;
      call_sign?: string;
      location: string;
      region?: string;
    };
  };
  subdivision: {
    _id: string;
    name: string;
    color: string;
  };
  
  // Station Assignment
  station_id: {
    _id: string;
    name: string;
    call_sign?: string;
    location: string;
    region?: string;
  };
  station: string; // Legacy field
  region: string;  // Legacy field
  
  // Operations Specific
  watchroom?: string;
  crew?: string;
  
  // Performance Metrics
  assignedReportsCount: number;
  averageResponseTime: number;
  lastActivity: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### **Personnel Management Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👥 Personnel Management                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ [+ Add Personnel] 🔍 Search: [________________] 📊 Export [▼] 🏢 Filter [▼] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Personnel Directory                                                     │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Name │ Rank │ Role │ Station │ Department │ Subdivision │ Actions │     │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ John │ CFO  │ Station│ Madina │ Operations │ Emergency   │ [Edit] │     │ │
│ │ Doe  │      │ Cmdr  │        │            │ Response    │ [View] │     │ │
│ │      │      │       │        │            │             │ [Transfer] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Jane │ SFO  │ Rescue│ Kumasi │ Rescue     │ Water       │ [Edit] │     │ │
│ │ Smith│      │ Spec  │        │            │ Rescue      │ [View] │     │ │
│ │      │      │       │        │            │             │ [Transfer] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Personnel Performance                                                   │ │
│ │ [Chart showing personnel by rank, role, station, and performance]       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 📄 Showing 1-20 of 150 personnel                                           │
│ [◀ Previous] [Next ▶]                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Organization Management

### **Department & Subdivision Management**
```typescript
interface OrganizationData {
  // Departments
  departments: {
    _id: string;
    name: string;
    description?: string;
    station_id: {
      _id: string;
      name: string;
      call_sign?: string;
      location: string;
    };
    subdivisions: {
      _id: string;
      name: string;
      color: string;
    }[];
    personnelCount: number;
    createdAt: string;
    updatedAt: string;
  }[];
  
  // Subdivisions
  subdivisions: {
    _id: string;
    name: string;
    color: string;
    department: {
      _id: string;
      name: string;
      station: {
        _id: string;
        name: string;
        location: string;
      };
    };
    personnelCount: number;
    createdAt: string;
    updatedAt: string;
  }[];
  
  // Ranks
  ranks: {
    _id: string;
    name: string;
    initials: string;
    level: number;
    personnelCount: number;
  }[];
  
  // Roles
  roles: {
    _id: string;
    name: string;
    description?: string;
    personnelCount: number;
  }[];
}
```

### **Organization Management Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏛️ Organization Management                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Departments] [Subdivisions] [Ranks] [Roles]                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Departments Management                                                  │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Department │ Station │ Subdivisions │ Personnel │ Actions │             │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Operations │ Madina  │ 3 subdivisions│ 15 personnel│ [Edit] │         │ │
│ │            │ Station │ • Emergency   │            │ [View] │         │ │
│ │            │         │ • Fire        │            │ [Delete] │       │ │
│ │            │         │ • Medical    │            │         │         │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Rescue     │ Kumasi  │ 2 subdivisions│ 12 personnel│ [Edit] │         │ │
│ │            │ Station │ • Water       │            │ [View] │         │ │
│ │            │         │ • Land        │            │ [Delete] │       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Ranks & Roles Overview                                                  │ │
│ │ [Chart showing personnel distribution by rank and role]                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📈 Analytics & Reporting

### **Comprehensive Analytics Dashboard**
```typescript
interface AnalyticsData {
  // Performance Metrics
  responseTimeAnalytics: {
    average: number;
    byStation: { station: string; time: number }[];
    byTimeOfDay: { hour: number; time: number }[];
    trends: { date: string; time: number }[];
  };
  
  // Incident Analytics
  incidentAnalytics: {
    byType: { type: string; count: number }[];
    byPriority: { priority: string; count: number }[];
    byStation: { station: string; count: number }[];
    byRegion: { region: string; count: number }[];
    trends: { date: string; count: number }[];
  };
  
  // Personnel Analytics
  personnelAnalytics: {
    byRank: { rank: string; count: number }[];
    byRole: { role: string; count: number }[];
    byStation: { station: string; count: number }[];
    byDepartment: { department: string; count: number }[];
    performance: { personnel: string; reports: number; avgTime: number }[];
  };
  
  // Station Analytics
  stationAnalytics: {
    performance: { station: string; responseTime: number; reports: number }[];
    capacity: { station: string; personnel: number; departments: number }[];
    coverage: { region: string; stations: number; coverage: number }[];
  };
  
  // System Analytics
  systemAnalytics: {
    userActivity: { date: string; users: number; reports: number }[];
    otpUsage: { date: string; sent: number; verified: number }[];
    adminActivity: { admin: string; actions: number; lastActive: string }[];
  };
}
```

### **Analytics Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📈 Analytics & Reporting                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Performance] [Incidents] [Personnel] [Stations] [System] [Custom]        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Performance Analytics                                                   │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Response Time Trends                    Station Performance              │ │
│ │ [Line chart: Avg response time over time] [Bar chart: By station]       │ │
│ │                                                                         │ │
│ │ Peak Hours Analysis                     Regional Coverage                │ │
│ │ [Heat map: Response time by hour]      [Map: Station coverage]          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Incident Analytics                                                      │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Incident Types                          Priority Distribution            │ │
│ │ [Pie chart: Fire, Rescue, Medical, Other] [Donut chart: High, Med, Low] │ │
│ │                                                                         │ │
│ │ Monthly Trends                          Geographic Distribution          │ │
│ │ [Area chart: Incidents over time]      [Map: Incidents by region]       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Personnel Analytics                                                     │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Rank Distribution                       Role Distribution                 │ │
│ │ [Bar chart: Personnel by rank]         [Bar chart: Personnel by role]    │ │
│ │                                                                         │ │
│ │ Station Assignment                     Performance Metrics                │ │
│ │ [Stacked bar: Personnel by station]    [Scatter plot: Reports vs Time]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ System Administration

### **Complete Admin Management**
```typescript
interface AdminData {
  // Super Admin Management
  superAdmins: {
    _id: string;
    username: string;
    name: string;
    email: string;
    managedDepartments: {
      _id: string;
      name: string;
      station: string;
    }[];
    managedStations: string[];
    isActive: boolean;
    lastLogin: string;
    createdAt: string;
  }[];
  
  // User Management
  users: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    isPhoneVerified: boolean;
    isActive: boolean;
    lastLoginAt?: string;
    reportsCount: number;
    createdAt: string;
  }[];
  
  // System Configuration
  systemConfig: {
    otpSettings: {
      expiryMinutes: number;
      maxAttempts: number;
      senderId: string;
    };
    notificationSettings: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      pushNotifications: boolean;
    };
    securitySettings: {
      sessionTimeout: number;
      passwordPolicy: string;
      twoFactorAuth: boolean;
    };
  };
  
  // Audit Logs
  auditLogs: {
    _id: string;
    user: string;
    action: string;
    resource: string;
    timestamp: string;
    ipAddress: string;
    userAgent: string;
  }[];
}
```

### **Admin Management Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚙️ System Administration                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Super Admins] [Users] [System Config] [Audit Logs] [Security]            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Super Admin Management                                                  │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Username │ Name │ Email │ Managed │ Last Login │ Status │ Actions │     │ │
│ │          │      │       │ Stations│            │        │         │     │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ admin1   │ John │ john@ │ 5 stations│ 2 hours ago│ Active │ [Edit] │   │ │
│ │          │ Doe  │ gnfs  │          │            │        │ [View] │   │ │
│ │          │      │ .gov  │          │            │        │ [Deactivate] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ admin2   │ Jane │ jane@ │ 3 stations│ 1 day ago │ Active │ [Edit] │   │ │
│ │          │ Smith│ gnfs  │          │            │        │ [View] │   │ │
│ │          │      │ .gov  │          │            │        │ [Deactivate] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ System Configuration                                                    │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ OTP Settings                    Notification Settings                   │ │
│ │ • Expiry: 10 minutes            • Email: ✅ Enabled                     │ │
│ │ • Max Attempts: 5               • SMS: ✅ Enabled                       │ │
│ │ • Sender ID: GNFS                • Push: ❌ Disabled                     │ │
│ │                                                                         │ │
│ │ Security Settings                Performance Settings                   │ │
│ │ • Session Timeout: 24 hours      • Cache TTL: 1 hour                    │ │
│ │ • Password Policy: Strong        • Rate Limiting: 100 req/min           │ │
│ │ • 2FA: ❌ Disabled               • Log Retention: 90 days               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 OTP Management

### **OTP System Management**
```typescript
interface OTPData {
  // Active OTPs
  activeOTPs: {
    _id: string;
    phone_number: string;
    otp_code: string;
    expiry_time: string;
    is_verified: boolean;
    attempts: number;
    purpose: 'registration' | 'login' | 'password_reset' | 'phone_verification';
    arkesel_response?: any;
    createdAt: string;
  }[];
  
  // OTP Statistics
  otpStats: {
    totalSent: number;
    totalVerified: number;
    verificationRate: number;
    byPurpose: { purpose: string; count: number }[];
    byHour: { hour: number; count: number }[];
    failedAttempts: number;
    expiredOTPs: number;
  };
  
  // Arkesel Integration
  arkeselStats: {
    totalSent: number;
    successful: number;
    failed: number;
    pending: number;
    lastSync: string;
    balance?: number;
  };
}
```

### **OTP Management Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔐 OTP Management                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Active OTPs] [Statistics] [Arkesel Integration] [Settings]               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Active OTPs                                                             │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Phone Number │ OTP Code │ Purpose │ Expires │ Attempts │ Status │ Actions│ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ +233201234567│ 123456   │ Registration│ 5 min │ 0/5 │ Pending │ [View] │ │
│ │ +233209876543│ 789012   │ Password Reset│ 3 min │ 2/5 │ Pending │ [View] │ │
│ │ +233245678901│ 345678   │ Phone Verify│ 7 min │ 1/5 │ Pending │ [View] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ OTP Statistics                                                          │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Total Sent: 1,250    Verified: 1,100    Rate: 88%    Failed: 150      │ │
│ │                                                                         │ │
│ │ By Purpose                    By Hour                                   │ │
│ │ [Bar chart: Registration, Login, etc.] [Line chart: OTPs by hour]      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Arkesel Integration                                                    │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Status: ✅ Connected    Balance: ₵500.00    Last Sync: 2 min ago       │ │
│ │                                                                         │ │
│ │ Recent Activity                         Performance                      │ │
│ │ [List of recent SMS sends]              [Success rate chart]            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Complete API Integration

### **All API Endpoints Integration**
```typescript
// Complete API Service
export const gnfsApi = createApi({
  reducerPath: 'gnfsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'FireReport', 'Station', 'FirePersonnel', 'Department', 
    'Subdivision', 'Rank', 'Role', 'SuperAdmin', 'User', 'OTP'
  ],
  endpoints: (builder) => ({
    // Dashboard Overview
    getDashboardMetrics: builder.query<DashboardMetrics, void>({
      query: () => '/dashboard/metrics',
    }),
    
    // Fire Reports
    getFireReports: builder.query<FireReportCardData[], ReportFilters>({
      query: (filters) => ({
        url: '/fire/reports',
        params: filters,
      }),
      providesTags: ['FireReport'],
    }),
    
    // Stations
    getStations: builder.query<StationTableData[], StationFilters>({
      query: (filters) => ({
        url: '/fire/stations',
        params: filters,
      }),
      providesTags: ['Station'],
    }),
    
    // Personnel
    getPersonnel: builder.query<PersonnelData[], PersonnelFilters>({
      query: (filters) => ({
        url: '/fire/personnel',
        params: filters,
      }),
      providesTags: ['FirePersonnel'],
    }),
    
    // Departments
    getDepartments: builder.query<DepartmentData[], DepartmentFilters>({
      query: (filters) => ({
        url: '/fire/departments',
        params: filters,
      }),
      providesTags: ['Department'],
    }),
    
    // Subdivisions
    getSubdivisions: builder.query<SubdivisionData[], SubdivisionFilters>({
      query: (filters) => ({
        url: '/fire/subdivisions',
        params: filters,
      }),
      providesTags: ['Subdivision'],
    }),
    
    // Ranks
    getRanks: builder.query<RankData[], void>({
      query: () => '/fire/ranks',
      providesTags: ['Rank'],
    }),
    
    // Roles
    getRoles: builder.query<RoleData[], void>({
      query: () => '/fire/roles',
      providesTags: ['Role'],
    }),
    
    // Super Admins
    getSuperAdmins: builder.query<SuperAdminData[], void>({
      query: () => '/fire/super-admins',
      providesTags: ['SuperAdmin'],
    }),
    
    // Users
    getUsers: builder.query<UserData[], UserFilters>({
      query: (filters) => ({
        url: '/users',
        params: filters,
      }),
      providesTags: ['User'],
    }),
    
    // OTP Management
    getOTPs: builder.query<OTPData, OTPFilters>({
      query: (filters) => ({
        url: '/otp',
        params: filters,
      }),
      providesTags: ['OTP'],
    }),
    
    // Analytics
    getAnalytics: builder.query<AnalyticsData, AnalyticsFilters>({
      query: (filters) => ({
        url: '/analytics',
        params: filters,
      }),
    }),
  }),
});
```

---

## 🎨 Complete Styling System

### **CSS Variables for GNFS Theme**
```css
:root {
  /* GNFS Brand Colors */
  --gnfs-red: #DC2626;
  --gnfs-orange: #EA580C;
  --gnfs-yellow: #EAB308;
  --gnfs-blue: #2563EB;
  --gnfs-green: #16A34A;
  
  /* Priority Colors */
  --priority-high: #DC2626;
  --priority-medium: #EA580C;
  --priority-low: #EAB308;
  
  /* Status Colors */
  --status-pending: #EAB308;
  --status-responding: #2563EB;
  --status-resolved: #16A34A;
  --status-closed: #6B7280;
  
  /* Incident Type Colors */
  --incident-fire: #DC2626;
  --incident-rescue: #2563EB;
  --incident-medical: #16A34A;
  --incident-other: #6B7280;
  
  /* Layout */
  --sidebar-width: 280px;
  --header-height: 64px;
  --card-border-radius: 12px;
  --table-border-radius: 8px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
}
```

---

## 📱 Complete Responsive Design

### **Breakpoint System**
```css
/* Mobile First Approach */
@media (max-width: 640px) {
  /* Mobile styles */
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .fire-report-cards {
    grid-template-columns: 1fr;
  }
  
  .stations-table {
    overflow-x: auto;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet styles */
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .fire-report-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  /* Desktop styles */
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .fire-report-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Core Dashboard (Weeks 1-2)**
- [ ] Dashboard overview with metrics
- [ ] Fire reports cards implementation
- [ ] Basic station table
- [ ] Authentication integration

### **Phase 2: Personnel & Organization (Weeks 3-4)**
- [ ] Personnel management
- [ ] Department/subdivision management
- [ ] Rank and role management
- [ ] Organizational charts

### **Phase 3: Advanced Features (Weeks 5-6)**
- [ ] Analytics dashboard
- [ ] OTP management
- [ ] System administration
- [ ] Real-time updates

### **Phase 4: Optimization (Weeks 7-8)**
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Advanced filtering
- [ ] Export functionality

---

This comprehensive blueprint utilizes ALL your backend models and provides a complete admin dashboard solution for the Ghana National Fire Service system! 🚀
