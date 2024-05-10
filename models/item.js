const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Category = require('./category')


const Item = new Schema({
    name: {type: 'String', required: true},
    category: {type: Schema.Types.ObjectID, ref: Category, required: true},
    available:{type: 'Boolean', required: true},
    price: {type: 'Number', requried: true},
    quantity: {type: 'Number', required: true},
    image_secure_url: {type: 'String'},
    image_public_id: {type:'String'},
})

Item.virtual('url').get(function(){
    return `/item/${this._id}`
})


module.exports = mongoose.model('Item', Item);