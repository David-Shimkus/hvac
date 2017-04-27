// File: getPredictedTemp.js
//
// Revisions:
// 01/25/2017 | David Shimkus | Creation. Ripped from old predictions.js code.  Minor changes.
// 01/26/2017 | David Shimkus | Parsing of the returned JSON for temp from outside weather.
// 02/06/2017 | David Shimkus | Filename/folder renaming and organiztion.
// 02/27/2017 | Alec Beyer    | Accepts timestamps in future to predict weather
// 02/27/2017 | Brian Stevens | Now accepts js date obejct and converts to unix. Also cleaned up code
// 03/28/2017 | David Shimkus | Changed BACK to accepting unix timestamp.
// 04/05/2017 | Brian Stevens | Fixed externals config.

var Promise = require('bluebird');
var http = require('http'); 
var ForecastIO = require('forecast.io');
var config = require("../externalsConfig.js");

var options = config.apiOptions;
var forecast = new ForecastIO(options);

//functions
module.exports = {

	//input: 6 digit zipcode and future unix timestamp
	getPredictedTemp: function(zip, t_target_unix)
	{

		return new Promise(function(resolve,reject)
		{
			var lat,lng,weather;
			var url = config.formatZipAPI(zip);
			
			//setup the http GET to recieve the weather API call.
			http.get(url, function(res)
			{ 
				var body = '';
				
				res.on('data', function(chunk)
				{
					body += chunk;
				});

				res.on('end', function()
				{
					var response = JSON.parse(body);
					if(response.error_code == 429)
					{
						//SIUE 38.7918347, -90.0005917
						lat = 38.7918;
						lng = -90.0005;
					}
					else
					{
						lat = response.lat;
						lng = response.lng;
					}

					//console.log(lat, lng);

					//javascript unix timestamps are 10^3 bigger for who knows what reason
					forecast.getAtTime(lat, lng, t_target_unix, options, function(err,res,data)
					{
						if(err)
						{	
							console.log(err);
						}

						//make the return into json object
						var tempData = JSON.stringify(data);
						weather = JSON.parse(tempData);
						resolve(weather);

					});//end forcast.getAtTime

				});//end res on

			});//end http get

		});//end promise

	}//end getPredictedTemp

}//end module.exports

