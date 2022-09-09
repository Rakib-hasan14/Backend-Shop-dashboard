const {
    successResponse,
    errorResponse,
} = require('../helper/apiResponse');
const ProductModel = require('../models/ProductModel')
const CustomerModel = require('../models/CustomerModel')
const SaleModel = require('../models/SaleModel')
const moment = require('moment');
const {pagination} = require('../helper/pagination')


exports.createProduct = async (req, res) => {
    try{
        const {
            name,
            salePrice,
            buyPrice,
            type,
            inventory,
        } = req.body

        if(!name || !inventory) return errorResponse(res, 'Bad Request')

        const product = await ProductModel.create({
            name,
            salePrice,
            buyPrice,
            type,
            buy: buyPrice * inventory ,
            inventory
        })

        successResponse(res, {
            message: 'Successfully added seller',
            data: product
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.getProducts = async (req,res) => {
    try{
        const { page = 1,pageSize = 50 } = req.query

        let paginate = await pagination({
            page,
            pageSize,
            model: ProductModel,
            condition: {},
            pagingRange: 5,
        });

        const list = await ProductModel.find({})
            .sort({ createdAt: 'Desc' })
            .skip(paginate.offset)
            .limit(paginate.limit)

            
        successResponse(res, {
            message: 'Successfully get product',
            data: {
                list,
                paginate
            }
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.getProductsDetails = async (req,res) => {
    try{
        const {id} = req.query

        const product = await ProductModel.findById(id)

        if(!product) return errorResponse(res, 'Product not found')

        successResponse(res, {
            message: 'Product Find',
            data: product
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.deleteProduct = async (req, res) => {
    try{
        const {id} = req.body

        const existProduct = await ProductModel.findById(id)

        if(!existProduct) return errorResponse(res, 'Product not found')

        await ProductModel.findByIdAndDelete(id)

        successResponse(res,{
            message: 'Successfully delete'
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.saleProduct = async (req,res) => {
    try{
        const {
            product,
            customer,
            quantity
        } = req.body

        const details = await ProductModel.findById(product)
        const customerDetails = await CustomerModel.findById(customer)

        if(details.inventory < quantity) return errorResponse(res,'Not available this quantity')

        let singleProfit = details.salePrice - details.buyPrice
        let profit = singleProfit * quantity

        const saleProduct = await SaleModel.create({
            product,
            customer,
            quantity,
            profit,
            productName: details.name,
            customerName: customerDetails.name,
            type: details.type
        })

        const sale = await SaleModel.findById(saleProduct._id).populate('product customer') 

        await ProductModel.updateOne(
            {_id: product},
            {
                sale: details.salePrice * quantity,
                inventory: details.inventory - quantity
            }
        )
        


        successResponse(res,{
            message: 'Successfully Sale',
            data: sale
        })
    }catch(error){
        errorResponse(res,error.message)
    }
}

exports.addInventory = async(req,res) => {
    try{
        const {productId,inventory} = req.body

        const product = await ProductModel.findById(productId)

        if(!product) return errorResponse(res,'Produc not found')

        await ProductModel.updateOne(
            {_id: productId},
            {
                
                buy: product.buy + (inventory * product.buyPrice),
                inventory: product.inventory + inventory
            }
        )

        const updatedProduct = await ProductModel.findById(productId)

        successResponse(res, {
            message: 'Successfully add inventory',
            data: updatedProduct
        })
    }catch(error){
        errorResponse(res,error.message)
    }
}

exports.listSaleProducts = async (req,res) => {
    try{
        const { page = 1,pageSize = 50 ,type, startDate,endDate,searchKey} = req.query

        let whereConfig = {}

        if(type){
            whereConfig = {
                ...whereConfig,
                type
            }
        }
        if(startDate && endDate){
            whereConfig = {
                ...whereConfig,
                createdAt: {
                    $gt: moment(new Date(startDate)),
                    $lt: moment(new Date(endDate))
                },
            }
        }
        if (searchKey) {
            const newQuery = searchKey.split(/[ ,]+/);
            const productQuery = newQuery.map(str => ({
                productName: RegExp(str, 'i'),
            }));

            const custoerQuery = newQuery.map(str => ({
                customerName: RegExp(str, 'i'),
            }));

            whereConfig = {
                ...whereConfig,
                $and: [
                    {
                        $or: [
                            { $and: productQuery },
                            { $and: custoerQuery },
                        ],
                    },
                ],
            };
        }


        let paginate = await pagination({
            page,
            pageSize,
            model: SaleModel,
            condition: whereConfig,
            pagingRange: 5,
        });

        const list = await SaleModel.find(whereConfig)
        .populate('product customer') 
            .sort({ createdAt:  'Desc'})
            .skip(paginate.offset)
            .limit(paginate.limit)

            
        successResponse(res, {
            message: 'Successfully get Sales',
            data: {
                list,
                paginate
            }
        })
    }catch(error){
        errorResponse(res, error.message)
    }
} 