const express = require('express');
const router = express.Router();

/**
 * @url http://localhost:5001/
 */

router.get('/', async (req, res) => {
    res.send('Welcome to Drop Backend');
});

router.use('/customer', require('./customer'));
router.use('/seller', require('./seller'));
router.use('/product', require('./product'));
router.use('/dashboard', require('./dashboard'));


module.exports = router;