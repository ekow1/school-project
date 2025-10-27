import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    address: { type: String },
    country: { type: String },
    dob: { type: Date },
    image: { type: String },
    gpsAddress: { 
        type: {
            latitude: { type: Number },
            longitude: { type: Number },
            address: { type: String }
        },
        required: false
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
