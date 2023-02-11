const {Schema, model} = require('mongoose')

const deliveryAddressSchema = Schema({
    name : {
        type : String,
        minlength: [3, "Minimum length of 3 letters"],
        required : [true, "Name cannot be empty"] 
    },

    kelurahan : {
        type : String,
        maxlength: [255, 'Maximum length of 255 letters'],
        required : [true, "Kelurahan cannot be empty"] 
    },

    kecamatan : {
        type : String,
        maxlength: [255, 'Maximum length of 255 letters'],
        required : [true, "Kecamatan cannot be empty"] 
    },

    kabupaten : {
        type : String,
        maxlength: [255, 'Maximum length of 255 letters'],
        required : [true, "Kabupaten cannot be empty"] 
    },

    provinsi : {
        type : String,
        maxlength: [255, 'Maximum length of 255 letters'],
        required : [true, "Provinsi cannot be empty"] 
    },

    detail : {
        type : String,
        maxlength: [1000, 'Maximum length of 1000 letters'],
        required : [true, "Detail alamat cannot be empty"] 
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamp : true})


module.exports = model('DeliveryAddress', deliveryAddressSchema)