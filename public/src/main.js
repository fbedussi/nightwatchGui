var host = 'http://'+document.location.host;
var featureListReady = new Event('featureListReady', {"bubbles": true, "cancelable": false});

import getRequest from './getRequest';
import insertInput from './insertInput';
import insertFeatureLine from './insertFeatureLine';
import manageTags from './manageTags';
import updateFeaturesToRun from './updateFeaturesToRun';
import handleFormSubmit from './handleFormSubmit';
import handleFolderClick from './handleFolderClick';
import handleFileClick from './handleFileClick';
import resetClick from './resetClick';
import {storeFeatures, globalTags} from './globals';

getRequest(host+'/environments', function (responseObj) {
    var parent = document.getElementById('environmentsFormInner');

    if (typeof responseObj !== 'object') {
        return;
    }

    Object.keys(responseObj).forEach(function (key) {
        insertInput({
            type: 'checkbox',
            value: key,
            labelText: key,
            className: 'line',
            dataType: 'environment',
            id: key,
            checked: (key === 'chrome') ? 'checked' : false,
            parent: parent
        });
    });
});

getRequest(host+'/features', function (responseObj) {
    if (typeof responseObj !== 'object') {
        return;
    }

    //Cache response
    storeFeatures.set(responseObj);

    insertFeatureLine(responseObj, document.getElementById('filesFormInner'));

    if (globalTags.get().length) {
        let uniqueTags = globalTags.get().sort().filter(function (item, pos, self) {
            return self.indexOf(item) === pos;
        });
        manageTags(uniqueTags);
    }
    updateFeaturesToRun();
    document.dispatchEvent(featureListReady);
});

handleFormSubmit(host);
handleFolderClick();
handleFileClick();
resetClick();