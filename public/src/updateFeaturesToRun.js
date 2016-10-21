import getTags from './getTags';
import arrayIntersect from './arrayIntersect';
import getFeatureName from './getFeatureName';
import printFeature from './printFeature';
import {submitBtn, storeFeatures} from './globals'

/**
 * @desc Update the list of features to run according to the selections
 */
function updateFeaturesToRun (featuresObj) {
    var selectedFolderEl = document.querySelector('[data-type="dir"]:checked');
    var collecting = (selectedFolderEl.dataset.path === 'all') ? true : false;
    var selectedFeatures = [];
    var includedTag = getTags().included;
    var excludedTag = getTags().excluded;
    var excludedFolders = [].map.call(document.querySelectorAll('[data-type="exclude"]:checked'), function (el) {
        return el.dataset.path;
    });
    var selectedFile = document.querySelector('[data-type="file"]:checked');
    var featuresToRunContainer = document.getElementById('featuresToRun');

    featuresToRunContainer.innerHTML = '';

    (function processFeatureLine (obj) {
        var key;

        for (key in obj) {
            if (obj[key].type === 'file') {
                if (!arrayIntersect(excludedTag, obj[key].tags).length
                    && collecting
                    && (!includedTag.length || arrayIntersect(includedTag, obj[key].tags).length)
                    && (!excludedFolders.length || excludedFolders.every(function (excludedFolder) {
                        return Boolean(obj[key].path.indexOf(excludedFolder) === -1);
                    }))
                    && (!selectedFile || obj[key].path === selectedFile.dataset.path)
                ) {
                    selectedFeatures.push(getFeatureName(obj[key].path));
                }
            } else {
                if (obj[key].subDir) {
                    if (obj[key].path.indexOf(selectedFolderEl.dataset.path) === 0) {
                        collecting = true;
                    } else if (selectedFolderEl.dataset.path !== 'all') {
                        collecting = false;
                    }
                    processFeatureLine(obj[key].subDir);
                }
            }
        }
    })(storeFeatures.get());

    if (!selectedFeatures.length) {
        selectedFeatures = ['No features selected!'];
        featuresToRunContainer.classList.add('error');
        submitBtn.disabled = true;
    } else  {
        featuresToRunContainer.classList.remove('error');
        submitBtn.disabled = false;
    }
    printFeature(selectedFeatures, featuresToRunContainer);
}

export default updateFeaturesToRun;