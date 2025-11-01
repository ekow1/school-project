import FirePersonnel from '../models/FirePersonnel.js';
import Unit from '../models/Unit.js';
import Department from '../models/Department.js';
import Station from '../models/Station.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Create FirePersonnel
export const createFirePersonnel = async (req, res) => {
    try {
        const { serviceNumber, name, rank, department, unit, role, station_id, tempPassword } = req.body;
        
        if (!serviceNumber) {
            return res.status(400).json({
                success: false,
                message: 'Service number is required'
            });
        }
        
        // Generate temporary password if not provided
        let generatedTempPassword = tempPassword;
        if (!generatedTempPassword) {
            // Generate a random 8-character password
            generatedTempPassword = Math.random().toString(36).slice(-8).toUpperCase();
        }
        
        // Hash the temporary password
        const hashedTempPassword = await bcrypt.hash(generatedTempPassword, 10);
        
        // Set expiry for 7 days from now
        const tempPasswordExpiry = new Date();
        tempPasswordExpiry.setDate(tempPasswordExpiry.getDate() + 7);

        // Validate station_id if provided
        if (station_id) {
            if (!mongoose.Types.ObjectId.isValid(station_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid station_id format'
                });
            }

            // Check if station exists
            const stationDoc = await Station.findById(station_id);
            if (!stationDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Station not found'
                });
            }
        }

        // Validate unit-department relationship if both provided
        if (unit && department) {
            const unitDoc = await Unit.findById(unit).populate('department');
            if (!unitDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Unit not found'
                });
            }

            if (unitDoc.department._id.toString() !== department) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit does not belong to the specified department'
                });
            }
        }

        const personnel = new FirePersonnel({
            serviceNumber, 
            name, 
            rank, 
            department, 
            unit, 
            role, 
            station_id, 
            tempPassword: hashedTempPassword,
            tempPasswordExpiry: tempPasswordExpiry,
            passwordResetRequired: true
        });
        await personnel.save();

        const populatedPersonnel = await FirePersonnel.findById(personnel._id)
            .populate('rank')
            .populate('department')
            .populate('unit')
            .populate('role')
            .populate('station_id');

        res.status(201).json({
            success: true,
            message: 'Fire personnel created successfully. Temporary password set for 7 days.',
            data: populatedPersonnel,
            tempPassword: generatedTempPassword, // Return the plain text temp password so admin can share it
            tempPasswordExpiry: tempPasswordExpiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All FirePersonnel
export const getAllFirePersonnel = async (req, res) => {
    try {
        const { unit, station_id, rank, department } = req.query;
        const filter = {};

        if (department) filter.department = department;
        if (unit) filter.unit = unit;
        if (station_id) {
            if (!mongoose.Types.ObjectId.isValid(station_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid station_id format'
                });
            }
            filter.station_id = station_id;
        }
        if (rank) filter.rank = rank;

        const personnel = await FirePersonnel.find(filter)
            .populate('rank')
            .populate('department')
            .populate('unit')
            .populate('role')
            .populate('station_id')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: personnel.length,
            data: personnel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get FirePersonnel By ID
export const getFirePersonnelById = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid personnel ID format'
            });
        }

        const personnel = await FirePersonnel.findById(req.params.id)
            .populate('rank')
            .populate('department')
            .populate('unit')
            .populate('role')
            .populate('station_id');

        if (!personnel) {
            return res.status(404).json({
                success: false,
                message: 'Fire personnel not found'
            });
        }

        res.status(200).json({
            success: true,
            data: personnel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update FirePersonnel
export const updateFirePersonnel = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid personnel ID format'
            });
        }

        const { department, unit, station_id } = req.body;

        // Validate station_id if provided
        if (station_id) {
            if (!mongoose.Types.ObjectId.isValid(station_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid station_id format'
                });
            }

            // Check if station exists
            const stationDoc = await Station.findById(station_id);
            if (!stationDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Station not found'
                });
            }
        }

        // If updating unit, validate that it belongs to the department
        if (unit) {
            const unitDoc = await Unit.findById(unit).populate('department');
            if (!unitDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Unit not found'
                });
            }

            // If both department and unit provided, validate they match
            if (department && unitDoc.department._id.toString() !== department) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit does not belong to the specified department'
                });
            }

        }

        const updateData = { ...req.body };

        const personnel = await FirePersonnel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('rank')
        .populate('department')
        .populate('unit')
        .populate('role')
        .populate('station_id');

        if (!personnel) {
            return res.status(404).json({
                success: false,
                message: 'Fire personnel not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fire personnel updated successfully',
            data: personnel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete FirePersonnel
export const deleteFirePersonnel = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid personnel ID format'
            });
        }

        const personnel = await FirePersonnel.findByIdAndDelete(req.params.id);

        if (!personnel) {
            return res.status(404).json({
                success: false,
                message: 'Fire personnel not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fire personnel deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Personnel by Unit
export const getPersonnelByUnit = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.unitId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid unit ID format'
            });
        }

        const personnel = await FirePersonnel.find({ unit: req.params.unitId })
            .populate('rank')
            .populate('department')
            .populate('unit')
            .populate('role')
            .populate('station_id')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: personnel.length,
            data: personnel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Personnel by Department
export const getPersonnelByDepartment = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.departmentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid department ID format'
            });
        }

        const personnel = await FirePersonnel.find({ department: req.params.departmentId })
            .populate('rank')
            .populate('department')
            .populate('unit')
            .populate('role')
            .populate('station_id')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: personnel.length,
            data: personnel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Personnel by Station
export const getPersonnelByStation = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.stationId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid station ID format'
            });
        }

        const personnel = await FirePersonnel.find({ station_id: req.params.stationId })
            .populate('rank')
            .populate('department')
            .populate('unit')
            .populate('role')
            .populate('station_id')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: personnel.length,
            data: personnel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

