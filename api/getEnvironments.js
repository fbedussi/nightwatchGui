'use strict';

var path = require('path');
var nightwatchConfig;

module.exports = function (startingFolder, done) {

    nightwatchConfig = nightwatchConfig || require(path.join(startingFolder, 'nightwatch.conf.js'));

    if (typeof nightwatchConfig.test_settings !== 'object') {
        done('Wrong nightwatch configuration file');
    }
    
    done(null, nightwatchConfig.test_settings);
};