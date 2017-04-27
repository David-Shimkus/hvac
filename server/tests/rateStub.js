// Filename: rateStub.js
//
// Revisions:
// 02/01/2017 | David Shimkus | Creation
// 02/06/2017 | David Shimkus | Folder/filename rename and organization.

require('datejs');
var predictions = require('../predictions/getPredictedRate.js');
var conversion = require('../misc/unixJSConversion.js');

//declare two date objects
var now = new Date();
var then = new Date(now);
then.setHours(then.getHours() + 10); //datejs magic

console.log("now: " + now);
console.log("then: " + then);



predictions.getPredictedRate(62062, now, then, "ameren").then(function(rateMap)
{

	console.log("rateMap follows:");
	console.log(rateMap);




});




//this is the function I made to hack my own 'map' object
//see the declaration of myMap above.. 
function getValue(inputMap, key)
{
	value = inputMap[key];
	return value;
}