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
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: false,
        description: 'Department assigned to handle this report (typically Operations)'
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: false,
        description: 'Active unit assigned to handle this report'
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Reporter ID is required'],
        refPath: 'reporterType'
    },
    reporterType: {
        type: String,
        enum: ['User', 'FirePersonnel'],
        required: true
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
    },
    // Action fields - only available after unit receives the alert
    dispatched: {
        type: Boolean,
        default: false,
        description: 'Whether the active unit has dispatched to handle this report'
    },
    dispatchedAt: {
        type: Date,
        required: false,
        description: 'Timestamp when the unit dispatched'
    },
    declined: {
        type: Boolean,
        default: false,
        description: 'Whether the active unit has declined this report'
    },
    declinedAt: {
        type: Date,
        required: false,
        description: 'Timestamp when the unit declined'
    },
    declineReason: {
        type: String,
        trim: true,
        required: false,
        description: 'Reason for declining the report'
    },
    referred: {
        type: Boolean,
        default: false,
        description: 'Whether the report has been referred to another station'
    },
    referredAt: {
        type: Date,
        required: false,
        description: 'Timestamp when the report was referred'
    },
    referredToStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: false,
        description: 'Station ID that this report was referred to'
    },
    referReason: {
        type: String,
        trim: true,
        required: false,
        description: 'Reason for referring the report to another station'
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

// Virtual for reporter details
fireReportSchema.virtual('reporterDetails', {
    refPath: 'reporterType',
    localField: 'reporterId',
    foreignField: '_id',
    justOne: true
});

// Virtual for referred station details
fireReportSchema.virtual('referredStationDetails', {
    ref: 'Station',
    localField: 'referredToStation',
    foreignField: '_id',
    justOne: true
});

// Indexes for efficient queries
fireReportSchema.index({ station: 1 });
fireReportSchema.index({ department: 1 });
fireReportSchema.index({ unit: 1 });
fireReportSchema.index({ reporterId: 1 });
fireReportSchema.index({ reporterType: 1 });
fireReportSchema.index({ status: 1 });
fireReportSchema.index({ priority: 1 });
fireReportSchema.index({ reportedAt: -1 });
fireReportSchema.index({ dispatched: 1 });
fireReportSchema.index({ declined: 1 });
fireReportSchema.index({ referred: 1 });
fireReportSchema.index({ referredToStation: 1 });
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

// Pre-save middleware to validate reporter exists
fireReportSchema.pre('save', async function(next) {
    try {
        if (this.reporterType === 'User') {
            const User = mongoose.model('User');
            const user = await User.findById(this.reporterId);
            if (!user) {
                throw new Error('Referenced user does not exist');
            }
        } else if (this.reporterType === 'FirePersonnel') {
            const FirePersonnel = mongoose.model('FirePersonnel');
            const personnel = await FirePersonnel.findById(this.reporterId);
            if (!personnel) {
                throw new Error('Referenced fire personnel does not exist');
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('FireReport', fireReportSchema);
