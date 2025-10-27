import FirePersonnel from '../models/FirePersonnel.js';
import Subdivision from '../models/Subdivision.js';
import Department from '../models/Department.js';
import Station from '../models/Station.js';
import mongoose from 'mongoose';

// Create FirePersonnel
export const createFirePersonnel = async (req, res) => {
    try {
        const { name, rank, department, subdivision, role, station_id, station, region, watchroom, crew } = req.body;

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

        // Validate subdivision-department relationship if both provided
        if (subdivision && department) {
            const subdivisionDoc = await Subdivision.findById(subdivision).populate('department');
            if (!subdivisionDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Subdivision not found'
                });
            }

            if (subdivisionDoc.department._id.toString() !== department) {
                return res.status(400).json({
                    success: false,
                    message: 'Subdivision does not belong to the specified department'
                });
            }

            // Validate watchroom and crew for Operations department
            if (subdivisionDoc.department.name === 'Operations') {
                if (!watchroom || !crew) {
                    return res.status(400).json({
                        success: false,
                        message: 'Watchroom and crew are required for Operations department personnel'
                    });
                }
            }
        }

        const personnel = new FirePersonnel({
            name, rank, department, subdivision, role, station_id, station, region, watchroom, crew
        });
        await personnel.save();

        const populatedPersonnel = await FirePersonnel.findById(personnel._id)
            .populate('rank')
            .populate('department')
            .populate('subdivision')
            .populate('role')
            .populate('station_id');

        res.status(201).json({
            success: true,
            message: 'Fire personnel created successfully',
            data: populatedPersonnel
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
        const { subdivision, station_id, station, region, rank, department } = req.query;
        const filter = {};

        if (department) filter.department = department;
        if (subdivision) filter.subdivision = subdivision;
        if (station_id) {
            if (!mongoose.Types.ObjectId.isValid(station_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid station_id format'
                });
            }
            filter.station_id = station_id;
        }
        if (station) filter.station = station;
        if (region) filter.region = region;
        if (rank) filter.rank = rank;

        const personnel = await FirePersonnel.find(filter)
            .populate('rank')
            .populate('department')
            .populate('subdivision')
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
            .populate('subdivision')
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

        const { department, subdivision, station_id, watchroom, crew } = req.body;

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

        // If updating subdivision, validate that it belongs to the department
        if (subdivision) {
            const subdivisionDoc = await Subdivision.findById(subdivision).populate('department');
            if (!subdivisionDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Subdivision not found'
                });
            }

            // If both department and subdivision provided, validate they match
            if (department && subdivisionDoc.department._id.toString() !== department) {
                return res.status(400).json({
                    success: false,
                    message: 'Subdivision does not belong to the specified department'
                });
            }

            // Get existing personnel to check department
            const existingPersonnel = await FirePersonnel.findById(req.params.id);
            const targetDepartment = department || existingPersonnel.department;

            // Check if it's Operations department
            if (subdivisionDoc.department.name === 'Operations') {
                const newWatchroom = watchroom !== undefined ? watchroom : existingPersonnel.watchroom;
                const newCrew = crew !== undefined ? crew : existingPersonnel.crew;

                if (!newWatchroom || !newCrew) {
                    return res.status(400).json({
                        success: false,
                        message: 'Watchroom and crew are required for Operations department personnel'
                    });
                }
            }
        }

        const personnel = await FirePersonnel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('rank')
        .populate('department')
        .populate('subdivision')
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

// Get Personnel by Subdivision
export const getPersonnelBySubdivision = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.subdivisionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subdivision ID format'
            });
        }

        const personnel = await FirePersonnel.find({ subdivision: req.params.subdivisionId })
            .populate('rank')
            .populate('department')
            .populate('subdivision')
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
            .populate('subdivision')
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
            .populate('subdivision')
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

