var stocks = angular.module('stocks', ['ngRoute']);

//routing to partial pages
stocks.config(function($routeProvider){
	$routeProvider
	.when('/data', { templateUrl: 'partials/home.html'})
	.when('/graph', { templateUrl: 'partials/graph.html' });
	// .otherwise({ redirectTo: 'index.html'});
});

//controller///////////////////////////////////////////////////////////////////////////////////

//stocks controller
stocks.controller('stocksController', function($scope, stocksFactory){

	stocks = [];
	//automatically list stocks and change amounts on page
	stocksFactory.getStocks(function(data){
		$scope.stocks = data;
		for(var i = 0; i<data.length; i++){
				stocks.push(data[i].symbol);
			}
		console.log(stocks);
		// console.log(data);
	});

	//want to get data every 24 hours (86400000 milliseconds)
	// setInterval(function(){ getData()}, 86400000 );

//{symbol: "", change: null}
	$scope.addStock = function(){
		console.log("stock", $scope.stock);

		if($scope.stock.symbol == "" || $scope.stock.change == null || $scope.stock == undefined){
			$scope.errors = "Please do not leave text fields empty";
			return false;
		}
		else{

			for(var i=0; i<stocks.length; i++){
				if($scope.stock.symbol == stocks[i]){
					$scope.errors = "This stock has already been entered";
					return false;
				}
			}

			$scope.errors = "";

			getData();

			//get data function
			function getData() {

			    var url = "http://query.yahooapis.com/v1/public/yql";
			    // var symbol = $("#symbol").val();
			    // var change = $("#change").val();

			    var symbol = $scope.stock.symbol;
			    var change = $scope.stock.change;

			    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

			    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
			        .done(function (data) {
			          console.log("data", data);
			          if (data.query.results.quote.Name == null){
			          	console.log("fake stock");
			          	$scope.errors = "Please enter valid stock symbol";
			          	return false;
			          } else {
			          		$scope.errors = "";
			          		console.log("real stock");
				          stock = { change: change,  change_from_previous_day: data.query.results.quote.Change, symbol: data.query.results.quote.Symbol, open: data.query.results.quote.Open, close: data.query.results.quote.PreviousClose, low: data.query.results.quote.DaysLow, high: data.query.results.quote.DaysHigh, volume: data.query.results.quote.Volume };
				          console.log(stock);

					        stocksFactory.addStock(stock, function(data){
								console.log("in factory", data);
								//populate table with current data

								if (data.change_from_previous_day[0] == "+"){
									$("#result").css('color', 'green');
								} else{
									$("#result").css('color', 'red');
								}

								$scope.current_info = {
									open: data.open,
									close: data.close,
									high: data.high,
									low: data.low,
									date: data.date.slice(0,10),
									symbol: data.symbol
								};

								console.log($scope.current_info);

								stocksFactory.getStocks(function(data){
									$scope.stocks = data;
									for(var i = 0; i<data.length; i++){
										stocks.push(data[i].symbol);
									}
									console.log(stocks);
									// console.log(data);
								});

							});
					}
			    })
			    //     .fail(function (jqxhr, textStatus, error) {
			    //     var err = textStatus + ", " + error;
			    //         // $("#result").text('Request failed: ' + err);
			    //         $scope.errors = "Please enter valid stock symbol";
			    //         return false;
			    // });
			}
		}

		}

		$scope.Delete = function(id, symbol) {

			stocks = [];
			
			stocksFactory.deleteStock( id, function(data){
				// console.log("back in controller", data);

				stocksFactory.getStocks(function(data){
					$scope.stocks = data;
					for(var i = 0; i<data.length; i++){
						stocks.push(data[i].symbol);
					}

					console.log(stocks);

				});

			})

		}


});
// end of controller


//factories ///////////////////////////////////////////////////////////////////////////////////

//stock Factory
stocks.factory('stocksFactory', function($http){
	var factory = {};
	var stocks = [];

	factory.addStock = function(info, callback){
		console.log("info", info);
		$http.post('/add_stock', info).success(function(output){
			stock_info = output;
			// console.log("stock_info", stock_info);
			callback(stock_info);
		});
	};

	factory.updateChange = function(info, callback){
		// console.log("info", info);
		$http.post('/update_change', info).success(function(output){
			// stock_info = output;
			// console.log("stock_info", stock_info);
			// callback(stock_info);
		});
	};

	factory.getStocks = function(callback){
		$http.get('/get_data').success(function(output){
			stocks = output;
			// console.log(stocks);
			callback(stocks);
		});
	}

	factory.deleteStock = function(id, callback){
		// console.log("factory", id);
		$http.get('/delete_stock/' + id).success(function(removed_stock){
			callback(removed_stock);
		});
	}

	return factory;
});