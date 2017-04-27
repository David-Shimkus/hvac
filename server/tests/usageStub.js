// File: predictionsUsageStub.js
// This file is an example of how to include our code and utilize it.
// Revisions:
// 01/17/2017 | David Shimkus | Creation.
// 01/18/2017 | David Shimkus | Wrapped everything in the callback function.

var temp = require('../predictions/getPredictedUsage.js');

console.log("start......");

temp.getPredictedUsagePromise().then(function(average)
{
	var tempAvg = average;

	console.log("tempAvg: " + tempAvg);

	console.log("done......");

});



