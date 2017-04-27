// tempStub.js


var predictions = require('../predictions/getPredictedTemp.js');
var conversion = require('../misc/unixJSConversion.js');

var target = new Date();
target.setHours(target.getHours() + 8);

var target_unix = conversion.jsToUnix(target);

console.log("target: " + target);

predictions.getPredictedTemp(62062, target_unix).then(function(weather)
{
	console.log("Weather: " + weather.currently.temperature);

});

