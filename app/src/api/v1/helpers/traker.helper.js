const { responseFormater } = require("../formatter/response.format")
const { post } = require("../services/axios.service")
const { createRoamTrackerUrl } = require("../services/url.service")

exports.getRoamId = async (bodyData, token) => {
    try {
        const url = createRoamTrackerUrl()
        const header = { "Authorization": `${token}` }
        const { status, message, data } = await post(url, bodyData, header)
        return responseFormater(status, message, data)
    } catch (error) {
        return responseFormater(false, error.message)
    }
}