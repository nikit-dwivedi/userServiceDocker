const { customerById } = require("../helpers/customer.helper")
const { success, badRequest, unknownError } = require("../helpers/response_helper")
const { sellerById } = require("../helpers/seller.helper")
const { addStory, getVisibleStories } = require("../helpers/story.helper")
const { parseJwt } = require("../middlewares/authToken")

exports.addNewStory = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { userId, role } = token
        const { url } = req.body
        let userData = {}
        if (role == 2) {
            let { status, message, data } = await sellerById(userId)
            if (status) {
                userData.userId = data.userId
                userData.username = data.basicDetails.tradeName
            }
        } else {
            let { status, message, data } = await customerById(userId)
            if (status) {
                userData.userId = data.userId
                userData.username = data.name 
            }
        }
        const { status, message } = await addStory(userData, url)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.getStories = async (req, res) => {
    try {
        const { status, message, data } = await getVisibleStories()
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }

}