const router = require('express').Router()
const multer = require('multer')
const os = require('os')
const { police_check } = require('../../middleware')

const productController = require('./controller')


router.get('/', productController.getDataProduct)
router.get('/:id', productController.getDataProductById)
router.delete('/:id',police_check("delete", "Product"), productController.deleteProduct)
router.post('/', multer({dest : os.tmpdir()}).single('image'),police_check("create", "Product") ,productController.createProduct)
router.put('/:id', multer({dest : os.tmpdir()}).single('image'),police_check("update", "Product"), productController.updateProduct)

module.exports = router