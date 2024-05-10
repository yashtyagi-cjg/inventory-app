const Item = require('./../models/item')
const Category = require('./../models/category')
const asyncHandler = require('express-async-handler')
const {body, validationResult} = require('express-validator')
const category = require('./../models/category')
const {uploadImage, downloadImage} = require('./cloudinaryMethods')


// console.log(cloudinary.config())

//Display a Category
exports.category_get = asyncHandler(
    async(req, res, next)=>{
        const items = await Item.find({category: req.params.id}).populate("category").exec()
        const category = await Category.findById(req.params.id).exec();
        // console.log(items);
        // console.log("EXISTS: " + req.params.exists)
        // console.log("EXISTS ID: " + req.params.id)
        // console.log("Category: " + category)
        res.render("categories", 
        {
            title: category.name, //(items === undefined? undefined: Array.from(items)[0].category.name),
            items: items,
            exists: (undefined==req.params.exists?'':true),
            category_id: req.params.id,
        })
    }
)

//Display all Categories
exports.categories_get = asyncHandler(
    async(req, res, next)=>{
        const categories = await Category.find({}).sort({name:1}).exec();
        const items = await Item.find({}).populate('category').exec();
        res.render("categories",
        {
            title: "Categories",
            categories: categories,
            items: items,
        });
    }
)

//Display create Categories 
exports.category_create_get = asyncHandler(
    async(req, res, next)=>{
        res.render("category_form",
        {
            title: "Create Category",
            category: undefined,
            errors: undefined,
            
        });
    }
)

//Handle create Categories
exports.category_create_post = [
    
    body('categoryName', "Numerical Values not Allowed")
    .trim()
    .isAlpha()
    ,
    
    asyncHandler(async(req, res, next)=>{

        const errors = validationResult(req);

        const newCategory = new Category({
            name: req.body.categoryName,
        })
        // console.log("POST CREATE " + JSON.stringify(req.body) + " \nERRORS: " + Array.from(errors))
        if(!errors.isEmpty()){
            // console.log("ERROR ARRAY: " + errors)
            res.render('category_form',
            {
                title: "Create Category",
                category: newCategory,
                errors: errors.array(),
            })
            return
            // next()
        }
        else{
            const resultExistence = await Category.find({name:req.body.categoryName}).exec()
            console.log("DOES EXISTS: " + JSON.stringify(resultExistence))
            if(resultExistence.length > 0) //Added to avoid duplication
            {
                // console.log("DUPLICATE")
                res.redirect('/category/'+resultExistence[0]._id+"/exists")
            }
            else{
                // console.log("NEW")
                await newCategory.save()
                res.redirect(newCategory.url);
            }
            
            
        }
    }
)]

//Display update Categories
exports.category_update_get = asyncHandler(
    async(req, res, next)=>{
        const currentCategory = await Category.findById(req.params.id).exec();

       
        res.render("category_form",
        {
            title: "Update Category",
            category: currentCategory,
        })
    }
)

//Handle update Categories
exports.category_update_post = [
    body('categoryName', "Numerical Values not Allowed")
    .trim()
    .isAlpha()
    ,
    
    asyncHandler(
    async(req, res, next)=>{
        const errors = validationResult(req);

        const currentCategory = new Category(
            {
                name: req.body.categoryName,
                _id: req.params.id,
            }
        )

        const Exists = await Category.find({name: req.body.categoryName}).exec();
        console.log(Array.from(Exists) + " is Exists");

        if(!errors.isEmpty()){
            res.render("category_form",
            {
                title: "Update Category",
                category: currentCategory,
                errors: errors.array(),

            })
        }
        else if(Exists.length > 0){
            res.redirect(Exists[0].url+'/exists');
        }else{
            const newItem = await Category.findByIdAndUpdate(req.params.id, currentCategory, {});
            res.redirect(newItem.url)
        }
    }
)]

//Display delete Categories---NOT REQUIRED ANYMORE
exports.category_delete_get = asyncHandler(
    async(req, res, next)=>{
        res.send("GET DELETE CATEGORY");
    }
)

//Handle Delete Categories
exports.category_delete_post = asyncHandler(
    async(req, res, next)=>{
        const Exists = await Category.findById(req.params.id).exec();
        const items = await Item.find({category: req.params.id}).populate("category").exec()
        if(items.length > 0){
            res.render("categories", 
            {
                category: Exists,
                title: Exists.name,
                items: items,
                category_id: req.params.id,
                items_exist: true,
            })
        }else{
            await Category.findByIdAndDelete(req.params.id).exec();
            res.redirect('/categories')
        }
    }
)




//IGNORE TESTING SOMETHING 

exports.testing_get = asyncHandler(async(req, res, next)=>{
    res.render("testing_form");
})

exports.testing_post = asyncHandler(async(req, res, next)=>{
    // const result = await uploadImage();
    console.log(req.files);
})