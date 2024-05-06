const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Category = new Schema({
    name: {type: 'String', required: true},

})


Category.virtual('url').get(function(){
    return `/category/${this._id}`
})


module.exports = mongoose.model('Category', Category)