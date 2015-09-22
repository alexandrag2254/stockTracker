var mongoose = require('mongoose');
var Stock = mongoose.model('Stock');

module.exports = (function() {
return{
	add_stock: function(req, res){
		// console.log(req);
		//name, open, previous close, low, high
		var new_stock = new Stock(req);
		new_stock.save(function(err, result){
			// console.log(result);
			if(err){
				res.send(err);
			} else {
				res.json(result);
			}
		});
	},

	get_data: function(req, res){
		console.log("getting stocks");
		Stock.find({}, function(err, result){
			// console.log("result", result);
			if(err){
				res.send(err);
			} else {
				res.json(result);
			}
		})
	},

	delete_stock: function(req, res){
		// console.log(req);
		Stock.remove({_id: req.id} , function(err, results){
  			if (err){
          		console.log('error');
  			}
  			else{
  				// console.log('done with removing', results);
  				res.json(results);
  			}
  		})
	},
	
	update_change: function(req, res){
		var query = { "stocks._id" : req.id };
		Stock.update(query, { $inc : { "answers.$.likes" : 1 }}, function(err, status){
			console.log(status);
			if(err){
				res.send(err);
			} else {
				// res.json(status);
			}
		});
	}
}
})();
