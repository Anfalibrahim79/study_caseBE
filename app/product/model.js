const mongoose = require('mongoose')
const {model, Schema} = mongoose

const productSchema = Schema({
    name : {
        type : String,
        minlength: [3, "Minimum length of 3 letters"],
        required : [true, "Name cannot be empty"] 
    },
    price : {
        type : Number,
        default : 0
    },
    description : {
        type : String,
        maxlength: [1000, "Maximum length of 1000 letters"]   
    },
    image_url : String,

    category : {
        type : Schema.Types.ObjectId,
        ref : "Category"
    },
    tags : [{
        type: Schema.Types.ObjectId,
        ref: "Tag"
    }]
},{timestamps : true}) 

module.exports = model('Product', productSchema)