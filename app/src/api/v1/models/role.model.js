const mongoose = require('mongoose');
const Schema = mongoose.Schema

const permissionSchema = new Schema({
    view: {
        type: Boolean,
        default: false
    },
    edit: {
        type: Boolean,
        default: false,
    },
    add: {
        type: Boolean,
        default: false
    },
    delete: {
        type: Boolean,
        default: false
    }
})

const featureSchema = new Schema({
    seller: {
        type: permissionSchema
    },
    customer: {
        type: permissionSchema
    },
    partner: {
        type: permissionSchema
    },
    employ: {
        type: permissionSchema
    },
    outlet: {
        type: permissionSchema
    },
    product: {
        type: permissionSchema
    },
    category: {
        type: permissionSchema
    },
    cusine: {
        type: permissionSchema
    },
    transaction: {
        type: permissionSchema
    },
    order: {
        type: permissionSchema
    },
})

const roleSchema = new Schema({
    userId:{
        type:String
    },
    roleId: {
        type: String
    },
    roleName: {
        type: String
    },
    permissions: {
        type: featureSchema
    },
    isActive: {
        type: Boolean,
        default: true
    }
})
const roleModel = mongoose.model('role', roleSchema);
module.exports = roleModel