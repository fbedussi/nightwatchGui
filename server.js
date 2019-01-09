var bodyParser = require("body-parser");
var open = require('open');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.js');

function init(hostName, port) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // extend main paths to include local node_modules
    if (require.main.paths.indexOf(config.mainNodeModulesPath) === -1) {
        require.main.paths.push(config.mainNodeModulesPath);
    }

    var routes = require("./routes.js")(app);

    var server = http.listen(port, function () {
        console.log("Listening on port %s...", server.address().port);

        open('http://' + hostName + ':' + Number(server.address().port), function (err) {
            if (err) {
                console.log('The user closed the browser');
                throw err;
            }
        });
    });
}

module.exports = {
    init,
    io
};
