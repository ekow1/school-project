import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import stationRoutes from './routes/stationRoutes.js';
import firePersonnelRoutes from './routes/firePersonnelRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import subdivisionRoutes from './routes/subdivisionRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import rankRoutes from './routes/rankRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import fireReportRoutes from './routes/fireReportRoutes.js';
import verifyToken from './middleware/verifyToken.js';
import { swaggerUi, specs } from './swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors(
    {
        origin: ['*'],
        credentials: true
    }
));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Authentication Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', verifyToken, profileRoutes);

// // OTP Routes (public - no auth required)
// app.use('/api/otp', otpRoutes);

// Fire Service Routes (all protected)
app.use('/api/fire/stations', verifyToken, stationRoutes);
app.use('/api/fire/personnel', verifyToken, firePersonnelRoutes);
app.use('/api/fire/departments', verifyToken, departmentRoutes);
app.use('/api/fire/subdivisions', verifyToken, subdivisionRoutes);
app.use('/api/fire/roles', verifyToken, roleRoutes);
app.use('/api/fire/ranks', verifyToken, rankRoutes);
app.use('/api/fire/reports',  fireReportRoutes);

// Super Admin routes (mixed - some public, some protected)
// The routes file handles which ones need auth

/**
 * @swagger
 * /api/fire/stations:
 *   post:
 *     summary: Create a new fire station (with intelligent upsert)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new fire station or updates existing one if duplicate detected. Uses coordinates, location, or phone number for duplicate detection.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationCreateRequest'
 *           examples:
 *             complete_station:
 *               summary: Complete station data
 *               value:
 *                 name: "Accra Central Fire Station"
 *                 call_sign: "ACFS-001"
 *                 location: "Central Business District, Accra"
 *                 location_url: "https://maps.google.com/?q=5.6037,-0.1870"
 *                 coordinates:
 *                   latitude: 5.6037
 *                   longitude: -0.1870
 *                 region: "Greater Accra"
 *                 phone_number: "+233302123456"
 *             minimal_station:
 *               summary: Minimal station data
 *               value:
 *                 name: "Test Station"
 *                 location: "Test Location"
 *     responses:
 *       201:
 *         description: Station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StationResponse'
 *       200:
 *         description: Station updated or skipped
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StationResponse'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   get:
 *     summary: Get all fire stations
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all fire stations with optional region filtering
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter stations by region
 *         example: "Greater Accra"
 *     responses:
 *       200:
 *         description: List of fire stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Station'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 * @swagger
 * /api/fire/stations/bulk:
 *   post:
 *     summary: Bulk create/update fire stations
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     description: Create or update multiple fire stations in one request. Each station is processed individually with upsert logic.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationBulkRequest'
 *           examples:
 *             bulk_stations:
 *               summary: Multiple stations
 *               value:
 *                 stations:
 *                   - name: "Accra Central Fire Station"
 *                     location: "Central Business District, Accra"
 *                     coordinates:
 *                       latitude: 5.6037
 *                       longitude: -0.1870
 *                     phone_number: "+233302123456"
 *                   - name: "Kumasi Fire Station"
 *                     location: "Central Kumasi"
 *                     coordinates:
 *                       latitude: 6.6885
 *                       longitude: -1.6244
 *                     phone_number: "+233322123456"
 *     responses:
 *       200:
 *         description: Bulk operation completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StationBulkResponse'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 * @swagger
 * /api/fire/stations/{id}:
 *   get:
 *     summary: Get fire station by ID
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a specific fire station by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Fire station details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Station'
 *       400:
 *         description: Invalid station ID format
 *       404:
 *         description: Station not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   put:
 *     summary: Update fire station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing fire station
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationCreateRequest'
 *     responses:
 *       200:
 *         description: Station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Station updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Station'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Station not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   delete:
 *     summary: Delete fire station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     description: Delete a fire station by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Station deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Station deleted successfully"
 *       400:
 *         description: Invalid station ID format
 *       404:
 *         description: Station not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check if the authentication backend service is running and healthy
 *     responses:
 *       200:
 *         description: Service is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Auth backend is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.send('Server running');
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
        console.log(`📱 API Base: http://localhost:${PORT}/api`);
        console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('🔍 Check your MONGODB_URI environment variable');
    process.exit(1);
});
