# 🔥 GNFS Multi-Role Dashboard System Blueprint

## 📋 Overview
A comprehensive multi-role dashboard system for Ghana National Fire Service with separate dashboards for different account types, each with specific access levels and functionalities.

---

## 🏗️ Role-Based Dashboard Architecture

### **Account Types & Access Levels**
```typescript
interface RoleBasedAccess {
  // System Administrators
  SuperAdmin: {
    access: 'full_system';
    dashboards: ['system_admin', 'analytics', 'user_management'];
    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'system_config'];
  };
  
  // Station Administrators
  Admin: {
    access: 'station_level';
    dashboards: ['station_admin', 'personnel_management', 'reports_management'];
    permissions: ['read', 'update', 'manage_personnel', 'manage_reports'];
  };
  
  // Operations Personnel
  Operations: {
    main: {
      access: 'operations_main';
      dashboards: ['operations_dashboard', 'incident_management'];
      permissions: ['read', 'update_reports', 'assign_personnel'];
    };
    watchroom: {
      access: 'watchroom_operations';
      dashboards: ['watchroom_dashboard', 'dispatch_management'];
      permissions: ['read', 'create_reports', 'dispatch_personnel'];
    };
    crew: {
      access: 'crew_operations';
      dashboards: ['crew_dashboard', 'field_operations'];
      permissions: ['read', 'update_status', 'report_progress'];
    };
  };
  
  // Safety Department
  Safety: {
    access: 'safety_management';
    dashboards: ['safety_dashboard', 'compliance_monitoring'];
    permissions: ['read', 'update_safety', 'compliance_reports'];
  };
  
  // Public Relations
  PR: {
    access: 'public_relations';
    dashboards: ['pr_dashboard', 'media_management'];
    permissions: ['read', 'create_announcements', 'media_reports'];
  };
}
```

---

## 🔐 Authentication & Authorization System

### **Role-Based Access Control**
```typescript
interface UserRole {
  userId: string;
  role: 'SuperAdmin' | 'Admin' | 'Operations' | 'Safety' | 'PR';
  subRole?: 'main' | 'watchroom' | 'crew'; // For Operations
  stationId?: string; // For Admin and Operations
  departmentId?: string; // For Operations sub-roles
  permissions: string[];
  dashboardAccess: string[];
}

// Middleware for role-based access
const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};
```

---

## 🎯 Dashboard Layouts by Role

### **1. 🔧 SuperAdmin Dashboard**

#### **SuperAdmin Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS SuperAdmin Dashboard                        👤 Super Admin ▼        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 System Overview │ 🏢 All Stations │ 👥 All Personnel │ 📈 System Analytics │
│ ⚙️ System Config │ 🔐 User Management │ 📋 Audit Logs │ 🚨 All Reports │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **SuperAdmin Dashboard Components**
```typescript
interface SuperAdminDashboard {
  // System Overview Metrics
  systemMetrics: {
    totalStations: number;
    totalPersonnel: number;
    totalUsers: number;
    totalReports: number;
    activeAdmins: number;
    systemUptime: string;
    lastBackup: string;
  };
  
  // All Stations Management
  allStations: {
    stations: StationTableData[];
    stationPerformance: StationPerformance[];
    regionalCoverage: RegionalCoverage[];
  };
  
  // All Personnel Management
  allPersonnel: {
    personnel: PersonnelData[];
    personnelByRole: PersonnelByRole[];
    personnelByStation: PersonnelByStation[];
    performanceMetrics: PersonnelPerformance[];
  };
  
  // System Analytics
  systemAnalytics: {
    userActivity: UserActivity[];
    systemPerformance: SystemPerformance[];
    securityMetrics: SecurityMetrics[];
    complianceReports: ComplianceReport[];
  };
  
  // System Configuration
  systemConfig: {
    otpSettings: OTPSettings;
    notificationSettings: NotificationSettings;
    securitySettings: SecuritySettings;
    backupSettings: BackupSettings;
  };
  
  // User Management
  userManagement: {
    superAdmins: SuperAdminData[];
    stationAdmins: AdminData[];
    operationsPersonnel: OperationsPersonnel[];
    safetyPersonnel: SafetyPersonnel[];
    prPersonnel: PRPersonnel[];
  };
  
  // Audit Logs
  auditLogs: {
    systemLogs: SystemLog[];
    userLogs: UserLog[];
    securityLogs: SecurityLog[];
    adminActions: AdminAction[];
  };
}
```

