
const express = require('express');
const router = express.Router();
const sellerController = require('../../controllers/sellerController')

/**
 * /seller
 * @url http://localhost:5001/seller
 *
 */



router.get('/',sellerController.getSellers)
router.get('/single-details',sellerController.getSellerDetails)
router.post('/add',sellerController.addSeller)
router.post('/delete',sellerController.deleteSeller)


module.exports = router;