var bodyParser = require("body-parser");
var open = require('open');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var routes = require("./routes.js");

function init(hostName, port) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    routes(app);

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
