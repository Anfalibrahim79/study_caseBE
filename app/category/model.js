const mongoose = require('mongoose')
const {model, Schema} = mongoose

const categorySchema = Schema({
    name : {
        type : String,
        minlength : [3, "Minimum length of 3 letters"],
        required : [true, "Category cannot empty"]
    }
})

module.exports = model("Category", categorySchema)