#### **SuperAdmin Dashboard Implementation**
```typescript
// SuperAdminDashboard.tsx
const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="superadmin-dashboard">
      {/* System Overview Cards */}
      <div className="system-overview">
        <MetricCard title="Total Stations" value={systemMetrics.totalStations} icon="🏢" />
        <MetricCard title="Total Personnel" value={systemMetrics.totalPersonnel} icon="👥" />
        <MetricCard title="Active Users" value={systemMetrics.totalUsers} icon="👤" />
        <MetricCard title="System Uptime" value={systemMetrics.systemUptime} icon="⏱️" />
      </div>
      
      {/* System Performance Charts */}
      <div className="system-charts">
        <SystemPerformanceChart data={systemAnalytics.systemPerformance} />
        <UserActivityChart data={systemAnalytics.userActivity} />
        <SecurityMetricsChart data={systemAnalytics.securityMetrics} />
      </div>
      
      {/* All Stations Management */}
      <div className="all-stations-section">
        <h2>All Stations Management</h2>
        <StationsTable 
          stations={allStations.stations}
          showAllStations={true}
          allowEdit={true}
          allowDelete={true}
        />
      </div>
      
      {/* All Personnel Management */}
      <div className="all-personnel-section">
        <h2>All Personnel Management</h2>
        <PersonnelTable 
          personnel={allPersonnel.personnel}
          showAllPersonnel={true}
          allowEdit={true}
          allowTransfer={true}
        />
      </div>
      
      {/* System Configuration */}
      <div className="system-config-section">
        <h2>System Configuration</h2>
        <SystemConfigPanel config={systemConfig} />
      </div>
      
      {/* User Management */}
      <div className="user-management-section">
        <h2>User Management</h2>
        <UserManagementPanel users={userManagement} />
      </div>
      
      {/* Audit Logs */}
      <div className="audit-logs-section">
        <h2>Audit Logs</h2>
        <AuditLogsTable logs={auditLogs} />
      </div>
    </div>
  );
};
```

---

### **2. 🏢 Admin Dashboard (Station Level)**

#### **Admin Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS Station Admin Dashboard                    👤 Station Admin ▼     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 Station Overview │ 👥 Station Personnel │ 🚨 Station Reports │ 📈 Station Analytics │
│ 🏛️ Departments │ 📋 Station Management │ ⚙️ Station Config │ 📊 Performance │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **Admin Dashboard Components**
```typescript
interface AdminDashboard {
  // Station Overview
  stationOverview: {
    stationInfo: StationData;
    personnelCount: number;
    departmentCount: number;
    activeReports: number;
    averageResponseTime: number;
    stationPerformance: StationPerformance;
  };
  
  // Station Personnel Management
  stationPersonnel: {
    personnel: PersonnelData[];
    personnelByDepartment: PersonnelByDepartment[];
    personnelByRank: PersonnelByRank[];
    personnelPerformance: PersonnelPerformance[];
  };
  
  // Station Reports
  stationReports: {
    reports: FireReportCardData[];
    reportsByStatus: ReportsByStatus[];
    reportsByPriority: ReportsByPriority[];
    reportsByType: ReportsByType[];
  };
  
  // Station Analytics
  stationAnalytics: {
    responseTimeTrends: ResponseTimeTrend[];
    incidentTrends: IncidentTrend[];
    personnelUtilization: PersonnelUtilization[];
    departmentPerformance: DepartmentPerformance[];
  };
  
  // Department Management
  departmentManagement: {
    departments: DepartmentData[];
    subdivisions: SubdivisionData[];
    departmentPersonnel: DepartmentPersonnel[];
  };
  
  // Station Configuration
  stationConfig: {
    stationSettings: StationSettings;
    departmentSettings: DepartmentSettings;
    personnelSettings: PersonnelSettings;
  };
}
```

