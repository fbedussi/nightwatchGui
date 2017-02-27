(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description send the POST request
 * @param dataObj {object} - data to send
 * @param url {string}
 * @param callback {function}
 */
function ajaxPost(dataObj, url, callback) {
    window.fetch(url, {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        }),
        body: JSON.stringify(dataObj)
    }).then(function (response) {
        console.log('Form submit status: ', response.statusText);
        callback();
    }).catch(function (err) {
        console.log('post error: ', err);
        alert('Server not responding, check if it\'s running');
    });
}

exports.default = ajaxPost;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description returns the element that 2 arrays have in common
 * @param {array} arr1
 * @param {array} arr2
 * @returns {array}
 */
function arrayIntersect(arr1, arr2) {
    var arrays = [arr1, arr2];

    return arrays.sort().shift().filter(function (v) {
        return arrays.every(function (a) {
            return a.indexOf(v) !== -1;
        });
    });
}

exports.default = arrayIntersect;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description create an element with an optional class and text content
 * @param {attrObjForCreateEl} attrObj
 * @returns {element}
 */
function createEl(attrObj) {
    /**
     * @typedef {Object} attrObjForCreateEl
     * @property {string} elTag - The tag of the element to create
     * @property {string} class - Class (or classes space separated) to assign to the newly created element
     * @property {string|element} text - string or element to set as content of the newly created element
     */
    var el = document.createElement(attrObj.elTag);
    if (attrObj.text) {
        var text = typeof attrObj.text === 'string' ? document.createTextNode(attrObj.text) : attrObj.text;
        el.appendChild(text);
    }
    if (attrObj.class) {
        el.className = attrObj.class;
    }
    if (attrObj.id) {
        el.id = attrObj.id;
    }
    return el;
}

exports.default = createEl;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function getFeatureName(featurePath) {
    return featurePath.replace(/^.*features/, '').substr(1);
}

exports.default = getFeatureName;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getTags = require('./getTags');

var _getTags2 = _interopRequireDefault(_getTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description gather all the data from the form
 * @param form {element}
 */
function getFormData(form) {
    var dataObj = {
        environments: [],
        dir: ''
    };
    var tagsIncluded = (0, _getTags2.default)().included;
    var tagsExcluded = (0, _getTags2.default)().excluded;

    [].filter.call(form.querySelectorAll('.line, .folderBtn'), function (el) {
        return el.checked;
    })
    //.filter(function(el) { return el.disabled; }) //Disabled elements die.
    .forEach(function (el) {
        //Map each field into a name=value string, make sure to properly escape!
        switch (el.getAttribute('data-type')) {
            case 'environment':
                dataObj.environments.push(el.id);
                break;
            case 'dir':
                dataObj.dir = el.getAttribute('data-path');
                break;
            case 'exclude':
                if (!dataObj.exclude) {
                    dataObj.exclude = [];
                }
                dataObj.exclude.push(el.getAttribute('data-path'));
                break;
            case 'file':
                dataObj.file = el.getAttribute('data-path');
        }
    });

    if (tagsIncluded.length) {
        dataObj.tagsIncluded = tagsIncluded;
    }

    if (tagsExcluded.length) {
        dataObj.tagsExcluded = tagsExcluded;
    }

    return dataObj;
}

exports.default = getFormData;

},{"./getTags":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description execute a GET request
 * @param {string} url
 * @param {function} callback
 */
function getRequest(url, callback) {
    window.fetch(url, {
        method: 'get'
    }).then(function (response) {
        return response.json();
    }).then(function (responseJson) {
        return callback(responseJson);
    }).catch(function (err) {
        return console.log('Error: ' + err);
    });
}

exports.default = getRequest;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @namespace
 * @description returns the sibling of an element with the specified data-type
 * @param {element} el
 * @param {string} elType - The type of the sibling to return
 * @returns {element}
 */
function getSiblingByTypeStarter(el, elType) {
    return getSiblingByType(el.parentElement.firstElementChild, elType);
}

function getSiblingByType(el, elType) {
    if (el.dataset.type && el.dataset.type === elType) {
        return el;
    } else {
        if (!el.nextElementSibling) {
            return null;
        } else {
            return getSiblingByType(el.nextElementSibling, elType);
        }
    }
}

exports.default = getSiblingByTypeStarter;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @namespace
 * @description get the tags to include/exclude
 * @returns {tags}
 */
function getTags() {
    var tagsIncluded = [].map.call(document.querySelectorAll('#tagsIncluded li'), function (tagEl) {
        return tagEl.id;
    });
    var tagsExcluded = [].map.call(document.querySelectorAll('#tagsExcluded li'), function (tagEl) {
        return tagEl.id;
    });

    /**
     * @typedef tags
     * @type Object
     * @property tagsIncluded {array}
     * @property tagsExcluded {array}
     */
    return {
        included: tagsIncluded,
        excluded: tagsExcluded
    };
}

exports.default = getTags;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @desc Manages the app global variables
 */

/*The features object tree*/
var storeFeaturesObj;
var storeFeatures = exports.storeFeatures = {
    get: function get() {
        return storeFeaturesObj;
    },
    set: function set(obj) {
        return storeFeaturesObj = obj;
    }
};

/*All the tags found in features files*/
var tags = [];
var globalTags = exports.globalTags = {
    get: function get() {
        return tags;
    },
    set: function set(arr) {
        return tags = arr;
    }
};

/*DOM elements*/
var testRunningMsg = exports.testRunningMsg = document.getElementById('testRunningMsg');
var submitBtn = exports.submitBtn = document.getElementById('submitBtn');
var includedFeaturesWrapper = exports.includedFeaturesWrapper = document.getElementById('includedFeatures');
var excludedFeaturesWrapper = exports.excludedFeaturesWrapper = document.getElementById('excludeddFeatures');

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getSiblingByType = require('./getSiblingByType');

var _getSiblingByType2 = _interopRequireDefault(_getSiblingByType);

var _updateFeaturesToRun = require('./updateFeaturesToRun');

var _updateFeaturesToRun2 = _interopRequireDefault(_updateFeaturesToRun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @desc Check/Uncheck parent folder include/exclude button when a file is selected
 */
function handleFileClick() {
    document.addEventListener('featureListReady', function () {

        [].forEach.call(document.querySelectorAll('[name="selectFile"]'), function (btn) {
            btn.addEventListener('click', function (e) {
                var parentFieldset = e.currentTarget.closest('fieldset');
                var parentFolderBtn = parentFieldset ? (0, _getSiblingByType2.default)(parentFieldset.firstElementChild, 'dir') : null;
                var parentExcludeFolderBtn = parentFieldset ? (0, _getSiblingByType2.default)(parentFieldset.firstElementChild, 'exclude') : null;

                if (parentFolderBtn && !parentFolderBtn.checked) {
                    parentFolderBtn.checked = true;
                }

                if (parentExcludeFolderBtn && parentExcludeFolderBtn.checked) {
                    parentExcludeFolderBtn.checked = false;
                }

                (0, _updateFeaturesToRun2.default)();
            });
        });
    });
}

exports.default = handleFileClick;

},{"./getSiblingByType":7,"./updateFeaturesToRun":19}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getSiblingByType = require('./getSiblingByType');

var _getSiblingByType2 = _interopRequireDefault(_getSiblingByType);

var _updateFeaturesToRun = require('./updateFeaturesToRun');

var _updateFeaturesToRun2 = _interopRequireDefault(_updateFeaturesToRun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @desc check if one of el parents are equal to elToMatch
 * @param el {element}
 * @param elToMatch {element}
 * @returns {boolean}
 */
function checkParentsAre(el, elToMatch) {
    if (el === elToMatch) {
        return true;
    }
    if (!el.parentElement) {
        return false;
    } else {
        return checkParentsAre(el.parentElement, elToMatch);
    }
}

/**
 * @desc returns the sibling of a folder select/exclude button
 */
function handleFolderClick() {
    document.addEventListener('featureListReady', function () {
        [].forEach.call(document.querySelectorAll('.folderBtn'), function (btn) {
            btn.addEventListener('click', function (e) {
                if (e.currentTarget.checked) {
                    //Uncheck sibling button
                    var siblingBtn = (0, _getSiblingByType2.default)(e.currentTarget, e.currentTarget.dataset.type === 'dir' ? 'exclude' : 'dir');
                    if (siblingBtn && siblingBtn.checked) {
                        siblingBtn.checked = false;
                    }

                    //Uncheck file selection
                    var elType = e.currentTarget.dataset.type;
                    if (elType && (elType === 'dir' || elType === 'exclude')) {
                        var fileBtnChecked = document.querySelector('[data-type="file"]:checked');
                        if (fileBtnChecked) {
                            fileBtnChecked.checked = false;
                        }
                    }

                    //If no folder is selected checl "select all"
                    if (!document.querySelector('[data-type="dir"]:checked')) {
                        document.getElementById('selectAll').checked = true;
                    }

                    //Uncheck and disable exclude button that are not children of the selected folder and enable those that are children
                    if (e.currentTarget.dataset.type === 'dir') {
                        var childFolderOfSelectedFolder = e.currentTarget.parentElement.querySelector('.featureFiles');

                        [].map.call(document.querySelectorAll('[data-type="exclude"]'), function (excludeBtn) {
                            excludeBtn.disabled = false;
                            return excludeBtn;
                        }).filter(function (excludeBtn) {
                            return !checkParentsAre(excludeBtn, childFolderOfSelectedFolder);
                        }).forEach(function (excludeBtn) {
                            excludeBtn.disabled = true;
                            excludeBtn.checked = false;
                        });
                    }
                }

                (0, _updateFeaturesToRun2.default)();
            });
        });
    });
}

exports.default = handleFolderClick;

},{"./getSiblingByType":7,"./updateFeaturesToRun":19}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getFormData = require('./getFormData');

var _getFormData2 = _interopRequireDefault(_getFormData);

var _ajaxPost = require('./ajaxPost');

var _ajaxPost2 = _interopRequireDefault(_ajaxPost);

var _globals = require('./globals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var form = document.getElementById('filesForm');

/**
 * @description handle the form submit button
 */
function handleFormSubmit(host) {
    /* global io */
    var socket = io.connect(host);

    _globals.submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        var dataObj = (0, _getFormData2.default)(form);

        (0, _ajaxPost2.default)(dataObj, host + '/launchspy', function () {
            _globals.testRunningMsg.setAttribute('style', '');
        });

        //Setup socket listener to get nightwatch console messages
        //Remove previous listener eventually present to avoid duplicates
        socket.removeAllListeners('nightwatchConsoleMsg');
        socket.on('nightwatchConsoleMsg', function (msg) {
            //console.log(msg);
            var p = document.createElement('p');

            p.innerHTML = msg;
            _globals.testRunningMsg.appendChild(p);
            _globals.testRunningMsg.scrollTop = _globals.testRunningMsg.scrollHeight;
        });
    });
}

