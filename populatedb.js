#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
const Item = require('./models/item')
const Category = require('./models/category')

 
  
  const catagories = []
  const items = []
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = "mongodb+srv://s2014moose:x4WNiks24U3xuGN@cluster0.8ax1lvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories()
    await createItems()
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
 
  
  async function createCategories() {
    console.log("Adding genres");
    await Promise.all([
      categoryCreate(0, 'Fruits'),
      categoryCreate(1, 'Vegetables'),
    ]);
  }


  async function categoryCreate(index, name){
    const category = new Category({name: name});
    catagories[index] = category;
    await category.save();
    console.log(`Added Category ${category._id}`)
  }


  async function createItems(){
    console.log('Addeing Items for ' );

    await Promise.all([
        itemCreate('Apple', catagories[0], true, 25, 50),
        itemCreate('Banana', catagories[0], true, 25, 50),
    ])

    console.log(`Adding items for ${catagories[1]}`)

    await Promise.all([
        itemCreate('Raddish', catagories[1], true, 50, 55),
        itemCreate('Carrort', catagories[1], true, 70, 3),
    ])

  }


async function itemCreate(name, category_l, available, price, qty){
    const item = new Item({
        name: name,
        category: category_l,
        available: available,
        price: price,
        quantity: qty,
    })

    await item.save();

    console.log('Added item ' + item.name)
}