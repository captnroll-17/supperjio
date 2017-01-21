const mongoose = require('mongoose');

var FoodList = mongoose.model('FoodList',{
	customID: {
		type: String,
		required: true
	},
	name:{
		type: String,
		required: true,
		minlength: 1
	},
	order:{
		type: String,
		required: true

	},
	price:{
		type: Number,
		required: true
	},
	comment:{
		type: String,
		default: null
	},
	quantity:{
		type: Number
	}
})

module.exports = {FoodList};