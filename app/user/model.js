const mongoose = require('mongoose')
const {Schema, model} = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcrypt')

let userSchema = Schema({

    full_name: {
        type : String,
        required : [true, "name is required"],
        maxlength : [255, "Maximum name length is 255 characters"],
        minlength : [3, "name at least 3 characters"]
    },

    customer_id : {
        type :Number
    },

    email : {
        type: String,
        required : [true, "email is required"],
        maxlength : [255, "Maximum email length is 255 characters"]
    },

    password : {
        type: String,
        required : [true, "password is required"],
        maxlength : [255, "Maximum password length is 255 characters"]
    },

    role : {
        type :String,
        enum : ['user', 'admin'],
        default : 'user'
    },

  
    token : [String]

},{timestamps : true})

// Email validasi menggunakan REGEX
userSchema.path('email').validate(function(value){
    const EMAIL_RE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return EMAIL_RE.test(value)
}, attr => `${attr.value} must be a valid email`) // Jika validasi gagal 

// Email validasi jika ada email yang sama
userSchema.path('email').validate(async function(value){
    try {
        // 1. lakukan pencarian ke collection User berdasarkan email

        const count = await this.model('User').count({email : value})

        // 2. kode ini mengindikasikan bahwa jika ditemukan email yang sama return "false" jika tidak ditemukan maka return "true"
        // jika "false" maka validasi gagal
        // jika "true" maka validasi berhasil
        return !count
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} e-mail already registered`)

//hashing password
const HASH_ROUND = 10
userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})
// untuk menambahkan autoIncrement customer_id
userSchema.plugin(AutoIncrement, {inc_field : 'customer_id'})
module.exports = model('User', userSchema)