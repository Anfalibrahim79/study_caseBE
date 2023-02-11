const { police_check } = require('../../middleware')

const router = require('express').Router()
const cartController = require('./controller')

router.get('/', police_check('read', 'Cart'), cartController.index)
router.put('/', police_check('update', 'Cart'), cartController.update)

module.exports = router