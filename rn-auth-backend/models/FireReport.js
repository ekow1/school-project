import mongoose from 'mongoose';

const fireReportSchema = new mongoose.Schema({
    incidentType: {
        type: String,
        required: [true, 'Incident type is required'],
        trim: true
    },
    incidentName: {
        type: String,
        required: [true, 'Incident name is required'],
        trim: true
    },
    location: {
        coordinates: {
            latitude: { 
                type: Number, 
                required: [true, 'Latitude is required'],
                min: -90,
                max: 90
            },
            longitude: { 
                type: Number, 
                required: [true, 'Longitude is required'],
                min: -180,
                max: 180
            }
        },
        locationUrl: { 
            type: String,
            trim: true
        },
        locationName: { 
            type: String,
            trim: true
        }
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: [true, 'Station is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    reportedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'responding', 'resolved', 'closed'],
            message: 'Status must be one of: pending, responding, resolved, closed'
        },
        default: 'pending'
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'Priority must be one of: low, medium, high'
        },
        default: 'high'
    },
    // Additional fields for better reporting
    description: {
        type: String,
        trim: true
    },
    estimatedCasualties: {
        type: Number,
        min: 0,
        default: 0
    },
    estimatedDamage: {
        type: String,
        enum: ['minimal', 'moderate', 'severe', 'extensive'],
        default: 'minimal'
    },
    assignedPersonnel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FirePersonnel'
    }],
    responseTime: {
        type: Number, // in minutes
        min: 0
    },
    resolvedAt: {
        type: Date
    },
    notes: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for response time calculation
fireReportSchema.virtual('responseTimeMinutes').get(function() {
    if (this.reportedAt && this.resolvedAt) {
        return Math.round((this.resolvedAt - this.reportedAt) / (1000 * 60));
    }
    return null;
});

// Virtual for station details
fireReportSchema.virtual('stationDetails', {
    ref: 'Station',
    localField: 'station',
    foreignField: '_id',
    justOne: true
});

// Virtual for user details
fireReportSchema.virtual('userDetails', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Indexes for efficient queries
fireReportSchema.index({ station: 1 });
fireReportSchema.index({ userId: 1 });
fireReportSchema.index({ status: 1 });
fireReportSchema.index({ priority: 1 });
fireReportSchema.index({ reportedAt: -1 });
fireReportSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

// Pre-save middleware to validate station exists
fireReportSchema.pre('save', async function(next) {
    try {
        const Station = mongoose.model('Station');
        const station = await Station.findById(this.station);
        if (!station) {
            throw new Error('Referenced station does not exist');
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to validate user exists
fireReportSchema.pre('save', async function(next) {
    try {
        const User = mongoose.model('User');
        const user = await User.findById(this.userId);
        if (!user) {
            throw new Error('Referenced user does not exist');
        }
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('FireReport', fireReportSchema);
