import mongoose from 'mongoose';

const rankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Rank name is required'],
        unique: true,
        trim: true
    },
    initials: {
        type: String,
        required: [true, 'Rank initials are required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    level: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true,
        trim: true,
        description: 'Description of the rank'
    }
}, { 
    timestamps: true 
});

export default mongoose.model('Rank', rankSchema);


