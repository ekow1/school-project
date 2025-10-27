import Subdivision from '../models/Subdivision.js';

// Create Subdivision
export const createSubdivision = async (req, res) => {
    try {
        const { name, color, department } = req.body;

        if (!name || !department) {
            return res.status(400).json({ 
                success: false, 
                message: 'Subdivision name and department are required' 
            });
        }

        const subdivision = new Subdivision({ name, color, department });
        await subdivision.save();

        const populatedSubdivision = await Subdivision.findById(subdivision._id).populate('department');

        res.status(201).json({ 
            success: true, 
            message: 'Subdivision created successfully', 
            data: populatedSubdivision 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Subdivision name already exists for this department' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Subdivisions
export const getAllSubdivisions = async (req, res) => {
    try {
        const subdivisions = await Subdivision.find()
            .populate('department')
            .sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: subdivisions.length, 
            data: subdivisions 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Subdivision By ID
export const getSubdivisionById = async (req, res) => {
    try {
        const subdivision = await Subdivision.findById(req.params.id)
            .populate('department')
            .populate('personnel');

        if (!subdivision) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subdivision not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: subdivision 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Subdivision
export const updateSubdivision = async (req, res) => {
    try {
        const { name, color, department } = req.body;

        const subdivision = await Subdivision.findByIdAndUpdate(
            req.params.id,
            { name, color, department },
            { new: true, runValidators: true }
        ).populate('department');

        if (!subdivision) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subdivision not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Subdivision updated successfully', 
            data: subdivision 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Subdivision name already exists for this department' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete Subdivision
export const deleteSubdivision = async (req, res) => {
    try {
        const subdivision = await Subdivision.findByIdAndDelete(req.params.id);

        if (!subdivision) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subdivision not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Subdivision deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Subdivisions by Department
export const getSubdivisionsByDepartment = async (req, res) => {
    try {
        const subdivisions = await Subdivision.find({ department: req.params.departmentId })
            .populate('department')
            .sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: subdivisions.length, 
            data: subdivisions 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

