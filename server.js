var bodyParser = require("body-parser");
var open = require('open');
var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
//app.io = io;

function init (hostName, port) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    
    // extend main paths to include local node_modules
    require.main.paths.push(path.join(path.resolve(), 'node_modules'));
    
    var routes = require("./routes.js")(app);

    var server = http.listen(port, function () {
        console.log("Listening on port %s...", server.address().port);

        open('http://'+hostName+':' + server.address().port, function (err) {
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
