import Station from '../models/Station.js';
import mongoose from 'mongoose';

// Create Station (with upsert functionality)
export const createStation = async (req, res) => {
    try {
        const { name, call_sign, location, location_url, coordinates, region, phone_number } = req.body;
        
        console.log('Received request body:', req.body);
        console.log('Extracted coordinates:', coordinates);

        // Validate coordinates if provided (basic validation only)
        if (coordinates && typeof coordinates !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Coordinates must be an object'
            });
        }

        // Check if station already exists based on location, coordinates, or phone number
        let existingStation = null;
        
        // Check by coordinates (most reliable) - compare entire coordinates object
        if (coordinates) {
            existingStation = await Station.findOne({
                coordinates: coordinates
            });
        }
        
        // Check by location if coordinates not found
        if (!existingStation && location) {
            existingStation = await Station.findOne({
                location: { $regex: new RegExp(location, 'i') }
            });
        }
        
        // Check by phone number if still not found
        if (!existingStation && phone_number) {
            existingStation = await Station.findOne({
                phone_number: phone_number
            });
        }

        if (existingStation) {
            // Update existing station with missing data
            const updateData = {};
            
            if (name && !existingStation.name) updateData.name = name;
            if (call_sign && !existingStation.call_sign) updateData.call_sign = call_sign;
            if (location && !existingStation.location) updateData.location = location;
            if (location_url && !existingStation.location_url) updateData.location_url = location_url;
            // Update coordinates if provided and different from existing
            if (coordinates) {
                const needsUpdate = !existingStation.coordinates || 
                    JSON.stringify(existingStation.coordinates) !== JSON.stringify(coordinates);
                
                if (needsUpdate) {
                    updateData.coordinates = coordinates;
                }
            }
            if (region && !existingStation.region) updateData.region = region;
            if (phone_number && !existingStation.phone_number) updateData.phone_number = phone_number;

            if (Object.keys(updateData).length > 0) {
                const updatedStation = await Station.findByIdAndUpdate(
                    existingStation._id,
                    updateData,
                    { new: true, runValidators: true }
                );

                return res.status(200).json({
                    success: true,
                    message: 'Station updated with missing data',
                    data: updatedStation,
                    action: 'updated'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Station already exists with all data',
                    data: existingStation,
                    action: 'skipped'
                });
            }
        }

        // Create new station if not found
        const stationData = { name, call_sign, location, location_url, region, phone_number };
        
        // Always add coordinates if they exist (even if empty object)
        if (coordinates !== undefined && coordinates !== null) {
            stationData.coordinates = coordinates;
            console.log('Adding coordinates to stationData:', coordinates);
        }
        
        console.log('Final stationData before creating Station:', stationData);
        const station = await Station.create(stationData);
        console.log('Station created with coordinates:', station.coordinates);

        res.status(201).json({
            success: true,
            message: 'Station created successfully',
            data: station,
            action: 'created'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Call sign already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk Create Stations (with upsert functionality)
export const bulkCreateStations = async (req, res) => {
    try {
        const { stations } = req.body;

        if (!Array.isArray(stations)) {
            return res.status(400).json({
                success: false,
                message: 'Stations must be an array'
            });
        }

        const results = {
            created: [],
            updated: [],
            skipped: [],
            errors: []
        };

        for (let i = 0; i < stations.length; i++) {
            try {
                const stationData = stations[i];
                const { name, call_sign, location, location_url, coordinates, region, phone_number } = stationData;

                // Validate coordinates if provided (basic validation only)
                if (coordinates && typeof coordinates !== 'object') {
                    results.errors.push({
                        index: i,
                        data: stationData,
                        error: 'Coordinates must be an object'
                    });
                    continue;
                }

                // Check if station already exists
                let existingStation = null;
                
                // Check by coordinates (most reliable) - compare entire coordinates object
                if (stationData.coordinates) {
                    existingStation = await Station.findOne({
                        coordinates: stationData.coordinates
                    });
                }
                
                // Check by location if coordinates not found
                if (!existingStation && location) {
                    existingStation = await Station.findOne({
                        location: { $regex: new RegExp(location, 'i') }
                    });
                }
                
                // Check by phone number if still not found
                if (!existingStation && phone_number) {
                    existingStation = await Station.findOne({
                        phone_number: phone_number
                    });
                }

                if (existingStation) {
                    // Update existing station with missing data
                    const updateData = {};
                    
                    if (name && !existingStation.name) updateData.name = name;
                    if (call_sign && !existingStation.call_sign) updateData.call_sign = call_sign;
                    if (location && !existingStation.location) updateData.location = location;
                    if (location_url && !existingStation.location_url) updateData.location_url = location_url;
                    // Update coordinates if provided and different from existing
                    if (stationData.coordinates) {
                        const needsUpdate = !existingStation.coordinates || 
                            JSON.stringify(existingStation.coordinates) !== JSON.stringify(stationData.coordinates);
                        
                        if (needsUpdate) {
                            updateData.coordinates = stationData.coordinates;
                        }
                    }
                    if (region && !existingStation.region) updateData.region = region;
                    if (phone_number && !existingStation.phone_number) updateData.phone_number = phone_number;

                    if (Object.keys(updateData).length > 0) {
                        const updatedStation = await Station.findByIdAndUpdate(
                            existingStation._id,
                            updateData,
                            { new: true, runValidators: true }
                        );

                        results.updated.push({
                            index: i,
                            data: updatedStation,
                            action: 'updated'
                        });
                    } else {
                        results.skipped.push({
                            index: i,
                            data: existingStation,
                            action: 'skipped'
                        });
                    }
                } else {
                    // Create new station
                    const station = await Station.create({ name, call_sign, location, location_url, coordinates, region, phone_number });

                    results.created.push({
                        index: i,
                        data: station,
                        action: 'created'
                    });
                }
            } catch (error) {
                if (error.code === 11000) {
                    results.errors.push({
                        index: i,
                        data: stations[i],
                        error: 'Call sign already exists'
                    });
                } else {
                    results.errors.push({
                        index: i,
                        data: stations[i],
                        error: error.message
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Bulk operation completed. Created: ${results.created.length}, Updated: ${results.updated.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`,
            results: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Stations
export const getAllStations = async (req, res) => {
    try {
        const { region } = req.query;
        const filter = {};

        if (region) filter.region = region;

        const stations = await Station.find(filter)
            .populate('departments')
            .populate('personnel')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: stations.length,
            data: stations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Station By ID
export const getStationById = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid station ID format'
            });
        }

        const station = await Station.findById(req.params.id)
            .populate('departments')
            .populate('personnel');

        if (!station) {
            return res.status(404).json({
                success: false,
                message: 'Station not found'
            });
        }

        res.status(200).json({
            success: true,
            data: station
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Station
export const updateStation = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid station ID format'
            });
        }

        const { coordinates } = req.body;

        // Validate coordinates if provided (basic validation only)
        if (coordinates && typeof coordinates !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Coordinates must be an object'
            });
        }

        const station = await Station.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!station) {
            return res.status(404).json({
                success: false,
                message: 'Station not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Station updated successfully',
            data: station
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Call sign already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Station
export const deleteStation = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid station ID format'
            });
        }

        const station = await Station.findByIdAndDelete(req.params.id);

        if (!station) {
            return res.status(404).json({
                success: false,
                message: 'Station not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Station deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