#### **Admin Dashboard Implementation**
```typescript
// AdminDashboard.tsx
const AdminDashboard: React.FC = () => {
  const { stationId } = useAuth(); // Get current admin's station
  
  return (
    <div className="admin-dashboard">
      {/* Station Overview Cards */}
      <div className="station-overview">
        <MetricCard title="Station Personnel" value={stationOverview.personnelCount} icon="👥" />
        <MetricCard title="Active Reports" value={stationOverview.activeReports} icon="🚨" />
        <MetricCard title="Response Time" value={`${stationOverview.averageResponseTime}min`} icon="⚡" />
        <MetricCard title="Departments" value={stationOverview.departmentCount} icon="🏛️" />
      </div>
      
      {/* Station Performance Chart */}
      <div className="station-performance">
        <StationPerformanceChart data={stationAnalytics.responseTimeTrends} />
      </div>
      
      {/* Station Personnel Management */}
      <div className="station-personnel-section">
        <h2>Station Personnel</h2>
        <PersonnelTable 
          personnel={stationPersonnel.personnel}
          showStationPersonnel={true}
          allowEdit={true}
          allowTransfer={false}
        />
      </div>
      
      {/* Station Reports */}
      <div className="station-reports-section">
        <h2>Station Reports</h2>
        <FireReportsGrid 
          reports={stationReports.reports}
          showStationReports={true}
          allowStatusUpdate={true}
        />
      </div>
      
      {/* Department Management */}
      <div className="department-management-section">
        <h2>Department Management</h2>
        <DepartmentManagementPanel 
          departments={departmentManagement.departments}
          subdivisions={departmentManagement.subdivisions}
        />
      </div>
      
      {/* Station Configuration */}
      <div className="station-config-section">
        <h2>Station Configuration</h2>
        <StationConfigPanel config={stationConfig} />
      </div>
    </div>
  );
};
```

---

### **3. 🚨 Operations Dashboard**

#### **Operations Main Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS Operations Dashboard                        👤 Operations Main ▼   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 Operations Overview │ 🚨 Active Incidents │ 👥 Personnel Status │ 📈 Operations Analytics │
│ 🚑 Dispatch Management │ 📋 Incident Reports │ ⚡ Response Tracking │ 🗺️ Coverage Map │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **Operations Watchroom Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS Watchroom Dashboard                       👤 Watchroom Operator ▼   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📞 Incoming Calls │ 🚨 New Reports │ 🚑 Dispatch Queue │ 📊 Watchroom Analytics │
│ 🗺️ Coverage Map │ 👥 Available Personnel │ ⚡ Response Tracking │ 📋 Call Logs │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **Operations Crew Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS Crew Dashboard                            👤 Crew Member ▼         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🚨 Assigned Incidents │ 📍 Current Location │ 👥 Crew Status │ 📋 Field Reports │
│ ⚡ Response Progress │ 🚑 Equipment Status │ 📞 Communication │ 🗺️ Navigation │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **Operations Dashboard Components**
```typescript
interface OperationsDashboard {
  // Operations Overview
  operationsOverview: {
    activeIncidents: number;
    personnelOnDuty: number;
    availableUnits: number;
    averageResponseTime: number;
    coverageArea: CoverageArea;
  };
  
  // Incident Management
  incidentManagement: {
    activeIncidents: FireReportCardData[];
    incidentQueue: IncidentQueue[];
    dispatchedUnits: DispatchedUnit[];
    responseTracking: ResponseTracking[];
  };
  
  // Personnel Status
  personnelStatus: {
    onDutyPersonnel: PersonnelStatus[];
    availablePersonnel: PersonnelStatus[];
    assignedPersonnel: PersonnelStatus[];
    personnelLocations: PersonnelLocation[];
  };
  
  // Dispatch Management
  dispatchManagement: {
    dispatchQueue: DispatchQueue[];
    unitAssignments: UnitAssignment[];
    resourceAllocation: ResourceAllocation[];
    communicationLogs: CommunicationLog[];
  };
  
  // Operations Analytics
  operationsAnalytics: {
    responseTimeAnalytics: ResponseTimeAnalytics[];
    incidentVolumeAnalytics: IncidentVolumeAnalytics[];
    personnelUtilizationAnalytics: PersonnelUtilizationAnalytics[];
    coverageAnalytics: CoverageAnalytics[];
  };
}
```

