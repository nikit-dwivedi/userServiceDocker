const roleModel = require('../models/role.model');
// const { authByUserId } = require('./auth.helper');
const { randomBytes } = require('node:crypto');


exports.addRole = async (userId, roleName, permissions) => {
    try {
        if (roleName == 'seller' || roleName == 'customer' || roleName == 'patner') {
            let roleCheck = await roleModel.exists({ roleName })
            if (roleCheck) {
                return { status: false, message: "please choose another role name", data: {} }
            }
        }
        const roleId = randomBytes(4).toString('hex')
        const formattedData = {
            userId: userId,
            roleId: roleId,
            roleName: roleName,
            permissions: permissions,
        }
        const saveData = await roleModel(formattedData);
        return saveData.save() ? { status: true, message: "role added", data: {} } : { status: false, message: "role not added", data: {} };
    } catch (error) {
        return { status: false, message: error.message, data: {} }
    }
}
exports.changeRole = async (roleId, permission) => {
    try {
        const changeRole = await roleModel.findOneAndUpdate({ roleId }, permission);
        return changeRole ? true : false;
    } catch (error) {
        return false;
    }
}
exports.removeRole = async (roleId) => {
    try {
        const changeRole = await roleModel.findOneAndUpdate({ roleId }, { isActive: true });
        return changeRole ? true : false;
    } catch (error) {
        return false;
    }
}
exports.getUserRole = async (userId) => {
    try {
        const userRole = await roleModel.find({ userId });
        return userRole[0] ? { status: true, message: "role list", data: userRole } : { status: false, message: "no roles found for this user", data: {} };
    } catch (error) {
        return { status: false, message: error.message, data: {} };
    }
}
exports.getDefaultRoleId = async (roleName) => {
    try {
        const roleData = await roleModel.findOne({ roleName }).select('-_id roleId')
        return roleData ? roleData.roleId : false
    } catch (error) {
        return false
    }
}
// exports.roleCheck = async (userId) => {
//     const authData = await authByUserId(userId);
//     const role = await this.getRole(userId);

// }

exports.permissionCheck = async () => {

}

let sellerPermissionCheck = async (permissions) => {

}