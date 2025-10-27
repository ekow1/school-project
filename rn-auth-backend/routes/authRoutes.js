import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Create a new user account with phone, name, password, and optional email and address. Returns JWT token and user data upon successful registration. If country is not provided, it defaults to "Ghana".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             name: "Jane Doe"
 *             phone: "+233201234567"
 *             email: "janedoe@example.com"
 *             password: "securePassword123"
 *             address: "East Legon, Accra"
 *             country: "Ghana"
 *             dob: "1992-05-15"
 *             image: "https://randomuser.me/api/portraits/women/44.jpg"
 *             ghanaPost: "GA-184-1234"
 *     responses:
 *       201:
 *         description: User registered successfully with token and user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *             example:
 *               message: "User created successfully"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMmY5ZTNhZTEwYjRmMDAxNWI1YWNkYyIsImlhdCI6MTYzMDU0MDg0MiwiZXhwIjoxNjMwNjI3MjQyfQ.9kX_7J5KZ8Y4bQ_3kF7Lq4mN2dR8vT6wP1xY4sZ7vA8"
 *               user:
 *                 id: "507f1f77bcf86cd799439011"
 *                 name: "Jane Doe"
 *                 phone: "+233201234567"
 *                 email: "janedoe@example.com"
 *                 address: "East Legon, Accra"
 *                 country: "Ghana"
 *                 dob: "1992-05-15"
 *                 image: "https://randomuser.me/api/portraits/women/44.jpg"
 *                 ghanaPost: "GA-184-1234"
 *       400:
 *         description: Validation error or phone already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               phoneInUse:
 *                 value:
 *                   message: "Phone already in use"
 *               nameRequired:
 *                 value:
 *                   message: "Name is required"
 *               phoneRequired:
 *                 value:
 *                   message: "Phone number is required"
 *               invalidPhone:
 *                 value:
 *                   message: "Invalid phone number format. Use international format (e.g., +233201234567)"
 *               passwordTooShort:
 *                 value:
 *                   message: "Password must be at least 6 characters long"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Internal server error"
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     description: Authenticate user with phone and password, returns JWT token valid for 24 hours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             phone: "+1234567890"
 *             password: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMmY5ZTNhZTEwYjRmMDAxNWI1YWNkYyIsImlhdCI6MTYzMDU0MDg0MiwiZXhwIjoxNjMwNjI3MjQyfQ.9kX_7J5KZ8Y4bQ_3kF7Lq4mN2dR8vT6wP1xY4sZ7vA8"
 *               user:
 *                 id: "507f1f77bcf86cd799439011"
 *                 name: "John Doe"
 *                 phone: "+1234567890"
 *                 email: "john.doe@example.com"
 *                 address: "123 Main St, City, Country"
 *                 country: "USA"
 *                 dob: "1990-01-01"
 *                 image: "https://example.com/images/profile.jpg"
 *                 ghanaPost: "GA-184-1234"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               phoneRequired:
 *                 value:
 *                   message: "Phone number is required"
 *               passwordRequired:
 *                 value:
 *                   message: "Password is required"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid credentials"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Internal server error"
 */
router.post('/login', login);

export default router;
