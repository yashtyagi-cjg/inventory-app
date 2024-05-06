var express = require('express');
var router = express.Router();

// CONTROLLERS
const itemController = require('./../controllers/itemController');
const categoryController = require('./../controllers/categoryController');

/* GET home page. */
router.get('/', itemController.get_homepage);

// ITEM CONTROLLER ROUTES

router.get('/items', itemController.items_get);

//CREATE ITEMS

router.get('/create/item', itemController.create_item_get);

router.post('/create/item', itemController.create_item_post);

//UPDATE ITEMS

router.get('/update/item/:id', itemController.update_item_get);

router.post('/update/item/:id', itemController.update_item_post);


//DELETE ITEMS

router.get('/delete/item/:id', itemController.delete_item_get);

router.post('/delete/item/:id', itemController.delete_item_post);


// ITEM DETAILS
router.get('/item/:id', itemController.item_get);


// CATEGORY CONTROLLER ROUTES

//GET CATEGORIES

router.get('/categories', categoryController.categories_get);



// CREATE CATEGORIES

router.get('/create/category', categoryController.category_create_get);
router.post('/create/category', categoryController.category_create_post);


//  UPDATE CATEGORIES

router.get('/update/category/:id', categoryController.category_update_get);
router.post('/update/category/:id', categoryController.category_update_post);


// DELETE CATEGORIES 
router.get('/delete/category/:id', categoryController.category_delete_get);
router.post('/delete/category/:id', categoryController.category_delete_post);


// GET CATEGORY DETAILS 

router.get('/category/:id/:exists?', categoryController.category_get)

module.exports = router;
