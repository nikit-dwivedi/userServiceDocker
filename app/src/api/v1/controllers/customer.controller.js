const { getAvatar } = require("../helpers/avatar.helper");
const { onboardCustomer, addNewAddress, getAddress, customerById, removeAddress, editUserDetails } = require("../helpers/customer.helper")
const { unknownError, success, badRequest } = require("../helpers/response_helper");
const { parseJwt } = require("../middlewares/authToken");

module.exports = {
    onboard: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const saveData = await onboardCustomer(token.userId, req.body);
            return saveData.status ? success(res, saveData.message, saveData.data) : badRequest(res, saveData.message);
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    },
    addAddress: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const saveData = await addNewAddress(token.userId, req.body);
            return saveData.status ? success(res, saveData.message) : badRequest(res, saveData.message);
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    },
    currentAddress: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const { longitude, latitude } = req.body
            const saveData = await getAddress(token.userId, longitude, latitude);
            return saveData.status ? success(res, saveData.message, saveData.data) : badRequest(res, saveData.message);
        } catch (error) {
            return unknownError(res, "unknown error")

        }
    },
    getCustomerById: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const { status, message, data } = await customerById(token.userId)
            return status ? success(res, message, data) : badRequest(res, message, data)
        } catch (error) {
            return unknownError(res, error)
        }
    },
    removeUserAddress: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const { addressId } = req.params
            const { status, message, data } = await removeAddress(token.userId, addressId)
            return status ? success(res, message, data) : badRequest(res, message, data)
        } catch (error) {
            return unknownError(res, error)
        }
    },
    getDefaultAvatar: async (req, res) => {
        try {
            const { status, message, data } = await getAvatar(); 
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    updateCustomerDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const { status, message, data } = await editUserDetails(token.customId, req.body)
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    }
}