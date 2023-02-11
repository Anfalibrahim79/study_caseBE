const router = require('express').Router()
const { police_check } = require('../../middleware')
const deliveryAddressController = require('./controller')


router.post('/',police_check('create', 'DeliveryAddress') ,deliveryAddressController.createDeliveryAddress)
router.get('/',police_check('view', 'DeliveryAddress'), deliveryAddressController.getDataDeliveryAddress)
router.put('/:id', deliveryAddressController.updateDeliveryAddress)
router.delete('/:id', deliveryAddressController.deleteDeliveryAddress)

module.exports = router