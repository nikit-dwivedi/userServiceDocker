const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    partnerId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
    },
    phone: {
        type: String
    },
    image: {
        type: String
    },
    dob: {
        type: String,
    },
    vehicleNo: {
        type: String,
    },
    gender: {
        type: String,
    },
    aadhaar: {
        type: String,
    },
    pan: {
        type: String,
    },
    insurance: {
        type: String,
        required: true
    },
    drivingLicense: {
        type: String,
        required: true
    },
    roamId: {
        type: String
    },
    rcCard: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    }
})

exports.partnerModel = mongoose.model("partner", partnerSchema);

