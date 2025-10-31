# 🔥 GNFS Admin Dashboard - Specific Implementation Blueprint

## 📋 Overview
Based on your backend models, this blueprint implements **Fire Reports as Cards** and **Stations as Tables** with complete integration to your existing API.

---

## 🎯 Dashboard Layout Structure

### **Main Navigation**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔥 GNFS Admin Dashboard                    👤 Admin User ▼  │
├─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard │ 🚨 Fire Reports │ 🏢 Stations │ 👥 Personnel │ 📈 Analytics │ ⚙️ Admin │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 Fire Reports - Card Layout

### **Fire Report Card Design**
```typescript
interface FireReportCard {
  id: string;
  incidentType: string;
  incidentName: string;
  location: {
    coordinates: { latitude: number; longitude: number };
    locationUrl?: string;
    locationName?: string;
  };
  station: {
    _id: string;
    name: string;
    location: string;
    phone_number?: string;
  };
  userId: {
    _id: string;
    name: string;
    phone: string;
  };
  status: 'pending' | 'responding' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  reportedAt: string;
  description?: string;
  estimatedCasualties: number;
  estimatedDamage: 'minimal' | 'moderate' | 'severe' | 'extensive';
  assignedPersonnel: string[];
  responseTime?: number;
  resolvedAt?: string;
  notes?: string;
}
```

### **Card Layout Structure**
```
┌─────────────────────────────────────────────────────────────┐
│ 🚨 Fire Reports Management                                 │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search: [________________] 📅 Date: [____] 🏢 Station: [▼] │
│ Status: [All ▼] Priority: [All ▼] Type: [All ▼]           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│ │ 🔥 HIGH     │ │ 🚑 MEDIUM    │ │ ⚠️ LOW      │           │
│ │ Fire        │ │ Rescue      │ │ Medical     │           │
│ │             │ │             │ │             │           │
│ │ Building Fire│ │ Car Accident│ │ Medical Aid │           │
│ │ Central Market│ │ Ring Road   │ │ Hospital    │           │
│ │             │ │             │ │             │           │
│ │ 📍 Accra    │ │ 📍 Kumasi   │ │ 📍 Tamale   │           │
│ │ 🏢 Station A│ │ 🏢 Station B│ │ 🏢 Station C│           │
│ │ 👤 John Doe │ │ 👤 Jane Doe │ │ 👤 Bob Smith│           │
│ │             │ │             │ │             │           │
│ │ ⏰ 2 min ago│ │ ⏰ 15 min ago│ │ ⏰ 1 hour ago│           │
│ │             │ │             │ │             │           │
│ │ [Respond]   │ │ [Assign]    │ │ [View]      │           │
│ └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│ │ ✅ RESOLVED │ │ 🔄 RESPONDING│ │ ⏸️ PENDING  │           │
│ │ Fire        │ │ Rescue      │ │ Medical     │           │
│ │             │ │             │ │             │           │
│ │ House Fire  │ │ Water Rescue│ │ Emergency   │           │
│ │ East Legon  │ │ Volta Lake  │ │ Call        │           │
│ │             │ │             │ │             │           │
│ │ 📍 Accra    │ │ 📍 Volta    │ │ 📍 Northern │           │
│ │ 🏢 Station A│ │ 🏢 Station D│ │ 🏢 Station E│           │
│ │ 👤 Alice    │ │ 👤 Charlie  │ │ 👤 David    │           │
│ │             │ │             │ │             │           │
│ │ ⏰ 2 hours ago│ │ ⏰ 30 min ago│ │ ⏰ 5 min ago│           │
│ │             │ │             │ │             │           │
│ │ [View Details]│ │ [Update]    │ │ [Assign]    │           │
│ └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│ 📄 Page 1 of 5  [◀ Previous] [Next ▶]                      │
└─────────────────────────────────────────────────────────────┘
```

