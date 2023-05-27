const { sellerFormatter } = require('../formatter/auth.format');
const authModel = require('../models/auth.model');
const sellerModel = require('../models/seller.model');

exports.addSellerDetails = async (userId, bodyData, role) => {
    try {
        const { status } = await this.sellerById(userId);
        if (status) {
            return { status: false, message: "seller already onboared" }
        }
        if (!bodyData.basicDetails.phone) {
            const authData = await authModel.findOne({ userId })
            if (!authData) {
                return { status: false, message: "seller not found" }
            }
            if (!authData.phone) {
                return { status: false, message: "please provide phone number" }
            }
            bodyData.basicDetails.phone = authData.phone
        }
        let sellerFormat
        if (role == 3) {
            sellerFormat = bodyData;
        } else {
            sellerFormat = sellerFormatter(userId, bodyData);
        }
        const saveData = await sellerModel(sellerFormat);
        await saveData.save()
        await markUserOnboarded(userId, "seller");
        return { status: true, message: "seller onboared successfully" }
    } catch (error) {
        console.log(error);
        return { status: false, message: error.message }
    }
}

exports.getAllSeller = async () => {
    try {
        const sellerData = await sellerModel.find().select('-_id -__v');
        if (!sellerData[0]) {
            return { status: false, message: "no Seller found", data: [] }
        }
        return { status: true, message: "Seller list", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}
exports.updateSellerInfo = async (sellerId, updateData) => {
    try {
        // const { } = updateData
        const sellerData = await sellerModel.find().select('-_id -__v');
        if (!sellerData[0]) {
            return { status: false, message: "no Seller found", data: [] }
        }
        return { status: true, message: "Seller list", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}
exports.getAllAgentSeller = async (agentId) => {
    try {
        const sellerData = await sellerModel.find({ agentId }).select('-_id -__v');
        if (!sellerData[0]) {
            return { status: false, message: "no Seller found", data: [] }
        }
        return { status: true, message: "Seller list", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.sellerById = async (userId) => {
    try {
        const sellerData = await sellerModel.findOne({ userId });
        if (!sellerData) {
            return { status: false, message: "Seller not found", data: {} }
        }
        return { status: true, message: "Seller info", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.addYeloId = async (sellerId, yeloId) => {
    try {
        let sellerData = await sellerModel.findOne({ sellerId });
        if (!sellerData) {
            return { status: false, message: "Seller not found", data: {} }
        }
        if (yeloId.length >= 1 && typeof yeloId != 'string') {
            yeloId.forEach(async element => {
                await sellerModel.updateOne({ sellerId }, { $push: { yeloId: element } });
            });
        } else {
            await sellerModel.updateOne({ sellerId }, { $push: { yeloId: yeloId } });
        }
        return { status: true, message: "yelo id Added" }
    } catch (error) {
        console.log(error);
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.sellerBySellerId = async (sellerId) => {
    try {
        const sellerData = await sellerModel.findOne({ sellerId }).select('-_id -__v -isVerfied -userId')
        if (!sellerData) {
            return { status: false, message: "Seller not found", data: {} }
        }
        return { status: true, message: "Seller info", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.changeVerifyStatus = async (sellerId, status) => {
    try {
        let sellerData
        if (status) {
            sellerData = await sellerModel.findOneAndUpdate({ sellerId }, { verificationStatus: "approved", isVerfied: true });
        } else {
            sellerData = await sellerModel.findOneAndUpdate({ sellerId }, { verificationStatus: "rejected" });
        }
        return sellerData ? { status: true, message: "status changed", data: {} } : { status: false, message: "status not changed", data: {} }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

// exports.addNewOutlet = async ()=>{
//     try {

//     } catch (error) {

//     }
// }
const markUserOnboarded = async (userId) => {
    try {
        await authModel.findOneAndUpdate({ userId: userId }, { isSellerOnboarded: true })
        return true
    } catch (error) {
        return false
    }
}