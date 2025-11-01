import mongoose from 'mongoose';

const firePersonnelSchema = new mongoose.Schema({
    serviceNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    rank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rank',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: false
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: false
    },
    station_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: false
    },
    station: {
        type: String,
        required: true
    },
    tempPassword: {
        type: String,
        required: false,
        select: false // Don't include password in queries by default
    },
    password: {
        type: String,
        required: false,
        select: false // Don't include password in queries by default
    },
    tempPasswordExpiry: {
        type: Date,
        required: false
    },
    passwordResetRequired: {
        type: Boolean,
        default: true // Require password reset on first login if temp password was set
    },
}, { 
    timestamps: true 
});

// Index for efficient queries
firePersonnelSchema.index({ serviceNumber: 1 });
firePersonnelSchema.index({ department: 1, unit: 1 });
firePersonnelSchema.index({ station_id: 1 });
firePersonnelSchema.index({ station: 1 });
firePersonnelSchema.index({ rank: 1 });

export default mongoose.model('FirePersonnel', firePersonnelSchema);

