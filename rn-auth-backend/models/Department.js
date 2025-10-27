import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    station_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: false
    },
    description: {
        type: String,
        required: false
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for subdivisions
departmentSchema.virtual('subdivisions', {
    ref: 'Subdivision',
    localField: '_id',
    foreignField: 'department'
});

// Virtual for personnel
departmentSchema.virtual('personnel', {
    ref: 'FirePersonnel',
    localField: '_id',
    foreignField: 'department'
});

// Virtual for station
departmentSchema.virtual('station', {
    ref: 'Station',
    localField: 'station_id',
    foreignField: '_id',
    justOne: true
});

// Index for efficient queries
departmentSchema.index({ station_id: 1 });
departmentSchema.index({ name: 1 });

export default mongoose.model('Department', departmentSchema);

