const path = require('path')
const fs = require('fs')
const config = require('../config')
const Product = require('./model')
const Category = require('../category/model')
const Tag = require('../tags/model')

const createProduct = async (req, res, next) => {
    try {
        let payload = req.body;
        // console.log(payload);
        let file = req.file
        
        // console.log(payload);
        //Relasi one to one category
        if(payload.category){
            let category = await Category.findOne({name : {$regex : payload.category, $options : 'i'}})
            if(category){
                payload = {...payload, category: category._id}
            }else{
                delete payload.category;
            }
        }
        
        //relasi one to many to tag
       if(payload.tags && payload.tags.length > 0){
            let tags = await Tag.find({name : {$in : payload.tags}})
            
            if(tags.length){
                payload = {...payload, tags : tags.map(e => e._id)}
                
            }else{
                delete payload.tags
            }
       }
    
        if(req.file){
            let tmp_path = req.file.path;
            console.log(tmp_path);
            let originalExt =req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);
            
            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path); 
            src.pipe(dest)
            
            src.on('end', async() =>{
                try {
                   
                    
                    const product = new Product({...payload, image_url: `/images/products/${filename}` });
                    await product.save()
                    return res.json(
                        product
                    )
                } catch (error) {
                    fs.unlinkSync(target_path)
                    if(error && error.name === "ValidationError"){
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields : error.errors
                        })
                    }
                    next(error);
                }
            })

            src.on('error', async () => {
                next(error)
            })

        } else {
            let product = new Product(payload);
            await product.save();
            return res.json(product)
        }
    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error: 1,
                message : error.message,
                fields: error.errors
            }) 
        }
        next(error)
    }
}
const updateProduct = async (req, res, next) => {
    try {
        let payload = req.body;
        const {id} = req.params
        if(payload.category){
            let category = await Category.findOne({name : {$regex : payload.category, $options : 'i'}})
            if(category){
                payload = {...payload, category: category._id}
            }else{
                delete payload.category;
            }
        }
        if(payload.tags && payload.tags.length > 0){
            let tags = await Tag.find({name : {$in : payload.tags}})
            
            if(tags.length){
                payload = {...payload, tags : tags.map(e => e._id)}
                
            }else{
                delete payload.tags
            }
           }
        if(req.file){
            let tmp_path = req.file.path;
            let originalExt =req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

                        
            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest)
            
            src.on('end', async() =>{
                try {
                    let product = await Product.findById(id)

                    // let currentImage = path.join(`${config.rootPath}/public/${product.image_url}`)
                    let currentImage = `${config.rootPath}/public/${product.image_url}`

                    console.log(currentImage);
                    console.log(fs.existsSync(currentImage)) 

                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage)
                    }

                    payload.image_url= `/images/products/${filename}`
                    
                    
                    console.log(payload);
                
                    product = await Product.findByIdAndUpdate({_id: id},payload, {new :true, runValidators: true});
                    return res.json(
                        product
                    )
                } catch (error) {
                    fs.unlinkSync(target_path)
                    if(error && error.name === "ValidationError"){
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields : error.errors
                        })
                    }
                    next(error);
                }
            })

            src.on('error', async () => {
                next(error)
            })

        } else {
            const product = await Product.findByIdAndUpdate(id, payload, {new :true, runValidators: true});
            return res.json(
                product
            )
        }
    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error: 1,
                message : error.message,
                fields: error.errors
            })
        }
        next(error)
    }
}

const getDataProduct = async (req, res, next) => {
    try {
        let {skip, limit, q = '', category = '', tags= []} = req.query
        
        let criteria =  {}

        if(q.length){
            criteria = {
                ...criteria,
                name : {$regex : `${q}`, $options: 'i'}
            }
        }

        if(category.length){
            let categoryResult = await Category.findOne({name : {$regex : `${category}`, $options: "i"}})
            // console.log(categoryResult);
            if(categoryResult){
                criteria = {...criteria, category: categoryResult._id}
            }
        }

        if(tags.length){
            let tagsResult = await Tag.find({name : {$in: tags}})
            console.log(tagsResult);
            if(tagsResult.length > 0){
                criteria = {...criteria, tags : {$in : tagsResult.map(tag => tag._id)}}
            }
        }

        console.log(criteria);
        let count = await Product.find().countDocuments()


        const product = await Product.find(criteria).skip(parseInt(skip)).limit(parseInt(limit)).populate('category').populate('tags')
        res.status(200).json({
            message : "Get Data Successfully",
            data : product,
            count  
        })
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        console.log(product.image_url);
        let currentImage = `${config.rootPath}/public${product.image_url}`
        console.log(currentImage);
        console.log(fs.existsSync(currentImage));
        if(fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage)
        }
        res.status(200).json({
            message : "Delete Data Successfully",
           
        })
    } catch (error) {
        next(error)
    }
}
const getDataProductById = async (req, res, next) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        res.status(200).json({
            message : "Get Data By id Successfully",
            data : product
           
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createProduct,
    getDataProduct,
    updateProduct,
    deleteProduct,
    getDataProductById
}