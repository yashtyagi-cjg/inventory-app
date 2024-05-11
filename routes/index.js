var express = require('express');
var router = express.Router();
const multer = require('multer');
const Item = require('./../models/item')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profilePics/') 
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random()* 3432);
    console.log("UNIQUE PREFIX" + uniquePrefix)
    console.log("file.fieldname " + file.fieldname)
    cb(null, uniquePrefix + file.originalname); 
  }
});
const upload = multer({storage: storage});
const cpUpload = upload.single('profilePic');;

//Middleware for pagingation
function paginateModel(Model){
  return async(req, res, next)=>{
    const page = (undefined === req.params.page?1:parseInt(req.params.page));
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page-1)*limit;

    const results = {}

    if(page >= 1){
      results.prevPage = 1
    }

    try{
      results.result = await Model.find({}).skip(skip).limit(limit).exec();

      res.paginationResults = results;
      console.log(res)
      next()
    }catch(err){
      res.status(500).json({message: err.message})
    }
  }
}

// CONTROLLERS
const itemController = require('./../controllers/itemController');
const categoryController = require('./../controllers/categoryController');

/* GET home page. */
router.get('/', itemController.get_homepage);

// ITEM CONTROLLER ROUTES

router.get('/items/:page?', paginateModel(Item),itemController.items_get);

//CREATE ITEMS

router.get('/create/item', itemController.create_item_get);

router.post('/create/item', cpUpload, itemController.create_item_post);

//UPDATE ITEMS

router.get('/update/item/:id', itemController.update_item_get);

router.post('/update/item/:id', cpUpload, itemController.update_item_post);


//DELETE ITEMS

router.get('/delete/item/:id', itemController.delete_item_get);

router.post('/delete/item/:id', itemController.delete_item_post);


// ITEM DETAILS
router.get('/item/:id/:exists?', itemController.item_get);


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


//TESTING ROUTE 

router.get('/abc/def',  categoryController.testing_get);

router.post('/abc/def', cpUpload, categoryController.testing_post);
 
module.exports = router;
