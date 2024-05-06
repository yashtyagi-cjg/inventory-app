const Item = require('./../models/item')
const Category = require('./../models/category')
const asyncHandler = require('express-async-handler')
const {body, validationResult} = require('express-validator')
const category = require('./../models/category')


//Display a Category
exports.category_get = asyncHandler(
    async(req, res, next)=>{
        const items = await Item.find({category: req.params.id}).populate("category").exec()
        const category = await Category.findById(req.params.id).exec();
        // console.log(items);
        res.render("categories", 
        {
            title: category.name, //(items === undefined? undefined: Array.from(items)[0].category.name),
            items: items,
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
    
    body('categoryName')
    .trim()
    .isAlpha()
    ,
    
    asyncHandler(async(req, res, next)=>{

        const errors = validationResult(req);

        const newCategory = new Category({
            name: req.body.categoryName,
        })
        console.log("POST CREATE " + JSON.stringify(req.body) + " \nERRORS: " + Array.from(errors))
        if(!errors.isEmpty()){
            res.render('category_form',
            {
                title: "Create Category",
                category: newCategory,
                errors: Array.from(errors),
            })
            return
            // next()
        }
        else{
            await newCategory.save()
            res.redirect(newCategory.url);
        }
    }
)]

//Display update Categories
exports.category_update_get = asyncHandler(
    async(req, res, next)=>{
        res.send("POST UPDATE CATEOGRIES")
    }
)

//Handle update Categories
exports.category_update_post = asyncHandler(
    async(req, res, next)=>{
        res.send("POST UPDATE CATEGORY");
    }
)

//Display delete Categories
exports.category_delete_get = asyncHandler(
    async(req, res, next)=>{
        res.send("GET DELETE CATEGORY");
    }
)

//Handle Delete Categories
exports.category_delete_post = asyncHandler(
    async(req, res, next)=>{
        res.send("POST DELETE CATEGORY");
    }
)