exports.default = handleFormSubmit;

},{"./ajaxPost":1,"./getFormData":5,"./globals":9}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createEl = require('./createEl');

var _createEl2 = _interopRequireDefault(_createEl);

var _insertInput = require('./insertInput');

var _insertInput2 = _interopRequireDefault(_insertInput);

var _globals = require('./globals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return Object.keys(obj).map(function (key, index) {
        return Object.assign({}, obj[key], {
            label: key,
            id: parentId + '-' + index
        });
    });
}

function insertLine(obj, parent, parentId) {
    /**
     * @typedef {Object} featuresDataObj
     * @description a recursive object containing data on features
     * @property {string} type - 'dir' or 'file'
     * @property {path} path - the absolute path to the folder or file
     * @property {featuresDataObj} subdir - a featuresDataObj of the subfolder eventually present in a folder
     * @property {array} tags - the tags eventually present in a feature
     */

    if (typeof parentId === 'undefined') {
        parentId = '-';
    }

    var arr = convertResponseObjToArray(obj, parentId).sort(function (a, b) {
        return a.label > b.label;
    });

    arr.forEach(function (line) {
        if (line.type === 'file') {
            //Collect tags
            var localTags = line.tags;
            var localTagsLabel = '';
            if (localTags && localTags.length) {
                _globals.globalTags.set(_globals.globalTags.get().concat(localTags));
                localTagsLabel = ' (TAG: ' + localTags.join(', ') + ')';
            }

            (0, _insertInput2.default)({
                type: 'radio',
                name: 'selectFile',
                value: line.label,
                labelText: line.label + localTagsLabel,
                className: 'line',
                dataPath: line.path,
                dataType: 'file',
                id: line.id,
                parent: parent
            });
        } else {
            //directories
            var fieldset = (0, _createEl2.default)({
                elTag: 'fieldset',
                class: 'folderWrapper ' + line.label + '_wrapper'
            });
            var closeContainer = (0, _createEl2.default)({
                elTag: 'span',
                text: '',
                class: 'closeTxt'
            });
            var openContainer = (0, _createEl2.default)({
                elTag: 'span',
                text: '',
                class: 'openTxt'
            });
            var div = (0, _createEl2.default)({
                elTag: 'div',
                class: 'featureFiles'
            });
            var openCloseContainer = document.createElement('span');

            openCloseContainer.appendChild(openContainer);
            openCloseContainer.appendChild(closeContainer);
            openCloseContainer.appendChild(document.createTextNode(line.label));
            parent.appendChild(fieldset);

            (0, _insertInput2.default)({
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
            (0, _insertInput2.default)({
                type: 'radio',
                name: 'selectFolder',
                value: line.label,
                labelText: 'select folder',
                className: 'folderBtn',
                labelClass: 'button selectFolder',
                dataPath: line.path,
                dataType: 'dir',
                id: line.id + '_entire',
                parent: fieldset
            });
            (0, _insertInput2.default)({
                type: 'checkbox',
                value: line.value,
                labelText: 'exclude folder',
                className: 'folderBtn',
                labelClass: 'button excludeFolder',
                dataPath: line.path,
                dataType: 'exclude',
                id: line.id + '_entireExclude',
                parent: fieldset
            });
            fieldset.appendChild(div);
            insertLine(line.subDir, div, line.id);
        }
    });
}

exports.default = insertLine;

},{"./createEl":3,"./globals":9,"./insertInput":14}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createEl = require('./createEl');

var _createEl2 = _interopRequireDefault(_createEl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @desc create an input field (checkbox or radio buttn) + its label and append them to the parent
 * @param {attrObjForInput} attrObj
 */
function insertInput(attrObj) {
    /**
     * @typedef {Object} attrObjForInput
     * @property {string} id
     * @property {string} type - Input type (eg. 'checkbox' or 'radio')
     * @property {string|element} labelText - string or element to set as content of the input label
     * @property {String} labelClass
     * @property {string} name
     * @property {string} class
     * @property {boolean} checked
     * @property {string} dataPath - The path to folder/file to assign to data-path
     * @property {string} dataType - The value of data-type: 'environment', 'file', 'dir'
     */
    var el = document.createElement('input');
    var label = (0, _createEl2.default)({
        elTag: 'label',
        text: attrObj.labelText
    });

    el.setAttribute('id', attrObj.id);
    el.setAttribute('type', attrObj.type);
    if (attrObj.name) {
        el.setAttribute('name', attrObj.name);
    }
    if (attrObj.className.length) {
        el.setAttribute('class', attrObj.className);
    }
    if (attrObj.checked) {
        el.setAttribute('checked', 'checked');
    }
    if (attrObj.dataPath) {
        el.setAttribute('data-path', attrObj.dataPath);
    }
    if (attrObj.dataType) {
        el.setAttribute('data-type', attrObj.dataType);
    }
    label.setAttribute('for', attrObj.id);
    if (attrObj.labelClass) {
        label.className = attrObj.labelClass;
    }

    attrObj.parent.appendChild(el);
    attrObj.parent.appendChild(label);
}

exports.default = insertInput;

},{"./createEl":3}],15:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _getRequest = require('./getRequest');

var _getRequest2 = _interopRequireDefault(_getRequest);

var _insertInput = require('./insertInput');

var _insertInput2 = _interopRequireDefault(_insertInput);

var _insertFeatureLine = require('./insertFeatureLine');

var _insertFeatureLine2 = _interopRequireDefault(_insertFeatureLine);

var _manageTags = require('./manageTags');

var _manageTags2 = _interopRequireDefault(_manageTags);

var _updateFeaturesToRun = require('./updateFeaturesToRun');

var _updateFeaturesToRun2 = _interopRequireDefault(_updateFeaturesToRun);

var _handleFormSubmit = require('./handleFormSubmit');

var _handleFormSubmit2 = _interopRequireDefault(_handleFormSubmit);

var _handleFolderClick = require('./handleFolderClick');

var _handleFolderClick2 = _interopRequireDefault(_handleFolderClick);

var _handleFileClick = require('./handleFileClick');

var _handleFileClick2 = _interopRequireDefault(_handleFileClick);

var _resetClick = require('./resetClick');

var _resetClick2 = _interopRequireDefault(_resetClick);

var _globals = require('./globals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var host = 'http://' + document.location.host;
var featureListReady = new Event('featureListReady', { "bubbles": true, "cancelable": false });

(0, _getRequest2.default)(host + '/environments', function (responseObj) {
    var parent = document.getElementById('environmentsFormInner');

    if ((typeof responseObj === 'undefined' ? 'undefined' : _typeof(responseObj)) !== 'object') {
        return;
    }

    Object.keys(responseObj).forEach(function (key) {
        (0, _insertInput2.default)({
            type: 'checkbox',
            value: key,
            labelText: key,
            className: 'line',
            dataType: 'environment',
            id: key,
            checked: key === 'chrome' ? 'checked' : false,
            parent: parent
        });
    });
});

(0, _getRequest2.default)(host + '/features', function (responseObj) {
    if ((typeof responseObj === 'undefined' ? 'undefined' : _typeof(responseObj)) !== 'object') {
        return;
    }

    //Cache response
    _globals.storeFeatures.set(responseObj);

    (0, _insertFeatureLine2.default)(responseObj, document.getElementById('filesFormInner'));

    if (_globals.globalTags.get().length) {
        var uniqueTags = _globals.globalTags.get().sort().filter(function (item, pos, self) {
            return self.indexOf(item) === pos;
        });
        (0, _manageTags2.default)(uniqueTags);
    }
    (0, _updateFeaturesToRun2.default)();
    document.dispatchEvent(featureListReady);
});

(0, _handleFormSubmit2.default)(host);
(0, _handleFolderClick2.default)();
(0, _handleFileClick2.default)();
(0, _resetClick2.default)();

},{"./getRequest":6,"./globals":9,"./handleFileClick":10,"./handleFolderClick":11,"./handleFormSubmit":12,"./insertFeatureLine":13,"./insertInput":14,"./manageTags":16,"./resetClick":18,"./updateFeaturesToRun":19}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getTags = require('./getTags');

var _getTags2 = _interopRequireDefault(_getTags);

var _arrayIntersect = require('./arrayIntersect');

var _arrayIntersect2 = _interopRequireDefault(_arrayIntersect);

var _printFeature = require('./printFeature');

var _printFeature2 = _interopRequireDefault(_printFeature);

var _updateFeaturesToRun = require('./updateFeaturesToRun');

var _updateFeaturesToRun2 = _interopRequireDefault(_updateFeaturesToRun);

var _getFeatureName = require('./getFeatureName');

