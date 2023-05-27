const { addPartner, editPartner, partnerByUserId, partnerByPartnerId, allPartner } = require("../helpers/partner.helper");
const { success, badRequest, unknownError } = require("../helpers/response_helper");
const { parseJwt } = require("../middlewares/authToken")

exports.onboardPartner = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        console.log(token);
        const { status, message, data } = await addPartner(token.userId, req.body, req.headers.authorization);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
exports.changePartnerDetail = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status, message } = await editPartner(token.userId, req.body);
        return status ? success(res, message) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
exports.getPartnerDetailsByUserId = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status, message, data } = await partnerByUserId(token.userId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
exports.getPartnerDetailsByPartnerId = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (token.role != 1) {
            token.customId = req.query.partnerId
        }
        const { status, message, data } = await partnerByPartnerId(token.customId);
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}
exports.getAllPartner = async (req, res) => {
    try {
        const { status, message, data } = await allPartner();
        return status ? success(res, message, data) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message);
    }
}