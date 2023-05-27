const { partnerFormatter } = require("../formatter/auth.format");
const { responseFormater } = require("../formatter/response.format");
const { createAuthToken } = require("../middlewares/authToken");
const authModel = require("../models/auth.model");
const { partnerModel } = require("../models/partner.model");
const { getRoamId } = require("./traker.helper");

exports.addPartner = async (userId, bodyData, authToken) => {
    try {
        const check = await partnerModel.exists({ userId })
        if (check) {
            return responseFormater(false, "already onboarded")
        }
        const response = await getRoamId(bodyData, authToken)
        if (!response.status) {
            console.log(response);
            return responseFormater(false, "please provide proper data")
        }
        const roamId = response.data.roamId
        const partnerId = response.data.partnerId
        const formattedData = partnerFormatter(bodyData, userId, roamId, partnerId);
        const saveData = new partnerModel(formattedData);
        await saveData.save();
        await markUserOnboarded(userId);
        formattedData.customId = formattedData.partnerId
        const token = createAuthToken("partner", formattedData)
        return responseFormater(true, "partner Onboarded", { token, partnerId: formattedData.partnerId, roamId });
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

exports.editPartner = async (userId, bodyData) => {
    try {
        const formattedData = partnerFormatter(bodyData);
        await partnerModel.findOneAndUpdate({ userId }, formattedData);
        return responseFormater(true, "partner details updated");
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

exports.partnerByPartnerId = async (partnerId) => {
    try {
        const partnerData = await partnerModel.findOne({ partnerId }).select("-_id -__v");
        return partnerData ? responseFormater(true, "Partner details", partnerData) : responseFormater(false, "no partner found",)
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

exports.partnerByUserId = async (userId) => {
    try {
        const partnerData = await partnerModel.findOne({ userId }).select("-_id -__v");
        return partnerData ? responseFormater(true, "Partner details", partnerData) : responseFormater(false, "no partner found",)
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

exports.allPartner = async () => {
    try {
        const partnerList = await partnerModel.find().select("-_id -__v");
        return partnerList[0] ? responseFormater(true, "Partner list", partnerList) : responseFormater(false, "no partner found",)
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

const markUserOnboarded = async (userId) => {
    try {
        await authModel.findOneAndUpdate({ userId: userId }, { isPartnerOnboarded: true })
        return true
    } catch (error) {
        return false
    }
}