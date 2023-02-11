const router = require('express').Router()
const orderController = require('./controller')
const {police_check} = require('../../middleware')

router.get('/', police_check('view', 'Order'), orderController.index)
router.post('/', police_check('view', 'Order'), orderController.index)

module.exports = router