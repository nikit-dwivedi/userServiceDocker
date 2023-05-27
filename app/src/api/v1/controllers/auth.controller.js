const { genrateOtpPhone, addAuth, verifyOtp, checkAuthByPhone, checkAuthByEmail,  checkLogin } = require("../helpers/auth.helper");
const { onboardCustomer } = require("../helpers/customer.helper");
const { unknownError, success, badRequest } = require("../helpers/response_helper");
const { generateGuestToken } = require("../middlewares/authToken");

module.exports = {
    login: async (req, res) => {
        try {
            const { phone, email, password, userType = "customer", ...garbage } = req.body
            req.body.userType = userType
            if ((phone && (email || password)) || (!phone && !(email || password)) || Object.entries(garbage)[0]) {
                return badRequest(res, "please send proper data");
            }
            if (req.body.phone) {
                const userCheck = await checkAuthByPhone(phone);
                if (userCheck) {
                    let { status: loginPhoneStatus, message: loginPhoneMessage, data: loginPhoneData } = await genrateOtpPhone(phone, userType);
                    loginPhoneData.isPhoneLogin = true
                    return loginPhoneStatus ? success(res, loginPhoneMessage, loginPhoneData) : badRequest(res, loginPhoneMessage)
                }
                const addUser = await addAuth(req.body);
                return addUser ? success(res, "otp sent successfully", addUser) : badRequest(res, "otp not send")
            }
            if (!email) {
                return badRequest(res, "phone/email is required")
            }
            const userCheck = await checkAuthByEmail(email);
            if (userCheck) {
                const { status: loginEmailStatus, message: loginEmailMessage, data: loginEmailData } = await checkLogin(email, password, userType)
                loginEmailData.isPhoneLogin = false;
                return loginEmailStatus ? success(res, loginEmailMessage, loginEmailData) : badRequest(res, loginEmailMessage)
            }
            const addUser = await addAuth(req.body);
            return addUser ? success(res, "otp sent successfull", addUser) : badRequest(res, "bad request")
        } catch (error) {
            console.log(error);
            return unknownError(res, "unknown error")
        }
    },
    verifyUserOtp: async (req, res) => {
        try {
            const { reqId, otp } = req.body
            const otpCheck = await verifyOtp(reqId, otp);
            return otpCheck ? success(res, "otp verified", otpCheck) : badRequest(res, "otp not verified");
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    resendOtp: async (req, res) => {
        try {
            const { reqId } = req.params
            const { status, message, data } = await genrateOtpPhone(null, null, reqId)
            return status ? success(res, message, data) : badRequest(res, message);
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    addSellerAuth: async (req, res) => {
        try {
            const addUser = await addAuth(req.body, 3);
            return addUser ? success(res, "auth added", addUser) : badRequest(res, "bad request")
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    guestLogin: async (req, res) => {
        try {
            const guestToken = generateGuestToken()
            return success(res, "guest login successfully", { token: guestToken });
        } catch (error) {
            return unknownError(res, error.message);
        }
    }
}