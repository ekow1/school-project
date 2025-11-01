import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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

// Virtual for units
departmentSchema.virtual('units', {
    ref: 'Unit',
    localField: '_id',
    foreignField: 'department'
});

// Index for efficient queries
departmentSchema.index({ name: 1 }, { unique: true });

export default mongoose.model('Department', departmentSchema);

