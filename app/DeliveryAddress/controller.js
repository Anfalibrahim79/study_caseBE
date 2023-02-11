const { subject} = require('@casl/ability');
const { policyFor } = require('../../utils');
const DeliveryAddress = require('./model')

const createDeliveryAddress = async(req, res, next) =>{
    try {
        let payload = req.body
        // console.log(payload);
        let user = req.user
        console.log(user);
        let address = new DeliveryAddress({...payload, user: user._id})
        await address.save()
        return res.json(address)
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

const updateDeliveryAddress = async(req, res, next) =>{
    try {
        let{_id, ...payload} = req.body // mengeluarkan id dari payload
        let {id} = req.params // mengambil id dari req params
        let address = await DeliveryAddress.findById(id)
        console.log(address)
        let policy = policyFor(req.user)   
        console.log(policy);
        let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user})
        if(!policy.can('update',subjectAddress)){
            return res.status(403).json({
                error : 1,
                message : "You don't have permission to update this address"
            })
        }
        address =await DeliveryAddress.findByIdAndUpdate(id , payload, {new :true})
        return res.json(address)
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
const deleteDeliveryAddress = async(req, res, next) =>{
    try {
        let {id} = req.params
        let address = await DeliveryAddress.findById(id)
        let subjectAddress =subject('DeliveryAddress', {...address, user_id : address.user })
        console.log(req.user);
        let policy = policyFor(req.user)
        if(!policy.can('delete',subjectAddress)){
            return res.status(403).json({
                error : 1,
                message : "You don't have permission to delete this address"
            })
        }
        address =await DeliveryAddress.findByIdAndDelete(id)
        
        return res.json({
            status : 200,
            message : "Delete Data Successfully",
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
const getDataDeliveryAddress = async(req, res, next) =>{
    try {
        let{ skip = 0, limit = 10} = req.query
        let count = await DeliveryAddress.find({user : req.user._id}).countDocuments()
        let address = await DeliveryAddress.find({user : req.user._id}).skip(skip).limit(limit).sort('-createdAt')

        
        
        return res.json({
            status : 200,
            message : "Get Data Successfully",
            data : address,
            count : count
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

module.exports = {
    createDeliveryAddress,
    updateDeliveryAddress,
    deleteDeliveryAddress,
    getDataDeliveryAddress
}