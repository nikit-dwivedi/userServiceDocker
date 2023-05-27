const { customRoleFormater, sellerRoleFormater, patnerRoleFormater } = require("../formatter/role.format")
const { success, badRequest, unknownError } = require("../helpers/response_helper")
const { addRole, getUserRole, getDefaultRoleId } = require("../helpers/role.helper")

exports.addCustomerRole = async (req, res) => {
    try {
        const permissions = customRoleFormater()
        const userId = 'CHMOD777'
        const { status, message, data } = await addRole(userId, "customer", permissions);
        return status ? success(res, message) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message)
    }
}
exports.addSellerRole = async (req, res) => {
    try {
        const permissions = sellerRoleFormater()
        const userId = 'CHMOD777'
        const { status, message, data } = await addRole(userId, "seller", permissions);
        return status ? success(res, message) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message)
    }
}
exports.addPatnerRole = async (req, res) => {
    try {
        const permissions = patnerRoleFormater()
        const userId = 'CHMOD777'
        const { status, message, data } = await addRole(userId, "patner", permissions);
        return status ? success(res, message) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message)
    }
}
exports.addCustomRole = async (req, res) => {
    try {
        const { userId, roleName, permissions } = req.body
        const permissionsFormat = customRoleFormater(permissions)
        const { status, message, data } = await addRole(userId, roleName, permissionsFormat);
        return status ? success(res, message) : badRequest(res, message);
    } catch (error) {
        return unknownError(res, error.message)
    }
}
exports.getAllRole = async (req, res) => {
    try {
        const { userId } = req.body
        const { status, message, data } =await getUserRole(userId)
        console.log(await getDefaultRoleId('customer'))
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}