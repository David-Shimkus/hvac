// Filename: serverRequester.js
// HVAConnect Project
//
// Revisions:
// 04/08/2017 | Brian Stevens | Creation.


var request = require('request');

request.post
(
	'http://127.0.0.1:1234/api/getPredictedTemp',
	{ json: { zip: '62062', t_target_unix : '14916835540' } },
	function (error, response, body) 
	{
		console.log("Temperature test: " + body.currently.temperature)
	}
);