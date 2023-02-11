const Category = require('./model')

const createCategory = async (req, res, next) => {
    try {
        let payload = req.body
        let category = new Category(payload)
        await category.save()
        return res.json(category)
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
const updateCategory = async (req, res, next) => {
    try {
        let {id} = req.params
        let payload = req.body
        let category = await Category.findByIdAndUpdate(id, payload, {new: true, runValidators:true})
        return res.json(category)
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
const deleteCategory = async (req, res, next) => {
    try {
        let {id} = req.params
        let category = await Category.findByIdAndDelete(id)
        return res.json(category)
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
const getCategory = async (req, res, next) => {
    try {
        let category = await Category.find()
        return res.json(category)
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
const getByIdCategory = async (req, res, next) => {
    try {
        let {id} = req.params
        let category = await Category.findById(id)
        return res.json(category)
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
    createCategory,
    deleteCategory,
    updateCategory,
    getCategory,
    getByIdCategory
}