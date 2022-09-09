const {
    successResponse,
    errorResponse,
} = require('../helper/apiResponse');
const SellerModel = require('../models/SellerModel')
const {pagination} = require('../helper/pagination')


exports.addSeller = async (req, res) => {
    try{
        const {
            name,
            email,
            number
        } = req.body
        
        const existEmail = await SellerModel.findOne({email})
        const existNumber = await SellerModel.findOne({number})

        if(existEmail) return errorResponse(res, 'Seller email already exist')
        if(existNumber) return errorResponse(res, 'Seller number already exist')

        const seller = await SellerModel.create({
            name,
            email,
            number
        })

        successResponse(res, {
            message: 'Successfully added seller',
            data: seller
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.getSellers = async (req,res) => {
    try{
        const { page = 1,pageSize = 50 } = req.query

        let paginate = await pagination({
            page,
            pageSize,
            model: SellerModel,
            condition: {},
            pagingRange: 5,
        });

        const list = await SellerModel.find({})
            .sort({ createdAt: 'Desc' })
            .skip(paginate.offset)
            .limit(paginate.limit)

            
        successResponse(res, {
            message: 'Successfully get customers',
            data: {
                list,
                paginate
            }
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.getSellerDetails = async (req,res) => {
    try{
        const {id} = req.query

        const seller = await SellerModel.findById(id)

        if(!seller) return errorResponse(res, 'Seller not found')

        successResponse(res, {
            message: 'Successfully Find',
            data: seller
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.deleteSeller = async (req, res) => {
    try{
        const {id} = req.body

        const existSeller = await SellerModel.findById(id)

        if(!existSeller) return errorResponse(res, 'Seller not found')

        await SellerModel.findByIdAndDelete(id)

        successResponse(res,{
            message: 'Successfully delete'
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}