const mongoose = require('mongoose')
const {model, Schema} = mongoose

const tagsSchema = Schema({
    name : {
        type : String,
        minlength : [3, "Minimum length of 3 letters"],
        required : [true, "Tags cannot empty"]
    }
})

module.exports = model("Tag", tagsSchema)