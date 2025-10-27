import mongoose from 'mongoose';

const firePersonnelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    rank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rank',
        required: false
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: false
    },
    subdivision: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subdivision',
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
        required: false
    },
    region: {
        type: String,
        required: false
    },
    // Operations Department specific fields (optional, validation in controller)
    watchroom: {
        type: String
    },
    crew: {
        type: String
    }
}, { 
    timestamps: true 
});

// Index for efficient queries
firePersonnelSchema.index({ department: 1, subdivision: 1 });
firePersonnelSchema.index({ station_id: 1 });
firePersonnelSchema.index({ station: 1, region: 1 });
firePersonnelSchema.index({ rank: 1 });

export default mongoose.model('FirePersonnel', firePersonnelSchema);