#### **Operations Dashboard Implementation**
```typescript
// OperationsDashboard.tsx
const OperationsDashboard: React.FC<{ subRole: 'main' | 'watchroom' | 'crew' }> = ({ subRole }) => {
  const { stationId, departmentId } = useAuth();
  
  if (subRole === 'main') {
    return <OperationsMainDashboard stationId={stationId} />;
  } else if (subRole === 'watchroom') {
    return <WatchroomDashboard stationId={stationId} />;
  } else if (subRole === 'crew') {
    return <CrewDashboard stationId={stationId} departmentId={departmentId} />;
  }
  
  return null;
};

// Operations Main Dashboard
const OperationsMainDashboard: React.FC<{ stationId: string }> = ({ stationId }) => {
  return (
    <div className="operations-main-dashboard">
      {/* Operations Overview */}
      <div className="operations-overview">
        <MetricCard title="Active Incidents" value={operationsOverview.activeIncidents} icon="🚨" />
        <MetricCard title="Personnel On Duty" value={operationsOverview.personnelOnDuty} icon="👥" />
        <MetricCard title="Available Units" value={operationsOverview.availableUnits} icon="🚑" />
        <MetricCard title="Response Time" value={`${operationsOverview.averageResponseTime}min`} icon="⚡" />
      </div>
      
      {/* Active Incidents */}
      <div className="active-incidents-section">
        <h2>Active Incidents</h2>
        <FireReportsGrid 
          reports={incidentManagement.activeIncidents}
          showActiveIncidents={true}
          allowStatusUpdate={true}
          allowPersonnelAssignment={true}
        />
      </div>
      
      {/* Personnel Status */}
      <div className="personnel-status-section">
        <h2>Personnel Status</h2>
        <PersonnelStatusGrid personnel={personnelStatus.onDutyPersonnel} />
      </div>
      
      {/* Dispatch Management */}
      <div className="dispatch-management-section">
        <h2>Dispatch Management</h2>
        <DispatchManagementPanel dispatch={dispatchManagement} />
      </div>
      
      {/* Operations Analytics */}
      <div className="operations-analytics-section">
        <h2>Operations Analytics</h2>
        <OperationsAnalyticsPanel analytics={operationsAnalytics} />
      </div>
    </div>
  );
};

// Watchroom Dashboard
const WatchroomDashboard: React.FC<{ stationId: string }> = ({ stationId }) => {
  return (
    <div className="watchroom-dashboard">
      {/* Incoming Calls */}
      <div className="incoming-calls-section">
        <h2>Incoming Calls</h2>
        <IncomingCallsPanel calls={incomingCalls} />
      </div>
      
      {/* New Reports */}
      <div className="new-reports-section">
        <h2>New Reports</h2>
        <NewReportsPanel reports={newReports} />
      </div>
      
      {/* Dispatch Queue */}
      <div className="dispatch-queue-section">
        <h2>Dispatch Queue</h2>
        <DispatchQueuePanel queue={dispatchQueue} />
      </div>
      
      {/* Coverage Map */}
      <div className="coverage-map-section">
        <h2>Coverage Map</h2>
        <CoverageMapPanel coverage={coverageArea} />
      </div>
    </div>
  );
};

// Crew Dashboard
const CrewDashboard: React.FC<{ stationId: string; departmentId: string }> = ({ stationId, departmentId }) => {
  return (
    <div className="crew-dashboard">
      {/* Assigned Incidents */}
      <div className="assigned-incidents-section">
        <h2>Assigned Incidents</h2>
        <AssignedIncidentsPanel incidents={assignedIncidents} />
      </div>
      
      {/* Current Location */}
      <div className="current-location-section">
        <h2>Current Location</h2>
        <LocationTrackingPanel location={currentLocation} />
      </div>
      
      {/* Crew Status */}
      <div className="crew-status-section">
        <h2>Crew Status</h2>
        <CrewStatusPanel crew={crewStatus} />
      </div>
      
      {/* Field Reports */}
      <div className="field-reports-section">
        <h2>Field Reports</h2>
        <FieldReportsPanel reports={fieldReports} />
      </div>
    </div>
  );
};
```

