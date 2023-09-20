const { changeUserType } = require("../helpers/auth.helper");
const { downloadFile } = require("../services/pdf.service");
const { success, badRequest, unknownError } = require("../helpers/response_helper");
const { addSellerDetails, getAllSeller, sellerBySellerId, changeVerifyStatus, getAllAgentSeller, addYeloId, updateSellerInfo, changeNotificationAlert, getPaginatedSeller, addContractToSeller } = require("../helpers/seller.helper");
const { parseJwt } = require("../middlewares/authToken");
const { get, post } = require("../services/axios.service");
const { agentInfoUrl } = require("../services/url.service");
const { uploadPdf } = require("../services/s3.service");

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
exports.getPaginatedSellers = async (req, res) => {
    try {
        const { page, limit } = req.query
        const { status, message, data } = await getPaginatedSeller(page, limit);
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.editSeller = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        let sellerId = token.customId
        if (token.role == 3) {
            sellerId = req.query.sellerId
        }
        const { status, message, data } = await updateSellerInfo(sellerId,req.body);
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}

exports.addSellerContract = async (req, res) => {
    try {
        let { sellerId, contract, seller_zone, start_date, account_holder_name, bank_name, account_no, ifsc } = req.body
        const { status: sellerStatus, message: sellerMessage, data: sellerData } = await sellerBySellerId(sellerId)
        if (!sellerStatus) {
            return badRequest(res, sellerMessage)
        }
        const url = process.env.PDFURL + process.env.PDFTEMPLATE
        const header = { 'X-API-KEY': [process.env.PDFKEY] }
        const body = {
            "seller_name": sellerData.basicDetails.sellerName,
            "contact_person": sellerData.authorizedPersonDetails.name,
            "seller_phone": sellerData.basicDetails.phone,
            "manage_email": sellerData.authorizedPersonDetails.email,
            "seller_id": sellerData.sellerId,
            "seller_zone": seller_zone,
            "start_date": start_date,
            "account_holder_name": account_holder_name,
            "bank_name": bank_name,
            "account_no": account_no,
            "ifsc": ifsc
        }
        const { status: axiosStatus, message: axiosMessage, data: axiosData } = await post(url, body, header)
        if (!axiosStatus) {
            return badRequest(res, axiosMessage)
        }
        const fileData = await downloadFile(axiosData.download_url, sellerData.basicDetails.sellerName)
        const fileUpload = await uploadPdf(fileData)
        const { status, message, data } = await addContractToSeller(sellerId, fileUpload.Location);
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.notificationStatusChange = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        let { sellerId } = req.query
        let { status: notificationStatus } = req.body
        if (token.role != 3) {
            sellerId = token.customId
        }
        const { status, message } = await changeNotificationAlert(sellerId, notificationStatus);
        return status ? success(res, message) : badRequest(res, message);
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
        console.log(url);
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