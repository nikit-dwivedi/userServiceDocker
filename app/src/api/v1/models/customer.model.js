const mongoose = require('mongoose');
const Schema = mongoose.Schema

const addressSchema = new Schema({
    locality: {
        type: String
    },
    address: {
        type: String
    },
    houseNo: {
        type: String
    },
    road: {
        type: String
    },
    tag: {
        type: String
    },
    longitude: {
        type: String
    },
    latitude: {
        type: String
    },
    isActive: {
        type: String
    },
    location: {
        type: { type: String },
        coordinates: [],
    }
})

const customerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
    },
    email:{
        type:String,
    },
    phone: {
        type: String,
    },
    image: {
        type: String,
    },
    addressList: {
        type: [addressSchema],
        default: []
    },
}, { timestamps: true })
addressSchema.index({ location: "2dsphere" });
const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;