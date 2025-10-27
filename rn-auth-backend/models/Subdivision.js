import mongoose from 'mongoose';

const subdivisionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subdivision name is required'],
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
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for personnel in this subdivision
subdivisionSchema.virtual('personnel', {
    ref: 'FirePersonnel',
    localField: '_id',
    foreignField: 'subdivision'
});

// Compound index for unique subdivision per department
subdivisionSchema.index({ name: 1, department: 1 }, { unique: true });

export default mongoose.model('Subdivision', subdivisionSchema);

