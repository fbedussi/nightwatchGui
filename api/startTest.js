'use strict';

var path = require('path');
var config = require('./../config.js');
var spawn = require('cross-spawn');
var io = require('../server').io;
var Convert = require('ansi-to-html');
var convert = new Convert();

module.exports = function (paramObj, done) {
    try {
        //console.log(paramObj);
        var confObj = {
            env: paramObj.environments.join(',')
        };
        if (paramObj.dir !== 'all') {
            confObj.group = path.relative(path.join(config.featuresParentFolder, config.featuresFolderName), paramObj.dir);
        }
        if (paramObj.exclude) {
            confObj.skipgroup = paramObj.exclude.map(function (excludeFullPath) {
                return path.relative(path.join(config.featuresParentFolder, config.featuresFolderName), excludeFullPath);
            }).join(',');
        }
        if (paramObj.file) {
            confObj['filter'] = path.basename(paramObj.file, '.feature') + '.*';
        }
        if (paramObj.tagsIncluded) {
            confObj.tag = paramObj.tagsIncluded.join(',');
        }
        if (paramObj.tagsExcluded) {
            confObj.skiptags = paramObj.tagsExcluded.join(',');
        }
        //console.log(confObj);

        var command = path.join(config.mainNodeModulesPath, '.bin', 'nightwatch');

        var args = [];

        Object.keys(confObj).forEach(function (key) {
            if (confObj[key]) {
                args.push('--' + key);
                args.push(confObj[key]);
            }
        });

        console.log('I\'m running nightwatch with the following command: ', command + ' ' + args.join(' '));

        var child = spawn(command, args);

        child.stdout.on('data', function (data) {
            console.log(data.toString());
            io.sockets.emit('nightwatchConsoleMsg', convert.toHtml(data.toString()));
        });
        
        done(null, 'Test started');
        
    } catch (ex) {
        console.log('ERROR: There was an error while starting the test runner:\n\n');
        done(new Error('Error starting test'));
        process.stderr.write(ex.stack + '\n');
        process.exit(2);
    }
};