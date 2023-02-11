const CartItem = require('../cart-items/model')
const DeliveryAddress = require('../DeliveryAddress/model')
const Order = require('../order/model')
const OrderItem = require('../order_items/model')
const { Types } = require('mongoose')

const store = async(req, res, next) =>{
    try {
        let {delivery_fee, delivery_address} = req.body
        let items = await CartItem.find({user : req.user._id}).populate('product')
        if(!items){
            return res.status(404).json({error: 1, message : 'No items in cart'})
        }

        let address = await DeliveryAddress.findById(delivery_address)

        let order = new Order({
            _id : new Types.ObjectId(),
            status : 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_address:{
                provinsi : address.provinsi,
                kabupaten : address.kabupaten,
                kecamatan : address.kecamatan,
                kelurahan : address.kelurahan,
                detail : address.detail
            },
            user : req.user._id
        })

        let orderItems = await OrderItem.insertMany(items.map(item =>({
            ...item,
            name : item.product.name,
            qty : parseInt(item.qty),
            price : parseInt(item.product.price),
            order : order._id,
            product : item.product._id
        })))

        orderItems.forEach(item => order.order_items.push(item))
        order.save()
        await CartItem.deleteMany({user :req.user._id})
        return res.status(200).json(order)
    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error: 1,
                message : error.message,
                fields: error.errors
            }) 
        }
        next(error)
    }
}

const index = async(req, res, next) =>{
    try {
        let {skip = 0, limit = 10} = req.query
        let count = await Order.find({user : req.user._id}).countDocument();
        let orders = await Order.find({user : req.user._id}).skip(parseInt(skip)).limit(parseInt(limit)).populate('order_items').sort('-createdAt')
        return res.status(200).json({
            data : orders.map(order => order.toJSON({virtuals : true})),
            count
        })
    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error: 1,
                message : error.message,
                fields: error.errors
            }) 
        }
        next(error)
    }
}



module.exports ={
    store,
    index
}