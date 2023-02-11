const CartItem = require('../cart-items/model');
const Product = require('../product/model');

const update = async (req, res, next) => {
    try {
        const {items} = req.body
        const productIds = items.map(item => item.product._id)
        const product = await Product.find({_id: {$in: productIds}})
        let cartItem = items.map(item => {
            let relatedProduct = product.find(product => product._id.toString() === item.product._id)
            return{
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user : req.user._id,
                qty : item.qty,
            }
        })
        await CartItem.deleteMany({user: req.user._id})
        await CartItem.bulkWrite(cartItem.map(item =>{
            return{
                updateOne : {
                    filter: {
                        user: req.user._id,
                        product: item.product
                    },
                    update : item,
                    upsert : true
                }
            }
        }))
        return res.json(cartItem)
    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error : 1,
                message : error.message,
                fields : error.error
            })
        }
        next(error)
    }
}

const index = async (req, res, next) => {
    try {
        let items = await CartItem.find({user : req.user._id}).populate('product')
        return res.json(items)
        
    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error : 1,
                message : error.message,
                fields : error.error
            })
        }
        next(error)
    }
}



module.exports = {
    update,
    index
}