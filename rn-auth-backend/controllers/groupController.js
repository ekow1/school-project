import Group from '../models/Group.js';
import mongoose from 'mongoose';

// Create Group
export const createGroup = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Group name is required' 
            });
        }

        const group = new Group({ name });
        await group.save();

        res.status(201).json({ 
            success: true, 
            message: 'Group created successfully', 
            data: group 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Group name already exists' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Groups
export const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate('units')
            .sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: groups.length, 
            data: groups 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Group By ID
export const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('units');

        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: group 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Group
export const updateGroup = async (req, res) => {
    try {
        const { name } = req.body;

        const group = await Group.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Group updated successfully', 
            data: group 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Group name already exists' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete Group
export const deleteGroup = async (req, res) => {
    try {
        // Check if group is being used by any units
        const Unit = mongoose.model('Unit');
        const unitsUsingGroup = await Unit.find({ 'groups.groupId': req.params.id });

        if (unitsUsingGroup.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete group. It is currently assigned to ${unitsUsingGroup.length} unit(s).`,
                unitsCount: unitsUsingGroup.length
            });
        }

        const group = await Group.findByIdAndDelete(req.params.id);

        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Group deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

