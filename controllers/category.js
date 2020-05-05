const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id)=>{
    Category.findById(id).exec((err, category)=>{
        if(err || !category){
            return res.status(400).json({
                error: "Category not found"
            });
        }
        req.category = category;
        next();
    })
}

exports.createCategory = (req, res)=>{

    Category.create(req.body,(err, category)=>{
        if(err){
            return res.status(400).json({
                error: "Can't create category"
            })
        }
        res.json({category});
    })
}

exports.getCategory = (req, res)=>{
    return res.json(req.category);
}

exports.getAllCategories = (req, res)=>{
    Category.find().exec((err, categories)=>{
        if(err){
            return res.status(400).json({
                error: "No category found"
            })
        }
        res.json(categories)
    })
}

// exports.updateCategory = (req, res)=>{
//     Category.findByIdAndUpdate(
//         {_id: req.category._id},
//         {$set: req.body},
//         {useFindAndModify: false},
//         (err, category)=>{
//             if(err || !category){
//                 return res.status(400).json({
//                     error: "Category not found"
//                 })
//             }
//             res.json(category);
//         }
//     )
// }




//Hitesh update method
exports.updateCategory = (req, res)=>{
    const category = req.category;
    category.name = req.body.name;
    console.log("outside save")

    category.save((err, updatedCategory)=>{
        console.log("inside save")
        if(err){
            console.log("insiderr")
            return res.status(400).json({
                error: "Category not found"
            })
        }
        res.json(updatedCategory);
    })
}

exports.deleteCategory = (req, res)=>{
    Category.findByIdAndRemove(
        {_id: req.category._id},
        {useFindAndModify:true},
        (err)=>{
            if(err){
                return res.json({
                    error: "category can't be deleted"
                })
            }
             res.json({
                 message: "Successfully deleted"
             })
        }
    )
}
//Hitesh delete method
// exports.deleteCategory = (req, res)=>{
//     const category = req.category;
//     category.remove((err, category)=>{
//         if(err){
//             return res.status(400).json({
//                 error: "Category not found"
//             })
//         }
            // res.json({
            //     message: "Successfully deleted"
            // })
//     })
// }