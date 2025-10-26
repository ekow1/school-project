import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import verifyToken from './middleware/verifyToken.js';
import { swaggerUi, specs } from './swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors(
    {
        origin: ['http://10.0.2.2:5000',"http://192.168.117.54:5000"],
        credentials: true
    }
));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', verifyToken, profileRoutes);

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