---

### **4. 🛡️ Safety Dashboard**

#### **Safety Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS Safety Dashboard                          👤 Safety Officer ▼       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 Safety Overview │ 🚨 Safety Incidents │ 📋 Compliance Reports │ 📈 Safety Analytics │
│ 🛡️ Safety Protocols │ 👥 Safety Personnel │ ⚠️ Risk Assessment │ 📊 Safety Metrics │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **Safety Dashboard Components**
```typescript
interface SafetyDashboard {
  // Safety Overview
  safetyOverview: {
    safetyIncidents: number;
    complianceScore: number;
    safetyPersonnel: number;
    riskLevel: 'low' | 'medium' | 'high';
    lastSafetyAudit: string;
  };
  
  // Safety Incidents
  safetyIncidents: {
    incidents: SafetyIncident[];
    incidentTrends: SafetyIncidentTrend[];
    incidentTypes: SafetyIncidentType[];
    incidentSeverity: SafetyIncidentSeverity[];
  };
  
  // Compliance Management
  complianceManagement: {
    complianceReports: ComplianceReport[];
    complianceScore: ComplianceScore[];
    auditSchedule: AuditSchedule[];
    complianceAlerts: ComplianceAlert[];
  };
  
  // Safety Personnel
  safetyPersonnel: {
    safetyOfficers: SafetyOfficer[];
    safetyTraining: SafetyTraining[];
    certificationStatus: CertificationStatus[];
    safetyPerformance: SafetyPerformance[];
  };
  
  // Safety Analytics
  safetyAnalytics: {
    incidentAnalytics: SafetyIncidentAnalytics[];
    complianceAnalytics: ComplianceAnalytics[];
    personnelAnalytics: SafetyPersonnelAnalytics[];
    riskAnalytics: RiskAnalytics[];
  };
}
```

#### **Safety Dashboard Implementation**
```typescript
// SafetyDashboard.tsx
const SafetyDashboard: React.FC = () => {
  return (
    <div className="safety-dashboard">
      {/* Safety Overview Cards */}
      <div className="safety-overview">
        <MetricCard title="Safety Incidents" value={safetyOverview.safetyIncidents} icon="🚨" />
        <MetricCard title="Compliance Score" value={`${safetyOverview.complianceScore}%`} icon="📋" />
        <MetricCard title="Safety Personnel" value={safetyOverview.safetyPersonnel} icon="👥" />
        <MetricCard title="Risk Level" value={safetyOverview.riskLevel} icon="⚠️" />
      </div>
      
      {/* Safety Incidents */}
      <div className="safety-incidents-section">
        <h2>Safety Incidents</h2>
        <SafetyIncidentsTable incidents={safetyIncidents.incidents} />
      </div>
      
      {/* Compliance Management */}
      <div className="compliance-management-section">
        <h2>Compliance Management</h2>
        <ComplianceManagementPanel compliance={complianceManagement} />
      </div>
      
      {/* Safety Personnel */}
      <div className="safety-personnel-section">
        <h2>Safety Personnel</h2>
        <SafetyPersonnelPanel personnel={safetyPersonnel} />
      </div>
      
      {/* Safety Analytics */}
      <div className="safety-analytics-section">
        <h2>Safety Analytics</h2>
        <SafetyAnalyticsPanel analytics={safetyAnalytics} />
      </div>
    </div>
  );
};
```

