const router = require('express').Router()
const { police_check } = require('../../middleware')
const categoryController = require('./controller')

router.post('/',police_check("create", "Category"),categoryController.createCategory)
router.put('/:id',police_check("update", "Category"),categoryController.updateCategory)
router.delete('/:id',police_check("delete", "Category"),categoryController.deleteCategory)
router.get('/',categoryController.getCategory)
router.get('/:id',categoryController.getByIdCategory)


module.exports = router