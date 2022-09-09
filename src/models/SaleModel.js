const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types

const SaleSchema = new Schema(
    {
        product:{
            type: ObjectId,
            ref: 'products',
            required: true
        },
        customer:{
            type: ObjectId,
            ref: 'customers',
            required: true
        },
        customerName:{
            type: String,
        },
        productName:{
            type: String,
        },
        type:{
            type: String,
            required: true
        },
        profit:{
            type: Number,
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('sales',SaleSchema)