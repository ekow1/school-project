import Station from '../models/Station.js';
import mongoose from 'mongoose';

// Create Station (with upsert functionality)
export const createStation = async (req, res) => {
    try {
        const { name, call_sign, location, location_url, coordinates, region, phone_number } = req.body;

        // Validate coordinates if provided
        if (coordinates) {
            // Handle both lat/lng and latitude/longitude formats
            let lat, lng;
            
            if (coordinates.lat !== undefined && coordinates.lng !== undefined) {
                lat = coordinates.lat;
                lng = coordinates.lng;
            } else if (coordinates.latitude !== undefined && coordinates.longitude !== undefined) {
                lat = coordinates.latitude;
                lng = coordinates.longitude;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Coordinates must include lat/lng or latitude/longitude'
                });
            }

            if (typeof lat !== 'number' || typeof lng !== 'number') {
                return res.status(400).json({
                    success: false,
                    message: 'Coordinates must be numbers (lat and lng)'
                });
            }
            if (lat < -90 || lat > 90) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitude must be between -90 and 90'
                });
            }
            if (lng < -180 || lng > 180) {
                return res.status(400).json({
                    success: false,
                    message: 'Longitude must be between -180 and 180'
                });
            }

            // Normalize coordinates to lat/lng format
            coordinates = { lat, lng };
        }

        // Check if station already exists based on location, coordinates, or phone number
        let existingStation = null;
        
        // Check by coordinates (most reliable)
        if (coordinates && coordinates.lat && coordinates.lng) {
            existingStation = await Station.findOne({
                'coordinates.lat': coordinates.lat,
                'coordinates.lng': coordinates.lng
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
            if (coordinates && !existingStation.coordinates) updateData.coordinates = coordinates;
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
        const station = new Station({ name, call_sign, location, location_url, coordinates, region, phone_number });
        await station.save();

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

                // Validate coordinates if provided
                if (coordinates) {
                    // Handle both lat/lng and latitude/longitude formats
                    let lat, lng;
                    
                    if (coordinates.lat !== undefined && coordinates.lng !== undefined) {
                        lat = coordinates.lat;
                        lng = coordinates.lng;
                    } else if (coordinates.latitude !== undefined && coordinates.longitude !== undefined) {
                        lat = coordinates.latitude;
                        lng = coordinates.longitude;
                    } else {
                        results.errors.push({
                            index: i,
                            data: stationData,
                            error: 'Coordinates must include lat/lng or latitude/longitude'
                        });
                        continue;
                    }

                    if (typeof lat !== 'number' || typeof lng !== 'number') {
                        results.errors.push({
                            index: i,
                            data: stationData,
                            error: 'Coordinates must be numbers (lat and lng)'
                        });
                        continue;
                    }
                    if (lat < -90 || lat > 90) {
                        results.errors.push({
                            index: i,
                            data: stationData,
                            error: 'Latitude must be between -90 and 90'
                        });
                        continue;
                    }
                    if (lng < -180 || lng > 180) {
                        results.errors.push({
                            index: i,
                            data: stationData,
                            error: 'Longitude must be between -180 and 180'
                        });
                        continue;
                    }

                    // Normalize coordinates to lat/lng format
                    stationData.coordinates = { lat, lng };
                }

                // Check if station already exists
                let existingStation = null;
                
                // Check by coordinates (most reliable)
                if (coordinates && coordinates.lat && coordinates.lng) {
                    existingStation = await Station.findOne({
                        'coordinates.lat': coordinates.lat,
                        'coordinates.lng': coordinates.lng
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
                    if (coordinates && !existingStation.coordinates) updateData.coordinates = coordinates;
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
                    const station = new Station({ name, call_sign, location, location_url, coordinates, region, phone_number });
                    await station.save();

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

        // Validate coordinates if provided
        if (coordinates) {
            // Handle both lat/lng and latitude/longitude formats
            let lat, lng;
            
            if (coordinates.lat !== undefined && coordinates.lng !== undefined) {
                lat = coordinates.lat;
                lng = coordinates.lng;
            } else if (coordinates.latitude !== undefined && coordinates.longitude !== undefined) {
                lat = coordinates.latitude;
                lng = coordinates.longitude;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Coordinates must include lat/lng or latitude/longitude'
                });
            }

            if (typeof lat !== 'number' || typeof lng !== 'number') {
                return res.status(400).json({
                    success: false,
                    message: 'Coordinates must be numbers (lat and lng)'
                });
            }
            if (lat < -90 || lat > 90) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitude must be between -90 and 90'
                });
            }
            if (lng < -180 || lng > 180) {
                return res.status(400).json({
                    success: false,
                    message: 'Longitude must be between -180 and 180'
                });
            }

            // Normalize coordinates to lat/lng format
            req.body.coordinates = { lat, lng };
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
