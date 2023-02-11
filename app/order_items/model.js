const {Schema, model} = require('mongoose')

const orderItemSchema = new Schema({
    name : {
        type : String,
        minlength : [5, 'name must be at least 5 characters'],
        required : [true, 'name is required']
    },

    price : {
        type : Number,
        required : [true, 'price is required']
    },

    qty: {
        type : Number,
        required : [true, 'qty is required'],
        min : [1, 'qty must be at least']
    },

    product : {
        type : Schema.Types.ObjectId,
        ref : 'Product'
    },

    order : {
        type : Schema.Types.ObjectId,
        ref : 'Order'
    }
})


module.exports = model('OrderItem', orderItemSchema)