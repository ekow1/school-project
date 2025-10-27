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

// Fire Service Routes (all protected)
app.use('/api/fire/stations', verifyToken, stationRoutes);
app.use('/api/fire/personnel', verifyToken, firePersonnelRoutes);
app.use('/api/fire/departments', verifyToken, departmentRoutes);
app.use('/api/fire/subdivisions', verifyToken, subdivisionRoutes);
app.use('/api/fire/roles', verifyToken, roleRoutes);
app.use('/api/fire/ranks', verifyToken, rankRoutes);

// Super Admin routes (mixed - some public, some protected)
// The routes file handles which ones need auth
app.use('/api/fire/superadmin', superAdminRoutes);

/**
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
    res.send('Sever running');
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Local: http://localhost:${PORT}`);
        console.log(`Network: http://192.168.117.54:${PORT}`);
        console.log(`Android Emulator: http://10.0.2.2:${PORT}`);
    });
}).catch(err => console.log(err));
