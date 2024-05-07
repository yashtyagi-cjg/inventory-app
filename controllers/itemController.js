const Item = require('./../models/item')
const Category = require('./../models/category')
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator')
const validator = require('validator');

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
        console.log("PARAMS: " + req.params.exists)
        res.render("item_detail", 
        {
            title: item.name,
            item: item,
            exists: (undefined==req.params.exists?'':true),
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
exports.create_item_post = [
    body('itemName', "Name of Item should be non-alphanumeric")
    .trim()
    .isAlpha(),


    body('itemPrice')
    .trim()
    .isNumeric().withMessage("Price must be a number")
    .notEmpty().withMessage("Price is required")
    .custom(value=>{
        const numericValue = parseFloat(value);
        if(!validator.isFloat(value, {min: 1})){
            throw new Error('Price must be greater than 0')
        }
        return true;
    }),

    body('itemQty')
    .trim()
    .isNumeric().withMessage("Quantity must be a number")
    .notEmpty().withMessage("Quantity is required")
    .custom(value=>{
        const numericValue = parseFloat(value);
        if(!validator.isFloat(value, {min: 0})){
            throw new Error("Quantity must be greater than -1")
        }
        return true;
    }),

    asyncHandler(
    async(req, res, next)=>{

        const errors = validationResult(req);

        const newItem = new Item({
            name: req.body.itemName,
            category: req.body.itemCategory,
            available: req.body['available-radio'],
            price: req.body.itemPrice,
            quantity: req.body.itemQty,
        })
        // console.log(req.body)
        // console.log(newItem)
        console.log("req.body"+JSON.stringify(req.body))
        if(!errors.isEmpty()){
            const categories = await Category.find({}).exec()
            res.render("item_form",
            {
                title: "Create Item",
                item: newItem,
                categories: categories,
                errors: errors.array(),
            })
        }
        else{
            const checkItem = await Item.find({
                name: req.body.itemName,
                category: req.body.itemCategory,
            }).exec()
            if(checkItem.length > 0){
                res.redirect(checkItem[0].url+"/exists")
            }else{
                await newItem.save();
                res.redirect(newItem.url);
            }
        }
    }
)]


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