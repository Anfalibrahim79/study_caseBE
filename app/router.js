const router = require('express').Router()
const productRouter = require('./product/router')
const categoryRouter = require('./category/router')
const tagRouter = require('./tags/router')
const authRouter = require('./auth/router')
const deliveryAddressRouter = require('./DeliveryAddress/router')
const cartRouter = require('./cart/router')
const orderRouter = require('./order/router')
const invoiceRouter = require('./invoice/router')


router.use('/product', productRouter)
router.use('/category', categoryRouter)
router.use('/tags', tagRouter)
router.use('/auth', authRouter)
router.use('/deliveryAddress', deliveryAddressRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.use('/invoice', invoiceRouter)


module.exports = router