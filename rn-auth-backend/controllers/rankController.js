import Rank from '../models/Rank.js';

// Create Rank
export const createRank = async (req, res) => {
    try {
        const { name, initials, level, role } = req.body;

        if (!name || !initials) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rank name and initials are required' 
            });
        }

        const rank = new Rank({ name, initials: initials.toUpperCase(), level, role });
        await rank.save();

        res.status(201).json({ 
            success: true, 
            message: 'Rank created successfully', 
            data: rank 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rank name or initials already exists' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Ranks
export const getAllRanks = async (req, res) => {
    try {
        const ranks = await Rank.find().sort({ level: -1, name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: ranks.length, 
            data: ranks 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Rank By ID
export const getRankById = async (req, res) => {
    try {
        const rank = await Rank.findById(req.params.id);

        if (!rank) {
            return res.status(404).json({ 
                success: false, 
                message: 'Rank not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: rank 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Rank
export const updateRank = async (req, res) => {
    try {
        const { name, initials, level, role } = req.body;
        const updates = { name, level, role };
        
        if (initials) {
            updates.initials = initials.toUpperCase();
        }

        const rank = await Rank.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!rank) {
            return res.status(404).json({ 
                success: false, 
                message: 'Rank not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Rank updated successfully', 
            data: rank 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rank name or initials already exists' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete Rank
export const deleteRank = async (req, res) => {
    try {
        const rank = await Rank.findByIdAndDelete(req.params.id);

        if (!rank) {
            return res.status(404).json({ 
                success: false, 
                message: 'Rank not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Rank deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


