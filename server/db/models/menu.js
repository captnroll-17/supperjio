const mongoose = require('mongoose');

var Menu = mongoose.model('Menu',{
	section:{
		type: String,
		required: true
	},
	title:{
		type: String,
		required: true
	},
	price:{
		type: Number,
		required: true
	},
	frequency:{
		type: Number,
		required: true,
		default: 0
	}
})


module.exports = {Menu};


