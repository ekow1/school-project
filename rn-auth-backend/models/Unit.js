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
    groups: [{
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true
        },
        color: {
            type: String,
            required: true,
            default: '#000000',
            description: 'Group color for this unit'
        }
    }],
    shift: {
        type: String,
        trim: true,
        required: false,
        description: 'Shift identifier (e.g., "Day", "Night", "A", "B"). Required for Operations department units.'
    },
    isActive: {
        type: Boolean,
        default: false,
        description: 'Indicates if this unit is currently on duty. Only one unit can be active per department.'
    },
    activatedAt: {
        type: Date,
        required: false,
        description: 'Timestamp when the unit was activated. Used for automatic deactivation at 8 AM the next day.'
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

// Index for active unit queries
unitSchema.index({ department: 1, isActive: 1 });

export default mongoose.model('Unit', unitSchema);

