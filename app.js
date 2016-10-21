var server = require('./server');
var port = process.argv.slice(2)[0] || 3000;
var hostName = require("os").hostname();

module.exports = server.init(hostName, port);
