const router = require('express').Router()
const { police_check } = require('../../middleware')
const tagController = require('./controller')

router.get('/', tagController.getTag)
router.get('/:id', tagController.getByIdTag)
router.post('/', police_check("create", "Tag"),tagController.createTag)
router.put('/:id',police_check("update", "Tag"), tagController.updateTag)
router.delete('/:id',police_check("delete", "Tag"), tagController.deleteTag)

module.exports = router