require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const mongoose = require('mongoose');
const shortid = require('shortid');
const path = require('path');
const sortObject = require('sort-object');

const {OrderList} = require('./db/models/orderlist');
const {Menu} = require('./db/models/menu');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = new express();
const port = process.env.PORT || 3000;

// app.use(express.static('/public'));
app.use('/order/:id',express.static(__dirname+'/../public'));
app.use(express.static(__dirname+'/../public'));
app.use('/name/:id',express.static(__dirname+'/../public'));
app.use(bodyParser.json());


app.get('/',(req,res)=>{
	console.log('GET /');
	res.sendFile(path.join(__dirname+'/../public/landing.html'));
})
//---------------GET---------------


app.get('/name/:id',(req,res)=>{
	console.log('GET /name/:id');
	var id = req.params.id;
	// //if id doesn't exist in the record. redirect to homepage to create list
	// OrderList.find({
	// 	customID: id
	// }).then((list)=>{
	// if(list[0] === undefined ){
	// 	console.log('s');
	// 	return res.sendFile(path.join(__dirname+'/../public/landing.html'));
	// }	
	// res.sendFile(path.join(__dirname+'/../public/dashboard.html'));
	// },(e)=>{
	// 	res.send(400).send(e);
	// })	
	res.setHeader('SECRET',31431);
	res.sendFile(path.join(__dirname+'/../public/dashboard.html'));

});

app.get('/order/:id',(req,res)=>{
	console.log('GET /order/:id');
	var customid = req.params.id;
	var name = req.query.name;
	// var body = _.pick(req.body)
	var token = req.header('SECRET');
	console.log(token);
	res.sendFile(path.join(__dirname+'/../public/menu.html'));
	// if(token === 31431){
	// 	res.sendFile(path.join(__dirname+'/../public/menu.html'));
	// } else {
	// 	window.location.href = '/name/'+customid;
	// }

	// OrderList.find({
	// 	customID: id
	// }).then((list)=>{
	// 	res.send({list}).sendFile(path.join(__dirname+'/../public/menu.html'));
	// },(e)=>{
	// 	res.send(400).send(e);
	// })	
})

app.get('/getname/:id',(req,res)=>{
	console.log('GET /getname/:id');	

	console.log(name);
	// res.status(200).send();
	res.setHeader('name', name);
	res.redirect('/order/'+customid);
})

app.get('/new/create',(req,res)=>{
	console.log('GET /new/create');
	var customid = shortid.generate();
	console.log(customid);
	
	// OrderList.find({customID: customid}).then((doc)=>{
	// 	console.log(doc[0] != undefined);
	// 	if(doc[0] != undefined){
	// 		return res.redirect('/');
	// 	}
	// 	res.query.new = true;
	// })
	res.redirect('/name/'+customid);

})

app.get('/populate/order',(req,res)=>{
	var orderList = new OrderList({
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

	orderList.save().then((doc)=>{
		console.log(doc);
	})
})

app.get('/populate/orderlist',(req,res)=>{
	var orderList = [{
		customID: 'Ska6BCxve',
		name: 'Krittin',
		order: 'Fried Rice',
		price: 4,
		comment: 'no rice',
		quantity: 1

	},{
		customID: 'Ska6BCxve',
		name: 'Gabriel',
		order: 'Chees Fries',
		price: 3,
		comment: null,
		quantity: 2
	},{
		customID: 'Ska6BCxve',
		name: 'Randy',
		order: 'Teh Cino',
		price: 2,
		comment: 'no milk',
		quantity: 1
	}];

	OrderList.insertMany(orderList).then((doc)=>{
		console.log(doc);
		res.send(doc);
	})
})

// to retrieve JSON
app.get('/private/menu',(req,res)=>{
	Menu.find().then((doc)=>{
		res.send(doc);
	},(e)=>{
		res.send(e);
	})
})

app.get('/private/getList/:id',(req,res)=>{
	var id = req.params.id;

	OrderList.find({customID:id}).then((orderlist)=>{
		orderlist.sort((a,b)=>{
				var nameA = a.name.toLowerCase();
				var nameB = b.name.toLowerCase();
				console.log(nameA);
				console.log(nameB);
				if(nameA<nameB){
					return -1;
				}else if(nameA>nameB){
					return 1;
				}else {
					return 0;
				}
			});
		console.log(orderlist);
		res.send(orderlist);
	})
})

app.post('/private/postOrder/:id',(req,res)=>{
	console.log('-----server------');
	var orderObject = req.body;

	var id = req.params.id;
	// var body = _.pick(sample2,['name','customlink','qty','title','comments']);
	orderObject.forEach((order)=>{
		// console.log(order);
		var orderlist = new OrderList(order);
		var food = order.order;
		var quantity = order.quantity;
		console.log(food);
		orderlist.save().then((doc)=>{
			// console.log(doc);
			//res.send(doc);
		})
		Menu.update(
		{title: food},
		{$inc:{
				frequency: quantity
			},
		}).then((doc)=>{
			console.log(doc.frequency);
		})
	})
	res.redirect('/name/'+id);
});


app.listen(port,()=>{
	console.log('Started on Port ',port);
});