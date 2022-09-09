const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController')

/**
 * /product
 * @url http://localhost:5001/product
 *
 */



router.get('/',productController.getProducts)
router.get('/single-details',productController.getProductsDetails)
router.post('/add',productController.createProduct)
router.post('/delete',productController.deleteProduct)


router.post('/inventory-add',productController.addInventory)
router.post('/sale',productController.saleProduct)
router.get('/sale/list',productController.listSaleProducts)


module.exports = router;