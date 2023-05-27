const { customerFormatter, customerEditFormatter } = require('../formatter/auth.format');
const { responseFormater } = require('../formatter/response.format');
const { customerRole } = require('../formatter/role.format');
const { generateUserToken } = require('../middlewares/authToken');
const authModel = require('../models/auth.model');
const customerModel = require('../models/customer.model');
const { defaultAvatar } = require('./avatar.helper');


exports.onboardCustomer = async (userId, userData) => {
    try {
        const { phone } = userData
        const userCheck = await customerModel.exists({ userId: userId })
        if (userCheck) {
            return { status: false, message: "customer already onboarded" }
        }
        if (!phone) {
            const authData = await authModel.findOne({ userId })
            if (!authData.phone) {
                return { status: false, message: "please provide phone number" }
            }
            userData.phone = authData.phone
        }
        const formattedData = customerFormatter(userId, userData);
        const saveData = new customerModel(formattedData);
        await markUserOnboarded(userId)
        const tokenData = { userId, customId: formattedData.customerId }
        const token = generateUserToken(tokenData)
        return await saveData.save() ? { status: true, message: "succesfully onboarded", data: { token, customerId: formattedData.customerId } } : { status: false, message: "please provide proper fields" };
    } catch (error) {
        console.log("=========helper", error);
        return { status: false, message: "please provide proper fields" }
    }
}
exports.addNewAddress = async (userId, addressData) => {
    try {
        const { locality, address, longitude, latitude } = addressData
        if (!locality || !address || !longitude || !latitude) {
            return responseFormater(false, "please provide valid data")
        }
        addressData.location = {
            'type': 'Point',
            'coordinates': [parseFloat(addressData.longitude), parseFloat(addressData.latitude)]
        }
        const addAddress = await customerModel.findOneAndUpdate({ userId }, { $push: { addressList: addressData } })
        return addAddress ? responseFormater(true, "address added successfully") : responseFormater(false, "address not added");
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.removeAddress = async (userId, addressId) => {
    try {
        const retailData = await customerModel.updateOne(
            { userId: userId },
            { $pull: { "addressList": { _id: addressId } } }
        );
        return retailData ? { status: true, message: "address removed successfully" } : { status: false, message: "address not removed" };
    } catch (error) {
        return { status: false, message: "please provide proper fields" }
    }
}
exports.getAddress = async (userId, clientLong, clientLat) => {
    try {
        let mainData = {}
        let checkLong = parseFloat(clientLong)
        let checkLat = parseFloat(clientLat)
        const outletList = await customerModel.aggregate(
            [
                {
                    "$geoNear": {
                        "near": {
                            "type": "Point",
                            "coordinates": [checkLong, checkLat]
                        },
                        "distanceField": "distance",
                        "spherical": true,
                        "maxDistance": 100,
                        "query": { userId: userId },
                        "includeLocs": "location"
                    },
                },
                // { "$unwind": "$addressList" },

                {
                    "$project": {
                        "_id": 0,
                        "location": 1,
                        // "addressList.address":0,
                        "addressList": 1,
                    }
                }
            ])
        if (outletList[0]) {
            mainData = findNearbyAddress(outletList[0].addressList, outletList[0].location)
            delete mainData.location
        }
        return outletList[0] ? responseFormater(true, "here is the address", mainData) : responseFormater(false, "please add new address", {})
    } catch (error) {
        console.log(error);
        return responseFormater(false, error.message, [])
    }
}
exports.customerById = async (userId) => {
    try {
        const customerData = await customerModel.findOne({ userId });
        if (!customerData) {
            return { status: false, message: "customer not found", data: {} }
        }
        customerData.image = customerData.image ?? (await defaultAvatar()).data.url
        return { status: true, message: "customer info", data: customerData }
    } catch (error) {
        return { status: false, message: error.message, data: error }
    }
}
exports.editUserDetails = async (customerId, customerData) => {
    try {
        if (customerId == "") {
            customerId = null
        }
        console.log(customerData);

        const formattedData = customerEditFormatter(customerData)
        console.log(formattedData);
        await customerModel.findOneAndUpdate({ customerId }, formattedData)
        return customerId ? responseFormater(true, "profile updated") : responseFormater(false, "user not boarded")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
const markUserOnboarded = async (userId, userType) => {
    try {
        await authModel.findOneAndUpdate({ userId: userId }, { isClientOnboarded: true })
        return true
    } catch (error) {
        return false
    }
}

const findNearbyAddress = (addressList, matchLocation) => {
    let returnData = {}
    addressList.forEach(element => {
        if (parseFloat(element.location.coordinates[0]) == matchLocation.coordinates[0] && parseFloat(element.location.coordinates[1]) == matchLocation.coordinates[1]) {
            returnData = element
        }
    });
    delete returnData.location
    return returnData
}