### **Card Component Implementation**
```typescript
// FireReportCard.tsx
interface FireReportCardProps {
  report: FireReportCard;
  onStatusChange: (id: string, status: string) => void;
  onAssign: (id: string) => void;
  onView: (id: string) => void;
}

const FireReportCard: React.FC<FireReportCardProps> = ({ report, onStatusChange, onAssign, onView }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#DC2626'; // Red
      case 'medium': return '#EA580C'; // Orange
      case 'low': return '#EAB308'; // Yellow
      default: return '#6B7280'; // Gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏸️';
      case 'responding': return '🔄';
      case 'resolved': return '✅';
      case 'closed': return '🔒';
      default: return '❓';
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fire': return '🔥';
      case 'rescue': return '🚑';
      case 'medical': return '⚕️';
      default: return '🚨';
    }
  };

  return (
    <Card 
      className={`fire-report-card priority-${report.priority}`}
      style={{ borderLeft: `4px solid ${getPriorityColor(report.priority)}` }}
    >
      <CardHeader>
        <div className="card-header">
          <div className="incident-info">
            <span className="incident-icon">{getIncidentIcon(report.incidentType)}</span>
            <span className="priority-badge" style={{ backgroundColor: getPriorityColor(report.priority) }}>
              {report.priority.toUpperCase()}
            </span>
            <span className="status-icon">{getStatusIcon(report.status)}</span>
          </div>
          <div className="incident-type">{report.incidentType}</div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="incident-details">
          <h3 className="incident-name">{report.incidentName}</h3>
          <p className="incident-description">{report.description}</p>
        </div>
        
        <div className="location-info">
          <div className="location-details">
            <span className="location-icon">📍</span>
            <span className="location-name">{report.location.locationName || 'Unknown Location'}</span>
          </div>
          <div className="station-info">
            <span className="station-icon">🏢</span>
            <span className="station-name">{report.station.name}</span>
          </div>
        </div>
        
        <div className="reporter-info">
          <span className="reporter-icon">👤</span>
          <span className="reporter-name">{report.userId.name}</span>
          <span className="reporter-phone">{report.userId.phone}</span>
        </div>
        
        <div className="timing-info">
          <div className="reported-time">
            <span className="time-icon">⏰</span>
            <span className="time-text">{formatTimeAgo(report.reportedAt)}</span>
          </div>
          {report.responseTime && (
            <div className="response-time">
              <span className="response-icon">⚡</span>
              <span className="response-text">{report.responseTime} min</span>
            </div>
          )}
        </div>
        
        {report.estimatedCasualties > 0 && (
          <div className="casualty-info">
            <span className="casualty-icon">🚨</span>
            <span className="casualty-text">{report.estimatedCasualties} casualties</span>
          </div>
        )}
      </CardContent>
      
      <CardActions>
        {report.status === 'pending' && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => onStatusChange(report.id, 'responding')}
          >
            Respond
          </Button>
        )}
        {report.status === 'responding' && (
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => onAssign(report.id)}
          >
            Assign Personnel
          </Button>
        )}
        <Button 
          variant="text" 
          onClick={() => onView(report.id)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};
```

### **Card Grid Layout**
```typescript
// FireReportsGrid.tsx
const FireReportsGrid: React.FC = () => {
  const [reports, setReports] = useState<FireReportCard[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    station: 'all',
    dateRange: 'all'
  });

  return (
    <div className="fire-reports-grid">
      {/* Filter Controls */}
      <div className="filters-section">
        <TextField 
          placeholder="Search reports..." 
          variant="outlined"
          size="small"
        />
        <Select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="responding">Responding</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </Select>
        <Select value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})}>
          <MenuItem value="all">All Priority</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {reports.map((report) => (
          <FireReportCard 
            key={report.id}
            report={report}
            onStatusChange={handleStatusChange}
            onAssign={handleAssign}
            onView={handleView}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <Pagination 
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};
```

---

## 🏢 Stations - Table Layout

### **Station Table Design**
```typescript
interface StationTableRow {
  _id: string;
  name: string;
  call_sign?: string;
  location: string;
  region?: string;
  lat?: number;
  lng?: number;
  phone_number?: string;
  placeId?: string;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  departments?: Department[];
  personnel?: FirePersonnel[];
  // Computed fields
  activePersonnelCount: number;
  activeReportsCount: number;
  averageResponseTime: number;
}
```

### **Table Layout Structure**
```
┌─────────────────────────────────────────────────────────────┐
│ 🏢 Stations Management                                      │
├─────────────────────────────────────────────────────────────┤
│ [+ Add Station] 🔍 Search: [________________] 📊 Export [▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Station Name │ Call Sign │ Location │ Region │ Personnel │ │
│ │ Phone │ Response Time │ Reports │ Actions │             │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Ghana Fire    │ GF-001    │ Madina   │ Greater│ 15       │ │
│ │ Service       │           │          │ Accra  │          │ │
│ │ Station -     │           │          │        │          │ │
│ │ Madina        │           │          │        │          │ │
│ │               │           │          │        │          │ │
│ │ +233302123456 │ 4.2 min   │ 3 active │ [Edit] │          │ │
│ │               │           │          │ [View] │          │ │
│ │               │           │          │ [Delete] │        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Ghana Fire    │ GF-002    │ Kumasi   │ Ashanti│ 12       │ │
│ │ Service       │           │          │        │          │ │
│ │ Station -     │           │          │        │          │ │
│ │ Kumasi        │           │          │        │          │ │
│ │               │          │          │        │          │ │
│ │ +233322123456 │ 5.1 min   │ 2 active │ [Edit] │          │ │
│ │               │           │          │ [View] │          │ │
│ │               │           │          │ [Delete] │        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Ghana Fire    │ GF-003    │ Tamale   │ Northern│ 8       │ │
│ │ Service       │           │          │        │          │ │
│ │ Station -     │           │          │        │          │ │
│ │ Tamale        │           │          │        │          │ │
│ │               │          │          │        │          │ │
│ │ +233372123456 │ 6.8 min   │ 1 active │ [Edit] │          │ │
│ │               │           │          │ [View] │          │ │
│ │               │           │          │ [Delete] │        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 📄 Showing 1-10 of 25 stations                              │
│ [◀ Previous] [Next ▶]                                       │
└─────────────────────────────────────────────────────────────┘
```

