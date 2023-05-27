const express = require('express');
const router = express.Router();

const roleController = require('../controllers/role.controller');

router.post('/',roleController.getAllRole)
router.get('/seller', roleController.addSellerRole);
router.get('/customer', roleController.addCustomerRole);
router.get('/patner', roleController.addPatnerRole);
router.post('/custom',roleController.addCustomRole)

module.exports = router;