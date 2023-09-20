const { randomBytes } = require('node:crypto');
const { encryption } = require('../middlewares/authToken');

module.exports = {
    authFormatter: async (data) => {
        const d = new Date
        let encryptedPassword
        const userId = randomBytes(4).toString('hex')
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        let isPhoneOtp = true
        if (data.password) {
            encryptedPassword = await encryption(data.password)
            isPhoneOtp = false;
        }
        return {
            userId: userId,
            email: data.email,
            userType: data.userType,
            password: encryptedPassword,
            phone: data.phone,
            otp: otp,
            reqId: reqId,
            userType: data.userType,
            date: d.getDate(),
            isPhoneOtp: isPhoneOtp,
        }
    },
    customerFormatter: (userId, userData) => {
        const customerId = randomBytes(4).toString('hex')
        return {
            userId: userId,
            customerId: customerId,
            phone: userData.phone,
            name: userData.name,
            email: userData.email
        }
    },
    customerEditFormatter: (userData) => {
        return {
            name: userData.name,
            email: userData.email,
            image: userData.image
        }
    },
    sellerFormatter: (userId, data) => {
        const sellerId = randomBytes(4).toString('hex')
        return {
            userId: userId,
            sellerId: sellerId,
            basicDetails: {
                sellerName: data.basicDetails.sellerName,
                tradeName: data.basicDetails.tradeName,
                sellerType: data.basicDetails.sellerType,
                isGst: data.basicDetails.isGst,
                gstNo: data.basicDetails.gstNo,
                panNumber: data.basicDetails.panNumber,
                phone: data.basicDetails.phone,
            },
            licenseDetails: {
                nameOnlicence: data.licenseDetails.nameOnlicence,
                licenceNumber: data.licenseDetails.licenceNumber,
                licenceType: data.licenseDetails.licenceType,
                licenceImage: data.licenseDetails.licenceImage,
                issuedOn: data.licenseDetails.issuedOn,
                tenure: data.licenseDetails.tenure,
            },
            authorizedPersonDetails: {
                name: data.authorizedPersonDetails.name,
                pan: data.authorizedPersonDetails.pan,
                phone: data.authorizedPersonDetails.phone,
                email: data.authorizedPersonDetails.email,
            }
        }
    },
    sellerEditFormatter: (data) => {
        return {
            "basicDetails.sellerName": data?.basicDetails?.sellerName,
            "basicDetails.tradeName": data?.basicDetails?.tradeName,
            "basicDetails.sellerType": data?.basicDetails?.sellerType,
            "basicDetails.isGst": data?.basicDetails?.isGst,
            "basicDetails.gstNo": data?.basicDetails?.gstNo,
            "basicDetails.panNumber": data?.basicDetails?.panNumber,
            "basicDetails.phone": data?.basicDetails?.phone,

            "licenseDetails.nameOnlicence": data?.licenseDetails?.nameOnlicence,
            "licenseDetails.licenceNumber": data?.licenseDetails?.licenceNumber,
            "licenseDetails.licenceType": data?.licenseDetails?.licenceType,
            "licenseDetails.licenceImage": data?.licenseDetails?.licenceImage,
            "licenseDetails.issuedOn": data?.licenseDetails?.issuedOn,
            "licenseDetails.tenure": data?.licenseDetails?.tenure,

            "authorizedPersonDetails.name": data?.authorizedPersonDetails?.name,
            "authorizedPersonDetails.pan": data?.authorizedPersonDetails?.pan,
            "authorizedPersonDetails.phone": data?.authorizedPersonDetails?.phone,
            "authorizedPersonDetails.email": data?.authorizedPersonDetails?.email,
        }
    },
    storyFormatter: (userData, url) => {
        const { userId, username } = userData
        let d = new Date
        let [hour, minute] = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(d).split(":")
        let date = new Intl.DateTimeFormat(['ban', 'id']).format(d)
        return { userId, username, url, hour, minute, date }
    },
    partnerFormatter: (data, userId = false, roamId, partnerId) => {
        return userId ? {
            userId: userId,
            partnerId: partnerId,
            name: data.name,
            phone: data.phone,
            roamId,
            image: data.image,
            dob: data.dob,
            vehicleNo: data.vehicleNo,
            gender: data.gender,
            aadhaar: data.aadhaar,
            pan: data.pan,
            insurance: data.insurance,
            drivingLicense: data.drivingLicense,
            rcCard: data.rcCard,
            zone: data.zone,
        } : {
            name: data.name,
            image: data.image,
            dob: data.dob,
            vehicleNo: data.vehicleNo,
            gender: data.gender,
            insurance: data.insurance,
            rcCard: data.rcCard,
            zone: data.zone,
        }
    },
}

function clock() {
    let date = new Date
    let hour = date.getHours()
    let timeZone = "AM"
    let minute = date.getMinutes()
    if (hour >= 12) {
        hour -= 12
        timeZone = "PM"
    }
    if (hour == 0) {
        hour = 12
    }
    return `${hour}:${minute} ${timeZone}`
}