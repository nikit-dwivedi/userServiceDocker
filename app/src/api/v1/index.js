const express = require("express");
const router = express.Router();

require("../v1/config/mongodb");

const authRoute = require('./routes/auth.route.js')
const customerRoute = require('./routes/customer.route');
const sellerRoute = require('./routes/seller.router.js');
const partnerRoute = require('./routes/partner.route');
const storyRoute = require('./routes/story.router.js');
const roleRoute = require('./routes/role.route')


router.use("/auth", authRoute);
router.use('/customer', customerRoute);
router.use('/seller', sellerRoute);
router.use('/partner', partnerRoute);
router.use('/role', roleRoute)
router.use('/story', storyRoute)

module.exports = router;
