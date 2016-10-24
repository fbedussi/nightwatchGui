'use strict';

var path = require('path');
var nightwatchConfig;

module.exports = function (nightwatchConfJsFolder, done) {

    nightwatchConfig = nightwatchConfig || require(path.join(nightwatchConfJsFolder, 'nightwatch.conf.js'));

    if (typeof nightwatchConfig.test_settings !== 'object') {
        done('Wrong nightwatch configuration file');
    }
    
    done(null, nightwatchConfig.test_settings);
};