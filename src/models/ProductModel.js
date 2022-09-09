const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        salePrice:{
            type: String,
            required: true
        },
        buyPrice:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        sale:{
            type: Number,
        },
        buy:{
            type: Number,
        },
        inventory:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('products',ProductSchema)