import Subdivision from '../models/Unit.js';

// Create Unit
export const createSubdivision = async (req, res) => {
    try {
        const { name, color, department, groupNames } = req.body;

        if (!name || !department) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit name and department are required' 
            });
        }

        const unit = new Subdivision({ name, color, department, groupNames });
        await unit.save();

        const populatedUnit = await Subdivision.findById(unit._id).populate('department');

        res.status(201).json({ 
            success: true, 
            message: 'Unit created successfully', 
            data: populatedUnit 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit name already exists for this department' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Units
export const getAllSubdivisions = async (req, res) => {
    try {
        const units = await Subdivision.find()
            .populate('department')
            .sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: units.length, 
            data: units 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Unit By ID
export const getSubdivisionById = async (req, res) => {
    try {
        const unit = await Subdivision.findById(req.params.id)
            .populate('department')
            .populate('personnel');

        if (!unit) {
            return res.status(404).json({ 
                success: false, 
                message: 'Unit not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: unit 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Unit
export const updateSubdivision = async (req, res) => {
    try {
        const { name, color, department, groupNames } = req.body;

        const unit = await Subdivision.findByIdAndUpdate(
            req.params.id,
            { name, color, department, groupNames },
            { new: true, runValidators: true }
        ).populate('department');

        if (!unit) {
            return res.status(404).json({ 
                success: false, 
                message: 'Unit not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Unit updated successfully', 
            data: unit 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit name already exists for this department' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete Unit
export const deleteSubdivision = async (req, res) => {
    try {
        const unit = await Subdivision.findByIdAndDelete(req.params.id);

        if (!unit) {
            return res.status(404).json({ 
                success: false, 
                message: 'Unit not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Unit deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Units by Department
export const getSubdivisionsByDepartment = async (req, res) => {
    try {
        const units = await Subdivision.find({ department: req.params.departmentId })
            .populate('department')
            .sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: units.length, 
            data: units 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

