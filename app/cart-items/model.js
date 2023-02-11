const { Schema, model } = require('mongoose')

const cartItemSchema = Schema({
    name : {
        type : String,
        required : [true, 'name must be filled '],
        minlength : [5, 'minlength must be greater than']
    },
    qty :{
        type : Number,
        required : [true, 'qty must be filled '],
        minlength : [1, 'qty must be greater than']
    },
    price :{
        type : Number,
        default: 0
    },
    image_url : String,
    url : String,
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    product : {
        type : Schema.Types.ObjectId,
        ref : 'Product'
    }
})

module.exports = model('CartItem', cartItemSchema)