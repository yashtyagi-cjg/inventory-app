const Item = require('./../models/item')
const Category = require('./../models/category')
const asyncHandler = require('express-async-handler')


//Display a Category
exports.category_get = asyncHandler(
    async(req, res, next)=>{
        const items = await Item.find({category: req.params.id}).populate("category").exec()
        // console.log(items);
        res.render("categories", 
        {
            title:Array.from(items)[0].category.name,
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
        });
    }
)

//Handle create Categories
exports.category_create_post = asyncHandler(
    async(req, res, next)=>{
        res.send("POST CREATE CATEOGRIES")
    }
)

//Display update Categories
exports.category_update_get = asyncHandler(
    async(req, res, next)=>{
        res.send("GET UPDATE CATEOGORY");
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