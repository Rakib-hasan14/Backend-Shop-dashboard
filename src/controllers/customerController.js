const {
    successResponse,
    errorResponse,
} = require('../helper/apiResponse');
const CustomerModel = require('../models/CustomerModel')
const {pagination} = require('../helper/pagination')

exports.addCustomer = async (req, res) => {
    try{
        const {
            name,
            email,
            number
        } = req.body
        
        const existEmail = await CustomerModel.findOne({email})
        const existNumber = await CustomerModel.findOne({number})

        if(existEmail) return errorResponse(res, 'Customer email already exist')
        if(existNumber) return errorResponse(res, 'Customer number already exist')

        const customer = await CustomerModel.create({
            name,
            email,
            number
        })

        successResponse(res, {
            message: 'Successfully added Customer',
            data: customer
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.getCustomers = async (req,res) => {
    try{
        const { page = 1,pageSize = 50 } = req.query

        let paginate = await pagination({
            page,
            pageSize,
            model: CustomerModel,
            condition: {},
            pagingRange: 5,
        });

        const list = await CustomerModel.find({})
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

exports.getCustomerDetails = async (req,res) => {
    try{
        const {id} = req.query

        const customer = await CustomerModel.findById(id)

        if(!customer) return errorResponse(res, 'Customer not found')

        successResponse(res, {
            message: 'Successfully Find',
            data: customer
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}

exports.deleteCustomer = async (req, res) => {
    try{
        const {id} = req.body

        const existCustomer = await CustomerModel.findById(id)

        if(!existCustomer) return errorResponse(res, 'Customer not found')

        await CustomerModel.findByIdAndDelete(id)

        successResponse(res,{
            message: 'Successfully delete'
        })
    }catch(error){
        errorResponse(res, error.message)
    }
}