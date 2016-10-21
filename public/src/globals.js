/**
 * @desc Manages the app global variables
 */

/*The features object tree*/
var storeFeaturesObj;
export const storeFeatures = {
    get: () => storeFeaturesObj,
    set: (obj) => storeFeaturesObj = obj
};

/*All the tags found in features files*/
var tags = [];
export const globalTags = {
    get: () => tags,
    set: (arr) => tags = arr
};

/*DOM elements*/
export const testRunningMsg = document.getElementById('testRunningMsg');
export const submitBtn = document.getElementById('submitBtn');
export const includedFeaturesWrapper = document.getElementById('includedFeatures');
export const excludedFeaturesWrapper = document.getElementById('excludeddFeatures');
