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
 * @description recursively print features folder content
 * @param {featuresDataObj} obj
 * @param {element} parent - The parent element of the new line
 */

/**
 * @desc converts a response object into an array
 * @param obj {object}
 * @returns {Array}
 */
function convertResponseObjToArray(obj) {
    return Object.keys(obj).map(function (key) {
        return Object.assign({}, obj[key], { label: key });
    });
}

function insertLine(obj, parent) {
    /**
     * @typedef {Object} featuresDataObj
     * @description a recursive object containing data on features
     * @property {string} type - 'dir' or 'file'
     * @property {path} path - the absolute path to the folder or file
     * @property {featuresDataObj} subdir - a featuresDataObj of the subfolder eventually present in a folder
     * @property {array} tags - the tags eventually present in a feature
     */

    var arr = convertResponseObjToArray(obj).sort(function (a, b) {
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
                id: line.label,
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
                id: line.label + '_close',
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
                id: line.label + '_entire',
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
                id: line.label + '_entireExclude',
                parent: fieldset
            });
            fieldset.appendChild(div);
            insertLine(line.subDir, div);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjXFxhamF4UG9zdC5qcyIsInNyY1xcYXJyYXlJbnRlcnNlY3QuanMiLCJzcmNcXGNyZWF0ZUVsLmpzIiwic3JjXFxnZXRGZWF0dXJlTmFtZS5qcyIsInNyY1xcZ2V0Rm9ybURhdGEuanMiLCJzcmNcXGdldFJlcXVlc3QuanMiLCJzcmNcXGdldFNpYmxpbmdCeVR5cGUuanMiLCJzcmNcXGdldFRhZ3MuanMiLCJzcmNcXGdsb2JhbHMuanMiLCJzcmNcXGhhbmRsZUZpbGVDbGljay5qcyIsInNyY1xcaGFuZGxlRm9sZGVyQ2xpY2suanMiLCJzcmNcXGhhbmRsZUZvcm1TdWJtaXQuanMiLCJzcmNcXGluc2VydEZlYXR1cmVMaW5lLmpzIiwic3JjXFxpbnNlcnRJbnB1dC5qcyIsInNyY1xcbWFpbi5qcyIsInNyY1xcbWFuYWdlVGFncy5qcyIsInNyY1xccHJpbnRGZWF0dXJlLmpzIiwic3JjXFxyZXNldENsaWNrLmpzIiwic3JjXFx1cGRhdGVGZWF0dXJlc1RvUnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQTs7Ozs7O0FBTUEsU0FBUyxRQUFULENBQW1CLE9BQW5CLEVBQTRCLEdBQTVCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ3ZDLFdBQU8sS0FBUCxDQUFhLEdBQWIsRUFBa0I7QUFDZCxnQkFBUSxNQURNO0FBRWQsaUJBQVMsSUFBSSxPQUFKLENBQVk7QUFDakIsNEJBQWdCO0FBREMsU0FBWixDQUZLO0FBS2QsY0FBTSxLQUFLLFNBQUwsQ0FBZSxPQUFmO0FBTFEsS0FBbEIsRUFNRyxJQU5ILENBTVEsVUFBVSxRQUFWLEVBQW9CO0FBQ3hCLGdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxTQUFTLFVBQTdDO0FBQ0E7QUFDSCxLQVRELEVBU0csS0FUSCxDQVNTLFVBQVUsR0FBVixFQUFlO0FBQ3BCLGdCQUFRLEdBQVIsQ0FBWSxjQUFaLEVBQTJCLEdBQTNCO0FBQ0EsY0FBTSwrQ0FBTjtBQUNILEtBWkQ7QUFhSDs7a0JBRWMsUTs7Ozs7Ozs7QUN0QmY7Ozs7OztBQU1BLFNBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQztBQUNoQyxRQUFJLFNBQVMsQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUFiOztBQUVBLFdBQU8sT0FBTyxJQUFQLEdBQWMsS0FBZCxHQUFzQixNQUF0QixDQUE2QixVQUFVLENBQVYsRUFBYTtBQUM3QyxlQUFPLE9BQU8sS0FBUCxDQUFhLFVBQVUsQ0FBVixFQUFhO0FBQzdCLG1CQUFPLEVBQUUsT0FBRixDQUFVLENBQVYsTUFBaUIsQ0FBQyxDQUF6QjtBQUNILFNBRk0sQ0FBUDtBQUdILEtBSk0sQ0FBUDtBQUtIOztrQkFFYyxjOzs7Ozs7OztBQ2hCZjs7Ozs7QUFLQSxTQUFTLFFBQVQsQ0FBa0IsT0FBbEIsRUFBMkI7QUFDdkI7Ozs7OztBQU1BLFFBQUksS0FBSyxTQUFTLGFBQVQsQ0FBdUIsUUFBUSxLQUEvQixDQUFUO0FBQ0EsUUFBSSxRQUFRLElBQVosRUFBa0I7QUFDZCxZQUFJLE9BQVEsT0FBTyxRQUFRLElBQWYsS0FBeUIsUUFBMUIsR0FBc0MsU0FBUyxjQUFULENBQXdCLFFBQVEsSUFBaEMsQ0FBdEMsR0FBOEUsUUFBUSxJQUFqRztBQUNBLFdBQUcsV0FBSCxDQUFlLElBQWY7QUFDSDtBQUNELFFBQUksUUFBUSxLQUFaLEVBQW1CO0FBQ2YsV0FBRyxTQUFILEdBQWUsUUFBUSxLQUF2QjtBQUNIO0FBQ0QsUUFBSSxRQUFRLEVBQVosRUFBZ0I7QUFDWixXQUFHLEVBQUgsR0FBUSxRQUFRLEVBQWhCO0FBQ0g7QUFDRCxXQUFPLEVBQVA7QUFDSDs7a0JBRWMsUTs7Ozs7Ozs7QUMxQmYsU0FBUyxjQUFULENBQXlCLFdBQXpCLEVBQXNDO0FBQ2xDLFdBQU8sWUFBWSxPQUFaLENBQW9CLGFBQXBCLEVBQW1DLEVBQW5DLEVBQXVDLE1BQXZDLENBQThDLENBQTlDLENBQVA7QUFDSDs7a0JBRWMsYzs7Ozs7Ozs7O0FDSmY7Ozs7OztBQUVBOzs7O0FBSUEsU0FBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCO0FBQ3ZCLFFBQUksVUFBVTtBQUNWLHNCQUFjLEVBREo7QUFFVixhQUFLO0FBRkssS0FBZDtBQUlBLFFBQUksZUFBZSx5QkFBVSxRQUE3QjtBQUNBLFFBQUksZUFBZSx5QkFBVSxRQUE3Qjs7QUFFQSxPQUFHLE1BQUgsQ0FBVSxJQUFWLENBQWUsS0FBSyxnQkFBTCxDQUFzQixtQkFBdEIsQ0FBZixFQUEyRCxVQUFVLEVBQVYsRUFBYztBQUNqRSxlQUFPLEdBQUcsT0FBVjtBQUNILEtBRkw7QUFHSTtBQUhKLEtBSUssT0FKTCxDQUlhLFVBQVUsRUFBVixFQUFjO0FBQ25CO0FBQ0EsZ0JBQVEsR0FBRyxZQUFILENBQWdCLFdBQWhCLENBQVI7QUFDSSxpQkFBSyxhQUFMO0FBQ0ksd0JBQVEsWUFBUixDQUFxQixJQUFyQixDQUEwQixHQUFHLEVBQTdCO0FBQ0E7QUFDSixpQkFBSyxLQUFMO0FBQ0ksd0JBQVEsR0FBUixHQUFjLEdBQUcsWUFBSCxDQUFnQixXQUFoQixDQUFkO0FBQ0E7QUFDSixpQkFBSyxTQUFMO0FBQ0ksb0JBQUksQ0FBQyxRQUFRLE9BQWIsRUFBc0I7QUFDbEIsNEJBQVEsT0FBUixHQUFrQixFQUFsQjtBQUNIO0FBQ0Qsd0JBQVEsT0FBUixDQUFnQixJQUFoQixDQUFxQixHQUFHLFlBQUgsQ0FBZ0IsV0FBaEIsQ0FBckI7QUFDQTtBQUNKLGlCQUFLLE1BQUw7QUFDSSx3QkFBUSxJQUFSLEdBQWUsR0FBRyxZQUFILENBQWdCLFdBQWhCLENBQWY7QUFkUjtBQWdCSCxLQXRCTDs7QUF3QkEsUUFBSSxhQUFhLE1BQWpCLEVBQXlCO0FBQ3JCLGdCQUFRLFlBQVIsR0FBdUIsWUFBdkI7QUFDSDs7QUFFRCxRQUFJLGFBQWEsTUFBakIsRUFBeUI7QUFDckIsZ0JBQVEsWUFBUixHQUF1QixZQUF2QjtBQUNIOztBQUVELFdBQU8sT0FBUDtBQUNIOztrQkFFYyxXOzs7Ozs7OztBQ2pEZjs7Ozs7QUFLQSxTQUFTLFVBQVQsQ0FBb0IsR0FBcEIsRUFBeUIsUUFBekIsRUFBbUM7QUFDL0IsV0FBTyxLQUFQLENBQWEsR0FBYixFQUFrQjtBQUNWLGdCQUFRO0FBREUsS0FBbEIsRUFHQyxJQUhELENBR007QUFBQSxlQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsS0FITixFQUlDLElBSkQsQ0FJTTtBQUFBLGVBQWdCLFNBQVMsWUFBVCxDQUFoQjtBQUFBLEtBSk4sRUFLQyxLQUxELENBS087QUFBQSxlQUFPLFFBQVEsR0FBUixDQUFZLFlBQVksR0FBeEIsQ0FBUDtBQUFBLEtBTFA7QUFNSDs7a0JBRWMsVTs7Ozs7Ozs7QUNkZjs7Ozs7OztBQU9BLFNBQVMsdUJBQVQsQ0FBa0MsRUFBbEMsRUFBc0MsTUFBdEMsRUFBOEM7QUFDMUMsV0FBTyxpQkFBaUIsR0FBRyxhQUFILENBQWlCLGlCQUFsQyxFQUFxRCxNQUFyRCxDQUFQO0FBQ0g7O0FBRUQsU0FBUyxnQkFBVCxDQUEyQixFQUEzQixFQUErQixNQUEvQixFQUF1QztBQUNuQyxRQUFJLEdBQUcsT0FBSCxDQUFXLElBQVgsSUFBbUIsR0FBRyxPQUFILENBQVcsSUFBWCxLQUFvQixNQUEzQyxFQUFtRDtBQUMvQyxlQUFPLEVBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxZQUFJLENBQUMsR0FBRyxrQkFBUixFQUE0QjtBQUN4QixtQkFBTyxJQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU8saUJBQWlCLEdBQUcsa0JBQXBCLEVBQXdDLE1BQXhDLENBQVA7QUFDSDtBQUNKO0FBQ0o7O2tCQUVjLHVCOzs7Ozs7OztBQ3ZCZjs7Ozs7QUFLQSxTQUFTLE9BQVQsR0FBbUI7QUFDZixRQUFJLGVBQWUsR0FBRyxHQUFILENBQU8sSUFBUCxDQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQVosRUFBMkQsVUFBVSxLQUFWLEVBQWlCO0FBQzNGLGVBQU8sTUFBTSxFQUFiO0FBQ0gsS0FGa0IsQ0FBbkI7QUFHQSxRQUFJLGVBQWUsR0FBRyxHQUFILENBQU8sSUFBUCxDQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQVosRUFBMkQsVUFBVSxLQUFWLEVBQWlCO0FBQzNGLGVBQU8sTUFBTSxFQUFiO0FBQ0gsS0FGa0IsQ0FBbkI7O0FBSUE7Ozs7OztBQU1BLFdBQU87QUFDSCxrQkFBVSxZQURQO0FBRUgsa0JBQVU7QUFGUCxLQUFQO0FBSUg7O2tCQUVjLE87Ozs7Ozs7O0FDekJmOzs7O0FBSUE7QUFDQSxJQUFJLGdCQUFKO0FBQ08sSUFBTSx3Q0FBZ0I7QUFDekIsU0FBSztBQUFBLGVBQU0sZ0JBQU47QUFBQSxLQURvQjtBQUV6QixTQUFLLGFBQUMsR0FBRDtBQUFBLGVBQVMsbUJBQW1CLEdBQTVCO0FBQUE7QUFGb0IsQ0FBdEI7O0FBS1A7QUFDQSxJQUFJLE9BQU8sRUFBWDtBQUNPLElBQU0sa0NBQWE7QUFDdEIsU0FBSztBQUFBLGVBQU0sSUFBTjtBQUFBLEtBRGlCO0FBRXRCLFNBQUssYUFBQyxHQUFEO0FBQUEsZUFBUyxPQUFPLEdBQWhCO0FBQUE7QUFGaUIsQ0FBbkI7O0FBS1A7QUFDTyxJQUFNLDBDQUFpQixTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBQXZCO0FBQ0EsSUFBTSxnQ0FBWSxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBbEI7QUFDQSxJQUFNLDREQUEwQixTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQWhDO0FBQ0EsSUFBTSw0REFBMEIsU0FBUyxjQUFULENBQXdCLG1CQUF4QixDQUFoQzs7Ozs7Ozs7O0FDdEJQOzs7O0FBQ0E7Ozs7OztBQUVBOzs7QUFHQSxTQUFTLGVBQVQsR0FBMkI7QUFDdkIsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBWTs7QUFFdEQsV0FBRyxPQUFILENBQVcsSUFBWCxDQUFnQixTQUFTLGdCQUFULENBQTBCLHFCQUExQixDQUFoQixFQUFrRSxVQUFVLEdBQVYsRUFBZTtBQUM3RSxnQkFBSSxnQkFBSixDQUFxQixPQUFyQixFQUE4QixVQUFVLENBQVYsRUFBYTtBQUN2QyxvQkFBSSxpQkFBaUIsRUFBRSxhQUFGLENBQWdCLE9BQWhCLENBQXdCLFVBQXhCLENBQXJCO0FBQ0Esb0JBQUksa0JBQWtCLGlCQUFnQixnQ0FBaUIsZUFBZSxpQkFBaEMsRUFBbUQsS0FBbkQsQ0FBaEIsR0FBNEUsSUFBbEc7QUFDQSxvQkFBSSx5QkFBeUIsaUJBQWdCLGdDQUFpQixlQUFlLGlCQUFoQyxFQUFtRCxTQUFuRCxDQUFoQixHQUFnRixJQUE3Rzs7QUFFQSxvQkFBSSxtQkFBbUIsQ0FBQyxnQkFBZ0IsT0FBeEMsRUFBaUQ7QUFDN0Msb0NBQWdCLE9BQWhCLEdBQTBCLElBQTFCO0FBQ0g7O0FBRUQsb0JBQUksMEJBQTBCLHVCQUF1QixPQUFyRCxFQUE4RDtBQUMxRCwyQ0FBdUIsT0FBdkIsR0FBaUMsS0FBakM7QUFDSDs7QUFFRDtBQUNILGFBZEQ7QUFlSCxTQWhCRDtBQWlCSCxLQW5CRDtBQW9CSDs7a0JBRWMsZTs7Ozs7Ozs7O0FDN0JmOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7QUFNQSxTQUFTLGVBQVQsQ0FBMEIsRUFBMUIsRUFBOEIsU0FBOUIsRUFBeUM7QUFDckMsUUFBSSxPQUFPLFNBQVgsRUFBc0I7QUFDbEIsZUFBTyxJQUFQO0FBQ0g7QUFDRCxRQUFJLENBQUMsR0FBRyxhQUFSLEVBQXVCO0FBQ25CLGVBQU8sS0FBUDtBQUNILEtBRkQsTUFFTztBQUNILGVBQU8sZ0JBQWdCLEdBQUcsYUFBbkIsRUFBa0MsU0FBbEMsQ0FBUDtBQUNIO0FBQ0o7O0FBRUQ7OztBQUdBLFNBQVMsaUJBQVQsR0FBOEI7QUFDMUIsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBWTtBQUN0RCxXQUFHLE9BQUgsQ0FBVyxJQUFYLENBQWdCLFNBQVMsZ0JBQVQsQ0FBMEIsWUFBMUIsQ0FBaEIsRUFBeUQsVUFBVSxHQUFWLEVBQWU7QUFDcEUsZ0JBQUksZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsVUFBVSxDQUFWLEVBQWE7QUFDdkMsb0JBQUksRUFBRSxhQUFGLENBQWdCLE9BQXBCLEVBQTZCO0FBQ3pCO0FBQ0Esd0JBQUksYUFBYSxnQ0FBaUIsRUFBRSxhQUFuQixFQUFtQyxFQUFFLGFBQUYsQ0FBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsS0FBaUMsS0FBbEMsR0FBMEMsU0FBMUMsR0FBc0QsS0FBeEYsQ0FBakI7QUFDQSx3QkFBSSxjQUFjLFdBQVcsT0FBN0IsRUFBc0M7QUFDbEMsbUNBQVcsT0FBWCxHQUFxQixLQUFyQjtBQUNIOztBQUVEO0FBQ0Esd0JBQUksU0FBUyxFQUFFLGFBQUYsQ0FBZ0IsT0FBaEIsQ0FBd0IsSUFBckM7QUFDQSx3QkFBSSxXQUFXLFdBQVcsS0FBWCxJQUFvQixXQUFXLFNBQTFDLENBQUosRUFBMEQ7QUFDdEQsNEJBQUksaUJBQWlCLFNBQVMsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBckI7QUFDQSw0QkFBSSxjQUFKLEVBQW9CO0FBQ2hCLDJDQUFlLE9BQWYsR0FBeUIsS0FBekI7QUFDSDtBQUNKOztBQUVEO0FBQ0Esd0JBQUksQ0FBQyxTQUFTLGFBQVQsQ0FBdUIsMkJBQXZCLENBQUwsRUFBMEQ7QUFDdEQsaUNBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxPQUFyQyxHQUErQyxJQUEvQztBQUNIOztBQUVEO0FBQ0Esd0JBQUksRUFBRSxhQUFGLENBQWdCLE9BQWhCLENBQXdCLElBQXhCLEtBQWlDLEtBQXJDLEVBQTRDO0FBQ3hDLDRCQUFJLDhCQUE4QixFQUFFLGFBQUYsQ0FBZ0IsYUFBaEIsQ0FBOEIsYUFBOUIsQ0FBNEMsZUFBNUMsQ0FBbEM7O0FBRUEsMkJBQUcsR0FBSCxDQUFPLElBQVAsQ0FBWSxTQUFTLGdCQUFULENBQTBCLHVCQUExQixDQUFaLEVBQWdFLFVBQVUsVUFBVixFQUFzQjtBQUM5RSx1Q0FBVyxRQUFYLEdBQXNCLEtBQXRCO0FBQ0EsbUNBQU8sVUFBUDtBQUNILHlCQUhMLEVBSUssTUFKTCxDQUlZLFVBQVUsVUFBVixFQUFzQjtBQUMxQixtQ0FBTyxDQUFDLGdCQUFnQixVQUFoQixFQUE0QiwyQkFBNUIsQ0FBUjtBQUNILHlCQU5MLEVBT0ssT0FQTCxDQU9hLFVBQVUsVUFBVixFQUFzQjtBQUMzQix1Q0FBVyxRQUFYLEdBQXNCLElBQXRCO0FBQ0EsdUNBQVcsT0FBWCxHQUFxQixLQUFyQjtBQUNILHlCQVZMO0FBWUg7QUFDSjs7QUFFRDtBQUNILGFBMUNEO0FBMkNILFNBNUNEO0FBNkNILEtBOUNEO0FBK0NIOztrQkFFYyxpQjs7Ozs7Ozs7O0FDekVmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBWDs7QUFFQTs7O0FBR0EsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQztBQUM1QjtBQUNBLFFBQUksU0FBUyxHQUFHLE9BQUgsQ0FBVyxJQUFYLENBQWI7O0FBRUEsdUJBQVUsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBVSxDQUFWLEVBQWE7QUFDN0MsVUFBRSxjQUFGOztBQUVBLFlBQUksVUFBVSwyQkFBWSxJQUFaLENBQWQ7O0FBRUEsZ0NBQVMsT0FBVCxFQUFrQixPQUFLLFlBQXZCLEVBQXFDLFlBQVk7QUFDN0Msb0NBQWUsWUFBZixDQUE0QixPQUE1QixFQUFxQyxFQUFyQztBQUNILFNBRkQ7O0FBSUE7QUFDQTtBQUNBLGVBQU8sa0JBQVAsQ0FBMEIsc0JBQTFCO0FBQ0EsZUFBTyxFQUFQLENBQVUsc0JBQVYsRUFBa0MsVUFBVSxHQUFWLEVBQWU7QUFDN0M7QUFDQSxnQkFBSSxJQUFJLFNBQVMsYUFBVCxDQUF1QixHQUF2QixDQUFSOztBQUVBLGNBQUUsU0FBRixHQUFjLEdBQWQ7QUFDQSxvQ0FBZSxXQUFmLENBQTJCLENBQTNCO0FBQ0Esb0NBQWUsU0FBZixHQUEyQix3QkFBZSxZQUExQztBQUNILFNBUEQ7QUFRSCxLQXBCRDtBQXFCSDs7a0JBRWMsZ0I7Ozs7Ozs7OztBQ3BDZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBTUE7Ozs7O0FBS0EsU0FBUyx5QkFBVCxDQUFtQyxHQUFuQyxFQUF3QztBQUNwQyxXQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FBcUIsVUFBUyxHQUFULEVBQWM7QUFDdEMsZUFBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLElBQUksR0FBSixDQUFqQixFQUEwQixFQUFDLE9BQU8sR0FBUixFQUExQixDQUFQO0FBQ0gsS0FGTSxDQUFQO0FBR0g7O0FBRUQsU0FBUyxVQUFULENBQXFCLEdBQXJCLEVBQTBCLE1BQTFCLEVBQWtDO0FBQzlCOzs7Ozs7Ozs7QUFTQSxRQUFJLE1BQU0sMEJBQTBCLEdBQTFCLEVBQStCLElBQS9CLENBQW9DLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUN4RCxlQUFPLEVBQUUsS0FBRixHQUFVLEVBQUUsS0FBbkI7QUFDSCxLQUZTLENBQVY7O0FBSUEsUUFBSSxPQUFKLENBQVksVUFBUyxJQUFULEVBQWU7QUFDdkIsWUFBSSxLQUFLLElBQUwsS0FBYyxNQUFsQixFQUEwQjtBQUN0QjtBQUNBLGdCQUFJLFlBQVksS0FBSyxJQUFyQjtBQUNBLGdCQUFJLGlCQUFpQixFQUFyQjtBQUNBLGdCQUFJLGFBQWEsVUFBVSxNQUEzQixFQUFtQztBQUMvQixvQ0FBVyxHQUFYLENBQWUsb0JBQVcsR0FBWCxHQUFpQixNQUFqQixDQUF3QixTQUF4QixDQUFmO0FBQ0EsaUNBQWlCLFlBQVksVUFBVSxJQUFWLENBQWUsSUFBZixDQUFaLEdBQW1DLEdBQXBEO0FBQ0g7O0FBRUQsdUNBQVk7QUFDUixzQkFBTSxPQURFO0FBRVIsc0JBQU0sWUFGRTtBQUdSLHVCQUFPLEtBQUssS0FISjtBQUlSLDJCQUFXLEtBQUssS0FBTCxHQUFhLGNBSmhCO0FBS1IsMkJBQVcsTUFMSDtBQU1SLDBCQUFVLEtBQUssSUFOUDtBQU9SLDBCQUFVLE1BUEY7QUFRUixvQkFBSSxLQUFLLEtBUkQ7QUFTUix3QkFBUTtBQVRBLGFBQVo7QUFXSCxTQXBCRCxNQW9CTztBQUFFO0FBQ0wsZ0JBQUksV0FBVyx3QkFBUztBQUNwQix1QkFBTyxVQURhO0FBRXBCLHVCQUFPLG1CQUFtQixLQUFLLEtBQXhCLEdBQWdDO0FBRm5CLGFBQVQsQ0FBZjtBQUlBLGdCQUFJLGlCQUFpQix3QkFBUztBQUMxQix1QkFBTyxNQURtQjtBQUUxQixzQkFBTSxFQUZvQjtBQUcxQix1QkFBTztBQUhtQixhQUFULENBQXJCO0FBS0EsZ0JBQUksZ0JBQWdCLHdCQUFTO0FBQ3pCLHVCQUFPLE1BRGtCO0FBRXpCLHNCQUFNLEVBRm1CO0FBR3pCLHVCQUFPO0FBSGtCLGFBQVQsQ0FBcEI7QUFLQSxnQkFBSSxNQUFNLHdCQUFTO0FBQ2YsdUJBQU8sS0FEUTtBQUVmLHVCQUFPO0FBRlEsYUFBVCxDQUFWO0FBSUEsZ0JBQUkscUJBQXFCLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUF6Qjs7QUFFQSwrQkFBbUIsV0FBbkIsQ0FBK0IsYUFBL0I7QUFDQSwrQkFBbUIsV0FBbkIsQ0FBK0IsY0FBL0I7QUFDQSwrQkFBbUIsV0FBbkIsQ0FBK0IsU0FBUyxjQUFULENBQXdCLEtBQUssS0FBN0IsQ0FBL0I7QUFDQSxtQkFBTyxXQUFQLENBQW1CLFFBQW5COztBQUVBLHVDQUFZO0FBQ1Isc0JBQU0sVUFERTtBQUVSLHVCQUFPLEtBQUssS0FGSjtBQUdSLDJCQUFXLGtCQUhIO0FBSVIsMkJBQVcsVUFKSDtBQUtSLDRCQUFZLFdBTEo7QUFNUiwwQkFBVSxLQUFLLElBTlA7QUFPUiwwQkFBVSxPQVBGO0FBUVIsb0JBQUksS0FBSyxLQUFMLEdBQWEsUUFSVDtBQVNSLHlCQUFTLElBVEQ7QUFVUix3QkFBUTtBQVZBLGFBQVo7QUFZQSx1Q0FBWTtBQUNSLHNCQUFNLE9BREU7QUFFUixzQkFBTSxjQUZFO0FBR1IsdUJBQU8sS0FBSyxLQUhKO0FBSVIsMkJBQVcsZUFKSDtBQUtSLDJCQUFXLFdBTEg7QUFNUiw0QkFBWSxxQkFOSjtBQU9SLDBCQUFVLEtBQUssSUFQUDtBQVFSLDBCQUFVLEtBUkY7QUFTUixvQkFBSSxLQUFLLEtBQUwsR0FBYSxTQVRUO0FBVVIsd0JBQVE7QUFWQSxhQUFaO0FBWUEsdUNBQVk7QUFDUixzQkFBTSxVQURFO0FBRVIsdUJBQU8sS0FBSyxLQUZKO0FBR1IsMkJBQVcsZ0JBSEg7QUFJUiwyQkFBVyxXQUpIO0FBS1IsNEJBQVksc0JBTEo7QUFNUiwwQkFBVSxLQUFLLElBTlA7QUFPUiwwQkFBVSxTQVBGO0FBUVIsb0JBQUksS0FBSyxLQUFMLEdBQWEsZ0JBUlQ7QUFTUix3QkFBUTtBQVRBLGFBQVo7QUFXQSxxQkFBUyxXQUFULENBQXFCLEdBQXJCO0FBQ0EsdUJBQVcsS0FBSyxNQUFoQixFQUF3QixHQUF4QjtBQUNIO0FBQ0osS0FyRkQ7QUFzRkg7O2tCQUVjLFU7Ozs7Ozs7OztBQzNIZjs7Ozs7O0FBRUE7Ozs7QUFJQSxTQUFTLFdBQVQsQ0FBc0IsT0FBdEIsRUFBK0I7QUFDM0I7Ozs7Ozs7Ozs7OztBQVlBLFFBQUksS0FBSyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBVDtBQUNBLFFBQUksUUFBUSx3QkFBUztBQUNqQixlQUFPLE9BRFU7QUFFakIsY0FBTSxRQUFRO0FBRkcsS0FBVCxDQUFaOztBQUtBLE9BQUcsWUFBSCxDQUFnQixJQUFoQixFQUFzQixRQUFRLEVBQTlCO0FBQ0EsT0FBRyxZQUFILENBQWdCLE1BQWhCLEVBQXdCLFFBQVEsSUFBaEM7QUFDQSxRQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNkLFdBQUcsWUFBSCxDQUFnQixNQUFoQixFQUF3QixRQUFRLElBQWhDO0FBQ0g7QUFDRCxRQUFJLFFBQVEsU0FBUixDQUFrQixNQUF0QixFQUE4QjtBQUMxQixXQUFHLFlBQUgsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBUSxTQUFqQztBQUNIO0FBQ0QsUUFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsV0FBRyxZQUFILENBQWdCLFNBQWhCLEVBQTJCLFNBQTNCO0FBQ0g7QUFDRCxRQUFJLFFBQVEsUUFBWixFQUFzQjtBQUNsQixXQUFHLFlBQUgsQ0FBZ0IsV0FBaEIsRUFBNkIsUUFBUSxRQUFyQztBQUNIO0FBQ0QsUUFBSSxRQUFRLFFBQVosRUFBc0I7QUFDbEIsV0FBRyxZQUFILENBQWdCLFdBQWhCLEVBQTZCLFFBQVEsUUFBckM7QUFDSDtBQUNELFVBQU0sWUFBTixDQUFtQixLQUFuQixFQUEwQixRQUFRLEVBQWxDO0FBQ0EsUUFBSSxRQUFRLFVBQVosRUFBd0I7QUFDcEIsY0FBTSxTQUFOLEdBQWtCLFFBQVEsVUFBMUI7QUFDSDs7QUFFRCxZQUFRLE1BQVIsQ0FBZSxXQUFmLENBQTJCLEVBQTNCO0FBQ0EsWUFBUSxNQUFSLENBQWUsV0FBZixDQUEyQixLQUEzQjtBQUNIOztrQkFFYyxXOzs7Ozs7O0FDaERmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBWkEsSUFBSSxPQUFPLFlBQVUsU0FBUyxRQUFULENBQWtCLElBQXZDO0FBQ0EsSUFBSSxtQkFBbUIsSUFBSSxLQUFKLENBQVUsa0JBQVYsRUFBOEIsRUFBQyxXQUFXLElBQVosRUFBa0IsY0FBYyxLQUFoQyxFQUE5QixDQUF2Qjs7QUFhQSwwQkFBVyxPQUFLLGVBQWhCLEVBQWlDLFVBQVUsV0FBVixFQUF1QjtBQUNwRCxRQUFJLFNBQVMsU0FBUyxjQUFULENBQXdCLHVCQUF4QixDQUFiOztBQUVBLFFBQUksUUFBTyxXQUFQLHlDQUFPLFdBQVAsT0FBdUIsUUFBM0IsRUFBcUM7QUFDakM7QUFDSDs7QUFFRCxXQUFPLElBQVAsQ0FBWSxXQUFaLEVBQXlCLE9BQXpCLENBQWlDLFVBQVUsR0FBVixFQUFlO0FBQzVDLG1DQUFZO0FBQ1Isa0JBQU0sVUFERTtBQUVSLG1CQUFPLEdBRkM7QUFHUix1QkFBVyxHQUhIO0FBSVIsdUJBQVcsTUFKSDtBQUtSLHNCQUFVLGFBTEY7QUFNUixnQkFBSSxHQU5JO0FBT1IscUJBQVUsUUFBUSxRQUFULEdBQXFCLFNBQXJCLEdBQWlDLEtBUGxDO0FBUVIsb0JBQVE7QUFSQSxTQUFaO0FBVUgsS0FYRDtBQVlILENBbkJEOztBQXFCQSwwQkFBVyxPQUFLLFdBQWhCLEVBQTZCLFVBQVUsV0FBVixFQUF1QjtBQUNoRCxRQUFJLFFBQU8sV0FBUCx5Q0FBTyxXQUFQLE9BQXVCLFFBQTNCLEVBQXFDO0FBQ2pDO0FBQ0g7O0FBRUQ7QUFDQSwyQkFBYyxHQUFkLENBQWtCLFdBQWxCOztBQUVBLHFDQUFrQixXQUFsQixFQUErQixTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBQS9COztBQUVBLFFBQUksb0JBQVcsR0FBWCxHQUFpQixNQUFyQixFQUE2QjtBQUN6QixZQUFJLGFBQWEsb0JBQVcsR0FBWCxHQUFpQixJQUFqQixHQUF3QixNQUF4QixDQUErQixVQUFVLElBQVYsRUFBZ0IsR0FBaEIsRUFBcUIsSUFBckIsRUFBMkI7QUFDdkUsbUJBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixNQUF1QixHQUE5QjtBQUNILFNBRmdCLENBQWpCO0FBR0Esa0NBQVcsVUFBWDtBQUNIO0FBQ0Q7QUFDQSxhQUFTLGFBQVQsQ0FBdUIsZ0JBQXZCO0FBQ0gsQ0FsQkQ7O0FBb0JBLGdDQUFpQixJQUFqQjtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDMURBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7OztBQUtBLFNBQVMsVUFBVCxDQUFxQixPQUFyQixFQUE4QixNQUE5QixFQUFzQztBQUNsQyxZQUFRLE9BQVIsQ0FBZ0IsVUFBVSxHQUFWLEVBQWU7QUFDM0IsWUFBSSxRQUFRLFNBQVMsYUFBVCxDQUF1QixJQUF2QixDQUFaO0FBQ0EsWUFBSSxVQUFVLFNBQVMsY0FBVCxDQUF3QixHQUF4QixDQUFkO0FBQ0EsY0FBTSxXQUFOLENBQWtCLE9BQWxCO0FBQ0EsY0FBTSxZQUFOLENBQW1CLFdBQW5CLEVBQWdDLElBQWhDO0FBQ0EsY0FBTSxFQUFOLEdBQVcsR0FBWDtBQUNBLGNBQU0sU0FBTixHQUFrQixLQUFsQjtBQUNBLGVBQU8sV0FBUCxDQUFtQixLQUFuQjtBQUNBLGNBQU0sZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBb0MsVUFBVSxDQUFWLEVBQWE7QUFDN0Msb0JBQVEsR0FBUixDQUFZLFdBQVo7QUFDQSxjQUFFLFlBQUYsQ0FBZSxPQUFmLENBQXVCLFlBQXZCLEVBQXFDLEVBQUUsTUFBRixDQUFTLEVBQTlDO0FBQ0EsY0FBRSxZQUFGLENBQWUsVUFBZixHQUE0QixNQUE1QjtBQUNBLGNBQUUsWUFBRixDQUFlLGFBQWYsR0FBK0IsTUFBL0I7QUFDSCxTQUxEO0FBTUgsS0FkRDtBQWVIOztBQUVEOzs7QUFHQSxTQUFTLHNCQUFULEdBQW1DO0FBQy9CLFFBQUksY0FBYyx5QkFBVSxRQUE1QjtBQUNBLFFBQUksY0FBYyx5QkFBVSxRQUE1QjtBQUNBLFFBQUksa0JBQWtCLEVBQXRCO0FBQ0EsUUFBSSxrQkFBa0IsRUFBdEI7O0FBRUEsS0FBQyxTQUFTLFlBQVQsQ0FBdUIsV0FBdkIsRUFBb0M7QUFDakMsZUFBTyxJQUFQLENBQVksV0FBWixFQUF5QixPQUF6QixDQUFpQyxVQUFVLEdBQVYsRUFBZTtBQUM1QyxnQkFBSSxZQUFZLEdBQVosRUFBaUIsSUFBakIsS0FBMEIsTUFBMUIsSUFBb0MsWUFBWSxHQUFaLEVBQWlCLElBQXpELEVBQStEO0FBQzNELG9CQUFJLDhCQUFlLFlBQVksR0FBWixFQUFpQixJQUFoQyxFQUFzQyxXQUF0QyxFQUFtRCxNQUF2RCxFQUErRDtBQUMzRCxvQ0FBZ0IsSUFBaEIsQ0FBcUIsOEJBQWUsWUFBWSxHQUFaLEVBQWlCLElBQWhDLENBQXJCO0FBQ0g7QUFDRCxvQkFBSSw4QkFBZSxZQUFZLEdBQVosRUFBaUIsSUFBaEMsRUFBc0MsV0FBdEMsRUFBbUQsTUFBdkQsRUFBK0Q7QUFDM0Qsb0NBQWdCLElBQWhCLENBQXFCLDhCQUFlLFlBQVksR0FBWixFQUFpQixJQUFoQyxDQUFyQjtBQUNIO0FBQ0Q7QUFDSCxhQVJELE1BUU87QUFDSCxvQkFBSSxDQUFDLFlBQVksR0FBWixFQUFpQixNQUF0QixFQUE4QjtBQUMxQjtBQUNILGlCQUZELE1BRU87QUFDSCwyQkFBTyxhQUFhLFlBQVksR0FBWixFQUFpQixNQUE5QixDQUFQO0FBQ0g7QUFDSjtBQUNKLFNBaEJEO0FBaUJILEtBbEJELEVBa0JHLHVCQUFjLEdBQWQsRUFsQkg7O0FBb0JBLGdDQUFhLGVBQWI7QUFDQSxnQ0FBYSxlQUFiOztBQUVBO0FBQ0g7O0FBRUQ7Ozs7QUFJQSxTQUFTLFVBQVQsQ0FBcUIsT0FBckIsRUFBOEI7QUFDMUIsZUFBVyxPQUFYLEVBQW9CLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUFwQjtBQUNBLGFBQVMsZ0JBQVQsQ0FBMEIsVUFBMUIsRUFBc0MsVUFBVSxDQUFWLEVBQWE7QUFDL0MsVUFBRSxjQUFGO0FBQ0gsS0FGRDtBQUdBLGFBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsVUFBVSxDQUFWLEVBQWE7QUFDaEQsVUFBRSxjQUFGO0FBQ0gsS0FGRDtBQUdBLGFBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsVUFBVSxDQUFWLEVBQWE7QUFDM0MsVUFBRSxjQUFGO0FBQ0EsWUFBSSxFQUFFLE1BQUYsQ0FBUyxTQUFULENBQW1CLFFBQW5CLENBQTRCLGNBQTVCLEtBQStDLEVBQUUsTUFBRixDQUFTLFVBQVQsQ0FBb0IsU0FBcEIsQ0FBOEIsUUFBOUIsQ0FBdUMsY0FBdkMsQ0FBbkQsRUFBMkc7QUFDdkcsZ0JBQUksT0FBTyxFQUFFLFlBQUYsQ0FBZSxPQUFmLENBQXVCLE1BQXZCLENBQVg7QUFDQSxnQkFBSSxLQUFNLEVBQUUsTUFBRixDQUFTLFNBQVQsQ0FBbUIsUUFBbkIsQ0FBNEIsY0FBNUIsQ0FBRCxHQUErQyxFQUFFLE1BQWpELEdBQTBELEVBQUUsTUFBRixDQUFTLFVBQTVFO0FBQ0EsZUFBRyxhQUFILENBQWlCLElBQWpCLEVBQXVCLFdBQXZCLENBQW1DLFNBQVMsY0FBVCxDQUF3QixJQUF4QixDQUFuQztBQUNBO0FBQ0g7QUFDSixLQVJEOztBQVVBO0FBQ0EsYUFBUyxjQUFULENBQXdCLGlCQUF4QixFQUEyQyxZQUEzQyxDQUF3RCxPQUF4RCxFQUFpRSxFQUFqRTtBQUNIOztrQkFFYyxVOzs7Ozs7OztBQzVGZjs7Ozs7QUFLQSxTQUFTLFlBQVQsQ0FBdUIsWUFBdkIsRUFBcUMsTUFBckMsRUFBNkM7QUFDekMsV0FBTyxTQUFQLEdBQW1CLEVBQW5COztBQUVBLGlCQUFhLE9BQWIsQ0FBcUIsVUFBVSxPQUFWLEVBQW1CO0FBQ3BDLFlBQUksWUFBWSxTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBaEI7QUFDQSxZQUFJLGFBQWEsU0FBUyxjQUFULENBQXdCLE9BQXhCLENBQWpCO0FBQ0Esa0JBQVUsV0FBVixDQUFzQixVQUF0QjtBQUNBLGVBQU8sV0FBUCxDQUFtQixTQUFuQjtBQUNILEtBTEQ7QUFNSDs7a0JBRWMsWTs7Ozs7Ozs7O0FDaEJmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBSUEsU0FBUyxVQUFULEdBQXNCO0FBQ2xCLGlCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsZ0JBQXZDLENBQXdELE9BQXhELEVBQWlFLFlBQVk7QUFDekUsb0JBQUksVUFBVSxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBZDs7QUFFQTtBQUNBLG1CQUFHLE9BQUgsQ0FBVyxJQUFYLENBQWdCLFNBQVMsZ0JBQVQsQ0FBMEIseUJBQTFCLENBQWhCLEVBQXNFLFVBQVUsR0FBVixFQUFlO0FBQ2pGLGdDQUFRLFdBQVIsQ0FBb0IsR0FBcEI7QUFDSCxpQkFGRDs7QUFJQTtBQUNBLDRDQUFhLEVBQWI7QUFDQSw0Q0FBYSxFQUFiOztBQUVBO0FBQ0Esd0NBQWUsWUFBZixDQUE0QixPQUE1QixFQUFxQyxnQkFBckM7O0FBRUE7QUFDQSwwREFBZ0MsQ0FBaEM7QUFDSCxTQWpCRDtBQWtCSDtrQkFDYyxVOzs7Ozs7Ozs7QUM1QmY7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7QUFHQSxTQUFTLG1CQUFULENBQThCLFdBQTlCLEVBQTJDO0FBQ3ZDLFFBQUksbUJBQW1CLFNBQVMsYUFBVCxDQUF1QiwyQkFBdkIsQ0FBdkI7QUFDQSxRQUFJLGFBQWMsaUJBQWlCLE9BQWpCLENBQXlCLElBQXpCLEtBQWtDLEtBQW5DLEdBQTRDLElBQTVDLEdBQW1ELEtBQXBFO0FBQ0EsUUFBSSxtQkFBbUIsRUFBdkI7QUFDQSxRQUFJLGNBQWMseUJBQVUsUUFBNUI7QUFDQSxRQUFJLGNBQWMseUJBQVUsUUFBNUI7QUFDQSxRQUFJLGtCQUFrQixHQUFHLEdBQUgsQ0FBTyxJQUFQLENBQVksU0FBUyxnQkFBVCxDQUEwQiwrQkFBMUIsQ0FBWixFQUF3RSxVQUFVLEVBQVYsRUFBYztBQUN4RyxlQUFPLEdBQUcsT0FBSCxDQUFXLElBQWxCO0FBQ0gsS0FGcUIsQ0FBdEI7QUFHQSxRQUFJLGVBQWUsU0FBUyxhQUFULENBQXVCLDRCQUF2QixDQUFuQjtBQUNBLFFBQUkseUJBQXlCLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUE3Qjs7QUFFQSwyQkFBdUIsU0FBdkIsR0FBbUMsRUFBbkM7O0FBRUEsS0FBQyxTQUFTLGtCQUFULENBQTZCLEdBQTdCLEVBQWtDO0FBQy9CLFlBQUksR0FBSjs7QUFFQSxhQUFLLEdBQUwsSUFBWSxHQUFaLEVBQWlCO0FBQ2IsZ0JBQUksSUFBSSxHQUFKLEVBQVMsSUFBVCxLQUFrQixNQUF0QixFQUE4QjtBQUMxQixvQkFBSSxDQUFDLDhCQUFlLFdBQWYsRUFBNEIsSUFBSSxHQUFKLEVBQVMsSUFBckMsRUFBMkMsTUFBNUMsSUFDRyxVQURILEtBRUksQ0FBQyxZQUFZLE1BQWIsSUFBdUIsOEJBQWUsV0FBZixFQUE0QixJQUFJLEdBQUosRUFBUyxJQUFyQyxFQUEyQyxNQUZ0RSxNQUdJLENBQUMsZ0JBQWdCLE1BQWpCLElBQTJCLGdCQUFnQixLQUFoQixDQUFzQixVQUFVLGNBQVYsRUFBMEI7QUFDM0UsMkJBQU8sUUFBUSxJQUFJLEdBQUosRUFBUyxJQUFULENBQWMsT0FBZCxDQUFzQixjQUF0QixNQUEwQyxDQUFDLENBQW5ELENBQVA7QUFDSCxpQkFGOEIsQ0FIL0IsTUFNSSxDQUFDLFlBQUQsSUFBaUIsSUFBSSxHQUFKLEVBQVMsSUFBVCxLQUFrQixhQUFhLE9BQWIsQ0FBcUIsSUFONUQsQ0FBSixFQU9FO0FBQ0UscUNBQWlCLElBQWpCLENBQXNCLDhCQUFlLElBQUksR0FBSixFQUFTLElBQXhCLENBQXRCO0FBQ0g7QUFDSixhQVhELE1BV087QUFDSCxvQkFBSSxJQUFJLEdBQUosRUFBUyxNQUFiLEVBQXFCO0FBQ2pCLHdCQUFJLElBQUksR0FBSixFQUFTLElBQVQsQ0FBYyxPQUFkLENBQXNCLGlCQUFpQixPQUFqQixDQUF5QixJQUEvQyxNQUF5RCxDQUE3RCxFQUFnRTtBQUM1RCxxQ0FBYSxJQUFiO0FBQ0gscUJBRkQsTUFFTyxJQUFJLGlCQUFpQixPQUFqQixDQUF5QixJQUF6QixLQUFrQyxLQUF0QyxFQUE2QztBQUNoRCxxQ0FBYSxLQUFiO0FBQ0g7QUFDRCx1Q0FBbUIsSUFBSSxHQUFKLEVBQVMsTUFBNUI7QUFDSDtBQUNKO0FBQ0o7QUFDSixLQTFCRCxFQTBCRyx1QkFBYyxHQUFkLEVBMUJIOztBQTRCQSxRQUFJLENBQUMsaUJBQWlCLE1BQXRCLEVBQThCO0FBQzFCLDJCQUFtQixDQUFDLHVCQUFELENBQW5CO0FBQ0EsK0JBQXVCLFNBQXZCLENBQWlDLEdBQWpDLENBQXFDLE9BQXJDO0FBQ0EsMkJBQVUsUUFBVixHQUFxQixJQUFyQjtBQUNILEtBSkQsTUFJUTtBQUNKLCtCQUF1QixTQUF2QixDQUFpQyxNQUFqQyxDQUF3QyxPQUF4QztBQUNBLDJCQUFVLFFBQVYsR0FBcUIsS0FBckI7QUFDSDtBQUNELGdDQUFhLGdCQUFiLEVBQStCLHNCQUEvQjtBQUNIOztrQkFFYyxtQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQGRlc2NyaXB0aW9uIHNlbmQgdGhlIFBPU1QgcmVxdWVzdFxyXG4gKiBAcGFyYW0gZGF0YU9iaiB7b2JqZWN0fSAtIGRhdGEgdG8gc2VuZFxyXG4gKiBAcGFyYW0gdXJsIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259XHJcbiAqL1xyXG5mdW5jdGlvbiBhamF4UG9zdCAoZGF0YU9iaiwgdXJsLCBjYWxsYmFjaykge1xyXG4gICAgd2luZG93LmZldGNoKHVybCwge1xyXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04J1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGFPYmopXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3JtIHN1Ym1pdCBzdGF0dXM6ICcsIHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Bvc3QgZXJyb3I6ICcsZXJyKTtcclxuICAgICAgICBhbGVydCgnU2VydmVyIG5vdCByZXNwb25kaW5nLCBjaGVjayBpZiBpdFxcJ3MgcnVubmluZycpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFqYXhQb3N0O1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIHJldHVybnMgdGhlIGVsZW1lbnQgdGhhdCAyIGFycmF5cyBoYXZlIGluIGNvbW1vblxyXG4gKiBAcGFyYW0ge2FycmF5fSBhcnIxXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGFycjJcclxuICogQHJldHVybnMge2FycmF5fVxyXG4gKi9cclxuZnVuY3Rpb24gYXJyYXlJbnRlcnNlY3QoYXJyMSwgYXJyMikge1xyXG4gICAgdmFyIGFycmF5cyA9IFthcnIxLCBhcnIyXTtcclxuXHJcbiAgICByZXR1cm4gYXJyYXlzLnNvcnQoKS5zaGlmdCgpLmZpbHRlcihmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiBhcnJheXMuZXZlcnkoZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXhPZih2KSAhPT0gLTE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXJyYXlJbnRlcnNlY3Q7XHJcbiIsIi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY3JlYXRlIGFuIGVsZW1lbnQgd2l0aCBhbiBvcHRpb25hbCBjbGFzcyBhbmQgdGV4dCBjb250ZW50XHJcbiAqIEBwYXJhbSB7YXR0ck9iakZvckNyZWF0ZUVsfSBhdHRyT2JqXHJcbiAqIEByZXR1cm5zIHtlbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlRWwoYXR0ck9iaikge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBhdHRyT2JqRm9yQ3JlYXRlRWxcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbFRhZyAtIFRoZSB0YWcgb2YgdGhlIGVsZW1lbnQgdG8gY3JlYXRlXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY2xhc3MgLSBDbGFzcyAob3IgY2xhc3NlcyBzcGFjZSBzZXBhcmF0ZWQpIHRvIGFzc2lnbiB0byB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50XHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ3xlbGVtZW50fSB0ZXh0IC0gc3RyaW5nIG9yIGVsZW1lbnQgdG8gc2V0IGFzIGNvbnRlbnQgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGF0dHJPYmouZWxUYWcpO1xyXG4gICAgaWYgKGF0dHJPYmoudGV4dCkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gKHR5cGVvZiBhdHRyT2JqLnRleHQgID09PSAnc3RyaW5nJykgPyBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhdHRyT2JqLnRleHQpIDogYXR0ck9iai50ZXh0O1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouY2xhc3MpIHtcclxuICAgICAgICBlbC5jbGFzc05hbWUgPSBhdHRyT2JqLmNsYXNzO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouaWQpIHtcclxuICAgICAgICBlbC5pZCA9IGF0dHJPYmouaWQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUVsO1xyXG4iLCJmdW5jdGlvbiBnZXRGZWF0dXJlTmFtZSAoZmVhdHVyZVBhdGgpIHtcclxuICAgIHJldHVybiBmZWF0dXJlUGF0aC5yZXBsYWNlKC9eLipmZWF0dXJlcy8sICcnKS5zdWJzdHIoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEZlYXR1cmVOYW1lO1xyXG4iLCJpbXBvcnQgZ2V0VGFncyBmcm9tICcuL2dldFRhZ3MnO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBnYXRoZXIgYWxsIHRoZSBkYXRhIGZyb20gdGhlIGZvcm1cclxuICogQHBhcmFtIGZvcm0ge2VsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRGb3JtRGF0YShmb3JtKSB7XHJcbiAgICB2YXIgZGF0YU9iaiA9IHtcclxuICAgICAgICBlbnZpcm9ubWVudHM6IFtdLFxyXG4gICAgICAgIGRpcjogJydcclxuICAgIH07XHJcbiAgICB2YXIgdGFnc0luY2x1ZGVkID0gZ2V0VGFncygpLmluY2x1ZGVkO1xyXG4gICAgdmFyIHRhZ3NFeGNsdWRlZCA9IGdldFRhZ3MoKS5leGNsdWRlZDtcclxuXHJcbiAgICBbXS5maWx0ZXIuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5saW5lLCAuZm9sZGVyQnRuJyksIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWwuY2hlY2tlZDtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC8vLmZpbHRlcihmdW5jdGlvbihlbCkgeyByZXR1cm4gZWwuZGlzYWJsZWQ7IH0pIC8vRGlzYWJsZWQgZWxlbWVudHMgZGllLlxyXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICAvL01hcCBlYWNoIGZpZWxkIGludG8gYSBuYW1lPXZhbHVlIHN0cmluZywgbWFrZSBzdXJlIHRvIHByb3Blcmx5IGVzY2FwZSFcclxuICAgICAgICAgICAgc3dpdGNoIChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdlbnZpcm9ubWVudCc6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5lbnZpcm9ubWVudHMucHVzaChlbC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkaXInOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZGlyID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2V4Y2x1ZGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YU9iai5leGNsdWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZXhjbHVkZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmV4Y2x1ZGUucHVzaChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZmlsZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICBpZiAodGFnc0luY2x1ZGVkLmxlbmd0aCkge1xyXG4gICAgICAgIGRhdGFPYmoudGFnc0luY2x1ZGVkID0gdGFnc0luY2x1ZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWdzRXhjbHVkZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgZGF0YU9iai50YWdzRXhjbHVkZWQgPSB0YWdzRXhjbHVkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGFPYmo7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEZvcm1EYXRhO1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIGV4ZWN1dGUgYSBHRVQgcmVxdWVzdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSZXF1ZXN0KHVybCwgY2FsbGJhY2spIHtcclxuICAgIHdpbmRvdy5mZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0J1xyXG4gICAgICAgIH0pXHJcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAudGhlbihyZXNwb25zZUpzb24gPT4gY2FsbGJhY2socmVzcG9uc2VKc29uKSlcclxuICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coJ0Vycm9yOiAnICsgZXJyKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFJlcXVlc3Q7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIEBkZXNjcmlwdGlvbiByZXR1cm5zIHRoZSBzaWJsaW5nIG9mIGFuIGVsZW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGRhdGEtdHlwZVxyXG4gKiBAcGFyYW0ge2VsZW1lbnR9IGVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbFR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgc2libGluZyB0byByZXR1cm5cclxuICogQHJldHVybnMge2VsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTaWJsaW5nQnlUeXBlU3RhcnRlciAoZWwsIGVsVHlwZSkge1xyXG4gICAgcmV0dXJuIGdldFNpYmxpbmdCeVR5cGUoZWwucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCwgZWxUeXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2libGluZ0J5VHlwZSAoZWwsIGVsVHlwZSkge1xyXG4gICAgaWYgKGVsLmRhdGFzZXQudHlwZSAmJiBlbC5kYXRhc2V0LnR5cGUgPT09IGVsVHlwZSkge1xyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCFlbC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldFNpYmxpbmdCeVR5cGUoZWwubmV4dEVsZW1lbnRTaWJsaW5nLCBlbFR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0U2libGluZ0J5VHlwZVN0YXJ0ZXI7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIEBkZXNjcmlwdGlvbiBnZXQgdGhlIHRhZ3MgdG8gaW5jbHVkZS9leGNsdWRlXHJcbiAqIEByZXR1cm5zIHt0YWdzfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VGFncygpIHtcclxuICAgIHZhciB0YWdzSW5jbHVkZWQgPSBbXS5tYXAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjdGFnc0luY2x1ZGVkIGxpJyksIGZ1bmN0aW9uICh0YWdFbCkge1xyXG4gICAgICAgIHJldHVybiB0YWdFbC5pZDtcclxuICAgIH0pO1xyXG4gICAgdmFyIHRhZ3NFeGNsdWRlZCA9IFtdLm1hcC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyN0YWdzRXhjbHVkZWQgbGknKSwgZnVuY3Rpb24gKHRhZ0VsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRhZ0VsLmlkO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB0YWdzXHJcbiAgICAgKiBAdHlwZSBPYmplY3RcclxuICAgICAqIEBwcm9wZXJ0eSB0YWdzSW5jbHVkZWQge2FycmF5fVxyXG4gICAgICogQHByb3BlcnR5IHRhZ3NFeGNsdWRlZCB7YXJyYXl9XHJcbiAgICAgKi9cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5jbHVkZWQ6IHRhZ3NJbmNsdWRlZCxcclxuICAgICAgICBleGNsdWRlZDogdGFnc0V4Y2x1ZGVkXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRUYWdzOyIsIi8qKlxyXG4gKiBAZGVzYyBNYW5hZ2VzIHRoZSBhcHAgZ2xvYmFsIHZhcmlhYmxlc1xyXG4gKi9cclxuXHJcbi8qVGhlIGZlYXR1cmVzIG9iamVjdCB0cmVlKi9cclxudmFyIHN0b3JlRmVhdHVyZXNPYmo7XHJcbmV4cG9ydCBjb25zdCBzdG9yZUZlYXR1cmVzID0ge1xyXG4gICAgZ2V0OiAoKSA9PiBzdG9yZUZlYXR1cmVzT2JqLFxyXG4gICAgc2V0OiAob2JqKSA9PiBzdG9yZUZlYXR1cmVzT2JqID0gb2JqXHJcbn07XHJcblxyXG4vKkFsbCB0aGUgdGFncyBmb3VuZCBpbiBmZWF0dXJlcyBmaWxlcyovXHJcbnZhciB0YWdzID0gW107XHJcbmV4cG9ydCBjb25zdCBnbG9iYWxUYWdzID0ge1xyXG4gICAgZ2V0OiAoKSA9PiB0YWdzLFxyXG4gICAgc2V0OiAoYXJyKSA9PiB0YWdzID0gYXJyXHJcbn07XHJcblxyXG4vKkRPTSBlbGVtZW50cyovXHJcbmV4cG9ydCBjb25zdCB0ZXN0UnVubmluZ01zZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0UnVubmluZ01zZycpO1xyXG5leHBvcnQgY29uc3Qgc3VibWl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdEJ0bicpO1xyXG5leHBvcnQgY29uc3QgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5jbHVkZWRGZWF0dXJlcycpO1xyXG5leHBvcnQgY29uc3QgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhjbHVkZWRkRmVhdHVyZXMnKTtcclxuIiwiaW1wb3J0IGdldFNpYmxpbmdCeVR5cGUgZnJvbSAnLi9nZXRTaWJsaW5nQnlUeXBlJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuXHJcbi8qKlxyXG4gKiBAZGVzYyBDaGVjay9VbmNoZWNrIHBhcmVudCBmb2xkZXIgaW5jbHVkZS9leGNsdWRlIGJ1dHRvbiB3aGVuIGEgZmlsZSBpcyBzZWxlY3RlZFxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlRmlsZUNsaWNrKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZmVhdHVyZUxpc3RSZWFkeScsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lPVwic2VsZWN0RmlsZVwiXScpLCBmdW5jdGlvbiAoYnRuKSB7XHJcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RmllbGRzZXQgPSBlLmN1cnJlbnRUYXJnZXQuY2xvc2VzdCgnZmllbGRzZXQnKTtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRGb2xkZXJCdG4gPSBwYXJlbnRGaWVsZHNldD8gZ2V0U2libGluZ0J5VHlwZShwYXJlbnRGaWVsZHNldC5maXJzdEVsZW1lbnRDaGlsZCwgJ2RpcicpIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRFeGNsdWRlRm9sZGVyQnRuID0gcGFyZW50RmllbGRzZXQ/IGdldFNpYmxpbmdCeVR5cGUocGFyZW50RmllbGRzZXQuZmlyc3RFbGVtZW50Q2hpbGQsICdleGNsdWRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRGb2xkZXJCdG4gJiYgIXBhcmVudEZvbGRlckJ0bi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Rm9sZGVyQnRuLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRFeGNsdWRlRm9sZGVyQnRuICYmIHBhcmVudEV4Y2x1ZGVGb2xkZXJCdG4uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEV4Y2x1ZGVGb2xkZXJCdG4uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZlYXR1cmVzVG9SdW4oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRmlsZUNsaWNrO1xyXG4iLCJpbXBvcnQgZ2V0U2libGluZ0J5VHlwZSBmcm9tICcuL2dldFNpYmxpbmdCeVR5cGUnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIGNoZWNrIGlmIG9uZSBvZiBlbCBwYXJlbnRzIGFyZSBlcXVhbCB0byBlbFRvTWF0Y2hcclxuICogQHBhcmFtIGVsIHtlbGVtZW50fVxyXG4gKiBAcGFyYW0gZWxUb01hdGNoIHtlbGVtZW50fVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGNoZWNrUGFyZW50c0FyZSAoZWwsIGVsVG9NYXRjaCkge1xyXG4gICAgaWYgKGVsID09PSBlbFRvTWF0Y2gpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmICghZWwucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrUGFyZW50c0FyZShlbC5wYXJlbnRFbGVtZW50LCBlbFRvTWF0Y2gpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGRlc2MgcmV0dXJucyB0aGUgc2libGluZyBvZiBhIGZvbGRlciBzZWxlY3QvZXhjbHVkZSBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUZvbGRlckNsaWNrICgpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZlYXR1cmVMaXN0UmVhZHknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb2xkZXJCdG4nKSwgZnVuY3Rpb24gKGJ0bikge1xyXG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUuY3VycmVudFRhcmdldC5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9VbmNoZWNrIHNpYmxpbmcgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNpYmxpbmdCdG4gPSBnZXRTaWJsaW5nQnlUeXBlKGUuY3VycmVudFRhcmdldCwgKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LnR5cGUgPT09ICdkaXInKT8gJ2V4Y2x1ZGUnIDogJ2RpcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nQnRuICYmIHNpYmxpbmdCdG4uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWJsaW5nQnRuLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vVW5jaGVjayBmaWxlIHNlbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbFR5cGUgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbFR5cGUgJiYgKGVsVHlwZSA9PT0gJ2RpcicgfHwgZWxUeXBlID09PSAnZXhjbHVkZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlQnRuQ2hlY2tlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR5cGU9XCJmaWxlXCJdOmNoZWNrZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVCdG5DaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlQnRuQ2hlY2tlZC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgbm8gZm9sZGVyIGlzIHNlbGVjdGVkIGNoZWNsIFwic2VsZWN0IGFsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZGlyXCJdOmNoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0QWxsJykuY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL1VuY2hlY2sgYW5kIGRpc2FibGUgZXhjbHVkZSBidXR0b24gdGhhdCBhcmUgbm90IGNoaWxkcmVuIG9mIHRoZSBzZWxlY3RlZCBmb2xkZXIgYW5kIGVuYWJsZSB0aG9zZSB0aGF0IGFyZSBjaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlID09PSAnZGlyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRGb2xkZXJPZlNlbGVjdGVkRm9sZGVyID0gZS5jdXJyZW50VGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZlYXR1cmVGaWxlcycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgW10ubWFwLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHlwZT1cImV4Y2x1ZGVcIl0nKSwgZnVuY3Rpb24gKGV4Y2x1ZGVCdG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4Y2x1ZGVCdG47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZXhjbHVkZUJ0bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhY2hlY2tQYXJlbnRzQXJlKGV4Y2x1ZGVCdG4sIGNoaWxkRm9sZGVyT2ZTZWxlY3RlZEZvbGRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGV4Y2x1ZGVCdG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlQnRuLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXBkYXRlRmVhdHVyZXNUb1J1bigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVGb2xkZXJDbGljazsiLCJpbXBvcnQgZ2V0Rm9ybURhdGEgZnJvbSAnLi9nZXRGb3JtRGF0YSc7XHJcbmltcG9ydCBhamF4UG9zdCBmcm9tICcuL2FqYXhQb3N0JztcclxuaW1wb3J0IHtzdWJtaXRCdG4sIHRlc3RSdW5uaW5nTXNnfSBmcm9tICcuL2dsb2JhbHMnXHJcblxyXG52YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlc0Zvcm0nKTtcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gaGFuZGxlIHRoZSBmb3JtIHN1Ym1pdCBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUZvcm1TdWJtaXQoaG9zdCkge1xyXG4gICAgLyogZ2xvYmFsIGlvICovXHJcbiAgICB2YXIgc29ja2V0ID0gaW8uY29ubmVjdChob3N0KTtcclxuICAgIFxyXG4gICAgc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhT2JqID0gZ2V0Rm9ybURhdGEoZm9ybSk7XHJcblxyXG4gICAgICAgIGFqYXhQb3N0KGRhdGFPYmosIGhvc3QrJy9sYXVuY2hzcHknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRlc3RSdW5uaW5nTXNnLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgc29ja2V0IGxpc3RlbmVyIHRvIGdldCBuaWdodHdhdGNoIGNvbnNvbGUgbWVzc2FnZXNcclxuICAgICAgICAvL1JlbW92ZSBwcmV2aW91cyBsaXN0ZW5lciBldmVudHVhbGx5IHByZXNlbnQgdG8gYXZvaWQgZHVwbGljYXRlc1xyXG4gICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ25pZ2h0d2F0Y2hDb25zb2xlTXNnJyk7XHJcbiAgICAgICAgc29ja2V0Lm9uKCduaWdodHdhdGNoQ29uc29sZU1zZycsIGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgICAgICB2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHJcbiAgICAgICAgICAgIHAuaW5uZXJIVE1MID0gbXNnO1xyXG4gICAgICAgICAgICB0ZXN0UnVubmluZ01zZy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICAgICAgdGVzdFJ1bm5pbmdNc2cuc2Nyb2xsVG9wID0gdGVzdFJ1bm5pbmdNc2cuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGhhbmRsZUZvcm1TdWJtaXQ7IiwiaW1wb3J0IGNyZWF0ZUVsIGZyb20gJy4vY3JlYXRlRWwnO1xyXG5pbXBvcnQgaW5zZXJ0SW5wdXQgZnJvbSAnLi9pbnNlcnRJbnB1dCc7XHJcbmltcG9ydCB7Z2xvYmFsVGFnc30gZnJvbSAnLi9nbG9iYWxzJztcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gcmVjdXJzaXZlbHkgcHJpbnQgZmVhdHVyZXMgZm9sZGVyIGNvbnRlbnRcclxuICogQHBhcmFtIHtmZWF0dXJlc0RhdGFPYmp9IG9ialxyXG4gKiBAcGFyYW0ge2VsZW1lbnR9IHBhcmVudCAtIFRoZSBwYXJlbnQgZWxlbWVudCBvZiB0aGUgbmV3IGxpbmVcclxuICovXHJcblxyXG4vKipcclxuICogQGRlc2MgY29udmVydHMgYSByZXNwb25zZSBvYmplY3QgaW50byBhbiBhcnJheVxyXG4gKiBAcGFyYW0gb2JqIHtvYmplY3R9XHJcbiAqIEByZXR1cm5zIHtBcnJheX1cclxuICovXHJcbmZ1bmN0aW9uIGNvbnZlcnRSZXNwb25zZU9ialRvQXJyYXkob2JqKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sb2JqW2tleV0se2xhYmVsOiBrZXl9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRMaW5lIChvYmosIHBhcmVudCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBmZWF0dXJlc0RhdGFPYmpcclxuICAgICAqIEBkZXNjcmlwdGlvbiBhIHJlY3Vyc2l2ZSBvYmplY3QgY29udGFpbmluZyBkYXRhIG9uIGZlYXR1cmVzXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSAtICdkaXInIG9yICdmaWxlJ1xyXG4gICAgICogQHByb3BlcnR5IHtwYXRofSBwYXRoIC0gdGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGZvbGRlciBvciBmaWxlXHJcbiAgICAgKiBAcHJvcGVydHkge2ZlYXR1cmVzRGF0YU9ian0gc3ViZGlyIC0gYSBmZWF0dXJlc0RhdGFPYmogb2YgdGhlIHN1YmZvbGRlciBldmVudHVhbGx5IHByZXNlbnQgaW4gYSBmb2xkZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7YXJyYXl9IHRhZ3MgLSB0aGUgdGFncyBldmVudHVhbGx5IHByZXNlbnQgaW4gYSBmZWF0dXJlXHJcbiAgICAgKi9cclxuXHJcbiAgICB2YXIgYXJyID0gY29udmVydFJlc3BvbnNlT2JqVG9BcnJheShvYmopLnNvcnQoZnVuY3Rpb24oYSxiKSB7XHJcbiAgICAgICAgcmV0dXJuIGEubGFiZWwgPiBiLmxhYmVsO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xyXG4gICAgICAgIGlmIChsaW5lLnR5cGUgPT09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAvL0NvbGxlY3QgdGFnc1xyXG4gICAgICAgICAgICBsZXQgbG9jYWxUYWdzID0gbGluZS50YWdzO1xyXG4gICAgICAgICAgICBsZXQgbG9jYWxUYWdzTGFiZWwgPSAnJztcclxuICAgICAgICAgICAgaWYgKGxvY2FsVGFncyAmJiBsb2NhbFRhZ3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUYWdzLnNldChnbG9iYWxUYWdzLmdldCgpLmNvbmNhdChsb2NhbFRhZ3MpKTtcclxuICAgICAgICAgICAgICAgIGxvY2FsVGFnc0xhYmVsID0gJyAoVEFHOiAnICsgbG9jYWxUYWdzLmpvaW4oJywgJykgKyAnKSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluc2VydElucHV0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2VsZWN0RmlsZScsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbGluZS5sYWJlbCxcclxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogbGluZS5sYWJlbCArIGxvY2FsVGFnc0xhYmVsLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGluZScsXHJcbiAgICAgICAgICAgICAgICBkYXRhUGF0aDogbGluZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdmaWxlJyxcclxuICAgICAgICAgICAgICAgIGlkOiBsaW5lLmxhYmVsLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBwYXJlbnRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy9kaXJlY3Rvcmllc1xyXG4gICAgICAgICAgICB2YXIgZmllbGRzZXQgPSBjcmVhdGVFbCh7XHJcbiAgICAgICAgICAgICAgICBlbFRhZzogJ2ZpZWxkc2V0JyxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiAnZm9sZGVyV3JhcHBlciAnICsgbGluZS5sYWJlbCArICdfd3JhcHBlcidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZUNvbnRhaW5lciA9IGNyZWF0ZUVsKHtcclxuICAgICAgICAgICAgICAgIGVsVGFnOiAnc3BhbicsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnJyxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiAnY2xvc2VUeHQnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgb3BlbkNvbnRhaW5lciA9IGNyZWF0ZUVsKHtcclxuICAgICAgICAgICAgICAgIGVsVGFnOiAnc3BhbicsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnJyxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiAnb3BlblR4dCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBkaXYgPSBjcmVhdGVFbCh7XHJcbiAgICAgICAgICAgICAgICBlbFRhZzogJ2RpdicsXHJcbiAgICAgICAgICAgICAgICBjbGFzczogJ2ZlYXR1cmVGaWxlcydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBvcGVuQ2xvc2VDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG4gICAgICAgICAgICBvcGVuQ2xvc2VDb250YWluZXIuYXBwZW5kQ2hpbGQob3BlbkNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG9wZW5DbG9zZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9zZUNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG9wZW5DbG9zZUNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsaW5lLmxhYmVsKSk7XHJcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChmaWVsZHNldCk7XHJcblxyXG4gICAgICAgICAgICBpbnNlcnRJbnB1dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGxpbmUubGFiZWwsXHJcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6IG9wZW5DbG9zZUNvbnRhaW5lcixcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nsb3NlQnRuJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsQ2xhc3M6ICdvcGVuQ2xvc2UnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVBhdGg6IGxpbmUucGF0aCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnY2xvc2UnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IGxpbmUubGFiZWwgKyAnX2Nsb3NlJyxcclxuICAgICAgICAgICAgICAgIGNoZWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGZpZWxkc2V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpbnNlcnRJbnB1dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NlbGVjdEZvbGRlcicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbGluZS5sYWJlbCxcclxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogJ3NlbGVjdCBmb2xkZXInLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZm9sZGVyQnRuJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsQ2xhc3M6ICdidXR0b24gc2VsZWN0Rm9sZGVyJyxcclxuICAgICAgICAgICAgICAgIGRhdGFQYXRoOiBsaW5lLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2RpcicsXHJcbiAgICAgICAgICAgICAgICBpZDogbGluZS5sYWJlbCArICdfZW50aXJlJyxcclxuICAgICAgICAgICAgICAgIHBhcmVudDogZmllbGRzZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGluc2VydElucHV0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbGluZS52YWx1ZSxcclxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogJ2V4Y2x1ZGUgZm9sZGVyJyxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ZvbGRlckJ0bicsXHJcbiAgICAgICAgICAgICAgICBsYWJlbENsYXNzOiAnYnV0dG9uIGV4Y2x1ZGVGb2xkZXInLFxyXG4gICAgICAgICAgICAgICAgZGF0YVBhdGg6IGxpbmUucGF0aCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnZXhjbHVkZScsXHJcbiAgICAgICAgICAgICAgICBpZDogbGluZS5sYWJlbCArICdfZW50aXJlRXhjbHVkZScsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGZpZWxkc2V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBmaWVsZHNldC5hcHBlbmRDaGlsZChkaXYpO1xyXG4gICAgICAgICAgICBpbnNlcnRMaW5lKGxpbmUuc3ViRGlyLCBkaXYpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBpbnNlcnRMaW5lO1xyXG4iLCJpbXBvcnQgY3JlYXRlRWwgZnJvbSAnLi9jcmVhdGVFbCc7XHJcblxyXG4vKipcclxuICogQGRlc2MgY3JlYXRlIGFuIGlucHV0IGZpZWxkIChjaGVja2JveCBvciByYWRpbyBidXR0bikgKyBpdHMgbGFiZWwgYW5kIGFwcGVuZCB0aGVtIHRvIHRoZSBwYXJlbnRcclxuICogQHBhcmFtIHthdHRyT2JqRm9ySW5wdXR9IGF0dHJPYmpcclxuICovXHJcbmZ1bmN0aW9uIGluc2VydElucHV0IChhdHRyT2JqKSB7XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IGF0dHJPYmpGb3JJbnB1dFxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGlkXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSAtIElucHV0IHR5cGUgKGVnLiAnY2hlY2tib3gnIG9yICdyYWRpbycpXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ3xlbGVtZW50fSBsYWJlbFRleHQgLSBzdHJpbmcgb3IgZWxlbWVudCB0byBzZXQgYXMgY29udGVudCBvZiB0aGUgaW5wdXQgbGFiZWxcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBsYWJlbENsYXNzXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNsYXNzXHJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGNoZWNrZWRcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkYXRhUGF0aCAtIFRoZSBwYXRoIHRvIGZvbGRlci9maWxlIHRvIGFzc2lnbiB0byBkYXRhLXBhdGhcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkYXRhVHlwZSAtIFRoZSB2YWx1ZSBvZiBkYXRhLXR5cGU6ICdlbnZpcm9ubWVudCcsICdmaWxlJywgJ2RpcidcclxuICAgICAqL1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgIHZhciBsYWJlbCA9IGNyZWF0ZUVsKHtcclxuICAgICAgICBlbFRhZzogJ2xhYmVsJyxcclxuICAgICAgICB0ZXh0OiBhdHRyT2JqLmxhYmVsVGV4dFxyXG4gICAgfSk7XHJcblxyXG4gICAgZWwuc2V0QXR0cmlidXRlKCdpZCcsIGF0dHJPYmouaWQpO1xyXG4gICAgZWwuc2V0QXR0cmlidXRlKCd0eXBlJywgYXR0ck9iai50eXBlKTtcclxuICAgIGlmIChhdHRyT2JqLm5hbWUpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBhdHRyT2JqLm5hbWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouY2xhc3NOYW1lLmxlbmd0aCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBhdHRyT2JqLmNsYXNzTmFtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXR0ck9iai5jaGVja2VkKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmRhdGFQYXRoKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnLCBhdHRyT2JqLmRhdGFQYXRoKTtcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmRhdGFUeXBlKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnLCBhdHRyT2JqLmRhdGFUeXBlKTtcclxuICAgIH1cclxuICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYXR0ck9iai5pZCk7XHJcbiAgICBpZiAoYXR0ck9iai5sYWJlbENsYXNzKSB7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gYXR0ck9iai5sYWJlbENsYXNzO1xyXG4gICAgfVxyXG5cclxuICAgIGF0dHJPYmoucGFyZW50LmFwcGVuZENoaWxkKGVsKTtcclxuICAgIGF0dHJPYmoucGFyZW50LmFwcGVuZENoaWxkKGxhYmVsKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0SW5wdXQ7XHJcbiIsInZhciBob3N0ID0gJ2h0dHA6Ly8nK2RvY3VtZW50LmxvY2F0aW9uLmhvc3Q7XHJcbnZhciBmZWF0dXJlTGlzdFJlYWR5ID0gbmV3IEV2ZW50KCdmZWF0dXJlTGlzdFJlYWR5Jywge1wiYnViYmxlc1wiOiB0cnVlLCBcImNhbmNlbGFibGVcIjogZmFsc2V9KTtcclxuXHJcbmltcG9ydCBnZXRSZXF1ZXN0IGZyb20gJy4vZ2V0UmVxdWVzdCc7XHJcbmltcG9ydCBpbnNlcnRJbnB1dCBmcm9tICcuL2luc2VydElucHV0JztcclxuaW1wb3J0IGluc2VydEZlYXR1cmVMaW5lIGZyb20gJy4vaW5zZXJ0RmVhdHVyZUxpbmUnO1xyXG5pbXBvcnQgbWFuYWdlVGFncyBmcm9tICcuL21hbmFnZVRhZ3MnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5pbXBvcnQgaGFuZGxlRm9ybVN1Ym1pdCBmcm9tICcuL2hhbmRsZUZvcm1TdWJtaXQnO1xyXG5pbXBvcnQgaGFuZGxlRm9sZGVyQ2xpY2sgZnJvbSAnLi9oYW5kbGVGb2xkZXJDbGljayc7XHJcbmltcG9ydCBoYW5kbGVGaWxlQ2xpY2sgZnJvbSAnLi9oYW5kbGVGaWxlQ2xpY2snO1xyXG5pbXBvcnQgcmVzZXRDbGljayBmcm9tICcuL3Jlc2V0Q2xpY2snO1xyXG5pbXBvcnQge3N0b3JlRmVhdHVyZXMsIGdsb2JhbFRhZ3N9IGZyb20gJy4vZ2xvYmFscyc7XHJcblxyXG5nZXRSZXF1ZXN0KGhvc3QrJy9lbnZpcm9ubWVudHMnLCBmdW5jdGlvbiAocmVzcG9uc2VPYmopIHtcclxuICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW52aXJvbm1lbnRzRm9ybUlubmVyJyk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiByZXNwb25zZU9iaiAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmtleXMocmVzcG9uc2VPYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGluc2VydElucHV0KHtcclxuICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgdmFsdWU6IGtleSxcclxuICAgICAgICAgICAgbGFiZWxUZXh0OiBrZXksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmUnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2Vudmlyb25tZW50JyxcclxuICAgICAgICAgICAgaWQ6IGtleSxcclxuICAgICAgICAgICAgY2hlY2tlZDogKGtleSA9PT0gJ2Nocm9tZScpID8gJ2NoZWNrZWQnIDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5nZXRSZXF1ZXN0KGhvc3QrJy9mZWF0dXJlcycsIGZ1bmN0aW9uIChyZXNwb25zZU9iaikge1xyXG4gICAgaWYgKHR5cGVvZiByZXNwb25zZU9iaiAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy9DYWNoZSByZXNwb25zZVxyXG4gICAgc3RvcmVGZWF0dXJlcy5zZXQocmVzcG9uc2VPYmopO1xyXG5cclxuICAgIGluc2VydEZlYXR1cmVMaW5lKHJlc3BvbnNlT2JqLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZXNGb3JtSW5uZXInKSk7XHJcblxyXG4gICAgaWYgKGdsb2JhbFRhZ3MuZ2V0KCkubGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IHVuaXF1ZVRhZ3MgPSBnbG9iYWxUYWdzLmdldCgpLnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIHBvcywgc2VsZikge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKGl0ZW0pID09PSBwb3M7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWFuYWdlVGFncyh1bmlxdWVUYWdzKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUZlYXR1cmVzVG9SdW4oKTtcclxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZmVhdHVyZUxpc3RSZWFkeSk7XHJcbn0pO1xyXG5cclxuaGFuZGxlRm9ybVN1Ym1pdChob3N0KTtcclxuaGFuZGxlRm9sZGVyQ2xpY2soKTtcclxuaGFuZGxlRmlsZUNsaWNrKCk7XHJcbnJlc2V0Q2xpY2soKTsiLCJpbXBvcnQgZ2V0VGFncyBmcm9tICcuL2dldFRhZ3MnO1xyXG5pbXBvcnQgYXJyYXlJbnRlcnNlY3QgZnJvbSAnLi9hcnJheUludGVyc2VjdCc7XHJcbmltcG9ydCBwcmludEZlYXR1cmUgZnJvbSAnLi9wcmludEZlYXR1cmUnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5pbXBvcnQgZ2V0RmVhdHVyZU5hbWUgZnJvbSAnLi9nZXRGZWF0dXJlTmFtZSc7XHJcbmltcG9ydCB7aW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIsIGV4Y2x1ZGVkRmVhdHVyZXNXcmFwcGVyLCBzdG9yZUZlYXR1cmVzfSBmcm9tICcuL2dsb2JhbHMnXHJcblxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjcmVhdGUgYSBsaSBlbGVtZW50IGZvciBldmVyeSB0YWcsIGluaXRpYWxpc2UgdGhlIGRyYWQmZHJvcCBiZWhhdmlvdXIgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIHBhcmVudFxyXG4gKiBAcGFyYW0ge2FycmF5fSB0YWdzQXJyXHJcbiAqIEBwYXJhbSB7ZWxlbWVudH0gcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnNlcnRUYWdzICh0YWdzQXJyLCBwYXJlbnQpIHtcclxuICAgIHRhZ3NBcnIuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgICAgdmFyIHRhZ0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICB2YXIgdGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRhZyk7XHJcbiAgICAgICAgdGFnRWwuYXBwZW5kQ2hpbGQodGFnVGV4dCk7XHJcbiAgICAgICAgdGFnRWwuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcclxuICAgICAgICB0YWdFbC5pZCA9IHRhZztcclxuICAgICAgICB0YWdFbC5jbGFzc05hbWUgPSAndGFnJztcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGFnRWwpO1xyXG4gICAgICAgIHRhZ0VsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkcmFnc3RhcnQnKTtcclxuICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgZS50YXJnZXQuaWQpO1xyXG4gICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIHVwZGF0ZSB0aGUgbGlzdHMgb2YgaW5jbHVkZWQvZXhjbHVkZWQgZmVhdHVyZSBhZnRlciBldmVyeSB0YWcgZHJvcFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWRGZWF0dXJlcyAoKSB7XHJcbiAgICB2YXIgaW5jbHVkZWRUYWcgPSBnZXRUYWdzKCkuaW5jbHVkZWQ7XHJcbiAgICB2YXIgZXhjbHVkZWRUYWcgPSBnZXRUYWdzKCkuZXhjbHVkZWQ7XHJcbiAgICB2YXIgaW5jbHVkZWRGZWF0dXJlID0gW107XHJcbiAgICB2YXIgZXhjbHVkZWRGZWF0dXJlID0gW107XHJcblxyXG4gICAgKGZ1bmN0aW9uIHBhcnNlRmVhdHVyZSAoZmVhdHVyZXNPYmopIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhmZWF0dXJlc09iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChmZWF0dXJlc09ialtrZXldLnR5cGUgPT09ICdmaWxlJyAmJiBmZWF0dXJlc09ialtrZXldLnRhZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcnJheUludGVyc2VjdChmZWF0dXJlc09ialtrZXldLnRhZ3MsIGluY2x1ZGVkVGFnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlZEZlYXR1cmUucHVzaChnZXRGZWF0dXJlTmFtZShmZWF0dXJlc09ialtrZXldLnBhdGgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhcnJheUludGVyc2VjdChmZWF0dXJlc09ialtrZXldLnRhZ3MsIGV4Y2x1ZGVkVGFnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBleGNsdWRlZEZlYXR1cmUucHVzaChnZXRGZWF0dXJlTmFtZShmZWF0dXJlc09ialtrZXldLnBhdGgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghZmVhdHVyZXNPYmpba2V5XS5zdWJEaXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZlYXR1cmUoZmVhdHVyZXNPYmpba2V5XS5zdWJEaXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KShzdG9yZUZlYXR1cmVzLmdldCgpKTtcclxuXHJcbiAgICBwcmludEZlYXR1cmUoaW5jbHVkZWRGZWF0dXJlLCBpbmNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcbiAgICBwcmludEZlYXR1cmUoZXhjbHVkZWRGZWF0dXJlLCBleGNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcblxyXG4gICAgdXBkYXRlRmVhdHVyZXNUb1J1bigpO1xyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIG1hbmFnZSB0aGUgdGFncyBzZWN0aW9uXHJcbiAqIEBwYXJhbSB7YXJyYXl9IHRhZ3NBcnIgLSBUaGUgYXJyYXkgb2YgdGhlIHRhZ3MgZm91bmQgaW4gdGhlIGZlYXR1cmVzIGZpbGVzXHJcbiAqL1xyXG5mdW5jdGlvbiBtYW5hZ2VUYWdzICh0YWdzQXJyKSB7XHJcbiAgICBpbnNlcnRUYWdzKHRhZ3NBcnIsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWdzTGlzdCcpKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGFnc0Ryb3BBcmVhJykgfHwgZS50YXJnZXQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ3NEcm9wQXJlYScpKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIik7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ3NEcm9wQXJlYScpKT8gZS50YXJnZXQgOiBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBlbC5xdWVyeVNlbGVjdG9yKCd1bCcpLmFwcGVuZENoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEpKTtcclxuICAgICAgICAgICAgdXBkYXRlU2VsZWN0ZWRGZWF0dXJlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vU2hvdyBjb250YWluZXJcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWdzRm9ybVdyYXBwZXInKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtYW5hZ2VUYWdzO1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIGNyZWF0ZSBhIGxpIGVsZW1lbnQgd2l0aCB0aGUgZmVhdHVyZSBuYW1lIGFzIGNvbnRlbnQgZm9yIGV2ZXJ5IGZlYXR1cmUgaW4gZmVhdHVyZUFycmF5IGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBwYXJlbnRcclxuICogQHBhcmFtIHthcnJheX0gZmVhdHVyZUFycmF5XHJcbiAqIEBwYXJhbSB7ZWxlbWVudH0gcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBwcmludEZlYXR1cmUgKGZlYXR1cmVBcnJheSwgcGFyZW50KSB7XHJcbiAgICBwYXJlbnQuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgZmVhdHVyZUFycmF5LmZvckVhY2goZnVuY3Rpb24gKGZlYXR1cmUpIHtcclxuICAgICAgICB2YXIgZmVhdHVyZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICB2YXIgZmVhdHVyZVR4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZlYXR1cmUpO1xyXG4gICAgICAgIGZlYXR1cmVFbC5hcHBlbmRDaGlsZChmZWF0dXJlVHh0KTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZmVhdHVyZUVsKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwcmludEZlYXR1cmU7XHJcbiIsImltcG9ydCBwcmludEZlYXR1cmUgZnJvbSAnLi9wcmludEZlYXR1cmUnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5pbXBvcnQge3Rlc3RSdW5uaW5nTXNnLCBpbmNsdWRlZEZlYXR1cmVzV3JhcHBlciwgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXJ9IGZyb20gJy4vZ2xvYmFscydcclxuXHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIEBkZXNjIE1hbmFnZSB0aGUgcmVzZXQgYnV0dG9uIGNsaWNrXHJcbiAqL1xyXG5mdW5jdGlvbiByZXNldENsaWNrKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2V0QnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRhZ0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFnc0xpc3QnKTtcclxuXHJcbiAgICAgICAgLy9Nb3ZlIGFsbCB0aGUgdGFncyBiYWNrIHRvIHRoZSB0YWcgbGlzdFxyXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFnc0Ryb3BBcmVhV3JhcHBlciBsaScpLCBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgICAgICAgIHRhZ0xpc3QuYXBwZW5kQ2hpbGQodGFnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9FbXB0eSBpbmNsdWRlZC9leGNsdWRlZCBmZWF0dXJlIGxpc3RzXHJcbiAgICAgICAgcHJpbnRGZWF0dXJlKFtdLCBpbmNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcbiAgICAgICAgcHJpbnRGZWF0dXJlKFtdLCBleGNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcblxyXG4gICAgICAgIC8vQ2xvc2UgdGVzdCBvdXRwdXRcclxuICAgICAgICB0ZXN0UnVubmluZ01zZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcblxyXG4gICAgICAgIC8vV2FpdCBmb3IgaHRtbCByZXNldCBhbmQgdGhlbiB1cGRhdGUgZmVhdHVyZXMgdG8gcnVuIGxpc3RcclxuICAgICAgICBzZXRUaW1lb3V0KHVwZGF0ZUZlYXR1cmVzVG9SdW4sIDApO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgcmVzZXRDbGljaztcclxuIiwiaW1wb3J0IGdldFRhZ3MgZnJvbSAnLi9nZXRUYWdzJztcclxuaW1wb3J0IGFycmF5SW50ZXJzZWN0IGZyb20gJy4vYXJyYXlJbnRlcnNlY3QnO1xyXG5pbXBvcnQgZ2V0RmVhdHVyZU5hbWUgZnJvbSAnLi9nZXRGZWF0dXJlTmFtZSc7XHJcbmltcG9ydCBwcmludEZlYXR1cmUgZnJvbSAnLi9wcmludEZlYXR1cmUnO1xyXG5pbXBvcnQge3N1Ym1pdEJ0biwgc3RvcmVGZWF0dXJlc30gZnJvbSAnLi9nbG9iYWxzJ1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIFVwZGF0ZSB0aGUgbGlzdCBvZiBmZWF0dXJlcyB0byBydW4gYWNjb3JkaW5nIHRvIHRoZSBzZWxlY3Rpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVGZWF0dXJlc1RvUnVuIChmZWF0dXJlc09iaikge1xyXG4gICAgdmFyIHNlbGVjdGVkRm9sZGVyRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZGlyXCJdOmNoZWNrZWQnKTtcclxuICAgIHZhciBjb2xsZWN0aW5nID0gKHNlbGVjdGVkRm9sZGVyRWwuZGF0YXNldC5wYXRoID09PSAnYWxsJykgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB2YXIgc2VsZWN0ZWRGZWF0dXJlcyA9IFtdO1xyXG4gICAgdmFyIGluY2x1ZGVkVGFnID0gZ2V0VGFncygpLmluY2x1ZGVkO1xyXG4gICAgdmFyIGV4Y2x1ZGVkVGFnID0gZ2V0VGFncygpLmV4Y2x1ZGVkO1xyXG4gICAgdmFyIGV4Y2x1ZGVkRm9sZGVycyA9IFtdLm1hcC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXR5cGU9XCJleGNsdWRlXCJdOmNoZWNrZWQnKSwgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsLmRhdGFzZXQucGF0aDtcclxuICAgIH0pO1xyXG4gICAgdmFyIHNlbGVjdGVkRmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR5cGU9XCJmaWxlXCJdOmNoZWNrZWQnKTtcclxuICAgIHZhciBmZWF0dXJlc1RvUnVuQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZlYXR1cmVzVG9SdW4nKTtcclxuXHJcbiAgICBmZWF0dXJlc1RvUnVuQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgIChmdW5jdGlvbiBwcm9jZXNzRmVhdHVyZUxpbmUgKG9iaikge1xyXG4gICAgICAgIHZhciBrZXk7XHJcblxyXG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAob2JqW2tleV0udHlwZSA9PT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFycmF5SW50ZXJzZWN0KGV4Y2x1ZGVkVGFnLCBvYmpba2V5XS50YWdzKS5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAmJiBjb2xsZWN0aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCFpbmNsdWRlZFRhZy5sZW5ndGggfHwgYXJyYXlJbnRlcnNlY3QoaW5jbHVkZWRUYWcsIG9ialtrZXldLnRhZ3MpLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAmJiAoIWV4Y2x1ZGVkRm9sZGVycy5sZW5ndGggfHwgZXhjbHVkZWRGb2xkZXJzLmV2ZXJ5KGZ1bmN0aW9uIChleGNsdWRlZEZvbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQm9vbGVhbihvYmpba2V5XS5wYXRoLmluZGV4T2YoZXhjbHVkZWRGb2xkZXIpID09PSAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCFzZWxlY3RlZEZpbGUgfHwgb2JqW2tleV0ucGF0aCA9PT0gc2VsZWN0ZWRGaWxlLmRhdGFzZXQucGF0aClcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZXMucHVzaChnZXRGZWF0dXJlTmFtZShvYmpba2V5XS5wYXRoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqW2tleV0uc3ViRGlyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtrZXldLnBhdGguaW5kZXhPZihzZWxlY3RlZEZvbGRlckVsLmRhdGFzZXQucGF0aCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZEZvbGRlckVsLmRhdGFzZXQucGF0aCAhPT0gJ2FsbCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRmVhdHVyZUxpbmUob2JqW2tleV0uc3ViRGlyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pKHN0b3JlRmVhdHVyZXMuZ2V0KCkpO1xyXG5cclxuICAgIGlmICghc2VsZWN0ZWRGZWF0dXJlcy5sZW5ndGgpIHtcclxuICAgICAgICBzZWxlY3RlZEZlYXR1cmVzID0gWydObyBmZWF0dXJlcyBzZWxlY3RlZCEnXTtcclxuICAgICAgICBmZWF0dXJlc1RvUnVuQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcbiAgICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH0gZWxzZSAge1xyXG4gICAgICAgIGZlYXR1cmVzVG9SdW5Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcclxuICAgICAgICBzdWJtaXRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHByaW50RmVhdHVyZShzZWxlY3RlZEZlYXR1cmVzLCBmZWF0dXJlc1RvUnVuQ29udGFpbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlRmVhdHVyZXNUb1J1bjsiXX0=
