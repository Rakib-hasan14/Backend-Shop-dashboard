const {
    successResponse,
    errorResponse,
} = require('../helper/apiResponse');
const ProductModel = require('../models/ProductModel')
const SaleModel = require('../models/SaleModel')
const {pagination} = require('../helper/pagination')


exports.summaryDetails = async (req, res) => {
    try{
        const allProfit = await SaleModel.aggregate([
            {
                $group: {
                    _id: '',
                    profit: { $sum: { $sum: ['$profit'] } },
                },
            },
        ]);

        const products = await ProductModel.aggregate([
            {
                $group: {
                    _id: '',
                    buy: { $sum: { $sum: ['$buy'] } },
                    sale: { $sum: { $sum: ['$sale'] } },
                },
            },
        ]);


        const allProducts = await ProductModel.find({})
        let bestSalingProduct = {}
        for (const singleProduct of allProducts) {

            let sale = bestSalingProduct.sale ? bestSalingProduct.sale : 0

            if(singleProduct.sale > sale){
                bestSalingProduct = singleProduct
            }
        }
        console.log(bestSalingProduct)

        successResponse(res,{
            message: 'Successfully Get',
            data: {
                totalBuy: products[0].buy,
                totalSale: products[0].sale,
                totalProfit: allProfit[0].profit,
                bestSaleProduct: bestSalingProduct
            }
        })
    }catch(error){
        errorResponse(res,error.message)
    }
}