const Item = require('./../models/item')
const Category = require('./../models/category')
const asyncHandler = require('express-async-handler');


exports.get_homepage = asyncHandler(
    async(req, res, next)=>{
        const [items, categories] = await Promise.all([
            Item.find({}).exec(),
            Category.find({}).exec()
         ])
        res.render("homepage", 
        {
            title: "Homepage",
            items : items,
            categories : categories,
        });
    }
)


//Display item
exports.item_get = asyncHandler(
    async(req, res, next)=>{
        const item = await Item.findById(req.params.id).populate("category").exec();
        // console.log(item)
        res.render("item_detail", 
        {
            title: item.name,
            item: item,
        })
    }
)

//Display list of items
exports.items_get = asyncHandler(
    async(req,res,next)=>{
        const items = await Item.find({}).exec();
        // console.log(items)
        res.render("items", 
        {
            title: "Items",
            items: items,
        })
    }
)


//Display Create Item
exports.create_item_get = asyncHandler(
    async(req, res, next)=>{
        const categories = await Category.find({}).exec()
        res.render('item_form',
        {
            title: "Create Item", 
            categories: categories,
            item: undefined,
        })
    }
)

//Handle Create Item
exports.create_item_post = asyncHandler(
    async(req, res, next)=>{
        res.send("POST CREATE ITEM");
    }
)


//Display Update Item
exports.update_item_get = asyncHandler(
    async(req, res, next)=>{
        res.send("GET UPDATE ITEM");
    }
)

//Handle Update Item
exports.update_item_post = asyncHandler(
    async(req, res, next)=>{
        res.send("POST UPDATE ITEM");
    }
)

//Display Delete Item
exports.delete_item_get = asyncHandler(
    async(req, res, next)=>{
        res.send("GET DELETE ITEM");
    }
)

//Handle Delete Item
exports.delete_item_post = asyncHandler(
    async(req, res, next)=>{
        res.send("POST DELETE ITEM");
    }
)