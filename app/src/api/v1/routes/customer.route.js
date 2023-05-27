const express = require('express');
const { onboard, currentAddress, addAddress, getCustomerById, removeUserAddress, getDefaultAvatar, updateCustomerDetails } = require('../controllers/customer.controller');
const { authenticateUser } = require('../middlewares/authToken');
const router = express.Router();


router.post('/onboard', authenticateUser, onboard);
router.post('/address', authenticateUser, currentAddress);
router.get('/address/remove/:addressId', authenticateUser, removeUserAddress);
router.post('/address/add', authenticateUser, addAddress);
router.get('/', authenticateUser, getCustomerById)
router.get('/avatar', getDefaultAvatar)
router.post('/profile', authenticateUser, updateCustomerDetails);

module.exports = router;