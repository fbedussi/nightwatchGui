import createEl from './createEl';
import insertInput from './insertInput';
import {globalTags} from './globals';

/**
 * @description recursively print features folder contentq
 * @param {featuresDataObj} obj
 * @param {element} parent - The parent element of the new line
 */

/**
 * @desc converts a response object into an array
 * @param obj {object}
 * @returns {Array}
 */
function convertResponseObjToArray(obj, parentId) {
    return Object.keys(obj).map(function(key, index) {
        return Object.assign(
            {},
            obj[key],
            {
                label: key,
                id: parentId + '-' + index
            }
        );
    });
}

function insertLine (obj, parent, parentId) {
    /**
     * @typedef {Object} featuresDataObj
     * @description a recursive object containing data on features
     * @property {string} type - 'dir' or 'file'
     * @property {path} path - the absolute path to the folder or file
     * @property {featuresDataObj} subdir - a featuresDataObj of the subfolder eventually present in a folder
     * @property {array} tags - the tags eventually present in a feature
     */

    if(typeof parentId === 'undefined') {
        parentId = 'root';
    }

    var arr = convertResponseObjToArray(obj, parentId).sort(function(a,b) {
        return a.label > b.label;
    });

    arr
        .sort()
        .forEach(function(line) {
        if (line.type === 'file') {
            //Collect tags
            let localTags = line.tags;
            let localTagsLabel = '';
            if (localTags && localTags.length) {
                globalTags.set(globalTags.get().concat(localTags));
                localTagsLabel = ' (TAG: ' + localTags.join(', ') + ')';
            }

            const fileLine = document.createElement('li');
            parent.appendChild(fileLine);

            insertInput({
                type: 'radio',
                name: 'selectFile',
                value: line.label,
                labelText: line.label + localTagsLabel,
                className: 'line',
                dataPath: line.path,
                dataType: 'file',
                id: line.id,
                parent: fileLine
            });
        } else { //directories
            var fieldset = createEl({
                elTag: 'fieldset',
                class: 'folderWrapper ' + line.label + '_wrapper'
            });
            var closeContainer = createEl({
                elTag: 'span',
                text: '',
                class: 'closeTxt'
            });
            var openContainer = createEl({
                elTag: 'span',
                text: '',
                class: 'openTxt'
            });
            var fileList = createEl({
                elTag: 'ul',
                class: 'featureFiles'
            });
            var openCloseContainer = document.createElement('span');

            openCloseContainer.appendChild(openContainer);
            openCloseContainer.appendChild(closeContainer);
            openCloseContainer.appendChild(document.createTextNode(line.label));
            parent.appendChild(fieldset);

            insertInput({
                type: 'checkbox',
                value: line.label,
                labelText: openCloseContainer,
                className: 'closeBtn',
                labelClass: 'openClose',
                dataPath: line.path,
                dataType: 'close',
                id: line.id + '_close',
                checked: true,
                parent: fieldset
            });
            insertInput({
                type: 'radio',
                name: 'selectFolder',
                value: line.label,
                labelText: 'select folder',
                className: 'folderBtn',
                labelClass: 'btn btn-outline-dark mr-2 selectFolder',
                dataPath: line.path,
                dataType: 'dir',
                id: line.id + '_entire',
                parent: fieldset
            });
            insertInput({
                type: 'checkbox',
                value: line.value,
                labelText: 'exclude folder',
                className: 'folderBtn',
                labelClass: 'btn btn-outline-dark excludeFolder',
                dataPath: line.path,
                dataType: 'exclude',
                id: line.id + '_entireExclude',
                parent: fieldset
            });
            fieldset.appendChild(fileList);
            insertLine(line.subDir, fileList, line.id);
        }
    });
}

export default insertLine;
