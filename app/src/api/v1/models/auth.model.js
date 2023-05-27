const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    userId: {
        type: String,
        unique: true
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
    },
    otp: {
        type: String
    },
    isPhoneOtp: {
        type: Boolean,
        default: true
    },
    reqId: {
        type: String,
        unique: true
    },
    userType: {
        type: String,
        enum: ["customer", "seller", "partner", "mrWhiteHatHacker"],
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    isClientOnboarded: {
        type: Boolean,
        default: false
    },
    isSellerOnboarded: {
        type: Boolean,
        default: false
    },
    isPartnerOnboarded: {
        type: Boolean,
        default: false
    },
    noOfOtp: {
        type: Number,
        default: 1
    },
    date: {
        type: Number,
    }
})
const authModel = mongoose.model('auth', authSchema);
module.exports = authModel;