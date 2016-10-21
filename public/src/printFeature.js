/**
 * @description create a li element with the feature name as content for every feature in featureArray and appends it to the parent
 * @param {array} featureArray
 * @param {element} parent
 */
function printFeature (featureArray, parent) {
    parent.innerHTML = '';

    featureArray.forEach(function (feature) {
        var featureEl = document.createElement('li');
        var featureTxt = document.createTextNode(feature);
        featureEl.appendChild(featureTxt);
        parent.appendChild(featureEl);
    });
}

export default printFeature;
