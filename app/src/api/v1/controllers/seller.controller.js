const { changeUserType } = require("../helpers/auth.helper");
const { success, badRequest, unknownError } = require("../helpers/response_helper");
const { addSellerDetails, getAllSeller, sellerBySellerId, changeVerifyStatus, getAllAgentSeller, addYeloId, updateSellerInfo } = require("../helpers/seller.helper");
const { parseJwt } = require("../middlewares/authToken");
const { get } = require("../services/axios.service");
const { agentInfoUrl } = require("../services/url.service");

exports.onboardSeller = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (token.role === 3) {
            const { userId } = req.body
            const { status, message, data } = await addSellerDetails(userId, req.body, token.role);
            return status ? success(res, message) : badRequest(res, message, data);
        }
        await changeUserType(token.userId)
        const { status, message, data } = await addSellerDetails(token.userId, req.body);
        return status ? success(res, message) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error");
    }
}
exports.getSellers = async (req, res) => {
    try {
        const { status, message, data } = await getAllSeller();
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.editSeller = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        let { sellerId } = req.query
        if (token.role != 3) {
            sellerId = token.customId
        }
        const { status, message, data } = await updateSellerInfo(sellerId);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.getAgentSellers = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status, message, data } = await getAllAgentSeller(token.userId);
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.getAgentInfo = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status, message, data } = await sellerBySellerId(token.customId);
        const url = agentInfoUrl(data.agentId)
        const { status: axiosStatus, message: axiosMessage, data: axiosData } = await get(url)
        return axiosStatus ? success(res, axiosMessage, axiosData) : badRequest(res, axiosMessage);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.yeloSync = async (req, res) => {
    try {
        const { sellerId, yeloId } = req.body
        const { status, message, data } = await addYeloId(sellerId, yeloId);
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.getSellerInfo = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        let { customId, role } = token
        const { searchId } = req.query
        if (role == 3) {
            customId = searchId
        }
        const { status, message, data } = await sellerBySellerId(customId);
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        console.log(error);
        return unknownError(res, "unknown error")
    }
}
exports.verifySeller = async (req, res) => {
    try {
        const { sellerId, verify } = req.body
        const { status, message, data } = await changeVerifyStatus(sellerId, verify);
        return status ? success(res, message) : badRequest(res, message, data)
    } catch (error) {
        return unknownError(res, "unknown error");
    }
}