---

### **5. 📢 PR Dashboard**

#### **PR Dashboard Layout**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 GNFS PR Dashboard                              👤 PR Officer ▼          │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 PR Overview │ 📰 Media Reports │ 📢 Public Announcements │ 📈 PR Analytics │
│ 🎯 Campaign Management │ 📱 Social Media │ 📊 Public Relations │ 📋 PR Reports │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **PR Dashboard Components**
```typescript
interface PRDashboard {
  // PR Overview
  prOverview: {
    mediaReports: number;
    publicAnnouncements: number;
    socialMediaPosts: number;
    prCampaigns: number;
    publicSentiment: 'positive' | 'neutral' | 'negative';
  };
  
  // Media Management
  mediaManagement: {
    mediaReports: MediaReport[];
    pressReleases: PressRelease[];
    mediaContacts: MediaContact[];
    mediaCoverage: MediaCoverage[];
  };
  
  // Public Announcements
  publicAnnouncements: {
    announcements: PublicAnnouncement[];
    announcementSchedule: AnnouncementSchedule[];
    announcementReach: AnnouncementReach[];
  };
  
  // Campaign Management
  campaignManagement: {
    activeCampaigns: PRCampaign[];
    campaignPerformance: CampaignPerformance[];
    campaignMetrics: CampaignMetrics[];
  };
  
  // PR Analytics
  prAnalytics: {
    mediaAnalytics: MediaAnalytics[];
    socialMediaAnalytics: SocialMediaAnalytics[];
    publicSentimentAnalytics: PublicSentimentAnalytics[];
    campaignAnalytics: CampaignAnalytics[];
  };
}
```

#### **PR Dashboard Implementation**
```typescript
// PRDashboard.tsx
const PRDashboard: React.FC = () => {
  return (
    <div className="pr-dashboard">
      {/* PR Overview Cards */}
      <div className="pr-overview">
        <MetricCard title="Media Reports" value={prOverview.mediaReports} icon="📰" />
        <MetricCard title="Announcements" value={prOverview.publicAnnouncements} icon="📢" />
        <MetricCard title="Social Posts" value={prOverview.socialMediaPosts} icon="📱" />
        <MetricCard title="Campaigns" value={prOverview.prCampaigns} icon="🎯" />
      </div>
      
      {/* Media Management */}
      <div className="media-management-section">
        <h2>Media Management</h2>
        <MediaManagementPanel media={mediaManagement} />
      </div>
      
      {/* Public Announcements */}
      <div className="public-announcements-section">
        <h2>Public Announcements</h2>
        <PublicAnnouncementsPanel announcements={publicAnnouncements} />
      </div>
      
      {/* Campaign Management */}
      <div className="campaign-management-section">
        <h2>Campaign Management</h2>
        <CampaignManagementPanel campaigns={campaignManagement} />
      </div>
      
      {/* PR Analytics */}
      <div className="pr-analytics-section">
        <h2>PR Analytics</h2>
        <PRAnalyticsPanel analytics={prAnalytics} />
      </div>
    </div>
  );
};
```

---

## 🔌 Role-Based API Integration