var _getFeatureName2 = _interopRequireDefault(_getFeatureName);

var _globals = require('./globals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description create a li element for every tag, initialise the drad&drop behaviour and appends it to the parent
 * @param {array} tagsArr
 * @param {element} parent
 */
function insertTags(tagsArr, parent) {
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
function updateSelectedFeatures() {
    var includedTag = (0, _getTags2.default)().included;
    var excludedTag = (0, _getTags2.default)().excluded;
    var includedFeature = [];
    var excludedFeature = [];

    (function parseFeature(featuresObj) {
        Object.keys(featuresObj).forEach(function (key) {
            if (featuresObj[key].type === 'file' && featuresObj[key].tags) {
                if ((0, _arrayIntersect2.default)(featuresObj[key].tags, includedTag).length) {
                    includedFeature.push((0, _getFeatureName2.default)(featuresObj[key].path));
                }
                if ((0, _arrayIntersect2.default)(featuresObj[key].tags, excludedTag).length) {
                    excludedFeature.push((0, _getFeatureName2.default)(featuresObj[key].path));
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
    })(_globals.storeFeatures.get());

    (0, _printFeature2.default)(includedFeature, _globals.includedFeaturesWrapper);
    (0, _printFeature2.default)(excludedFeature, _globals.excludedFeaturesWrapper);

    (0, _updateFeaturesToRun2.default)();
}

/**
 * @description manage the tags section
 * @param {array} tagsArr - The array of the tags found in the features files
 */
function manageTags(tagsArr) {
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
            var el = e.target.classList.contains('tagsDropArea') ? e.target : e.target.parentNode;
            el.querySelector('ul').appendChild(document.getElementById(data));
            updateSelectedFeatures();
        }
    });

    //Show container
    document.getElementById('tagsFormWrapper').setAttribute('style', '');
}

exports.default = manageTags;

},{"./arrayIntersect":2,"./getFeatureName":4,"./getTags":8,"./globals":9,"./printFeature":17,"./updateFeaturesToRun":19}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @description create a li element with the feature name as content for every feature in featureArray and appends it to the parent
 * @param {array} featureArray
 * @param {element} parent
 */
function printFeature(featureArray, parent) {
    parent.innerHTML = '';

    featureArray.forEach(function (feature) {
        var featureEl = document.createElement('li');
        var featureTxt = document.createTextNode(feature);
        featureEl.appendChild(featureTxt);
        parent.appendChild(featureEl);
    });
}

exports.default = printFeature;

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _printFeature = require('./printFeature');

var _printFeature2 = _interopRequireDefault(_printFeature);

var _updateFeaturesToRun = require('./updateFeaturesToRun');

var _updateFeaturesToRun2 = _interopRequireDefault(_updateFeaturesToRun);

var _globals = require('./globals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
                (0, _printFeature2.default)([], _globals.includedFeaturesWrapper);
                (0, _printFeature2.default)([], _globals.excludedFeaturesWrapper);

                //Close test output
                _globals.testRunningMsg.setAttribute('style', 'display: none;');

                //Wait for html reset and then update features to run list
                setTimeout(_updateFeaturesToRun2.default, 0);
        });
}
exports.default = resetClick;

},{"./globals":9,"./printFeature":17,"./updateFeaturesToRun":19}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getTags = require('./getTags');

var _getTags2 = _interopRequireDefault(_getTags);

var _arrayIntersect = require('./arrayIntersect');

var _arrayIntersect2 = _interopRequireDefault(_arrayIntersect);

var _getFeatureName = require('./getFeatureName');

var _getFeatureName2 = _interopRequireDefault(_getFeatureName);

var _printFeature = require('./printFeature');

var _printFeature2 = _interopRequireDefault(_printFeature);

