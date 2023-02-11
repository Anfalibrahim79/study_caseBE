const Tags = require('./model')

const createTag = async (req, res, next) => {
    try {
        let payload = req.body
        let tag = new Tags(payload)
        await tag.save()
        return res.json(tag)
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
const updateTag = async (req, res, next) => {
    try {
        let {id} = req.params
        let payload = req.body
        let tag = await Tags.findByIdAndUpdate(id, payload, {new: true, runValidators:true})
        return res.json({
            message : "Update Success",
            tag
        })
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
const deleteTag = async (req, res, next) => {
    try {
        let {id} = req.params
        let tag = await Tags.findByIdAndDelete(id)
        return res.json({
            message : "Delete Success",
            tag
        })
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
const getTag = async (req, res, next) => {
    try {
        let tag = await Tags.find()
        return res.json(tag)
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
const getByIdTag = async (req, res, next) => {
    try {
        let {id} = req.params
        let tag = await Tags.findById(id)
        return res.json(tag)
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
    createTag,
    updateTag,
    deleteTag,
    getByIdTag,
    getTag
}