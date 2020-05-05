const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id)=>{
    Product.findById(id)
    .populate("Category")
    .exec((err, product)=>{
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product;
        next();
    })
}

exports.getProduct = (req, res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}

//middleware-This will make our application faster to load 
exports.photo = (req, res, next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.createProduct = (req, res)=>{
    //creating a form
    let form = new formidable.IncomingForm();
    //form should also include the extensions of the files
    form.keepExtensions = true;

    //Now parse the form
    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error: "problem with Image"
            })
        }

        //destructure the fields
        const {name, description, price, category, stock} = fields;

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please include all the fields"
            })
        }

        //create a product object and put fields in it which is just a simple data
        let product = new Product(fields);

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            //These two lines saves the Photo the the DB
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType  = file.photo.type;
        }

        //Now save the product(including photo) to the DB
        product.save((err, product)=>{
            if(err){
                return res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })
    })
}

exports.getAllProducts = (req, res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error: "No Product found"
            })
        }
        res.json(products);
    })
}

exports.updateProduct = (req, res)=>{
     //creating a form
     let form = new formidable.IncomingForm();
     //form should also include the extensions of the files
     form.keepExtensions = true;
 
     //Now parse the form
     form.parse(req, (err, fields, file)=>{
         if(err){
             return res.status(400).json({
                 error: "problem with Image"
             })
         }
 
         //updation of the product
         let product = req.product;
         product = _.extend(product, fields);
 
         //handle file here
         if(file.photo){
             if(file.photo.size > 3000000){
                 return res.status(400).json({
                     error: "File size too big"
                 })
             }
             //These two lines saves the Photo the the DB
             product.photo.data = fs.readFileSync(file.photo.path);
             product.photo.contentType  = file.photo.type;
         }
 
         //Now save the product(including photo) to the DB
         product.save((err, product)=>{
             if(err){
                 return res.status(400).json({
                     error: "Updating tshirt in DB failed"
                 })
             }
             res.json(product);
         })
     })
}

exports.removeProduct = (req, res)=>{
    let product = req.product;
    product.remove((err, product)=>{
        if(err){
            return res.status(400).json({
                error: "Product can't be deleted"
            })
        }
        res.json({
            message: "Product Successfully deleted",
            product
        })
    })
}

exports.getAllUniqueCategories = (req, res)=>{
    Product.distinct("category", {}, (err, category)=>{
        if(err){
            return res.status(400).json({
                error: "No category found"
            })
        }
        res.json(category);
    })
}

//Middleware
exports.updateStock = (req, res)=>{
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk operations failed"
            })
        }
    })
}