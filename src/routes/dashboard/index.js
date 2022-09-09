const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboardController')

/**
 * /dashboard
 * @url http://localhost:5001/dashboard
 *
 */



router.get('/',dashboardController.summaryDetails)


module.exports = router;