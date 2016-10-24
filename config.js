var path = require('path');
var packageJson = require('./package.json');

module.exports = {
    nigthwatchConfigJsFolder: (packageJson.config.nightwatchConfigJsFolder && packageJson.config.nightwatchConfigJsFolder.length)? packageJson.config.nightwatchConfigJsFolder : path.resolve(),
    featuresParentFolder: (packageJson.config.featuresParentFolder && packageJson.config.featuresParentFolder.length)? packageJson.config.featuresParentFolder : path.resolve(),
    featuresFolderName: (packageJson.config.featuresFolderName && packageJson.config.featuresFolderName.length)? packageJson.config.featuresFolderName : 'features',
    excludeFolders: (packageJson.config.excludeFolders && packageJson.config.excludeFolders.length)? packageJson.config.excludeFolders : ['step_definitions']
};