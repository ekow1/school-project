import Department from '../models/Department.js';
import mongoose from 'mongoose';

// Create Department
export const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Department name is required'
            });
        }

        const department = new Department({ name, description });
        await department.save();

        const populatedDepartment = await Department.findById(department._id)
            .populate('units');

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: populatedDepartment
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Department name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .populate('units')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Department By ID
export const getDepartmentById = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid department ID format'
            });
        }

        const department = await Department.findById(req.params.id)
            .populate('units');

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Department
export const updateDepartment = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid department ID format'
            });
        }

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('units');

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Department name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid department ID format'
            });
        }

        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


