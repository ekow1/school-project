import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Unit name is required'],
        trim: true
    },
    color: {
        type: String,
        default: '#000000'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department is required']
    },
    groupNames: {
        type: [String],
        default: []
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for personnel in this unit
unitSchema.virtual('personnel', {
    ref: 'FirePersonnel',
    localField: '_id',
    foreignField: 'unit'
});

// Compound index for unique unit per department
unitSchema.index({ name: 1, department: 1 }, { unique: true });

export default mongoose.model('Unit', unitSchema);

