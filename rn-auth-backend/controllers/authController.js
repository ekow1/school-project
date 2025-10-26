import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, phone, password, address } = req.body;
        console.log( 'request',req.body);
        const existing = await User.findOne({ phone });
        if (existing) return res.status(400).json({ message: 'Phone already in use' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, phone, address, password: hashed });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
