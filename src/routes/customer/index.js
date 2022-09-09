
const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customerController')

/**
 * /customer
 * @url http://localhost:5001/customer
 *
 */



router.get('/',customerController.getCustomers)
router.get('/single-details',customerController.getCustomerDetails)
router.post('/add',customerController.addCustomer)
router.post('/delete',customerController.deleteCustomer)


module.exports = router;