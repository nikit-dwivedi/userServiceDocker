const express = require('express');
const router = express.Router();

const sellerController = require('../controllers/seller.controller');
const { authenticateSeller, authenticateAdmin } = require('../middlewares/authToken');

router.get('/all', authenticateAdmin, sellerController.getSellers);
router.get('/all/paginated', authenticateAdmin, sellerController.getPaginatedSellers);
router.get('/info', authenticateSeller, sellerController.getSellerInfo);
router.post('/', authenticateSeller, sellerController.onboardSeller);
router.post('/update', authenticateSeller, sellerController.editSeller);
router.post('/contract', authenticateAdmin, sellerController.addSellerContract);
router.post('/notification', sellerController.notificationStatusChange);
router.post('/verify', authenticateAdmin,sellerController.verifySeller);
router.get('/agent', authenticateAdmin, sellerController.getAgentSellers);
router.get('/agent/info', authenticateSeller, sellerController.getAgentInfo)
router.post('/yelo', authenticateAdmin, sellerController.yeloSync)

module.exports = router;