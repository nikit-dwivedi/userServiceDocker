//-------------------------------------customer-role--------------------------------------------------------------//
exports.customerRoleFormater = () => {
    return {
        seller: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        customer: {
            view: true,
            edit: true,
            add: true,
            delete: false
        },
        partner: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        employ: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        outlet: {
            view: true,
            edit: false,
            add: false,
            delete: false
        },
        product: {
            view: true,
            edit: false,
            add: false,
            delete: false
        },
        category: {
            view: true,
            edit: false,
            add: false,
            delete: false
        },
        cusine: {
            view: true,
            edit: false,
            add: false,
            delete: false
        },
        transaction: {
            view: true,
            edit: false,
            add: true,
            delete: false
        },
        order: {
            view: true,
            edit: false,
            add: true,
            delete: false
        },
    }
}
//--------------------------------------seller-role---------------------------------------------------------------//
exports.sellerRoleFormater = () => {
    return {
        seller: {
            view: true,
            edit: true,
            add: true,
            delete: false
        },
        customer: {
            view: true,
            edit: false,
            add: false,
            delete: false
        },
        partner: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        employ: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        outlet: {
            view: true,
            edit: true,
            add: true,
            delete: false
        },
        product: {
            view: true,
            edit: true,
            add: true,
            delete: false
        },
        category: {
            view: true,
            edit: true,
            add: true,
            delete: false
        },
        cusine: {
            view: true,
            edit: false,
            add: false,
            delete: false
        },
        transaction: {
            view: true,
            edit: false,
            add: true,
            delete: false
        },
        order: {
            view: true,
            edit: true,
            add: false,
            delete: false
        },
    }
}
//----------------------------------delivery-patner-role----------------------------------------------------------//
exports.patnerRoleFormater = () => {
    return {
        seller: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        customer: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        partner: {
            view: true,
            edit: true,
            add: true,
            delete: false
        },
        employ: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        outlet: {
            view: true,
            edit: false,
            add: false,
            delete: false
        },
        product: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        category: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        cusine: {
            view: false,
            edit: false,
            add: false,
            delete: false
        },
        transaction: {
            view: true,
            edit: false,
            add: true,
            delete: false
        },
        order: {
            view: true,
            edit: true,
            add: false,
            delete: false
        },
    }
}
//--------------------------------------custom-role---------------------------------------------------------------//
exports.customRoleFormater = (permissions = {}) => {
    const { seller = null, customer = null, partner = null, employ = null, outlet = null, product = null, category = null, cusine = null, transaction = null, order = null } = permissions
    return {
        seller: {
            view: seller?.view ? seller.view : false,
            edit: seller?.edit ? seller.edit : false,
            add: seller?.add ? seller.add : false,
            delete: seller?.delete ? seller.delete : false
        },
        customer: {
            view: customer?.view ? customer.view : false,
            edit: customer?.edit ? customer.edit : false,
            add: customer?.add ? customer.add : false,
            delete: customer?.delete ? customer.delete : false,
        },
        partner: {
            view: partner?.view ? partner.view : false,
            edit: partner?.edit ? partner.edit : false,
            add: partner?.add ? partner.add : false,
            delete: partner?.delete ? partner.delete : false,
        },
        employ: {
            view: employ?.view ? employ.view : false,
            edit: employ?.edit ? employ.edit : false,
            add: employ?.add ? employ.add : false,
            delete: employ?.delete ? employ.delete : false,
        },
        outlet: {
            view: outlet?.view ? outlet.view : false,
            edit: outlet?.edit ? outlet.edit : false,
            add: outlet?.add ? outlet.add : false,
            delete: outlet?.delete ? outlet.delete : false,
        },
        product: {
            view: product?.view ? product.view : false,
            edit: product?.edit ? product.edit : false,
            add: product?.add ? product.add : false,
            delete: product?.delete ? product.delete : false,
        },
        category: {
            view: category?.view ? category.view : false,
            edit: category?.edit ? category.edit : false,
            add: category?.add ? category.add : false,
            delete: category?.delete ? category.delete : false,
        },
        cusine: {
            view: cusine?.view ? cusine.view : false,
            edit: cusine?.edit ? cusine.edit : false,
            add: cusine?.add ? cusine.add : false,
            delete: cusine?.delete ? cusine.delete : false,
        },
        transaction: {
            view: transaction?.view ? transaction.view : false,
            edit: transaction?.edit ? transaction.edit : false,
            add: transaction?.add ? transaction.add : false,
            delete: transaction?.delete ? transaction.delete : false,
        },
        order: {
            view: order?.view ? order.view : false,
            edit: order?.edit ? order.edit : false,
            add: order?.add ? order.add : false,
            delete: order?.delete ? order.delete : false,
        },
    }
}
//--------------------------------------edit-role---------------------------------------------------------------//
exports.editRoleFormater = (permissions = {}) => {
    const { seller = null, customer = null, partner = null, employ = null, outlet = null, product = null, category = null, cusine = null, transaction = null, order = null } = permissions
    let returnData = {}

    if (seller) {
        Object.assign(returnData,{seller:{}})
        if (seller.view) {
            returnData.seller.view = seller.view
        }
        if (seller.edit) {
            returnData.seller.view = seller.view
        }
        if (seller.add) {
            returnData.seller.view = seller.view
        }
        if (seller.delete) {
            returnData.seller.view = seller.view
        }
    }
    if (customer) {
        Object.assign(returnData,{customer:{}})
        if (customer.view) {
            returnData.customer.view = customer.view
        }
        if (customer.edit) {
            returnData.customer.edit = customer.edit
        }
        if (customer.add) {
            returnData.customer.add = customer.add
        }
        if (customer.delete) {
            returnData.customer.delete = customer.delete
        }
    }
    if (partner) {
        Object.assign(returnData,{partner:{}})
        if (partner.view) {
            returnData.partner.view = partner.view
        }
        if (partner.edit) {
            returnData.partner.edit = partner.edit
        }
        if (partner.add) {
            returnData.partner.add = partner.add
        }
        if (partner.delete) {
            returnData.partner.delete = partner.delete
        }
    }
    if (employ) {
        Object.assign(returnData,{employ:{}})
        if (employ.view) {
            returnData.employ.view = employ.view
        }
        if (employ.edit) {
            returnData.employ.edit = employ.edit
        }
        if (employ.add) {
            returnData.employ.add = employ.add
        }
        if (employ.delete) {
            returnData.employ.delete = employ.delete
        }
    }
    if (outlet) {
        Object.assign(returnData,{outlet:{}})
        if (outlet.view) {
            returnData.outlet.view = outlet.view
        }
        if (outlet.edit) {
            returnData.outlet.edit = outlet.edit
        }
        if (outlet.add) {
            returnData.outlet.add = outlet.add
        }
        if (outlet.delete) {
            returnData.outlet.delete = outlet.delete
        }
    }
    if (product) {
        Object.assign(returnData,{product:{}})
        if (product.view) {
            returnData.product.view = product.view
        }
        if (product.edit) {
            returnData.product.edit = product.edit
        }
        if (product.add) {
            returnData.product.add = product.add
        }
        if (product.delete) {
            returnData.product.delete = product.delete
        }
    }
    if (category) {
        Object.assign(returnData,{category:{}})
        if (category.view) {
            returnData.category.view = category.view
        }
        if (category.edit) {
            returnData.category.edit = category.edit
        }
        if (category.add) {
            returnData.category.add = category.add
        }
        if (category.delete) {
            returnData.category.delete = category.delete
        }
    }
    if (cusine) {
        Object.assign(returnData,{cusine:{}})
        if (cusine.view) {
            returnData.cusine.view = cusine.view
        }
        if (cusine.edit) {
            returnData.cusine.edit = cusine.edit
        }
        if (cusine.add) {
            returnData.cusine.add = cusine.add
        }
        if (cusine.delete) {
            returnData.cusine.delete = cusine.delete
        }
    }
    if (transaction) {
        Object.assign(returnData,{transaction:{}})
        if (transaction.view) {
            returnData.transaction.view = transaction.view
        }
        if (transaction.edit) {
            returnData.transaction.edit = transaction.edit
        }
        if (transaction.add) {
            returnData.transaction.add = transaction.add
        }
        if (transaction.delete) {
            returnData.transaction.delete = transaction.delete
        }
    }
    if (order) {
        Object.assign(returnData,{order:{}})
        if (order.view) {
            returnData.order.view = order.view
        }
        if (order.edit) {
            returnData.order.edit = order.edit
        }
        if (order.add) {
            returnData.order.add = order.add
        }
        if (order.delete) {
            returnData.order.delete = order.delete
        }
    }
    return returnData
}
