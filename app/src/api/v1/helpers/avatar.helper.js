const { responseFormater } = require('../formatter/response.format');
const { avatarModel } = require('../models/avatar.model')


exports.getAvatar = async () => {
    try {
        const avatarList = await avatarModel.find().select('-_id -__v');
        return avatarList[0] ? responseFormater(true, "avatar list", avatarList) : responseFormater(false, "no avatar found")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}

exports.defaultAvatar = async () => {
    try {
        const defaultAvatarData = await avatarModel.findOne({ title: "default.png" })
        return defaultAvatarData ? responseFormater(true, "avatar list", defaultAvatarData) : responseFormater(false, "no avatar found")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
