var path = require('path');
try {
    require.resolve(path.join(path.resolve(), 'nightwatch-gui-config.json'));
    var configFile = require(path.join(path.resolve(), 'nightwatch-gui-config.json'));
} catch(e) {
    console.log('No nightwatch-gui-config.json file found, using defaults in package.json');
    var configFile = require('./package.json').config;
}

module.exports = {
    nigthwatchConfigJsFolder: (configFile.nightwatchConfigJsFolder && configFile.nightwatchConfigJsFolder.length)? path.normalize(configFile.nightwatchConfigJsFolder) : path.resolve(),
    featuresParentFolder: (configFile.featuresParentFolder && configFile.featuresParentFolder.length)? path.normalize(configFile.featuresParentFolder) : path.resolve(),
    featuresFolderName: (configFile.featuresFolderName && configFile.featuresFolderName.length)? configFile.featuresFolderName : 'features',
    excludeFolders: (configFile.excludeFolders && configFile.excludeFolders.length)? configFile.excludeFolders : ['step_definitions'],
    mainNodeModulesPath: (configFile.mainNodeModulesPath && configFile.mainNodeModulesPath.length)? path.normalize(configFile.mainNodeModulesPath) : path.join(path.resolve(), 'node_modules')
};