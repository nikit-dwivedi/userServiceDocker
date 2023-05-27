const express = require('express');
const router = express.Router();
const { onboardPartner, getPartnerDetailsByPartnerId, changePartnerDetail, getAllPartner } = require('../controllers/partner.controller')

router.post('/onboard', onboardPartner);
router.post('/details', changePartnerDetail);
router.get('/details', getPartnerDetailsByPartnerId);
router.get('/all', getAllPartner);


module.exports = router
