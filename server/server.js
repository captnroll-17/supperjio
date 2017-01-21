require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const mongoose = require('mongoose');
const shortid = require('shortid');

const {FoodList} = require('./db/models/foodList');
const {Menu} = require('./db/models/menu');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = new express();
const port = process.env.PORT || 3000;


app.get('/',(req,res)=>{

	res.send(shortid.generate());
})
//---------------GET---------------


app.get('/:id',(req,res)=>{
	var id = req.params.id;

	FoodList.find({
		customID: id
	}).then((list)=>{
		res.send({list})
	},(e)=>{
		res.send(400).send(e);
	})	
})

app.get('/new/create',(req,res)=>{
	
	var customid = shortid.generate();
	console.log(customid);
	res.redirect('/'+customid);

})

app.get('/populate/order',(req,res)=>{
	var foodList = new FoodList({
		customID: 'Ska6BCxve',
		name: 'Krittin',
		order: 'Fried Rice',
		price: 123.43,
		comment: null,
		quantity: 1

	})

	var menu = [{
		section: 'Western',
		title: 'Mushroom Olio',
		price: 5.00
	},{
		section: 'Western',
		title: 'Beef Bolognaise',
		price: 6.50
	},{
		section: 'Western',
		title: 'Cheese Fries',
		price: 4.00
	},{
		section: 'Western',
		title: 'Roti John Combon',
		price: 5.00
	},{
		section: 'Western',
		title: 'Fried Fish Burger',
		price: 6.00
	},{
		section: 'Drinks',
		title: 'Watermelon Juice',
		price: 3.00
	},{
		section: 'Drinks',
		title: 'Lime Juice',
		price: 1.80
	},{
		section: 'Drinks',
		title: 'Teh O Peng',
		price: 1.40
	},{
		section: 'Drinks',
		title: 'Teh Peng',
		price: 1.50
	},{
		section: 'Drinks',
		title: 'Teh Cino',
		price: 1.80
	},{
		section: 'Indian',
		title: 'Cheese Naan',
		price: 3.00
	},{
		section: 'Indian',
		title: 'Garlic Naan',
		price: 2.50
	},{
		section: 'Indian',
		title: 'Butter Chicken',
		price: 7.00
	},{
		section: 'Indian',
		title: 'Mutton Kroma`',
		price: 6.00
	},{
		section: 'Indian',
		title: 'Vegetable Briyani',
		price: 5.00
	}]

	Menu.insertMany(menu).then((doc)=>{
		res.send(doc);
		console.log(doc);
	})

	foodList.save().then((doc)=>{
		console.log(doc);
	})
})

// /:id
// Get the supper page by id


//---------------POST---------------

// /create
// Create a supper list. 

//---------------PATCH---------------

// /:id
// update the order list.

//---------------DELETE---------------



app.listen(port,()=>{
	console.log('Started on Port ',port);
});