### **Table Component Implementation**
```typescript
// StationsTable.tsx
interface StationsTableProps {
  stations: StationTableRow[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const StationsTable: React.FC<StationsTableProps> = ({ stations, onEdit, onView, onDelete, onAdd }) => {
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const columns = [
    {
      key: 'name',
      label: 'Station Name',
      sortable: true,
      render: (station: StationTableRow) => (
        <div className="station-name-cell">
          <div className="station-name">{station.name}</div>
          <div className="station-call-sign">{station.call_sign}</div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (station: StationTableRow) => (
        <div className="location-cell">
          <div className="location-name">{station.location}</div>
          <div className="location-region">{station.region}</div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (station: StationTableRow) => (
        <div className="contact-cell">
          <div className="phone-number">{station.phone_number}</div>
          <div className="coordinates">
            {station.lat && station.lng && `${station.lat.toFixed(4)}, ${station.lng.toFixed(4)}`}
          </div>
        </div>
      )
    },
    {
      key: 'personnel',
      label: 'Personnel',
      sortable: true,
      render: (station: StationTableRow) => (
        <div className="personnel-cell">
          <div className="personnel-count">{station.activePersonnelCount} active</div>
          <div className="personnel-departments">
            {station.departments?.length || 0} departments
          </div>
        </div>
      )
    },
    {
      key: 'performance',
      label: 'Performance',
      sortable: true,
      render: (station: StationTableRow) => (
        <div className="performance-cell">
          <div className="response-time">
            <span className="response-icon">⚡</span>
            <span className="response-text">{station.averageResponseTime} min</span>
          </div>
          <div className="active-reports">
            <span className="reports-icon">🚨</span>
            <span className="reports-text">{station.activeReportsCount} active</span>
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (station: StationTableRow) => (
        <div className="actions-cell">
          <IconButton 
            size="small" 
            onClick={() => onView(station._id)}
            title="View Details"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onEdit(station._id)}
            title="Edit Station"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onDelete(station._id)}
            title="Delete Station"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <div className="stations-table-container">
      {/* Table Header */}
      <div className="table-header">
        <div className="header-actions">
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onAdd}
          >
            Add Station
          </Button>
          <TextField 
            placeholder="Search stations..." 
            variant="outlined"
            size="small"
          />
          <Button variant="outlined" startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  checked={selectedRows.length === stations.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  sortDirection={sortField === column.key ? sortDirection : false}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <TableSortLabel 
                    active={sortField === column.key}
                    direction={sortField === column.key ? sortDirection : 'asc'}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((station) => (
              <TableRow 
                key={station._id}
                selected={selectedRows.includes(station._id)}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={selectedRows.includes(station._id)}
                    onChange={() => handleSelectRow(station._id)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render(station)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="pagination-info">
          Showing {startIndex}-{endIndex} of {totalStations} stations
        </div>
        <TablePagination
          component="div"
          count={totalStations}
          page={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};
```

---

## 🔌 API Integration

### **Fire Reports API Service**
```typescript
// fireReportsApi.ts
export const fireReportsApi = createApi({
  reducerPath: 'fireReportsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/fire/reports',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['FireReport'],
  endpoints: (builder) => ({
    getFireReports: builder.query<FireReportCard[], {
      status?: string;
      priority?: string;
      station?: string;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '',
        params,
      }),
      providesTags: ['FireReport'],
    }),
    getFireReportById: builder.query<FireReportCard, string>({
      query: (id) => `/${id}`,
      providesTags: ['FireReport'],
    }),
    createFireReport: builder.mutation<FireReportCard, Partial<FireReportCard>>({
      query: (report) => ({
        url: '',
        method: 'POST',
        body: report,
      }),
      invalidatesTags: ['FireReport'],
    }),
    updateFireReport: builder.mutation<FireReportCard, { id: string; updates: Partial<FireReportCard> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['FireReport'],
    }),
    deleteFireReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FireReport'],
    }),
    getFireReportStats: builder.query<FireReportStats, void>({
      query: () => '/stats',
    }),
  }),
});
```

