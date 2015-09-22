var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//only one schema for questions with associated answers to these questions
var StockSchema = new mongoose.Schema({

	symbol: String,

	data: [{
		high: String,
		low: String,
		open: String,
		close: String,
		volume: String,
		change: String,
		change_from_previous_day: String,
		date: {type: Date, default: Date.now },
		hidden: Boolean
	}]

});
mongoose.model('Stock', StockSchema);