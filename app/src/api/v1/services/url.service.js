const adminBaseUrl = 'http://139.59.60.119:4777/v1'
const deliveryBase = 'http://139.59.60.119:4489/v1'
const adminBaseUrlProd = 'https://admin.fablocdn.com'
const deliveryBaseProd = 'https://delivery.fablocdn.com'

exports.agentInfoUrl = (agentId) => {
    return `${adminBaseUrlProd}/auth/${agentId}`
}

exports.createRoamTrackerUrl = () => {
    return `${deliveryBaseProd}/partner/create`
}