### **API Endpoints by Role**
```typescript
// Role-based API service
export const roleBasedApi = createApi({
  reducerPath: 'roleBasedApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      const userRole = selectUserRole(getState());
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('x-user-role', userRole);
      
      return headers;
    },
  }),
  tagTypes: ['Dashboard', 'Reports', 'Personnel', 'Stations'],
  endpoints: (builder) => ({
    // SuperAdmin endpoints
    getSuperAdminDashboard: builder.query<SuperAdminDashboard, void>({
      query: () => '/admin/superadmin/dashboard',
    }),
    
    // Admin endpoints
    getAdminDashboard: builder.query<AdminDashboard, string>({
      query: (stationId) => `/admin/station/${stationId}/dashboard`,
    }),
    
    // Operations endpoints
    getOperationsDashboard: builder.query<OperationsDashboard, { stationId: string; subRole: string }>({
      query: ({ stationId, subRole }) => `/operations/${stationId}/${subRole}/dashboard`,
    }),
    
    // Safety endpoints
    getSafetyDashboard: builder.query<SafetyDashboard, void>({
      query: () => '/safety/dashboard',
    }),
    
    // PR endpoints
    getPRDashboard: builder.query<PRDashboard, void>({
      query: () => '/pr/dashboard',
    }),
  }),
});
```

---

## 🎨 Role-Based Styling

### **Role-Specific Color Schemes**
```css
:root {
  /* SuperAdmin Colors */
  --superadmin-primary: #DC2626;
  --superadmin-secondary: #EA580C;
  --superadmin-accent: #EAB308;
  
  /* Admin Colors */
  --admin-primary: #2563EB;
  --admin-secondary: #1D4ED8;
  --admin-accent: #3B82F6;
  
  /* Operations Colors */
  --operations-primary: #16A34A;
  --operations-secondary: #15803D;
  --operations-accent: #22C55E;
  
  /* Safety Colors */
  --safety-primary: #EAB308;
  --safety-secondary: #CA8A04;
  --safety-accent: #FACC15;
  
  /* PR Colors */
  --pr-primary: #8B5CF6;
  --pr-secondary: #7C3AED;
  --pr-accent: #A78BFA;
}

/* Role-specific dashboard styling */
.superadmin-dashboard {
  --dashboard-primary: var(--superadmin-primary);
  --dashboard-secondary: var(--superadmin-secondary);
  --dashboard-accent: var(--superadmin-accent);
}

.admin-dashboard {
  --dashboard-primary: var(--admin-primary);
  --dashboard-secondary: var(--admin-secondary);
  --dashboard-accent: var(--admin-accent);
}

.operations-dashboard {
  --dashboard-primary: var(--operations-primary);
  --dashboard-secondary: var(--operations-secondary);
  --dashboard-accent: var(--operations-accent);
}

.safety-dashboard {
  --dashboard-primary: var(--safety-primary);
  --dashboard-secondary: var(--safety-secondary);
  --dashboard-accent: var(--safety-accent);
}

.pr-dashboard {
  --dashboard-primary: var(--pr-primary);
  --dashboard-secondary: var(--pr-secondary);
  --dashboard-accent: var(--pr-accent);
}
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Core Role System (Weeks 1-2)**
- [ ] Role-based authentication
- [ ] Permission system
- [ ] Basic dashboard routing
- [ ] SuperAdmin dashboard

### **Phase 2: Station-Level Dashboards (Weeks 3-4)**
- [ ] Admin dashboard
- [ ] Operations main dashboard
- [ ] Watchroom dashboard
- [ ] Crew dashboard

### **Phase 3: Specialized Dashboards (Weeks 5-6)**
- [ ] Safety dashboard
- [ ] PR dashboard
- [ ] Role-specific analytics
- [ ] Cross-role communication

### **Phase 4: Advanced Features (Weeks 7-8)**
- [ ] Real-time updates
- [ ] Mobile optimization
- [ ] Advanced permissions
- [ ] Performance optimization

---

This comprehensive blueprint provides separate dashboards for each account type with specific access levels and functionalities, all integrated with your existing backend models! 🚀