### **Stations API Service**
```typescript
// stationsApi.ts
export const stationsApi = createApi({
  reducerPath: 'stationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/fire/stations',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Station'],
  endpoints: (builder) => ({
    getStations: builder.query<StationTableRow[], {
      page?: number;
      limit?: number;
      search?: string;
    }>({
      query: (params) => ({
        url: '',
        params,
      }),
      providesTags: ['Station'],
    }),
    getStationById: builder.query<StationTableRow, string>({
      query: (id) => `/${id}`,
      providesTags: ['Station'],
    }),
    createStation: builder.mutation<StationTableRow, Partial<StationTableRow>>({
      query: (station) => ({
        url: '',
        method: 'POST',
        body: station,
      }),
      invalidatesTags: ['Station'],
    }),
    updateStation: builder.mutation<StationTableRow, { id: string; updates: Partial<StationTableRow> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Station'],
    }),
    deleteStation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Station'],
    }),
  }),
});
```

---

## 🎨 CSS Styling

### **Fire Report Cards Styling**
```css
/* FireReportCard.css */
.fire-report-card {
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 400px;
  min-height: 300px;
}

.fire-report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.fire-report-card.priority-high {
  border-left: 4px solid #DC2626;
}

.fire-report-card.priority-medium {
  border-left: 4px solid #EA580C;
}

.fire-report-card.priority-low {
  border-left: 4px solid #EAB308;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.incident-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.incident-icon {
  font-size: 24px;
}

.priority-badge {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.status-icon {
  font-size: 20px;
}

.incident-name {
  font-size: 18px;
  font-weight: bold;
  margin: 8px 0;
  color: #1F2937;
}

.location-info, .reporter-info, .timing-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  font-size: 14px;
  color: #6B7280;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
  padding: 16px;
}

.filters-section {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}
```

### **Stations Table Styling**
```css
/* StationsTable.css */
.stations-table-container {
  padding: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.station-name-cell {
  display: flex;
  flex-direction: column;
}

.station-name {
  font-weight: bold;
  color: #1F2937;
}

.station-call-sign {
  font-size: 12px;
  color: #6B7280;
}

.location-cell {
  display: flex;
  flex-direction: column;
}

.location-name {
  font-weight: 500;
  color: #1F2937;
}

.location-region {
  font-size: 12px;
  color: #6B7280;
}

.contact-cell {
  display: flex;
  flex-direction: column;
}

.phone-number {
  font-weight: 500;
  color: #1F2937;
}

.coordinates {
  font-size: 12px;
  color: #6B7280;
  font-family: monospace;
}

.personnel-cell {
  display: flex;
  flex-direction: column;
}

.personnel-count {
  font-weight: bold;
  color: #059669;
}

.personnel-departments {
  font-size: 12px;
  color: #6B7280;
}

.performance-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.response-time, .active-reports {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.response-icon {
  color: #EA580C;
}

.reports-icon {
  color: #DC2626;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 8px;
}

.pagination-info {
  color: #6B7280;
  font-size: 14px;
}
```

---

## 📱 Responsive Design

### **Mobile Adaptations**
```css
/* Mobile responsive */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    padding: 8px;
  }
  
  .fire-report-card {
    margin: 8px;
    max-width: none;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .stations-table-container {
    padding: 8px;
  }
}
```

---

## 🚀 Implementation Checklist

### **Phase 1: Fire Reports Cards**
- [ ] Create FireReportCard component
- [ ] Implement card grid layout
- [ ] Add filtering and search
- [ ] Implement status change actions
- [ ] Add pagination
- [ ] Integrate with API

### **Phase 2: Stations Table**
- [ ] Create StationsTable component
- [ ] Implement table with sorting
- [ ] Add row selection
- [ ] Implement CRUD operations
- [ ] Add export functionality
- [ ] Integrate with API

### **Phase 3: Integration**
- [ ] Connect both components to Redux
- [ ] Implement real-time updates
- [ ] Add error handling
- [ ] Implement loading states
- [ ] Add responsive design
- [ ] Performance optimization

This blueprint provides a complete implementation guide for your specific requirements with fire reports as cards and stations as tables, fully integrated with your existing backend models and API endpoints.
