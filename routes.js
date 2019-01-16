var express = require('express');
var path = require('path');
var getEnvironments = require('./api/getEnvironments.js');
var getDir = require('./api/getDir.js');
var startTest = require('./api/startTest');
var config = require('./config.js');


module.exports = function (app) {

    app.use('/', express.static(path.join(__dirname, 'public')));

    app.get('/environments', function (req, res) {
        getEnvironments(config.nigthwatchConfigJsFolder, function (err, data) {
            if (err) {
                console.log('Error:', err);
                return;
            }
            res.send(data);
        });
    });
    
    app.get('/features', function (req, res) {
        getDir(path.join(config.featuresParentFolder, config.featuresFolderName), function (err, data) {
            if (err) {
                console.log('Error:', err);
                return;
            }
            res.send(data);   
        });
    });
    
    app.post('/launchspy', function (req, res) {
        startTest(req.body, function (err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    });
    

    function getCommandLine() {
        switch (process.platform) { 
           case 'darwin' : return 'open';
           case 'win32' : return 'start';
           case 'win64' : return 'start';
           default : return 'xdg-open';
        }
     }
    
    app.post('/open-file-in-editor', function (req, res) {
        const exec = require('child_process').exec;
        exec(getCommandLine() + ' ' + req.body.path); 
        res.status(200).send();
    });
};