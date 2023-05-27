const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        unique: true,
        required: true
    },
    basicDetails: {
        sellerName: {
            type: String
        },
        tradeName: {
            type: String
        },
        sellerType: {
            type: String,
            enum: ['enterprise', 'individual']
        },
        isGst: {
            type: Boolean
        },
        gstNo: {
            type: String
        },
        panNumber: {
            type: String,
        },
        phone: {
            type: String,
        }
    },
    licenseDetails: {
        nameOnlicence: {
            type: String
        },
        licenceNumber: {
            type: String,
        },
        licenceType: {
            type: String,
        },
        licenceImage: {
            type: String
        },
        issuedOn: {
            type: String
        },
        tenure: {
            type: String
        },
    },
    authorizedPersonDetails: {
        name: {
            type: String
        },
        pan: {
            type: String
        },
        phone: {
            type: String
        },
        email: {
            type: String
        }
    },
    verificationStatus: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    yeloId: {
        type: Array,
    },
    agentId: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    numberOfShop: {
        type: Number,
        default: 0
    },
    outletList: {
        type: Array,
        default: []
    },
})

const sellerModel = mongoose.model('seller', sellerSchema);
module.exports = sellerModel;