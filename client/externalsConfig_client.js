// Filename: externalsConfig_client.js
//
// Revisions:
// 04/08/2017 | David Shimkus | Creation.

//******RATES******
// Exports of varables to be used when require('./reqMongo.js')
exports.ratesDB = 'prices';
exports.ratesCollection = 'rtp_prices';

//******USAGES******
exports.usageDB = 'usage';
exports.usageCollection = 'usage_history';

//******TEMPERATURES******
exports.tempDB = 'n/a';
exports.tempCollection = 'n/a';

//exports.URL = 'http://localhost:1234';
exports.URL = 'http://hvaconnect.bigmoney.biz:1234'
