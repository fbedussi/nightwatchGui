import getTags from './getTags';
import arrayIntersect from './arrayIntersect';
import printFeature from './printFeature';
import updateFeaturesToRun from './updateFeaturesToRun';
import getFeatureName from './getFeatureName';
import {includedFeaturesWrapper, excludedFeaturesWrapper, storeFeatures} from './globals'


/**
 * @description create a li element for every tag, initialise the drad&drop behaviour and appends it to the parent
 * @param {array} tagsArr
 * @param {element} parent
 */
function insertTags (tagsArr, parent) {
    tagsArr.forEach(function (tag) {
        var tagEl = document.createElement('li');
        var tagText = document.createTextNode(tag);
        tagEl.appendChild(tagText);
        tagEl.setAttribute('draggable', true);
        tagEl.id = tag;
        tagEl.className = 'tag';
        parent.appendChild(tagEl);
        tagEl.addEventListener('dragstart', function (e) {
            console.log('dragstart');
            e.dataTransfer.setData("text/plain", e.target.id);
            e.dataTransfer.dropEffect = "move";
            e.dataTransfer.effectAllowed = "move";
        });
    });
}

/**
 * @description update the lists of included/excluded feature after every tag drop
 */
function updateSelectedFeatures () {
    var includedTag = getTags().included;
    var excludedTag = getTags().excluded;
    var includedFeature = [];
    var excludedFeature = [];

    (function parseFeature (featuresObj) {
        Object.keys(featuresObj).forEach(function (key) {
            if (featuresObj[key].type === 'file' && featuresObj[key].tags) {
                if (arrayIntersect(featuresObj[key].tags, includedTag).length) {
                    includedFeature.push(getFeatureName(featuresObj[key].path));
                }
                if (arrayIntersect(featuresObj[key].tags, excludedTag).length) {
                    excludedFeature.push(getFeatureName(featuresObj[key].path));
                }
                return;
            } else {
                if (!featuresObj[key].subDir) {
                    return;
                } else {
                    return parseFeature(featuresObj[key].subDir);
                }
            }
        });
    })(storeFeatures.get());

    printFeature(includedFeature, includedFeaturesWrapper);
    printFeature(excludedFeature, excludedFeaturesWrapper);

    updateFeaturesToRun();
}

/**
 * @description manage the tags section
 * @param {array} tagsArr - The array of the tags found in the features files
 */
function manageTags (tagsArr) {
    insertTags(tagsArr, document.getElementById('tagsList'));
    document.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    document.addEventListener('dragenter', function (e) {
        e.preventDefault();
    });
    document.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.target.classList.contains('tagsDropArea') || e.target.parentNode.classList.contains('tagsDropArea')) {
            var data = e.dataTransfer.getData("text");
            var el = (e.target.classList.contains('tagsDropArea'))? e.target : e.target.parentNode;
            el.querySelector('ul').appendChild(document.getElementById(data));
            updateSelectedFeatures();
        }
    });

    //Show container
    document.getElementById('tagsFormWrapper').setAttribute('style', '');
}

export default manageTags;
