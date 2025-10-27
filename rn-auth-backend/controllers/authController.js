import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, phone, email, password, address, country, dob, image, ghanaPost } = req.body;
        console.log('request', req.body);

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (!phone || phone.trim().length === 0) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate phone format (basic check for international format)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
            return res.status(400).json({ message: 'Invalid phone number format. Use international format (e.g., +233201234567)' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if phone already exists
        const existing = await User.findOne({ phone });
        if (existing) return res.status(400).json({ message: 'Phone already in use' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ 
            name, 
            phone, 
            email, 
            password: hashed,
            address,
            country,
            dob,
            image,
            ghanaPost
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return user data without password
        res.status(201).json({ 
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                address: user.address,
                country: user.country,
                dob: user.dob,
                image: user.image,
                ghanaPost: user.ghanaPost
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validate required fields
        if (!phone || phone.trim().length === 0) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        if (!password || password.trim().length === 0) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                address: user.address,
                country: user.country,
                dob: user.dob,
                image: user.image,
                ghanaPost: user.ghanaPost
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
