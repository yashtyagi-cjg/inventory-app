const Item = require('./../models/item')
const Category = require('./../models/category')
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator')
const validator = require('validator');
const {uploadImage, downloadImage} = require('./cloudinaryMethods')

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
        // console.log("PARAMS: " + req.params.exists)
        console.log("ITEM: " + item)
        res.render("item_detail", 
        {
            title: item.name,
            item: item,
            exists: (undefined==req.params.exists?'':true),
            secure_url: item.image_secure_url,
        })
    }
)

//Display list of items
exports.items_get = [asyncHandler(
    async(req,res,next)=>{

        const items = res.results
        console.log(res.paginationResults)
        res.render("items", 
        {
            title: "Items",
            items: res.paginationResults.result,
            prevPage: parseInt(res.paginationResults.prevPage),
            currPage: parseInt(res.paginationResults.currPage),
            nextPage: parseInt(res.paginationResults.nextPage),
            maxPage: parseInt(res.paginationResults.maxPage)

            
        })
    }
)]


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


    body('itemPrice', 'Because of ItemPrice')
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

    body('itemQty', 'Because of Item Quantity')
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
        console.log("RECV POST REQUEST")

        const errors = validationResult(req);
        console.log(req.file)
        const uploadedFile = await uploadImage(req.file.path);

        const newItem = new Item({
            name: req.body.itemName,
            category: req.body.itemCategory,
            available: req.body['available-radio'],
            price: req.body.itemPrice,
            quantity: req.body.itemQty,
            image_public_id: uploadedFile.public_id,
            image_secure_url: uploadedFile.secure_url
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

        const [currentItem, categories] = await Promise.all([
            Item.findById(req.params.id).populate("category").exec(),
            Category.find({}).exec(),
        ])

        categories.forEach(category=>{
            if(category._id.toString()===currentItem.category._id.toString()){
                category.selected=true;
            }
        })
        res.render("item_form", {
            title:"Update Item",
            item: currentItem,
            categories: categories,
        })
    }
)

//Handle Update Item
exports.update_item_post = [
    body('itemName')
    .trim()
    .isAlpha().withMessage("Only Alphabets Allowed"),

    body('itemPrice')
    .trim()
    .isNumeric().withMessage("Only Numerice Characters Allowed")
    .custom(value=>{
        if(parseFloat(value) < 0){
            throw new Error("Price should be a whole number");
        }
        return true;
    }),

    // body('itemQty')
    // .trim()
    // .isNumeric().withMessage("Only Numerice Charecters Allowed for Quantity")
    // .custom(value=>{
    //     if(parseFloat(value) < 0){
    //         throw new Error("Quantity should be a whole number")
    //     }
    // }),
    
    asyncHandler(
    async(req, res, next)=>{
        const errors = validationResult(req);
        var uploadedImage = null;
        if(req.file){
            uploadedImage = await uploadImage(req.file.path)
        }

        const itemDb = await Item.findById(req.params.id).exec();


        console.log("BODY: " + JSON.stringify(req.body))
        const updatedItem = new Item({
            name: req.body.itemName,
            price: req.body.itemPrice,
            quantity: req.body.itemQty,
            available: req.body['available-radio'],
            category: req.body.itemCategory,
            image_public_id: (undefined === req.file?itemDb.image_public_id:uploadedImage.public_id),
            image_secure_url: (undefined === req.file?itemDb.image_secure_url:uploadedImage.secure_url),
            _id : req.params.id,
        })
        console.log(errors)

        if(!errors.isEmpty()){
            const categories = await Category.find({}).exec();

            categories.forEach(category=>{
                if(category._id.toString() === updatedItem.category.toString()){
                    category.selected = true;
                }
            })

            console.log(JSON.stringify(categories))
            res.render("item_form",{
                title: "Update Item",
                item: updatedItem,
                categories: categories,
                errors: errors.array(),
                
            })
        }else{
            const itemExists = await Item.find({
                name: updatedItem.name,
                category: updatedItem.category,
            }).exec();

            itemExists.forEach((item,idx)=>{
                if(item._id.toString() === req.params.id.toString()){
                    itemExists.splice(idx, 1);
                }
            })
            console.log(itemExists)
            if( itemExists.length > 0){
                res.redirect(itemExists[0].url+'/exists')
            }else{
                const newUpdate = await Item.findByIdAndUpdate(req.params.id, updatedItem, {});
                res.redirect(newUpdate.url);  
            }

            
        }
    }
)]

//Display Delete Item --NOT REQUIRED
exports.delete_item_get = asyncHandler(
    async(req, res, next)=>{
        res.send("GET DELETE ITEM");
    }
)

//Handle Delete Item
exports.delete_item_post = asyncHandler(
    async(req, res, next)=>{
        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/items')
    }
)