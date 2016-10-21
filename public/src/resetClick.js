import printFeature from './printFeature';
import updateFeaturesToRun from './updateFeaturesToRun';
import {testRunningMsg, includedFeaturesWrapper, excludedFeaturesWrapper} from './globals'

/**
 * @namespace
 * @desc Manage the reset button click
 */
function resetClick() {
    document.getElementById('resetButton').addEventListener('click', function () {
        var tagList = document.getElementById('tagsList');

        //Move all the tags back to the tag list
        [].forEach.call(document.querySelectorAll('.tagsDropAreaWrapper li'), function (tag) {
            tagList.appendChild(tag);
        });

        //Empty included/excluded feature lists
        printFeature([], includedFeaturesWrapper);
        printFeature([], excludedFeaturesWrapper);

        //Close test output
        testRunningMsg.setAttribute('style', 'display: none;');

        //Wait for html reset and then update features to run list
        setTimeout(updateFeaturesToRun, 0);
    });
}
export default resetClick;
