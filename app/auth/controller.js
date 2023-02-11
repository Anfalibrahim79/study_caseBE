const User = require('../user/model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { getToken } = require('../../utils/index')

const register = async(req, res, next) => {
    try {
        const payload = req.body
        let user = new User(payload)
        await user.save()
        return res.json(user)
    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error: 1,
                message : error.message,
                fields : error.errors
            })
        }
        next(error)
    }
}


const localStrategy = async (email, password, done) => {
    try {
        let user = await User.findOne({email}).select('-_v -createAt -updateAt -cart_items -token ');
        if(!user)
            return done ()

        if(bcrypt.compareSync(password, user.password)){
            const {password, ...userWithoutPassword} = user.toJSON()
            return done(null, userWithoutPassword)
        }
    } catch (error) {
        done(error, null)
    }
    done()
}

const login =  (req, res, next)=>{
    passport.authenticate('local', async function(err, user){
        if(err) return next(err)
        // console.log(user);
        if(!user){
            // Validasi jika email dan password salah
            return res.json({
                error: 1,
                message : "Email or Password incorrect"
            })
        }
            // validasi jika user ditemukan
        let signed = jwt.sign(user, config.secretKey)
        // console.log(signed);
        await User.findByIdAndUpdate(user._id, {$push : {token: signed}})

        return res.json({
                message :'Login Successfully',
                user,
                token : signed
            })
        
    })(req, res, next) // passport meneruskan

}

const logout = async (req, res, next) =>{
    
        let token = getToken(req)
  
        let user = await User.findOneAndUpdate({token : {$in : [token]}}, {$pull : {token}}, {userFindAndModify : false})

        if(!token || !user) {
            res.json({
                error : 1,
                message : 'No Found User !!'
            })
        }

        res.json({
            error : 0,
            message: "Logout Successfully"
        })
   
}

const me = (req, res, next) => {
    // console.log(req.user);
    if(!req.user){
        res.json({
            error: 1,
            message: `You're not login or token expired`
        })
    }

    return res.json(req.user)
}
module.exports ={
    register,
    localStrategy,
    login,
    logout,
    me
}