var _globals = require('./globals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @desc Update the list of features to run according to the selections
 */
function updateFeaturesToRun(featuresObj) {
    var selectedFolderEl = document.querySelector('[data-type="dir"]:checked');
    var collecting = selectedFolderEl.dataset.path === 'all' ? true : false;
    var selectedFeatures = [];
    var includedTag = (0, _getTags2.default)().included;
    var excludedTag = (0, _getTags2.default)().excluded;
    var excludedFolders = [].map.call(document.querySelectorAll('[data-type="exclude"]:checked'), function (el) {
        return el.dataset.path;
    });
    var selectedFile = document.querySelector('[data-type="file"]:checked');
    var featuresToRunContainer = document.getElementById('featuresToRun');

    featuresToRunContainer.innerHTML = '';

    (function processFeatureLine(obj) {
        var key;

        for (key in obj) {
            if (obj[key].type === 'file') {
                if (!(0, _arrayIntersect2.default)(excludedTag, obj[key].tags).length && collecting && (!includedTag.length || (0, _arrayIntersect2.default)(includedTag, obj[key].tags).length) && (!excludedFolders.length || excludedFolders.every(function (excludedFolder) {
                    return Boolean(obj[key].path.indexOf(excludedFolder) === -1);
                })) && (!selectedFile || obj[key].path === selectedFile.dataset.path)) {
                    selectedFeatures.push((0, _getFeatureName2.default)(obj[key].path));
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
    })(_globals.storeFeatures.get());

    if (!selectedFeatures.length) {
        selectedFeatures = ['No features selected!'];
        featuresToRunContainer.classList.add('error');
        _globals.submitBtn.disabled = true;
    } else {
        featuresToRunContainer.classList.remove('error');
        _globals.submitBtn.disabled = false;
    }
    (0, _printFeature2.default)(selectedFeatures, featuresToRunContainer);
}

exports.default = updateFeaturesToRun;

},{"./arrayIntersect":2,"./getFeatureName":4,"./getTags":8,"./globals":9,"./printFeature":17}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGFqYXhQb3N0LmpzIiwic3JjXFxhcnJheUludGVyc2VjdC5qcyIsInNyY1xcY3JlYXRlRWwuanMiLCJzcmNcXGdldEZlYXR1cmVOYW1lLmpzIiwic3JjXFxnZXRGb3JtRGF0YS5qcyIsInNyY1xcZ2V0UmVxdWVzdC5qcyIsInNyY1xcZ2V0U2libGluZ0J5VHlwZS5qcyIsInNyY1xcZ2V0VGFncy5qcyIsInNyY1xcZ2xvYmFscy5qcyIsInNyY1xcaGFuZGxlRmlsZUNsaWNrLmpzIiwic3JjXFxoYW5kbGVGb2xkZXJDbGljay5qcyIsInNyY1xcaGFuZGxlRm9ybVN1Ym1pdC5qcyIsInNyY1xcaW5zZXJ0RmVhdHVyZUxpbmUuanMiLCJzcmNcXGluc2VydElucHV0LmpzIiwic3JjXFxtYWluLmpzIiwic3JjXFxtYW5hZ2VUYWdzLmpzIiwic3JjXFxwcmludEZlYXR1cmUuanMiLCJzcmNcXHJlc2V0Q2xpY2suanMiLCJzcmNcXHVwZGF0ZUZlYXR1cmVzVG9SdW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOzs7Ozs7QUFNQSxTQUFTLFFBQVQsQ0FBbUIsT0FBbkIsRUFBNEIsR0FBNUIsRUFBaUMsUUFBakMsRUFBMkM7QUFDdkMsV0FBTyxLQUFQLENBQWEsR0FBYixFQUFrQjtBQUNkLGdCQUFRLE1BRE07QUFFZCxpQkFBUyxJQUFJLE9BQUosQ0FBWTtBQUNqQiw0QkFBZ0I7QUFEQyxTQUFaLENBRks7QUFLZCxjQUFNLEtBQUssU0FBTCxDQUFlLE9BQWY7QUFMUSxLQUFsQixFQU1HLElBTkgsQ0FNUSxVQUFVLFFBQVYsRUFBb0I7QUFDeEIsZ0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLFNBQVMsVUFBN0M7QUFDQTtBQUNILEtBVEQsRUFTRyxLQVRILENBU1MsVUFBVSxHQUFWLEVBQWU7QUFDcEIsZ0JBQVEsR0FBUixDQUFZLGNBQVosRUFBMkIsR0FB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LE9BQWIsQ0FBcUIsSUFONUQsQ0FBSixFQU9FO0FBQ0UscUNBQWlCLElBQWpCLENBQXNCLDhCQUFlLElBQUksR0FBSixFQUFTLElBQXhCLENBQXRCO0FBQ0g7QUFDSixhQVhELE1BV087QUFDSCxvQkFBSSxJQUFJLEdBQUosRUFBUyxNQUFiLEVBQXFCO0FBQ2pCLHdCQUFJLElBQUksR0FBSixFQUFTLElBQVQsQ0FBYyxPQUFkLENBQXNCLGlCQUFpQixPQUFqQixDQUF5QixJQUEvQyxNQUF5RCxDQUE3RCxFQUFnRTtBQUM1RCxxQ0FBYSxJQUFiO0FBQ0gscUJBRkQsTUFFTyxJQUFJLGlCQUFpQixPQUFqQixDQUF5QixJQUF6QixLQUFrQyxLQUF0QyxFQUE2QztBQUNoRCxxQ0FBYSxLQUFiO0FBQ0g7QUFDRCx1Q0FBbUIsSUFBSSxHQUFKLEVBQVMsTUFBNUI7QUFDSDtBQUNKO0FBQ0o7QUFDSixLQTFCRCxFQTBCRyx1QkFBYyxHQUFkLEVBMUJIOztBQTRCQSxRQUFJLENBQUMsaUJBQWlCLE1BQXRCLEVBQThCO0FBQzFCLDJCQUFtQixDQUFDLHVCQUFELENBQW5CO0FBQ0EsK0JBQXVCLFNBQXZCLENBQWlDLEdBQWpDLENBQXFDLE9BQXJDO0FBQ0EsMkJBQVUsUUFBVixHQUFxQixJQUFyQjtBQUNILEtBSkQsTUFJUTtBQUNKLCtCQUF1QixTQUF2QixDQUFpQyxNQUFqQyxDQUF3QyxPQUF4QztBQUNBLDJCQUFVLFFBQVYsR0FBcUIsS0FBckI7QUFDSDtBQUNELGdDQUFhLGdCQUFiLEVBQStCLHNCQUEvQjtBQUNIOztrQkFFYyxtQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQGRlc2NyaXB0aW9uIHNlbmQgdGhlIFBPU1QgcmVxdWVzdFxyXG4gKiBAcGFyYW0gZGF0YU9iaiB7b2JqZWN0fSAtIGRhdGEgdG8gc2VuZFxyXG4gKiBAcGFyYW0gdXJsIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259XHJcbiAqL1xyXG5mdW5jdGlvbiBhamF4UG9zdCAoZGF0YU9iaiwgdXJsLCBjYWxsYmFjaykge1xyXG4gICAgd2luZG93LmZldGNoKHVybCwge1xyXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04J1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGFPYmopXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3JtIHN1Ym1pdCBzdGF0dXM6ICcsIHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Bvc3QgZXJyb3I6ICcsZXJyKTtcclxuICAgICAgICBhbGVydCgnU2VydmVyIG5vdCByZXNwb25kaW5nLCBjaGVjayBpZiBpdFxcJ3MgcnVubmluZycpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFqYXhQb3N0O1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIHJldHVybnMgdGhlIGVsZW1lbnQgdGhhdCAyIGFycmF5cyBoYXZlIGluIGNvbW1vblxyXG4gKiBAcGFyYW0ge2FycmF5fSBhcnIxXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGFycjJcclxuICogQHJldHVybnMge2FycmF5fVxyXG4gKi9cclxuZnVuY3Rpb24gYXJyYXlJbnRlcnNlY3QoYXJyMSwgYXJyMikge1xyXG4gICAgdmFyIGFycmF5cyA9IFthcnIxLCBhcnIyXTtcclxuXHJcbiAgICByZXR1cm4gYXJyYXlzLnNvcnQoKS5zaGlmdCgpLmZpbHRlcihmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiBhcnJheXMuZXZlcnkoZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXhPZih2KSAhPT0gLTE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXJyYXlJbnRlcnNlY3Q7XHJcbiIsIi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY3JlYXRlIGFuIGVsZW1lbnQgd2l0aCBhbiBvcHRpb25hbCBjbGFzcyBhbmQgdGV4dCBjb250ZW50XHJcbiAqIEBwYXJhbSB7YXR0ck9iakZvckNyZWF0ZUVsfSBhdHRyT2JqXHJcbiAqIEByZXR1cm5zIHtlbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlRWwoYXR0ck9iaikge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBhdHRyT2JqRm9yQ3JlYXRlRWxcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbFRhZyAtIFRoZSB0YWcgb2YgdGhlIGVsZW1lbnQgdG8gY3JlYXRlXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY2xhc3MgLSBDbGFzcyAob3IgY2xhc3NlcyBzcGFjZSBzZXBhcmF0ZWQpIHRvIGFzc2lnbiB0byB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50XHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ3xlbGVtZW50fSB0ZXh0IC0gc3RyaW5nIG9yIGVsZW1lbnQgdG8gc2V0IGFzIGNvbnRlbnQgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGF0dHJPYmouZWxUYWcpO1xyXG4gICAgaWYgKGF0dHJPYmoudGV4dCkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gKHR5cGVvZiBhdHRyT2JqLnRleHQgID09PSAnc3RyaW5nJykgPyBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhdHRyT2JqLnRleHQpIDogYXR0ck9iai50ZXh0O1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouY2xhc3MpIHtcclxuICAgICAgICBlbC5jbGFzc05hbWUgPSBhdHRyT2JqLmNsYXNzO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouaWQpIHtcclxuICAgICAgICBlbC5pZCA9IGF0dHJPYmouaWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUVsO1xyXG4iLCJmdW5jdGlvbiBnZXRGZWF0dXJlTmFtZSAoZmVhdHVyZVBhdGgpIHtcclxuICAgIHJldHVybiBmZWF0dXJlUGF0aC5yZXBsYWNlKC9eLipmZWF0dXJlcy8sICcnKS5zdWJzdHIoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEZlYXR1cmVOYW1lO1xyXG4iLCJpbXBvcnQgZ2V0VGFncyBmcm9tICcuL2dldFRhZ3MnO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBnYXRoZXIgYWxsIHRoZSBkYXRhIGZyb20gdGhlIGZvcm1cclxuICogQHBhcmFtIGZvcm0ge2VsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRGb3JtRGF0YShmb3JtKSB7XHJcbiAgICB2YXIgZGF0YU9iaiA9IHtcclxuICAgICAgICBlbnZpcm9ubWVudHM6IFtdLFxyXG4gICAgICAgIGRpcjogJydcclxuICAgIH07XHJcbiAgICB2YXIgdGFnc0luY2x1ZGVkID0gZ2V0VGFncygpLmluY2x1ZGVkO1xyXG4gICAgdmFyIHRhZ3NFeGNsdWRlZCA9IGdldFRhZ3MoKS5leGNsdWRlZDtcclxuXHJcbiAgICBbXS5maWx0ZXIuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5saW5lLCAuZm9sZGVyQnRuJyksIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWwuY2hlY2tlZDtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC8vLmZpbHRlcihmdW5jdGlvbihlbCkgeyByZXR1cm4gZWwuZGlzYWJsZWQ7IH0pIC8vRGlzYWJsZWQgZWxlbWVudHMgZGllLlxyXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICAvL01hcCBlYWNoIGZpZWxkIGludG8gYSBuYW1lPXZhbHVlIHN0cmluZywgbWFrZSBzdXJlIHRvIHByb3Blcmx5IGVzY2FwZSFcclxuICAgICAgICAgICAgc3dpdGNoIChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdlbnZpcm9ubWVudCc6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5lbnZpcm9ubWVudHMucHVzaChlbC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkaXInOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZGlyID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2V4Y2x1ZGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YU9iai5leGNsdWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZXhjbHVkZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmV4Y2x1ZGUucHVzaChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZmlsZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICBpZiAodGFnc0luY2x1ZGVkLmxlbmd0aCkge1xyXG4gICAgICAgIGRhdGFPYmoudGFnc0luY2x1ZGVkID0gdGFnc0luY2x1ZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWdzRXhjbHVkZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgZGF0YU9iai50YWdzRXhjbHVkZWQgPSB0YWdzRXhjbHVkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGFPYmo7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEZvcm1EYXRhO1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIGV4ZWN1dGUgYSBHRVQgcmVxdWVzdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSZXF1ZXN0KHVybCwgY2FsbGJhY2spIHtcclxuICAgIHdpbmRvdy5mZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0J1xyXG4gICAgICAgIH0pXHJcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAudGhlbihyZXNwb25zZUpzb24gPT4gY2FsbGJhY2socmVzcG9uc2VKc29uKSlcclxuICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coJ0Vycm9yOiAnICsgZXJyKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFJlcXVlc3Q7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIEBkZXNjcmlwdGlvbiByZXR1cm5zIHRoZSBzaWJsaW5nIG9mIGFuIGVsZW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGRhdGEtdHlwZVxyXG4gKiBAcGFyYW0ge2VsZW1lbnR9IGVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbFR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgc2libGluZyB0byByZXR1cm5cclxuICogQHJldHVybnMge2VsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTaWJsaW5nQnlUeXBlU3RhcnRlciAoZWwsIGVsVHlwZSkge1xyXG4gICAgcmV0dXJuIGdldFNpYmxpbmdCeVR5cGUoZWwucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCwgZWxUeXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2libGluZ0J5VHlwZSAoZWwsIGVsVHlwZSkge1xyXG4gICAgaWYgKGVsLmRhdGFzZXQudHlwZSAmJiBlbC5kYXRhc2V0LnR5cGUgPT09IGVsVHlwZSkge1xyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCFlbC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldFNpYmxpbmdCeVR5cGUoZWwubmV4dEVsZW1lbnRTaWJsaW5nLCBlbFR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0U2libGluZ0J5VHlwZVN0YXJ0ZXI7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIEBkZXNjcmlwdGlvbiBnZXQgdGhlIHRhZ3MgdG8gaW5jbHVkZS9leGNsdWRlXHJcbiAqIEByZXR1cm5zIHt0YWdzfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VGFncygpIHtcclxuICAgIHZhciB0YWdzSW5jbHVkZWQgPSBbXS5tYXAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjdGFnc0luY2x1ZGVkIGxpJyksIGZ1bmN0aW9uICh0YWdFbCkge1xyXG4gICAgICAgIHJldHVybiB0YWdFbC5pZDtcclxuICAgIH0pO1xyXG4gICAgdmFyIHRhZ3NFeGNsdWRlZCA9IFtdLm1hcC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyN0YWdzRXhjbHVkZWQgbGknKSwgZnVuY3Rpb24gKHRhZ0VsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRhZ0VsLmlkO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB0YWdzXHJcbiAgICAgKiBAdHlwZSBPYmplY3RcclxuICAgICAqIEBwcm9wZXJ0eSB0YWdzSW5jbHVkZWQge2FycmF5fVxyXG4gICAgICogQHByb3BlcnR5IHRhZ3NFeGNsdWRlZCB7YXJyYXl9XHJcbiAgICAgKi9cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5jbHVkZWQ6IHRhZ3NJbmNsdWRlZCxcclxuICAgICAgICBleGNsdWRlZDogdGFnc0V4Y2x1ZGVkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRUYWdzOyIsIi8qKlxyXG4gKiBAZGVzYyBNYW5hZ2VzIHRoZSBhcHAgZ2xvYmFsIHZhcmlhYmxlc1xyXG4gKi9cclxuXHJcbi8qVGhlIGZlYXR1cmVzIG9iamVjdCB0cmVlKi9cclxudmFyIHN0b3JlRmVhdHVyZXNPYmo7XHJcbmV4cG9ydCBjb25zdCBzdG9yZUZlYXR1cmVzID0ge1xyXG4gICAgZ2V0OiAoKSA9PiBzdG9yZUZlYXR1cmVzT2JqLFxyXG4gICAgc2V0OiAob2JqKSA9PiBzdG9yZUZlYXR1cmVzT2JqID0gb2JqXHJcbn07XHJcblxyXG4vKkFsbCB0aGUgdGFncyBmb3VuZCBpbiBmZWF0dXJlcyBmaWxlcyovXHJcbnZhciB0YWdzID0gW107XHJcbmV4cG9ydCBjb25zdCBnbG9iYWxUYWdzID0ge1xyXG4gICAgZ2V0OiAoKSA9PiB0YWdzLFxyXG4gICAgc2V0OiAoYXJyKSA9PiB0YWdzID0gYXJyXHJcbn07XHJcblxyXG4vKkRPTSBlbGVtZW50cyovXHJcbmV4cG9ydCBjb25zdCB0ZXN0UnVubmluZ01zZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0UnVubmluZ01zZycpO1xyXG5leHBvcnQgY29uc3Qgc3VibWl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdEJ0bicpO1xyXG5leHBvcnQgY29uc3QgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5jbHVkZWRGZWF0dXJlcycpO1xyXG5leHBvcnQgY29uc3QgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhjbHVkZWRkRmVhdHVyZXMnKTtcclxuIiwiaW1wb3J0IGdldFNpYmxpbmdCeVR5cGUgZnJvbSAnLi9nZXRTaWJsaW5nQnlUeXBlJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuXHJcbi8qKlxyXG4gKiBAZGVzYyBDaGVjay9VbmNoZWNrIHBhcmVudCBmb2xkZXIgaW5jbHVkZS9leGNsdWRlIGJ1dHRvbiB3aGVuIGEgZmlsZSBpcyBzZWxlY3RlZFxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlRmlsZUNsaWNrKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZmVhdHVyZUxpc3RSZWFkeScsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lPVwic2VsZWN0RmlsZVwiXScpLCBmdW5jdGlvbiAoYnRuKSB7XHJcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RmllbGRzZXQgPSBlLmN1cnJlbnRUYXJnZXQuY2xvc2VzdCgnZmllbGRzZXQnKTtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRGb2xkZXJCdG4gPSBwYXJlbnRGaWVsZHNldD8gZ2V0U2libGluZ0J5VHlwZShwYXJlbnRGaWVsZHNldC5maXJzdEVsZW1lbnRDaGlsZCwgJ2RpcicpIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRFeGNsdWRlRm9sZGVyQnRuID0gcGFyZW50RmllbGRzZXQ/IGdldFNpYmxpbmdCeVR5cGUocGFyZW50RmllbGRzZXQuZmlyc3RFbGVtZW50Q2hpbGQsICdleGNsdWRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRGb2xkZXJCdG4gJiYgIXBhcmVudEZvbGRlckJ0bi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Rm9sZGVyQnRuLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRFeGNsdWRlRm9sZGVyQnRuICYmIHBhcmVudEV4Y2x1ZGVGb2xkZXJCdG4uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEV4Y2x1ZGVGb2xkZXJCdG4uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZlYXR1cmVzVG9SdW4oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRmlsZUNsaWNrO1xyXG4iLCJpbXBvcnQgZ2V0U2libGluZ0J5VHlwZSBmcm9tICcuL2dldFNpYmxpbmdCeVR5cGUnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIGNoZWNrIGlmIG9uZSBvZiBlbCBwYXJlbnRzIGFyZSBlcXVhbCB0byBlbFRvTWF0Y2hcclxuICogQHBhcmFtIGVsIHtlbGVtZW50fVxyXG4gKiBAcGFyYW0gZWxUb01hdGNoIHtlbGVtZW50fVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGNoZWNrUGFyZW50c0FyZSAoZWwsIGVsVG9NYXRjaCkge1xyXG4gICAgaWYgKGVsID09PSBlbFRvTWF0Y2gpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmICghZWwucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrUGFyZW50c0FyZShlbC5wYXJlbnRFbGVtZW50LCBlbFRvTWF0Y2gpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGRlc2MgcmV0dXJucyB0aGUgc2libGluZyBvZiBhIGZvbGRlciBzZWxlY3QvZXhjbHVkZSBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUZvbGRlckNsaWNrICgpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZlYXR1cmVMaXN0UmVhZHknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb2xkZXJCdG4nKSwgZnVuY3Rpb24gKGJ0bikge1xyXG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUuY3VycmVudFRhcmdldC5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9VbmNoZWNrIHNpYmxpbmcgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNpYmxpbmdCdG4gPSBnZXRTaWJsaW5nQnlUeXBlKGUuY3VycmVudFRhcmdldCwgKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LnR5cGUgPT09ICdkaXInKT8gJ2V4Y2x1ZGUnIDogJ2RpcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nQnRuICYmIHNpYmxpbmdCdG4uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWJsaW5nQnRuLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vVW5jaGVjayBmaWxlIHNlbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbFR5cGUgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbFR5cGUgJiYgKGVsVHlwZSA9PT0gJ2RpcicgfHwgZWxUeXBlID09PSAnZXhjbHVkZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlQnRuQ2hlY2tlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR5cGU9XCJmaWxlXCJdOmNoZWNrZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVCdG5DaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlQnRuQ2hlY2tlZC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgbm8gZm9sZGVyIGlzIHNlbGVjdGVkIGNoZWNsIFwic2VsZWN0IGFsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZGlyXCJdOmNoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0QWxsJykuY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL1VuY2hlY2sgYW5kIGRpc2FibGUgZXhjbHVkZSBidXR0b24gdGhhdCBhcmUgbm90IGNoaWxkcmVuIG9mIHRoZSBzZWxlY3RlZCBmb2xkZXIgYW5kIGVuYWJsZSB0aG9zZSB0aGF0IGFyZSBjaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlID09PSAnZGlyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRGb2xkZXJPZlNlbGVjdGVkRm9sZGVyID0gZS5jdXJyZW50VGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZlYXR1cmVGaWxlcycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgW10ubWFwLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHlwZT1cImV4Y2x1ZGVcIl0nKSwgZnVuY3Rpb24gKGV4Y2x1ZGVCdG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4Y2x1ZGVCdG47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZXhjbHVkZUJ0bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhY2hlY2tQYXJlbnRzQXJlKGV4Y2x1ZGVCdG4sIGNoaWxkRm9sZGVyT2ZTZWxlY3RlZEZvbGRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGV4Y2x1ZGVCdG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlQnRuLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXBkYXRlRmVhdHVyZXNUb1J1bigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVGb2xkZXJDbGljazsiLCJpbXBvcnQgZ2V0Rm9ybURhdGEgZnJvbSAnLi9nZXRGb3JtRGF0YSc7XHJcbmltcG9ydCBhamF4UG9zdCBmcm9tICcuL2FqYXhQb3N0JztcclxuaW1wb3J0IHtzdWJtaXRCdG4sIHRlc3RSdW5uaW5nTXNnfSBmcm9tICcuL2dsb2JhbHMnXHJcblxyXG52YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlc0Zvcm0nKTtcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gaGFuZGxlIHRoZSBmb3JtIHN1Ym1pdCBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUZvcm1TdWJtaXQoaG9zdCkge1xyXG4gICAgLyogZ2xvYmFsIGlvICovXHJcbiAgICB2YXIgc29ja2V0ID0gaW8uY29ubmVjdChob3N0KTtcclxuICAgIFxyXG4gICAgc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhT2JqID0gZ2V0Rm9ybURhdGEoZm9ybSk7XHJcblxyXG4gICAgICAgIGFqYXhQb3N0KGRhdGFPYmosIGhvc3QrJy9sYXVuY2hzcHknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRlc3RSdW5uaW5nTXNnLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgc29ja2V0IGxpc3RlbmVyIHRvIGdldCBuaWdodHdhdGNoIGNvbnNvbGUgbWVzc2FnZXNcclxuICAgICAgICAvL1JlbW92ZSBwcmV2aW91cyBsaXN0ZW5lciBldmVudHVhbGx5IHByZXNlbnQgdG8gYXZvaWQgZHVwbGljYXRlc1xyXG4gICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ25pZ2h0d2F0Y2hDb25zb2xlTXNnJyk7XHJcbiAgICAgICAgc29ja2V0Lm9uKCduaWdodHdhdGNoQ29uc29sZU1zZycsIGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgICAgICB2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHJcbiAgICAgICAgICAgIHAuaW5uZXJIVE1MID0gbXNnO1xyXG4gICAgICAgICAgICB0ZXN0UnVubmluZ01zZy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICAgICAgdGVzdFJ1bm5pbmdNc2cuc2Nyb2xsVG9wID0gdGVzdFJ1bm5pbmdNc2cuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGhhbmRsZUZvcm1TdWJtaXQ7IiwiaW1wb3J0IGNyZWF0ZUVsIGZyb20gJy4vY3JlYXRlRWwnO1xuaW1wb3J0IGluc2VydElucHV0IGZyb20gJy4vaW5zZXJ0SW5wdXQnO1xuaW1wb3J0IHtnbG9iYWxUYWdzfSBmcm9tICcuL2dsb2JhbHMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiByZWN1cnNpdmVseSBwcmludCBmZWF0dXJlcyBmb2xkZXIgY29udGVudHFcbiAqIEBwYXJhbSB7ZmVhdHVyZXNEYXRhT2JqfSBvYmpcbiAqIEBwYXJhbSB7ZWxlbWVudH0gcGFyZW50IC0gVGhlIHBhcmVudCBlbGVtZW50IG9mIHRoZSBuZXcgbGluZVxuICovXG5cbi8qKlxuICogQGRlc2MgY29udmVydHMgYSByZXNwb25zZSBvYmplY3QgaW50byBhbiBhcnJheVxuICogQHBhcmFtIG9iaiB7b2JqZWN0fVxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiBjb252ZXJ0UmVzcG9uc2VPYmpUb0FycmF5KG9iaiwgcGFyZW50SWQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgb2JqW2tleV0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IGtleSxcbiAgICAgICAgICAgICAgICBpZDogcGFyZW50SWQrJy0nK2luZGV4XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydExpbmUgKG9iaiwgcGFyZW50LCBwYXJlbnRJZCkge1xuICAgIC8qKlxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IGZlYXR1cmVzRGF0YU9ialxuICAgICAqIEBkZXNjcmlwdGlvbiBhIHJlY3Vyc2l2ZSBvYmplY3QgY29udGFpbmluZyBkYXRhIG9uIGZlYXR1cmVzXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgLSAnZGlyJyBvciAnZmlsZSdcbiAgICAgKiBAcHJvcGVydHkge3BhdGh9IHBhdGggLSB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgZm9sZGVyIG9yIGZpbGVcbiAgICAgKiBAcHJvcGVydHkge2ZlYXR1cmVzRGF0YU9ian0gc3ViZGlyIC0gYSBmZWF0dXJlc0RhdGFPYmogb2YgdGhlIHN1YmZvbGRlciBldmVudHVhbGx5IHByZXNlbnQgaW4gYSBmb2xkZXJcbiAgICAgKiBAcHJvcGVydHkge2FycmF5fSB0YWdzIC0gdGhlIHRhZ3MgZXZlbnR1YWxseSBwcmVzZW50IGluIGEgZmVhdHVyZVxuICAgICAqL1xuXG4gICAgaWYodHlwZW9mIHBhcmVudElkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwYXJlbnRJZCA9ICctJztcbiAgICB9XG5cbiAgICB2YXIgYXJyID0gY29udmVydFJlc3BvbnNlT2JqVG9BcnJheShvYmosIHBhcmVudElkKS5zb3J0KGZ1bmN0aW9uKGEsYikge1xuICAgICAgICByZXR1cm4gYS5sYWJlbCA+IGIubGFiZWw7XG4gICAgfSk7XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIGlmIChsaW5lLnR5cGUgPT09ICdmaWxlJykge1xuICAgICAgICAgICAgLy9Db2xsZWN0IHRhZ3NcbiAgICAgICAgICAgIGxldCBsb2NhbFRhZ3MgPSBsaW5lLnRhZ3M7XG4gICAgICAgICAgICBsZXQgbG9jYWxUYWdzTGFiZWwgPSAnJztcbiAgICAgICAgICAgIGlmIChsb2NhbFRhZ3MgJiYgbG9jYWxUYWdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGdsb2JhbFRhZ3Muc2V0KGdsb2JhbFRhZ3MuZ2V0KCkuY29uY2F0KGxvY2FsVGFncykpO1xuICAgICAgICAgICAgICAgIGxvY2FsVGFnc0xhYmVsID0gJyAoVEFHOiAnICsgbG9jYWxUYWdzLmpvaW4oJywgJykgKyAnKSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluc2VydElucHV0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdzZWxlY3RGaWxlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbGluZS5sYWJlbCxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6IGxpbmUubGFiZWwgKyBsb2NhbFRhZ3NMYWJlbCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5lJyxcbiAgICAgICAgICAgICAgICBkYXRhUGF0aDogbGluZS5wYXRoLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnZmlsZScsXG4gICAgICAgICAgICAgICAgaWQ6IGxpbmUuaWQsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgeyAvL2RpcmVjdG9yaWVzXG4gICAgICAgICAgICB2YXIgZmllbGRzZXQgPSBjcmVhdGVFbCh7XG4gICAgICAgICAgICAgICAgZWxUYWc6ICdmaWVsZHNldCcsXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdmb2xkZXJXcmFwcGVyICcgKyBsaW5lLmxhYmVsICsgJ193cmFwcGVyJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2xvc2VDb250YWluZXIgPSBjcmVhdGVFbCh7XG4gICAgICAgICAgICAgICAgZWxUYWc6ICdzcGFuJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnJyxcbiAgICAgICAgICAgICAgICBjbGFzczogJ2Nsb3NlVHh0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgb3BlbkNvbnRhaW5lciA9IGNyZWF0ZUVsKHtcbiAgICAgICAgICAgICAgICBlbFRhZzogJ3NwYW4nLFxuICAgICAgICAgICAgICAgIHRleHQ6ICcnLFxuICAgICAgICAgICAgICAgIGNsYXNzOiAnb3BlblR4dCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGRpdiA9IGNyZWF0ZUVsKHtcbiAgICAgICAgICAgICAgICBlbFRhZzogJ2RpdicsXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdmZWF0dXJlRmlsZXMnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBvcGVuQ2xvc2VDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICAgICAgICAgIG9wZW5DbG9zZUNvbnRhaW5lci5hcHBlbmRDaGlsZChvcGVuQ29udGFpbmVyKTtcbiAgICAgICAgICAgIG9wZW5DbG9zZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9zZUNvbnRhaW5lcik7XG4gICAgICAgICAgICBvcGVuQ2xvc2VDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGluZS5sYWJlbCkpO1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGZpZWxkc2V0KTtcblxuICAgICAgICAgICAgaW5zZXJ0SW5wdXQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGxpbmUubGFiZWwsXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiBvcGVuQ2xvc2VDb250YWluZXIsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2xvc2VCdG4nLFxuICAgICAgICAgICAgICAgIGxhYmVsQ2xhc3M6ICdvcGVuQ2xvc2UnLFxuICAgICAgICAgICAgICAgIGRhdGFQYXRoOiBsaW5lLnBhdGgsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdjbG9zZScsXG4gICAgICAgICAgICAgICAgaWQ6IGxpbmUuaWQgKyAnX2Nsb3NlJyxcbiAgICAgICAgICAgICAgICBjaGVja2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogZmllbGRzZXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaW5zZXJ0SW5wdXQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NlbGVjdEZvbGRlcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGxpbmUubGFiZWwsXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnc2VsZWN0IGZvbGRlcicsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZm9sZGVyQnRuJyxcbiAgICAgICAgICAgICAgICBsYWJlbENsYXNzOiAnYnV0dG9uIHNlbGVjdEZvbGRlcicsXG4gICAgICAgICAgICAgICAgZGF0YVBhdGg6IGxpbmUucGF0aCxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2RpcicsXG4gICAgICAgICAgICAgICAgaWQ6IGxpbmUuaWQgKyAnX2VudGlyZScsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBmaWVsZHNldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbnNlcnRJbnB1dCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbGluZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdleGNsdWRlIGZvbGRlcicsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZm9sZGVyQnRuJyxcbiAgICAgICAgICAgICAgICBsYWJlbENsYXNzOiAnYnV0dG9uIGV4Y2x1ZGVGb2xkZXInLFxuICAgICAgICAgICAgICAgIGRhdGFQYXRoOiBsaW5lLnBhdGgsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdleGNsdWRlJyxcbiAgICAgICAgICAgICAgICBpZDogbGluZS5pZCArICdfZW50aXJlRXhjbHVkZScsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBmaWVsZHNldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWVsZHNldC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICAgICAgaW5zZXJ0TGluZShsaW5lLnN1YkRpciwgZGl2LCBsaW5lLmlkKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbnNlcnRMaW5lO1xuIiwiaW1wb3J0IGNyZWF0ZUVsIGZyb20gJy4vY3JlYXRlRWwnO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIGNyZWF0ZSBhbiBpbnB1dCBmaWVsZCAoY2hlY2tib3ggb3IgcmFkaW8gYnV0dG4pICsgaXRzIGxhYmVsIGFuZCBhcHBlbmQgdGhlbSB0byB0aGUgcGFyZW50XHJcbiAqIEBwYXJhbSB7YXR0ck9iakZvcklucHV0fSBhdHRyT2JqXHJcbiAqL1xyXG5mdW5jdGlvbiBpbnNlcnRJbnB1dCAoYXR0ck9iaikge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBhdHRyT2JqRm9ySW5wdXRcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZFxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgLSBJbnB1dCB0eXBlIChlZy4gJ2NoZWNrYm94JyBvciAncmFkaW8nKVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd8ZWxlbWVudH0gbGFiZWxUZXh0IC0gc3RyaW5nIG9yIGVsZW1lbnQgdG8gc2V0IGFzIGNvbnRlbnQgb2YgdGhlIGlucHV0IGxhYmVsXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbGFiZWxDbGFzc1xyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWVcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGFzc1xyXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBjaGVja2VkXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZGF0YVBhdGggLSBUaGUgcGF0aCB0byBmb2xkZXIvZmlsZSB0byBhc3NpZ24gdG8gZGF0YS1wYXRoXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZGF0YVR5cGUgLSBUaGUgdmFsdWUgb2YgZGF0YS10eXBlOiAnZW52aXJvbm1lbnQnLCAnZmlsZScsICdkaXInXHJcbiAgICAgKi9cclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICB2YXIgbGFiZWwgPSBjcmVhdGVFbCh7XHJcbiAgICAgICAgZWxUYWc6ICdsYWJlbCcsXHJcbiAgICAgICAgdGV4dDogYXR0ck9iai5sYWJlbFRleHRcclxuICAgIH0pO1xyXG5cclxuICAgIGVsLnNldEF0dHJpYnV0ZSgnaWQnLCBhdHRyT2JqLmlkKTtcclxuICAgIGVsLnNldEF0dHJpYnV0ZSgndHlwZScsIGF0dHJPYmoudHlwZSk7XHJcbiAgICBpZiAoYXR0ck9iai5uYW1lKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCduYW1lJywgYXR0ck9iai5uYW1lKTtcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmNsYXNzTmFtZS5sZW5ndGgpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYXR0ck9iai5jbGFzc05hbWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouY2hlY2tlZCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICdjaGVja2VkJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXR0ck9iai5kYXRhUGF0aCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJywgYXR0ck9iai5kYXRhUGF0aCk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXR0ck9iai5kYXRhVHlwZSkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgYXR0ck9iai5kYXRhVHlwZSk7XHJcbiAgICB9XHJcbiAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGF0dHJPYmouaWQpO1xyXG4gICAgaWYgKGF0dHJPYmoubGFiZWxDbGFzcykge1xyXG4gICAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IGF0dHJPYmoubGFiZWxDbGFzcztcclxuICAgIH1cclxuXHJcbiAgICBhdHRyT2JqLnBhcmVudC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICBhdHRyT2JqLnBhcmVudC5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluc2VydElucHV0O1xyXG4iLCJ2YXIgaG9zdCA9ICdodHRwOi8vJytkb2N1bWVudC5sb2NhdGlvbi5ob3N0O1xyXG52YXIgZmVhdHVyZUxpc3RSZWFkeSA9IG5ldyBFdmVudCgnZmVhdHVyZUxpc3RSZWFkeScsIHtcImJ1YmJsZXNcIjogdHJ1ZSwgXCJjYW5jZWxhYmxlXCI6IGZhbHNlfSk7XHJcblxyXG5pbXBvcnQgZ2V0UmVxdWVzdCBmcm9tICcuL2dldFJlcXVlc3QnO1xyXG5pbXBvcnQgaW5zZXJ0SW5wdXQgZnJvbSAnLi9pbnNlcnRJbnB1dCc7XHJcbmltcG9ydCBpbnNlcnRGZWF0dXJlTGluZSBmcm9tICcuL2luc2VydEZlYXR1cmVMaW5lJztcclxuaW1wb3J0IG1hbmFnZVRhZ3MgZnJvbSAnLi9tYW5hZ2VUYWdzJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuaW1wb3J0IGhhbmRsZUZvcm1TdWJtaXQgZnJvbSAnLi9oYW5kbGVGb3JtU3VibWl0JztcclxuaW1wb3J0IGhhbmRsZUZvbGRlckNsaWNrIGZyb20gJy4vaGFuZGxlRm9sZGVyQ2xpY2snO1xyXG5pbXBvcnQgaGFuZGxlRmlsZUNsaWNrIGZyb20gJy4vaGFuZGxlRmlsZUNsaWNrJztcclxuaW1wb3J0IHJlc2V0Q2xpY2sgZnJvbSAnLi9yZXNldENsaWNrJztcclxuaW1wb3J0IHtzdG9yZUZlYXR1cmVzLCBnbG9iYWxUYWdzfSBmcm9tICcuL2dsb2JhbHMnO1xyXG5cclxuZ2V0UmVxdWVzdChob3N0KycvZW52aXJvbm1lbnRzJywgZnVuY3Rpb24gKHJlc3BvbnNlT2JqKSB7XHJcbiAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vudmlyb25tZW50c0Zvcm1Jbm5lcicpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgcmVzcG9uc2VPYmogIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5rZXlzKHJlc3BvbnNlT2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICBpbnNlcnRJbnB1dCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgIHZhbHVlOiBrZXksXHJcbiAgICAgICAgICAgIGxhYmVsVGV4dDoga2V5LFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5lJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdlbnZpcm9ubWVudCcsXHJcbiAgICAgICAgICAgIGlkOiBrZXksXHJcbiAgICAgICAgICAgIGNoZWNrZWQ6IChrZXkgPT09ICdjaHJvbWUnKSA/ICdjaGVja2VkJyA6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuZ2V0UmVxdWVzdChob3N0KycvZmVhdHVyZXMnLCBmdW5jdGlvbiAocmVzcG9uc2VPYmopIHtcclxuICAgIGlmICh0eXBlb2YgcmVzcG9uc2VPYmogIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQ2FjaGUgcmVzcG9uc2VcclxuICAgIHN0b3JlRmVhdHVyZXMuc2V0KHJlc3BvbnNlT2JqKTtcclxuXHJcbiAgICBpbnNlcnRGZWF0dXJlTGluZShyZXNwb25zZU9iaiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVzRm9ybUlubmVyJykpO1xyXG5cclxuICAgIGlmIChnbG9iYWxUYWdzLmdldCgpLmxlbmd0aCkge1xyXG4gICAgICAgIGxldCB1bmlxdWVUYWdzID0gZ2xvYmFsVGFncy5nZXQoKS5zb3J0KCkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBwb3MsIHNlbGYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZihpdGVtKSA9PT0gcG9zO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1hbmFnZVRhZ3ModW5pcXVlVGFncyk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVGZWF0dXJlc1RvUnVuKCk7XHJcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGZlYXR1cmVMaXN0UmVhZHkpO1xyXG59KTtcclxuXHJcbmhhbmRsZUZvcm1TdWJtaXQoaG9zdCk7XHJcbmhhbmRsZUZvbGRlckNsaWNrKCk7XHJcbmhhbmRsZUZpbGVDbGljaygpO1xyXG5yZXNldENsaWNrKCk7IiwiaW1wb3J0IGdldFRhZ3MgZnJvbSAnLi9nZXRUYWdzJztcclxuaW1wb3J0IGFycmF5SW50ZXJzZWN0IGZyb20gJy4vYXJyYXlJbnRlcnNlY3QnO1xyXG5pbXBvcnQgcHJpbnRGZWF0dXJlIGZyb20gJy4vcHJpbnRGZWF0dXJlJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuaW1wb3J0IGdldEZlYXR1cmVOYW1lIGZyb20gJy4vZ2V0RmVhdHVyZU5hbWUnO1xyXG5pbXBvcnQge2luY2x1ZGVkRmVhdHVyZXNXcmFwcGVyLCBleGNsdWRlZEZlYXR1cmVzV3JhcHBlciwgc3RvcmVGZWF0dXJlc30gZnJvbSAnLi9nbG9iYWxzJ1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY3JlYXRlIGEgbGkgZWxlbWVudCBmb3IgZXZlcnkgdGFnLCBpbml0aWFsaXNlIHRoZSBkcmFkJmRyb3AgYmVoYXZpb3VyIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBwYXJlbnRcclxuICogQHBhcmFtIHthcnJheX0gdGFnc0FyclxyXG4gKiBAcGFyYW0ge2VsZW1lbnR9IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gaW5zZXJ0VGFncyAodGFnc0FyciwgcGFyZW50KSB7XHJcbiAgICB0YWdzQXJyLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICAgIHZhciB0YWdFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgdmFyIHRhZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0YWcpO1xyXG4gICAgICAgIHRhZ0VsLmFwcGVuZENoaWxkKHRhZ1RleHQpO1xyXG4gICAgICAgIHRhZ0VsLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSk7XHJcbiAgICAgICAgdGFnRWwuaWQgPSB0YWc7XHJcbiAgICAgICAgdGFnRWwuY2xhc3NOYW1lID0gJ3RhZyc7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRhZ0VsKTtcclxuICAgICAgICB0YWdFbC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZHJhZ3N0YXJ0Jyk7XHJcbiAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIGUudGFyZ2V0LmlkKTtcclxuICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiB1cGRhdGUgdGhlIGxpc3RzIG9mIGluY2x1ZGVkL2V4Y2x1ZGVkIGZlYXR1cmUgYWZ0ZXIgZXZlcnkgdGFnIGRyb3BcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkRmVhdHVyZXMgKCkge1xyXG4gICAgdmFyIGluY2x1ZGVkVGFnID0gZ2V0VGFncygpLmluY2x1ZGVkO1xyXG4gICAgdmFyIGV4Y2x1ZGVkVGFnID0gZ2V0VGFncygpLmV4Y2x1ZGVkO1xyXG4gICAgdmFyIGluY2x1ZGVkRmVhdHVyZSA9IFtdO1xyXG4gICAgdmFyIGV4Y2x1ZGVkRmVhdHVyZSA9IFtdO1xyXG5cclxuICAgIChmdW5jdGlvbiBwYXJzZUZlYXR1cmUgKGZlYXR1cmVzT2JqKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXNPYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoZmVhdHVyZXNPYmpba2V5XS50eXBlID09PSAnZmlsZScgJiYgZmVhdHVyZXNPYmpba2V5XS50YWdzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlJbnRlcnNlY3QoZmVhdHVyZXNPYmpba2V5XS50YWdzLCBpbmNsdWRlZFRhZykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWRGZWF0dXJlLnB1c2goZ2V0RmVhdHVyZU5hbWUoZmVhdHVyZXNPYmpba2V5XS5wYXRoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlJbnRlcnNlY3QoZmVhdHVyZXNPYmpba2V5XS50YWdzLCBleGNsdWRlZFRhZykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRGZWF0dXJlLnB1c2goZ2V0RmVhdHVyZU5hbWUoZmVhdHVyZXNPYmpba2V5XS5wYXRoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZlYXR1cmVzT2JqW2tleV0uc3ViRGlyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGZWF0dXJlKGZlYXR1cmVzT2JqW2tleV0uc3ViRGlyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSkoc3RvcmVGZWF0dXJlcy5nZXQoKSk7XHJcblxyXG4gICAgcHJpbnRGZWF0dXJlKGluY2x1ZGVkRmVhdHVyZSwgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG4gICAgcHJpbnRGZWF0dXJlKGV4Y2x1ZGVkRmVhdHVyZSwgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG5cclxuICAgIHVwZGF0ZUZlYXR1cmVzVG9SdW4oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBtYW5hZ2UgdGhlIHRhZ3Mgc2VjdGlvblxyXG4gKiBAcGFyYW0ge2FycmF5fSB0YWdzQXJyIC0gVGhlIGFycmF5IG9mIHRoZSB0YWdzIGZvdW5kIGluIHRoZSBmZWF0dXJlcyBmaWxlc1xyXG4gKi9cclxuZnVuY3Rpb24gbWFuYWdlVGFncyAodGFnc0Fycikge1xyXG4gICAgaW5zZXJ0VGFncyh0YWdzQXJyLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFnc0xpc3QnKSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ3NEcm9wQXJlYScpIHx8IGUudGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdzRHJvcEFyZWEnKSkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdzRHJvcEFyZWEnKSk/IGUudGFyZ2V0IDogZS50YXJnZXQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgZWwucXVlcnlTZWxlY3RvcigndWwnKS5hcHBlbmRDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKSk7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNlbGVjdGVkRmVhdHVyZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL1Nob3cgY29udGFpbmVyXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFnc0Zvcm1XcmFwcGVyJykuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWFuYWdlVGFncztcclxuIiwiLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjcmVhdGUgYSBsaSBlbGVtZW50IHdpdGggdGhlIGZlYXR1cmUgbmFtZSBhcyBjb250ZW50IGZvciBldmVyeSBmZWF0dXJlIGluIGZlYXR1cmVBcnJheSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgcGFyZW50XHJcbiAqIEBwYXJhbSB7YXJyYXl9IGZlYXR1cmVBcnJheVxyXG4gKiBAcGFyYW0ge2VsZW1lbnR9IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gcHJpbnRGZWF0dXJlIChmZWF0dXJlQXJyYXksIHBhcmVudCkge1xyXG4gICAgcGFyZW50LmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgIGZlYXR1cmVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChmZWF0dXJlKSB7XHJcbiAgICAgICAgdmFyIGZlYXR1cmVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgdmFyIGZlYXR1cmVUeHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmZWF0dXJlKTtcclxuICAgICAgICBmZWF0dXJlRWwuYXBwZW5kQ2hpbGQoZmVhdHVyZVR4dCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGZlYXR1cmVFbCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJpbnRGZWF0dXJlO1xyXG4iLCJpbXBvcnQgcHJpbnRGZWF0dXJlIGZyb20gJy4vcHJpbnRGZWF0dXJlJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuaW1wb3J0IHt0ZXN0UnVubmluZ01zZywgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIsIGV4Y2x1ZGVkRmVhdHVyZXNXcmFwcGVyfSBmcm9tICcuL2dsb2JhbHMnXHJcblxyXG4vKipcclxuICogQG5hbWVzcGFjZVxyXG4gKiBAZGVzYyBNYW5hZ2UgdGhlIHJlc2V0IGJ1dHRvbiBjbGlja1xyXG4gKi9cclxuZnVuY3Rpb24gcmVzZXRDbGljaygpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldEJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0YWdMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhZ3NMaXN0Jyk7XHJcblxyXG4gICAgICAgIC8vTW92ZSBhbGwgdGhlIHRhZ3MgYmFjayB0byB0aGUgdGFnIGxpc3RcclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhZ3NEcm9wQXJlYVdyYXBwZXIgbGknKSwgZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICAgICAgICB0YWdMaXN0LmFwcGVuZENoaWxkKHRhZyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vRW1wdHkgaW5jbHVkZWQvZXhjbHVkZWQgZmVhdHVyZSBsaXN0c1xyXG4gICAgICAgIHByaW50RmVhdHVyZShbXSwgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG4gICAgICAgIHByaW50RmVhdHVyZShbXSwgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG5cclxuICAgICAgICAvL0Nsb3NlIHRlc3Qgb3V0cHV0XHJcbiAgICAgICAgdGVzdFJ1bm5pbmdNc2cuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lOycpO1xyXG5cclxuICAgICAgICAvL1dhaXQgZm9yIGh0bWwgcmVzZXQgYW5kIHRoZW4gdXBkYXRlIGZlYXR1cmVzIHRvIHJ1biBsaXN0XHJcbiAgICAgICAgc2V0VGltZW91dCh1cGRhdGVGZWF0dXJlc1RvUnVuLCAwKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHJlc2V0Q2xpY2s7XHJcbiIsImltcG9ydCBnZXRUYWdzIGZyb20gJy4vZ2V0VGFncyc7XHJcbmltcG9ydCBhcnJheUludGVyc2VjdCBmcm9tICcuL2FycmF5SW50ZXJzZWN0JztcclxuaW1wb3J0IGdldEZlYXR1cmVOYW1lIGZyb20gJy4vZ2V0RmVhdHVyZU5hbWUnO1xyXG5pbXBvcnQgcHJpbnRGZWF0dXJlIGZyb20gJy4vcHJpbnRGZWF0dXJlJztcclxuaW1wb3J0IHtzdWJtaXRCdG4sIHN0b3JlRmVhdHVyZXN9IGZyb20gJy4vZ2xvYmFscydcclxuXHJcbi8qKlxyXG4gKiBAZGVzYyBVcGRhdGUgdGhlIGxpc3Qgb2YgZmVhdHVyZXMgdG8gcnVuIGFjY29yZGluZyB0byB0aGUgc2VsZWN0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlRmVhdHVyZXNUb1J1biAoZmVhdHVyZXNPYmopIHtcclxuICAgIHZhciBzZWxlY3RlZEZvbGRlckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdHlwZT1cImRpclwiXTpjaGVja2VkJyk7XHJcbiAgICB2YXIgY29sbGVjdGluZyA9IChzZWxlY3RlZEZvbGRlckVsLmRhdGFzZXQucGF0aCA9PT0gJ2FsbCcpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgdmFyIHNlbGVjdGVkRmVhdHVyZXMgPSBbXTtcclxuICAgIHZhciBpbmNsdWRlZFRhZyA9IGdldFRhZ3MoKS5pbmNsdWRlZDtcclxuICAgIHZhciBleGNsdWRlZFRhZyA9IGdldFRhZ3MoKS5leGNsdWRlZDtcclxuICAgIHZhciBleGNsdWRlZEZvbGRlcnMgPSBbXS5tYXAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10eXBlPVwiZXhjbHVkZVwiXTpjaGVja2VkJyksIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHJldHVybiBlbC5kYXRhc2V0LnBhdGg7XHJcbiAgICB9KTtcclxuICAgIHZhciBzZWxlY3RlZEZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZmlsZVwiXTpjaGVja2VkJyk7XHJcbiAgICB2YXIgZmVhdHVyZXNUb1J1bkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmZWF0dXJlc1RvUnVuJyk7XHJcblxyXG4gICAgZmVhdHVyZXNUb1J1bkNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAoZnVuY3Rpb24gcHJvY2Vzc0ZlYXR1cmVMaW5lIChvYmopIHtcclxuICAgICAgICB2YXIga2V5O1xyXG5cclxuICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9ialtrZXldLnR5cGUgPT09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhcnJheUludGVyc2VjdChleGNsdWRlZFRhZywgb2JqW2tleV0udGFncykubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgY29sbGVjdGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICYmICghaW5jbHVkZWRUYWcubGVuZ3RoIHx8IGFycmF5SW50ZXJzZWN0KGluY2x1ZGVkVGFnLCBvYmpba2V5XS50YWdzKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCFleGNsdWRlZEZvbGRlcnMubGVuZ3RoIHx8IGV4Y2x1ZGVkRm9sZGVycy5ldmVyeShmdW5jdGlvbiAoZXhjbHVkZWRGb2xkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJvb2xlYW4ob2JqW2tleV0ucGF0aC5pbmRleE9mKGV4Y2x1ZGVkRm9sZGVyKSA9PT0gLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICghc2VsZWN0ZWRGaWxlIHx8IG9ialtrZXldLnBhdGggPT09IHNlbGVjdGVkRmlsZS5kYXRhc2V0LnBhdGgpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVzLnB1c2goZ2V0RmVhdHVyZU5hbWUob2JqW2tleV0ucGF0aCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9ialtrZXldLnN1YkRpcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpba2V5XS5wYXRoLmluZGV4T2Yoc2VsZWN0ZWRGb2xkZXJFbC5kYXRhc2V0LnBhdGgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRGb2xkZXJFbC5kYXRhc2V0LnBhdGggIT09ICdhbGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0ZlYXR1cmVMaW5lKG9ialtrZXldLnN1YkRpcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KShzdG9yZUZlYXR1cmVzLmdldCgpKTtcclxuXHJcbiAgICBpZiAoIXNlbGVjdGVkRmVhdHVyZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlcyA9IFsnTm8gZmVhdHVyZXMgc2VsZWN0ZWQhJ107XHJcbiAgICAgICAgZmVhdHVyZXNUb1J1bkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG4gICAgICAgIHN1Ym1pdEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9IGVsc2UgIHtcclxuICAgICAgICBmZWF0dXJlc1RvUnVuQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XHJcbiAgICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwcmludEZlYXR1cmUoc2VsZWN0ZWRGZWF0dXJlcywgZmVhdHVyZXNUb1J1bkNvbnRhaW5lcik7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZUZlYXR1cmVzVG9SdW47Il19
