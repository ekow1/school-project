import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    call_sign: {
        type: String,
        required: false,
        trim: true,
        unique: true,
        sparse: true
    },
    location: {
        type: String,
        required: false,
        trim: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: false,
            min: -90,
            max: 90
        },
        lng: {
            type: Number,
            required: false,
            min: -180,
            max: 180
        }
    },
    region: {
        type: String,
        required: false,
        trim: true
    },
    phone_number: {
        type: String,
        required: false,
        trim: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for departments in this station
stationSchema.virtual('departments', {
    ref: 'Department',
    localField: '_id',
    foreignField: 'station_id'
});

// Virtual for personnel in this station
stationSchema.virtual('personnel', {
    ref: 'Personnel',
    localField: '_id',
    foreignField: 'station_id'
});

// Index for efficient queries
stationSchema.index({ call_sign: 1 });
stationSchema.index({ region: 1 });
stationSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

export default mongoose.model('Station', stationSchema);
