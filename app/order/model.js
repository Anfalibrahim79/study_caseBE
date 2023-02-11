const mongoose = require('mongoose')
const {Schema, model} = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Invoice = require('../invoice/model')


const orderSchema = new Schema({
    status : {
        type : String,
        enum : ['waiting_payment', 'processing_payment','in_delivery', 'delivered'],
        default : 'waiting_payment'
    },

    delivery_fee: {
        type : Number,
        default : 0
    },
    order_number : {

    },

    

    delivery_address : {
        provinsi : { type : String, required : [true, 'provinsi must be provided']},
        kabupaten : { type : String, required : [true, 'kabupaten must be provided']},
        kecamatan : { type : String, required : [true, 'kecamatan must be provided']},
        kelurahan : { type : String, required : [true, 'kelurahan must be provided']},
        detail : {type : String}
    },

    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },

    order_items : [{type : Schema.Types.ObjectId, ref : 'OrderItem'}]
}, {timestamps : true})

/**
 bagian ini masih error
// orderSchema.plugin(AutoIncrement, {inc_fields : 'order_number'})
 */

// membuat table secara virtual
orderSchema.virtual('items_count').get(function () {
    return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0)
})

// membuat data secara trigger
orderSchema.post('save', async function(){
    let sub_total = this.order_items.reduce((total, item) => total += (item.price * item.qty), 0)
    let invoice = new Invoice({
        user : this.user,
        order : this._id,
        sub_total : sub_total,
        delivery_fee : parseInt(this.delivery_fee),
        delivery_address : this.delivery_address,
        total: parseInt(sub_total + this.delivery_fee)

    })

    await invoice.save()
})

module.exports = model('Order', orderSchema)
