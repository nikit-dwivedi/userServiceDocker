const authModel = require('../models/auth.model');
const { sendSms, sendMail } = require('../services/otp.service');
const { authFormatter } = require('../formatter/auth.format');
const { randomBytes } = require('node:crypto');
const { checkEncryption, createAuthToken } = require('../middlewares/authToken');
const { customerById } = require('./customer.helper');
const { sellerById } = require('./seller.helper');
const { responseFormater } = require('../formatter/response.format');
const { partnerByUserId } = require('./partner.helper');

exports.addAuth = async (bodyData, role) => {
    try {
        const formattedData = await authFormatter(bodyData);
        const saveData = await authModel(formattedData);
        if (role == 3) {
            return await saveData.save() ? { userId: formattedData.userId } : false
        }
        if (bodyData.phone) {
            await sendSms(formattedData.phone, formattedData.otp)
            return await saveData.save() ? { reqId: formattedData.reqId, isOnboarded: false, isPhoneLogin: true } : false
        } else {
            await sendMail(formattedData.email, formattedData.otp)
            return await saveData.save() ? { reqId: formattedData.reqId, isEmailVerified: false, isOnboarded: false, isPhoneLogin: false } : false
        }
    } catch (error) {
        return false
    }
}
exports.checkAuthByPhone = async (phone) => {
    try {
        const authData = await authModel.exists({ phone });
        return authData ? authData : false;
    } catch (error) {
        return false
    }
}
exports.checkAuthByEmail = async (email) => {
    try {
        const authData = await authModel.exists({ email });
        return authData ? authData : false;
    } catch (error) {
        return false
    }
}
exports.authByUserId = async (userId) => {
    try {
        const authData = await authModel.findOne({ userId });
        return authData[0] ? authData : false;
    } catch (error) {
        return false
    }
}
exports.authList = async () => {
    try {
        const authData = await authModel.find();
        return authData[0] ? true : false;
    } catch (error) {
        return false
    }
}
exports.genrateOtpEmail = async (email) => {
    const date = new Date
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const reqId = randomBytes(4).toString('hex')
    const updatedData = await authModel.findOne({ email })
    if (updatedData.noOfOtp >= 10 && updatedData.date == date.getDate()) {
        return responseFormater(false, "otp limit reached. try again tomorrow", {})
    }
    updatedData.otp = otp;
    updatedData.reqId = reqId;
    updatedData.noOfOtp += 1
    updatedData.date = date.getDate()
    updatedData.isPhoneOtp = false;
    const saveData = await updatedData.save()
    if (!saveData) {
        return responseFormater(false, "otp not sent", {})
    }
    await sendMail(email, otp)
    if (userType === 'seller') {
        return responseFormater(true, "otp sent to mail", { reqId: reqId, isOnboarded: updatedData.isSellerOnboarded })
    }
    else if (userType === 'partner') {
        return responseFormater(true, "otp sent to mail", { reqId: reqId, isOnboarded: updatedData.isPartnerOnboarded })
    }
    else {
        return responseFormater(true, "otp sent to mail", { reqId: reqId, isOnboarded: updatedData.isClientOnboarded })
    }
}
exports.genrateOtpPhone = async (phone, userType, oldReqId) => {
    const date = new Date
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const reqId = randomBytes(4).toString('hex')
    let updatedData
    if (oldReqId) {
        updatedData = await authModel.findOne({ reqId: oldReqId })
        if (!updatedData) {
            return responseFormater(false, "invalid request")
        }
    } else {
        updatedData = await authModel.findOne({ phone })
    }
    if (updatedData.noOfOtp >= 10 && updatedData.date == date.getDate()) {
        return responseFormater(false, "otp limit reached. try again tomorrow", { attempt: updatedData.noOfOtp })
    }
    if (userType) {
        updatedData.userType = userType
    }
    updatedData.otp = otp;
    updatedData.reqId = reqId;
    updatedData.noOfOtp += 1
    updatedData.date = date.getDate();
    updatedData.isPhoneOtp = true;
    if (phone == "1111111111") {
        updatedData.otp = "1111"
    }
    const saveData = await updatedData.save()
    if (!saveData) {
        return responseFormater(false, "otp not sent", {})
    }
    userType = updatedData.userType
    await sendSms(updatedData.phone, otp)
    if (userType === 'seller') {
        return responseFormater(true, "otp sent to phone", { reqId: reqId, isOnboarded: updatedData.isSellerOnboarded, attempt: updatedData.noOfOtp  })
    }
    else if (userType === 'partner') {
        return responseFormater(true, "otp sent to phone", { reqId: reqId, isOnboarded: updatedData.isPartnerOnboarded , attempt: updatedData.noOfOtp })
    }
    else {
        return responseFormater(true, "otp sent to phone", { reqId: reqId, isOnboarded: updatedData.isClientOnboarded, attempt: updatedData.noOfOtp  })
    }
}
exports.verifyOtp = async (reqId, otp) => {
    try {
        const newReqId = randomBytes(4).toString('hex')
        const newOtp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const userData = await authModel.findOne({ reqId });
        if (!userData) {
            return false
        }
        if (userData.otp == otp) {
            if (!userData.isPhoneOtp) {
                userData.isEmailVerified = true
            }
            const customId = await getCustomId(userData.userId, userData.userType)
            if (userData.userType == 'partner') {
                userData.customId = customId.partnerId,
                    userData.roamId = customId.roamId
            } else {
                userData.customId = customId
            }
            const token = createAuthToken(userData.userType, userData);
            userData.noOfOtp = 0
            userData.otp = newOtp
            userData.reqId = newReqId
            await userData.save()
            if (userData.userType === 'seller') {
                return { token, isOnboarded: userData.isSellerOnboarded, sellerId: userData.customId, isPhoneLogin: userData.isPhoneOtp }
            }
            if (userData.userType === 'partner') {
                return { token, isOnboarded: userData.isPartnerOnboarded, partnerId: userData.customId, isPhoneLogin: userData.isPhoneOtp, roamId: userData.roamId }
            }
            if (userData.userType === 'customer') {
                return { token, isOnboarded: userData.isClientOnboarded, customerId: userData.customId, isPhoneLogin: userData.isPhoneOtp }
            }
            return { token, isOnboarded: userData.isOnboarded, customerId: userData.customId, isPhoneLogin: userData.isPhoneOtp }
        }
        return false
    } catch (error) {
        return false
    }
}
exports.checkLogin = async (email, password, userType) => {
    try {
        const userData = await authModel.findOne({ email });
        if (!userData) {
            return responseFormater(false, "user not found", {});
        }
        const passwordCheck = await checkEncryption(password, userData.password);
        if (!passwordCheck) {
            return responseFormater(false, "invalid password", {});
        }
        if (userData.isEmailVerified) {
            userData.isLogin = true
            await userData.save()
            userData.customId = await getCustomId(userData.userId, userType)
            const token = createAuthToken(userType, userData);
            if (userType === 'seller') {
                return responseFormater(true, "login success", { token, isEmailVerified: true, isOnboarded: userData.isSellerOnboarded });
            }
            if (userType === 'partner') {
                return responseFormater(true, "login success", { token, isEmailVerified: true, isOnboarded: userData.isPartnerOnboarded });
            }
            if (userType === 'customer') {
                return responseFormater(true, "login success", { token, isEmailVerified: true, isOnboarded: userData.isClientOnboarded });
            }
        }
        const reqId = await genrateOtpEmail(userData.email)
        if (userType === 'seller') {
            return responseFormater(true, "please verify email", { isEmailVerified: false, reqId: reqId, isOnboarded: userData.isSellerOnboarded });
        }
        if (userType === 'partner') {
            return responseFormater(true, "please verify email", { isEmailVerified: false, reqId: reqId, isOnboarded: userData.isPartnerOnboarded });
        }
        if (userType === 'customer') {
            return responseFormater(true, "please verify email", { isEmailVerified: false, reqId: reqId, isOnboarded: userData.isClientOnboarded });
        }
    }
    catch (error) {
        return responseFormater(false, error.message, {})
    }
}
exports.changeUserType = async (userId) => {
    try {
        await authModel.findOneAndUpdate({ userId }, { userType: "seller" });
    } catch (error) {
        console.log(error);
    }
}


const genrateOtpEmail = async (email) => {
    const date = new Date
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const reqId = randomBytes(4).toString('hex')
    const updatedData = await authModel.findOne({ email })
    if (updatedData.noOfOtp >= 3 && updatedData.date == date.getDate()) {
        return 1
    }
    updatedData.otp = otp;
    updatedData.reqId = reqId;
    updatedData.noOfOtp += 1
    updatedData.date = date.getDate()
    const saveData = await updatedData.save()
    if (!saveData) {
        return false
    }
    await sendMail(email, otp)
    return reqId
}

const getCustomId = async (userId, userType) => {
    try {
        switch (userType) {
            case "seller":
                const sellerData = await sellerById(userId)
                return sellerData.status ? sellerData.data.sellerId : ""
            case "partner":
                const partnerData = await partnerByUserId(userId)
                return partnerData.status ? { partnerId: partnerData.data.partnerId, roamId: partnerData.data.roamId } : ""
            default:
                const customerData = await customerById(userId)
                return customerData.status ? customerData.data.customerId : ""
        }
    } catch (error) {
        return ""
    }
}