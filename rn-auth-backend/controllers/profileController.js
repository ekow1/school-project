import User from '../models/User.js';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, address, country, dob, image, ghanaPost } = req.body;
        
        // Find user
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields if provided
        if (name) user.name = name;
        if (email !== undefined) user.email = email;
        if (address !== undefined) user.address = address;
        if (country !== undefined) user.country = country;
        if (dob !== undefined) user.dob = dob;
        if (image !== undefined) user.image = image;
        if (ghanaPost !== undefined) user.ghanaPost = ghanaPost;

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(req.userId).select('-password');
        res.status(200).json({ 
            message: 'Profile updated successfully',
            user: updatedUser 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(req.userId);
        
        res.status(200).json({ 
            message: 'Profile deleted successfully' 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
