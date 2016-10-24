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
                var parentFolderBtn = (0, _getSiblingByType2.default)(e.currentTarget.closest('fieldset').firstElementChild, 'dir');
                var parentExcludeFolderBtn = (0, _getSiblingByType2.default)(e.currentTarget.closest('fieldset').firstElementChild, 'exclude');

                if (!parentFolderBtn.checked) {
                    parentFolderBtn.checked = true;
                }

                if (parentExcludeFolderBtn.checked) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjXFxhamF4UG9zdC5qcyIsInNyY1xcYXJyYXlJbnRlcnNlY3QuanMiLCJzcmNcXGNyZWF0ZUVsLmpzIiwic3JjXFxnZXRGZWF0dXJlTmFtZS5qcyIsInNyY1xcZ2V0Rm9ybURhdGEuanMiLCJzcmNcXGdldFJlcXVlc3QuanMiLCJzcmNcXGdldFNpYmxpbmdCeVR5cGUuanMiLCJzcmNcXGdldFRhZ3MuanMiLCJzcmNcXGdsb2JhbHMuanMiLCJzcmNcXGhhbmRsZUZpbGVDbGljay5qcyIsInNyY1xcaGFuZGxlRm9sZGVyQ2xpY2suanMiLCJzcmNcXGhhbmRsZUZvcm1TdWJtaXQuanMiLCJzcmNcXGluc2VydEZlYXR1cmVMaW5lLmpzIiwic3JjXFxpbnNlcnRJbnB1dC5qcyIsInNyY1xcbWFpbi5qcyIsInNyY1xcbWFuYWdlVGFncy5qcyIsInNyY1xccHJpbnRGZWF0dXJlLmpzIiwic3JjXFxyZXNldENsaWNrLmpzIiwic3JjXFx1cGRhdGVGZWF0dXJlc1RvUnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQTs7Ozs7O0FBTUEsU0FBUyxRQUFULENBQW1CLE9BQW5CLEVBQTRCLEdBQTVCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ3ZDLFdBQU8sS0FBUCxDQUFhLEdBQWIsRUFBa0I7QUFDZCxnQkFBUSxNQURNO0FBRWQsaUJBQVMsSUFBSSxPQUFKLENBQVk7QUFDakIsNEJBQWdCO0FBREMsU0FBWixDQUZLO0FBS2QsY0FBTSxLQUFLLFNBQUwsQ0FBZSxPQUFmO0FBTFEsS0FBbEIsRUFNRyxJQU5ILENBTVEsVUFBVSxRQUFWLEVBQW9CO0FBQ3hCLGdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxTQUFTLFVBQTdDO0FBQ0E7QUFDSCxLQVRELEVBU0csS0FUSCxDQVNTLFVBQVUs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QkFBSSxJQUFJLEdBQUosRUFBUyxJQUFULENBQWMsT0FBZCxDQUFzQixpQkFBaUIsT0FBakIsQ0FBeUIsSUFBL0MsTUFBeUQsQ0FBN0QsRUFBZ0U7QUFDNUQscUNBQWEsSUFBYjtBQUNILHFCQUZELE1BRU8sSUFBSSxpQkFBaUIsT0FBakIsQ0FBeUIsSUFBekIsS0FBa0MsS0FBdEMsRUFBNkM7QUFDaEQscUNBQWEsS0FBYjtBQUNIO0FBQ0QsdUNBQW1CLElBQUksR0FBSixFQUFTLE1BQTVCO0FBQ0g7QUFDSjtBQUNKO0FBQ0osS0ExQkQsRUEwQkcsdUJBQWMsR0FBZCxFQTFCSDs7QUE0QkEsUUFBSSxDQUFDLGlCQUFpQixNQUF0QixFQUE4QjtBQUMxQiwyQkFBbUIsQ0FBQyx1QkFBRCxDQUFuQjtBQUNBLCtCQUF1QixTQUF2QixDQUFpQyxHQUFqQyxDQUFxQyxPQUFyQztBQUNBLDJCQUFVLFFBQVYsR0FBcUIsSUFBckI7QUFDSCxLQUpELE1BSVE7QUFDSiwrQkFBdUIsU0FBdkIsQ0FBaUMsTUFBakMsQ0FBd0MsT0FBeEM7QUFDQSwyQkFBVSxRQUFWLEdBQXFCLEtBQXJCO0FBQ0g7QUFDRCxnQ0FBYSxnQkFBYixFQUErQixzQkFBL0I7QUFDSDs7a0JBRWMsbUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBzZW5kIHRoZSBQT1NUIHJlcXVlc3RcclxuICogQHBhcmFtIGRhdGFPYmoge29iamVjdH0gLSBkYXRhIHRvIHNlbmRcclxuICogQHBhcmFtIHVybCB7c3RyaW5nfVxyXG4gKiBAcGFyYW0gY2FsbGJhY2sge2Z1bmN0aW9ufVxyXG4gKi9cclxuZnVuY3Rpb24gYWpheFBvc3QgKGRhdGFPYmosIHVybCwgY2FsbGJhY2spIHtcclxuICAgIHdpbmRvdy5mZXRjaCh1cmwsIHtcclxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCdcclxuICAgICAgICB9KSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhT2JqKVxyXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRm9ybSBzdWJtaXQgc3RhdHVzOiAnLCByZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdwb3N0IGVycm9yOiAnLGVycik7XHJcbiAgICAgICAgYWxlcnQoJ1NlcnZlciBub3QgcmVzcG9uZGluZywgY2hlY2sgaWYgaXRcXCdzIHJ1bm5pbmcnKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhamF4UG9zdDtcclxuIiwiLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiByZXR1cm5zIHRoZSBlbGVtZW50IHRoYXQgMiBhcnJheXMgaGF2ZSBpbiBjb21tb25cclxuICogQHBhcmFtIHthcnJheX0gYXJyMVxyXG4gKiBAcGFyYW0ge2FycmF5fSBhcnIyXHJcbiAqIEByZXR1cm5zIHthcnJheX1cclxuICovXHJcbmZ1bmN0aW9uIGFycmF5SW50ZXJzZWN0KGFycjEsIGFycjIpIHtcclxuICAgIHZhciBhcnJheXMgPSBbYXJyMSwgYXJyMl07XHJcblxyXG4gICAgcmV0dXJuIGFycmF5cy5zb3J0KCkuc2hpZnQoKS5maWx0ZXIoZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gYXJyYXlzLmV2ZXJ5KGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhLmluZGV4T2YodikgIT09IC0xO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFycmF5SW50ZXJzZWN0O1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIGNyZWF0ZSBhbiBlbGVtZW50IHdpdGggYW4gb3B0aW9uYWwgY2xhc3MgYW5kIHRleHQgY29udGVudFxyXG4gKiBAcGFyYW0ge2F0dHJPYmpGb3JDcmVhdGVFbH0gYXR0ck9ialxyXG4gKiBAcmV0dXJucyB7ZWxlbWVudH1cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUVsKGF0dHJPYmopIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGVkZWYge09iamVjdH0gYXR0ck9iakZvckNyZWF0ZUVsXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZWxUYWcgLSBUaGUgdGFnIG9mIHRoZSBlbGVtZW50IHRvIGNyZWF0ZVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNsYXNzIC0gQ2xhc3MgKG9yIGNsYXNzZXMgc3BhY2Ugc2VwYXJhdGVkKSB0byBhc3NpZ24gdG8gdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudFxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd8ZWxlbWVudH0gdGV4dCAtIHN0cmluZyBvciBlbGVtZW50IHRvIHNldCBhcyBjb250ZW50IG9mIHRoZSBuZXdseSBjcmVhdGVkIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhdHRyT2JqLmVsVGFnKTtcclxuICAgIGlmIChhdHRyT2JqLnRleHQpIHtcclxuICAgICAgICB2YXIgdGV4dCA9ICh0eXBlb2YgYXR0ck9iai50ZXh0ICA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXR0ck9iai50ZXh0KSA6IGF0dHJPYmoudGV4dDtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmNsYXNzKSB7XHJcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gYXR0ck9iai5jbGFzcztcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmlkKSB7XHJcbiAgICAgICAgZWwuaWQgPSBhdHRyT2JqLmlkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFbDtcclxuIiwiZnVuY3Rpb24gZ2V0RmVhdHVyZU5hbWUgKGZlYXR1cmVQYXRoKSB7XHJcbiAgICByZXR1cm4gZmVhdHVyZVBhdGgucmVwbGFjZSgvXi4qZmVhdHVyZXMvLCAnJykuc3Vic3RyKDEpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRGZWF0dXJlTmFtZTtcclxuIiwiaW1wb3J0IGdldFRhZ3MgZnJvbSAnLi9nZXRUYWdzJztcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gZ2F0aGVyIGFsbCB0aGUgZGF0YSBmcm9tIHRoZSBmb3JtXHJcbiAqIEBwYXJhbSBmb3JtIHtlbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Rm9ybURhdGEoZm9ybSkge1xyXG4gICAgdmFyIGRhdGFPYmogPSB7XHJcbiAgICAgICAgZW52aXJvbm1lbnRzOiBbXSxcclxuICAgICAgICBkaXI6ICcnXHJcbiAgICB9O1xyXG4gICAgdmFyIHRhZ3NJbmNsdWRlZCA9IGdldFRhZ3MoKS5pbmNsdWRlZDtcclxuICAgIHZhciB0YWdzRXhjbHVkZWQgPSBnZXRUYWdzKCkuZXhjbHVkZWQ7XHJcblxyXG4gICAgW10uZmlsdGVyLmNhbGwoZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcubGluZSwgLmZvbGRlckJ0bicpLCBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAvLy5maWx0ZXIoZnVuY3Rpb24oZWwpIHsgcmV0dXJuIGVsLmRpc2FibGVkOyB9KSAvL0Rpc2FibGVkIGVsZW1lbnRzIGRpZS5cclxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgLy9NYXAgZWFjaCBmaWVsZCBpbnRvIGEgbmFtZT12YWx1ZSBzdHJpbmcsIG1ha2Ugc3VyZSB0byBwcm9wZXJseSBlc2NhcGUhXHJcbiAgICAgICAgICAgIHN3aXRjaCAoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZW52aXJvbm1lbnQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZW52aXJvbm1lbnRzLnB1c2goZWwuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZGlyJzpcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmRpciA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdleGNsdWRlJzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGFPYmouZXhjbHVkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmV4Y2x1ZGUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5leGNsdWRlLnB1c2goZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdmaWxlJzpcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmZpbGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgaWYgKHRhZ3NJbmNsdWRlZC5sZW5ndGgpIHtcclxuICAgICAgICBkYXRhT2JqLnRhZ3NJbmNsdWRlZCA9IHRhZ3NJbmNsdWRlZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFnc0V4Y2x1ZGVkLmxlbmd0aCkge1xyXG4gICAgICAgIGRhdGFPYmoudGFnc0V4Y2x1ZGVkID0gdGFnc0V4Y2x1ZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhT2JqO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRGb3JtRGF0YTtcclxuIiwiLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBleGVjdXRlIGEgR0VUIHJlcXVlc3RcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmVxdWVzdCh1cmwsIGNhbGxiYWNrKSB7XHJcbiAgICB3aW5kb3cuZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCdcclxuICAgICAgICB9KVxyXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgLnRoZW4ocmVzcG9uc2VKc29uID0+IGNhbGxiYWNrKHJlc3BvbnNlSnNvbikpXHJcbiAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogJyArIGVycikpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRSZXF1ZXN0O1xyXG4iLCIvKipcclxuICogQG5hbWVzcGFjZVxyXG4gKiBAZGVzY3JpcHRpb24gcmV0dXJucyB0aGUgc2libGluZyBvZiBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBkYXRhLXR5cGVcclxuICogQHBhcmFtIHtlbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZWxUeXBlIC0gVGhlIHR5cGUgb2YgdGhlIHNpYmxpbmcgdG8gcmV0dXJuXHJcbiAqIEByZXR1cm5zIHtlbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U2libGluZ0J5VHlwZVN0YXJ0ZXIgKGVsLCBlbFR5cGUpIHtcclxuICAgIHJldHVybiBnZXRTaWJsaW5nQnlUeXBlKGVsLnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQsIGVsVHlwZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNpYmxpbmdCeVR5cGUgKGVsLCBlbFR5cGUpIHtcclxuICAgIGlmIChlbC5kYXRhc2V0LnR5cGUgJiYgZWwuZGF0YXNldC50eXBlID09PSBlbFR5cGUpIHtcclxuICAgICAgICByZXR1cm4gZWw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghZWwubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRTaWJsaW5nQnlUeXBlKGVsLm5leHRFbGVtZW50U2libGluZywgZWxUeXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFNpYmxpbmdCeVR5cGVTdGFydGVyO1xyXG4iLCIvKipcclxuICogQG5hbWVzcGFjZVxyXG4gKiBAZGVzY3JpcHRpb24gZ2V0IHRoZSB0YWdzIHRvIGluY2x1ZGUvZXhjbHVkZVxyXG4gKiBAcmV0dXJucyB7dGFnc31cclxuICovXHJcbmZ1bmN0aW9uIGdldFRhZ3MoKSB7XHJcbiAgICB2YXIgdGFnc0luY2x1ZGVkID0gW10ubWFwLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3RhZ3NJbmNsdWRlZCBsaScpLCBmdW5jdGlvbiAodGFnRWwpIHtcclxuICAgICAgICByZXR1cm4gdGFnRWwuaWQ7XHJcbiAgICB9KTtcclxuICAgIHZhciB0YWdzRXhjbHVkZWQgPSBbXS5tYXAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjdGFnc0V4Y2x1ZGVkIGxpJyksIGZ1bmN0aW9uICh0YWdFbCkge1xyXG4gICAgICAgIHJldHVybiB0YWdFbC5pZDtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGVkZWYgdGFnc1xyXG4gICAgICogQHR5cGUgT2JqZWN0XHJcbiAgICAgKiBAcHJvcGVydHkgdGFnc0luY2x1ZGVkIHthcnJheX1cclxuICAgICAqIEBwcm9wZXJ0eSB0YWdzRXhjbHVkZWQge2FycmF5fVxyXG4gICAgICovXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluY2x1ZGVkOiB0YWdzSW5jbHVkZWQsXHJcbiAgICAgICAgZXhjbHVkZWQ6IHRhZ3NFeGNsdWRlZFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0VGFnczsiLCIvKipcclxuICogQGRlc2MgTWFuYWdlcyB0aGUgYXBwIGdsb2JhbCB2YXJpYWJsZXNcclxuICovXHJcblxyXG4vKlRoZSBmZWF0dXJlcyBvYmplY3QgdHJlZSovXHJcbnZhciBzdG9yZUZlYXR1cmVzT2JqO1xyXG5leHBvcnQgY29uc3Qgc3RvcmVGZWF0dXJlcyA9IHtcclxuICAgIGdldDogKCkgPT4gc3RvcmVGZWF0dXJlc09iaixcclxuICAgIHNldDogKG9iaikgPT4gc3RvcmVGZWF0dXJlc09iaiA9IG9ialxyXG59O1xyXG5cclxuLypBbGwgdGhlIHRhZ3MgZm91bmQgaW4gZmVhdHVyZXMgZmlsZXMqL1xyXG52YXIgdGFncyA9IFtdO1xyXG5leHBvcnQgY29uc3QgZ2xvYmFsVGFncyA9IHtcclxuICAgIGdldDogKCkgPT4gdGFncyxcclxuICAgIHNldDogKGFycikgPT4gdGFncyA9IGFyclxyXG59O1xyXG5cclxuLypET00gZWxlbWVudHMqL1xyXG5leHBvcnQgY29uc3QgdGVzdFJ1bm5pbmdNc2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdFJ1bm5pbmdNc2cnKTtcclxuZXhwb3J0IGNvbnN0IHN1Ym1pdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXRCdG4nKTtcclxuZXhwb3J0IGNvbnN0IGluY2x1ZGVkRmVhdHVyZXNXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luY2x1ZGVkRmVhdHVyZXMnKTtcclxuZXhwb3J0IGNvbnN0IGV4Y2x1ZGVkRmVhdHVyZXNXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4Y2x1ZGVkZEZlYXR1cmVzJyk7XHJcbiIsImltcG9ydCBnZXRTaWJsaW5nQnlUeXBlIGZyb20gJy4vZ2V0U2libGluZ0J5VHlwZSc7XHJcbmltcG9ydCB1cGRhdGVGZWF0dXJlc1RvUnVuIGZyb20gJy4vdXBkYXRlRmVhdHVyZXNUb1J1bic7XHJcblxyXG4vKipcclxuICogQGRlc2MgQ2hlY2svVW5jaGVjayBwYXJlbnQgZm9sZGVyIGluY2x1ZGUvZXhjbHVkZSBidXR0b24gd2hlbiBhIGZpbGUgaXMgc2VsZWN0ZWRcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUZpbGVDbGljaygpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZlYXR1cmVMaXN0UmVhZHknLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbbmFtZT1cInNlbGVjdEZpbGVcIl0nKSwgZnVuY3Rpb24gKGJ0bikge1xyXG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudEZvbGRlckJ0biA9IGdldFNpYmxpbmdCeVR5cGUoZS5jdXJyZW50VGFyZ2V0LmNsb3Nlc3QoJ2ZpZWxkc2V0JykuZmlyc3RFbGVtZW50Q2hpbGQsICdkaXInKTtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRFeGNsdWRlRm9sZGVyQnRuID0gZ2V0U2libGluZ0J5VHlwZShlLmN1cnJlbnRUYXJnZXQuY2xvc2VzdCgnZmllbGRzZXQnKS5maXJzdEVsZW1lbnRDaGlsZCwgJ2V4Y2x1ZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudEZvbGRlckJ0bi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Rm9sZGVyQnRuLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRFeGNsdWRlRm9sZGVyQnRuLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRFeGNsdWRlRm9sZGVyQnRuLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGZWF0dXJlc1RvUnVuKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGhhbmRsZUZpbGVDbGljaztcclxuIiwiaW1wb3J0IGdldFNpYmxpbmdCeVR5cGUgZnJvbSAnLi9nZXRTaWJsaW5nQnlUeXBlJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuXHJcbi8qKlxyXG4gKiBAZGVzYyBjaGVjayBpZiBvbmUgb2YgZWwgcGFyZW50cyBhcmUgZXF1YWwgdG8gZWxUb01hdGNoXHJcbiAqIEBwYXJhbSBlbCB7ZWxlbWVudH1cclxuICogQHBhcmFtIGVsVG9NYXRjaCB7ZWxlbWVudH1cclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja1BhcmVudHNBcmUgKGVsLCBlbFRvTWF0Y2gpIHtcclxuICAgIGlmIChlbCA9PT0gZWxUb01hdGNoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoIWVsLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjaGVja1BhcmVudHNBcmUoZWwucGFyZW50RWxlbWVudCwgZWxUb01hdGNoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjIHJldHVybnMgdGhlIHNpYmxpbmcgb2YgYSBmb2xkZXIgc2VsZWN0L2V4Y2x1ZGUgYnV0dG9uXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVGb2xkZXJDbGljayAoKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmZWF0dXJlTGlzdFJlYWR5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZm9sZGVyQnRuJyksIGZ1bmN0aW9uIChidG4pIHtcclxuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVW5jaGVjayBzaWJsaW5nIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaWJsaW5nQnRuID0gZ2V0U2libGluZ0J5VHlwZShlLmN1cnJlbnRUYXJnZXQsIChlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlID09PSAnZGlyJyk/ICdleGNsdWRlJyA6ICdkaXInKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2libGluZ0J0biAmJiBzaWJsaW5nQnRuLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2libGluZ0J0bi5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL1VuY2hlY2sgZmlsZSBzZWxlY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxUeXBlID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxUeXBlICYmIChlbFR5cGUgPT09ICdkaXInIHx8IGVsVHlwZSA9PT0gJ2V4Y2x1ZGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZUJ0bkNoZWNrZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZmlsZVwiXTpjaGVja2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxlQnRuQ2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUJ0bkNoZWNrZWQuY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL0lmIG5vIGZvbGRlciBpcyBzZWxlY3RlZCBjaGVjbCBcInNlbGVjdCBhbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdHlwZT1cImRpclwiXTpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdEFsbCcpLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9VbmNoZWNrIGFuZCBkaXNhYmxlIGV4Y2x1ZGUgYnV0dG9uIHRoYXQgYXJlIG5vdCBjaGlsZHJlbiBvZiB0aGUgc2VsZWN0ZWQgZm9sZGVyIGFuZCBlbmFibGUgdGhvc2UgdGhhdCBhcmUgY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudHlwZSA9PT0gJ2RpcicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkRm9sZGVyT2ZTZWxlY3RlZEZvbGRlciA9IGUuY3VycmVudFRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZWF0dXJlRmlsZXMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtdLm1hcC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXR5cGU9XCJleGNsdWRlXCJdJyksIGZ1bmN0aW9uIChleGNsdWRlQnRuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleGNsdWRlQnRuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGV4Y2x1ZGVCdG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWNoZWNrUGFyZW50c0FyZShleGNsdWRlQnRuLCBjaGlsZEZvbGRlck9mU2VsZWN0ZWRGb2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChleGNsdWRlQnRuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUJ0bi5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZlYXR1cmVzVG9SdW4oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRm9sZGVyQ2xpY2s7IiwiaW1wb3J0IGdldEZvcm1EYXRhIGZyb20gJy4vZ2V0Rm9ybURhdGEnO1xyXG5pbXBvcnQgYWpheFBvc3QgZnJvbSAnLi9hamF4UG9zdCc7XHJcbmltcG9ydCB7c3VibWl0QnRuLCB0ZXN0UnVubmluZ01zZ30gZnJvbSAnLi9nbG9iYWxzJ1xyXG5cclxudmFyIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZXNGb3JtJyk7XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIGhhbmRsZSB0aGUgZm9ybSBzdWJtaXQgYnV0dG9uXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVGb3JtU3VibWl0KGhvc3QpIHtcclxuICAgIC8qIGdsb2JhbCBpbyAqL1xyXG4gICAgdmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoaG9zdCk7XHJcbiAgICBcclxuICAgIHN1Ym1pdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgZGF0YU9iaiA9IGdldEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuICAgICAgICBhamF4UG9zdChkYXRhT2JqLCBob3N0KycvbGF1bmNoc3B5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0ZXN0UnVubmluZ01zZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL1NldHVwIHNvY2tldCBsaXN0ZW5lciB0byBnZXQgbmlnaHR3YXRjaCBjb25zb2xlIG1lc3NhZ2VzXHJcbiAgICAgICAgLy9SZW1vdmUgcHJldmlvdXMgbGlzdGVuZXIgZXZlbnR1YWxseSBwcmVzZW50IHRvIGF2b2lkIGR1cGxpY2F0ZXNcclxuICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCduaWdodHdhdGNoQ29uc29sZU1zZycpO1xyXG4gICAgICAgIHNvY2tldC5vbignbmlnaHR3YXRjaENvbnNvbGVNc2cnLCBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICAgICAgdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcblxyXG4gICAgICAgICAgICBwLmlubmVySFRNTCA9IG1zZztcclxuICAgICAgICAgICAgdGVzdFJ1bm5pbmdNc2cuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgICAgIHRlc3RSdW5uaW5nTXNnLnNjcm9sbFRvcCA9IHRlc3RSdW5uaW5nTXNnLnNjcm9sbEhlaWdodDtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVGb3JtU3VibWl0OyIsImltcG9ydCBjcmVhdGVFbCBmcm9tICcuL2NyZWF0ZUVsJztcclxuaW1wb3J0IGluc2VydElucHV0IGZyb20gJy4vaW5zZXJ0SW5wdXQnO1xyXG5pbXBvcnQge2dsb2JhbFRhZ3N9IGZyb20gJy4vZ2xvYmFscyc7XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIHJlY3Vyc2l2ZWx5IHByaW50IGZlYXR1cmVzIGZvbGRlciBjb250ZW50XHJcbiAqIEBwYXJhbSB7ZmVhdHVyZXNEYXRhT2JqfSBvYmpcclxuICogQHBhcmFtIHtlbGVtZW50fSBwYXJlbnQgLSBUaGUgcGFyZW50IGVsZW1lbnQgb2YgdGhlIG5ldyBsaW5lXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIGNvbnZlcnRzIGEgcmVzcG9uc2Ugb2JqZWN0IGludG8gYW4gYXJyYXlcclxuICogQHBhcmFtIG9iaiB7b2JqZWN0fVxyXG4gKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0UmVzcG9uc2VPYmpUb0FycmF5KG9iaikge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LG9ialtrZXldLHtsYWJlbDoga2V5fSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0TGluZSAob2JqLCBwYXJlbnQpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGVkZWYge09iamVjdH0gZmVhdHVyZXNEYXRhT2JqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24gYSByZWN1cnNpdmUgb2JqZWN0IGNvbnRhaW5pbmcgZGF0YSBvbiBmZWF0dXJlc1xyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgLSAnZGlyJyBvciAnZmlsZSdcclxuICAgICAqIEBwcm9wZXJ0eSB7cGF0aH0gcGF0aCAtIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBmb2xkZXIgb3IgZmlsZVxyXG4gICAgICogQHByb3BlcnR5IHtmZWF0dXJlc0RhdGFPYmp9IHN1YmRpciAtIGEgZmVhdHVyZXNEYXRhT2JqIG9mIHRoZSBzdWJmb2xkZXIgZXZlbnR1YWxseSBwcmVzZW50IGluIGEgZm9sZGVyXHJcbiAgICAgKiBAcHJvcGVydHkge2FycmF5fSB0YWdzIC0gdGhlIHRhZ3MgZXZlbnR1YWxseSBwcmVzZW50IGluIGEgZmVhdHVyZVxyXG4gICAgICovXHJcblxyXG4gICAgdmFyIGFyciA9IGNvbnZlcnRSZXNwb25zZU9ialRvQXJyYXkob2JqKS5zb3J0KGZ1bmN0aW9uKGEsYikge1xyXG4gICAgICAgIHJldHVybiBhLmxhYmVsID4gYi5sYWJlbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcclxuICAgICAgICBpZiAobGluZS50eXBlID09PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgLy9Db2xsZWN0IHRhZ3NcclxuICAgICAgICAgICAgbGV0IGxvY2FsVGFncyA9IGxpbmUudGFncztcclxuICAgICAgICAgICAgbGV0IGxvY2FsVGFnc0xhYmVsID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbFRhZ3MgJiYgbG9jYWxUYWdzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsVGFncy5zZXQoZ2xvYmFsVGFncy5nZXQoKS5jb25jYXQobG9jYWxUYWdzKSk7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFRhZ3NMYWJlbCA9ICcgKFRBRzogJyArIGxvY2FsVGFncy5qb2luKCcsICcpICsgJyknO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnNlcnRJbnB1dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NlbGVjdEZpbGUnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGxpbmUubGFiZWwsXHJcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6IGxpbmUubGFiZWwgKyBsb2NhbFRhZ3NMYWJlbCxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmUnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVBhdGg6IGxpbmUucGF0aCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnZmlsZScsXHJcbiAgICAgICAgICAgICAgICBpZDogbGluZS5sYWJlbCxcclxuICAgICAgICAgICAgICAgIHBhcmVudDogcGFyZW50XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vZGlyZWN0b3JpZXNcclxuICAgICAgICAgICAgdmFyIGZpZWxkc2V0ID0gY3JlYXRlRWwoe1xyXG4gICAgICAgICAgICAgICAgZWxUYWc6ICdmaWVsZHNldCcsXHJcbiAgICAgICAgICAgICAgICBjbGFzczogJ2ZvbGRlcldyYXBwZXIgJyArIGxpbmUubGFiZWwgKyAnX3dyYXBwZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VDb250YWluZXIgPSBjcmVhdGVFbCh7XHJcbiAgICAgICAgICAgICAgICBlbFRhZzogJ3NwYW4nLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJycsXHJcbiAgICAgICAgICAgICAgICBjbGFzczogJ2Nsb3NlVHh0J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIG9wZW5Db250YWluZXIgPSBjcmVhdGVFbCh7XHJcbiAgICAgICAgICAgICAgICBlbFRhZzogJ3NwYW4nLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJycsXHJcbiAgICAgICAgICAgICAgICBjbGFzczogJ29wZW5UeHQnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgZGl2ID0gY3JlYXRlRWwoe1xyXG4gICAgICAgICAgICAgICAgZWxUYWc6ICdkaXYnLFxyXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdmZWF0dXJlRmlsZXMnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgb3BlbkNsb3NlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuICAgICAgICAgICAgb3BlbkNsb3NlQ29udGFpbmVyLmFwcGVuZENoaWxkKG9wZW5Db250YWluZXIpO1xyXG4gICAgICAgICAgICBvcGVuQ2xvc2VDb250YWluZXIuYXBwZW5kQ2hpbGQoY2xvc2VDb250YWluZXIpO1xyXG4gICAgICAgICAgICBvcGVuQ2xvc2VDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGluZS5sYWJlbCkpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZmllbGRzZXQpO1xyXG5cclxuICAgICAgICAgICAgaW5zZXJ0SW5wdXQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBsaW5lLmxhYmVsLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiBvcGVuQ2xvc2VDb250YWluZXIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjbG9zZUJ0bicsXHJcbiAgICAgICAgICAgICAgICBsYWJlbENsYXNzOiAnb3BlbkNsb3NlJyxcclxuICAgICAgICAgICAgICAgIGRhdGFQYXRoOiBsaW5lLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2Nsb3NlJyxcclxuICAgICAgICAgICAgICAgIGlkOiBsaW5lLmxhYmVsICsgJ19jbG9zZScsXHJcbiAgICAgICAgICAgICAgICBjaGVja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBmaWVsZHNldFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaW5zZXJ0SW5wdXQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzZWxlY3RGb2xkZXInLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGxpbmUubGFiZWwsXHJcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdzZWxlY3QgZm9sZGVyJyxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ZvbGRlckJ0bicsXHJcbiAgICAgICAgICAgICAgICBsYWJlbENsYXNzOiAnYnV0dG9uIHNlbGVjdEZvbGRlcicsXHJcbiAgICAgICAgICAgICAgICBkYXRhUGF0aDogbGluZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdkaXInLFxyXG4gICAgICAgICAgICAgICAgaWQ6IGxpbmUubGFiZWwgKyAnX2VudGlyZScsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGZpZWxkc2V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpbnNlcnRJbnB1dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGxpbmUudmFsdWUsXHJcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdleGNsdWRlIGZvbGRlcicsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdmb2xkZXJCdG4nLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxDbGFzczogJ2J1dHRvbiBleGNsdWRlRm9sZGVyJyxcclxuICAgICAgICAgICAgICAgIGRhdGFQYXRoOiBsaW5lLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2V4Y2x1ZGUnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IGxpbmUubGFiZWwgKyAnX2VudGlyZUV4Y2x1ZGUnLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBmaWVsZHNldFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZmllbGRzZXQuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICAgICAgaW5zZXJ0TGluZShsaW5lLnN1YkRpciwgZGl2KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0TGluZTtcclxuIiwiaW1wb3J0IGNyZWF0ZUVsIGZyb20gJy4vY3JlYXRlRWwnO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIGNyZWF0ZSBhbiBpbnB1dCBmaWVsZCAoY2hlY2tib3ggb3IgcmFkaW8gYnV0dG4pICsgaXRzIGxhYmVsIGFuZCBhcHBlbmQgdGhlbSB0byB0aGUgcGFyZW50XHJcbiAqIEBwYXJhbSB7YXR0ck9iakZvcklucHV0fSBhdHRyT2JqXHJcbiAqL1xyXG5mdW5jdGlvbiBpbnNlcnRJbnB1dCAoYXR0ck9iaikge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBhdHRyT2JqRm9ySW5wdXRcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZFxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgLSBJbnB1dCB0eXBlIChlZy4gJ2NoZWNrYm94JyBvciAncmFkaW8nKVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd8ZWxlbWVudH0gbGFiZWxUZXh0IC0gc3RyaW5nIG9yIGVsZW1lbnQgdG8gc2V0IGFzIGNvbnRlbnQgb2YgdGhlIGlucHV0IGxhYmVsXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbGFiZWxDbGFzc1xyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWVcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGFzc1xyXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBjaGVja2VkXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZGF0YVBhdGggLSBUaGUgcGF0aCB0byBmb2xkZXIvZmlsZSB0byBhc3NpZ24gdG8gZGF0YS1wYXRoXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZGF0YVR5cGUgLSBUaGUgdmFsdWUgb2YgZGF0YS10eXBlOiAnZW52aXJvbm1lbnQnLCAnZmlsZScsICdkaXInXHJcbiAgICAgKi9cclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICB2YXIgbGFiZWwgPSBjcmVhdGVFbCh7XHJcbiAgICAgICAgZWxUYWc6ICdsYWJlbCcsXHJcbiAgICAgICAgdGV4dDogYXR0ck9iai5sYWJlbFRleHRcclxuICAgIH0pO1xyXG5cclxuICAgIGVsLnNldEF0dHJpYnV0ZSgnaWQnLCBhdHRyT2JqLmlkKTtcclxuICAgIGVsLnNldEF0dHJpYnV0ZSgndHlwZScsIGF0dHJPYmoudHlwZSk7XHJcbiAgICBpZiAoYXR0ck9iai5uYW1lKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCduYW1lJywgYXR0ck9iai5uYW1lKTtcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmNsYXNzTmFtZS5sZW5ndGgpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYXR0ck9iai5jbGFzc05hbWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouY2hlY2tlZCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICdjaGVja2VkJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXR0ck9iai5kYXRhUGF0aCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJywgYXR0ck9iai5kYXRhUGF0aCk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXR0ck9iai5kYXRhVHlwZSkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgYXR0ck9iai5kYXRhVHlwZSk7XHJcbiAgICB9XHJcbiAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGF0dHJPYmouaWQpO1xyXG4gICAgaWYgKGF0dHJPYmoubGFiZWxDbGFzcykge1xyXG4gICAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IGF0dHJPYmoubGFiZWxDbGFzcztcclxuICAgIH1cclxuXHJcbiAgICBhdHRyT2JqLnBhcmVudC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICBhdHRyT2JqLnBhcmVudC5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluc2VydElucHV0O1xyXG4iLCJ2YXIgaG9zdCA9ICdodHRwOi8vJytkb2N1bWVudC5sb2NhdGlvbi5ob3N0O1xyXG52YXIgZmVhdHVyZUxpc3RSZWFkeSA9IG5ldyBFdmVudCgnZmVhdHVyZUxpc3RSZWFkeScsIHtcImJ1YmJsZXNcIjogdHJ1ZSwgXCJjYW5jZWxhYmxlXCI6IGZhbHNlfSk7XHJcblxyXG5pbXBvcnQgZ2V0UmVxdWVzdCBmcm9tICcuL2dldFJlcXVlc3QnO1xyXG5pbXBvcnQgaW5zZXJ0SW5wdXQgZnJvbSAnLi9pbnNlcnRJbnB1dCc7XHJcbmltcG9ydCBpbnNlcnRGZWF0dXJlTGluZSBmcm9tICcuL2luc2VydEZlYXR1cmVMaW5lJztcclxuaW1wb3J0IG1hbmFnZVRhZ3MgZnJvbSAnLi9tYW5hZ2VUYWdzJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuaW1wb3J0IGhhbmRsZUZvcm1TdWJtaXQgZnJvbSAnLi9oYW5kbGVGb3JtU3VibWl0JztcclxuaW1wb3J0IGhhbmRsZUZvbGRlckNsaWNrIGZyb20gJy4vaGFuZGxlRm9sZGVyQ2xpY2snO1xyXG5pbXBvcnQgaGFuZGxlRmlsZUNsaWNrIGZyb20gJy4vaGFuZGxlRmlsZUNsaWNrJztcclxuaW1wb3J0IHJlc2V0Q2xpY2sgZnJvbSAnLi9yZXNldENsaWNrJztcclxuaW1wb3J0IHtzdG9yZUZlYXR1cmVzLCBnbG9iYWxUYWdzfSBmcm9tICcuL2dsb2JhbHMnO1xyXG5cclxuZ2V0UmVxdWVzdChob3N0KycvZW52aXJvbm1lbnRzJywgZnVuY3Rpb24gKHJlc3BvbnNlT2JqKSB7XHJcbiAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vudmlyb25tZW50c0Zvcm1Jbm5lcicpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgcmVzcG9uc2VPYmogIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5rZXlzKHJlc3BvbnNlT2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICBpbnNlcnRJbnB1dCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgIHZhbHVlOiBrZXksXHJcbiAgICAgICAgICAgIGxhYmVsVGV4dDoga2V5LFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5lJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdlbnZpcm9ubWVudCcsXHJcbiAgICAgICAgICAgIGlkOiBrZXksXHJcbiAgICAgICAgICAgIGNoZWNrZWQ6IChrZXkgPT09ICdjaHJvbWUnKSA/ICdjaGVja2VkJyA6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuZ2V0UmVxdWVzdChob3N0KycvZmVhdHVyZXMnLCBmdW5jdGlvbiAocmVzcG9uc2VPYmopIHtcclxuICAgIGlmICh0eXBlb2YgcmVzcG9uc2VPYmogIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQ2FjaGUgcmVzcG9uc2VcclxuICAgIHN0b3JlRmVhdHVyZXMuc2V0KHJlc3BvbnNlT2JqKTtcclxuXHJcbiAgICBpbnNlcnRGZWF0dXJlTGluZShyZXNwb25zZU9iaiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVzRm9ybUlubmVyJykpO1xyXG5cclxuICAgIGlmIChnbG9iYWxUYWdzLmdldCgpLmxlbmd0aCkge1xyXG4gICAgICAgIGxldCB1bmlxdWVUYWdzID0gZ2xvYmFsVGFncy5nZXQoKS5zb3J0KCkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBwb3MsIHNlbGYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZihpdGVtKSA9PT0gcG9zO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1hbmFnZVRhZ3ModW5pcXVlVGFncyk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVGZWF0dXJlc1RvUnVuKCk7XHJcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGZlYXR1cmVMaXN0UmVhZHkpO1xyXG59KTtcclxuXHJcbmhhbmRsZUZvcm1TdWJtaXQoaG9zdCk7XHJcbmhhbmRsZUZvbGRlckNsaWNrKCk7XHJcbmhhbmRsZUZpbGVDbGljaygpO1xyXG5yZXNldENsaWNrKCk7IiwiaW1wb3J0IGdldFRhZ3MgZnJvbSAnLi9nZXRUYWdzJztcclxuaW1wb3J0IGFycmF5SW50ZXJzZWN0IGZyb20gJy4vYXJyYXlJbnRlcnNlY3QnO1xyXG5pbXBvcnQgcHJpbnRGZWF0dXJlIGZyb20gJy4vcHJpbnRGZWF0dXJlJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuaW1wb3J0IGdldEZlYXR1cmVOYW1lIGZyb20gJy4vZ2V0RmVhdHVyZU5hbWUnO1xyXG5pbXBvcnQge2luY2x1ZGVkRmVhdHVyZXNXcmFwcGVyLCBleGNsdWRlZEZlYXR1cmVzV3JhcHBlciwgc3RvcmVGZWF0dXJlc30gZnJvbSAnLi9nbG9iYWxzJ1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY3JlYXRlIGEgbGkgZWxlbWVudCBmb3IgZXZlcnkgdGFnLCBpbml0aWFsaXNlIHRoZSBkcmFkJmRyb3AgYmVoYXZpb3VyIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBwYXJlbnRcclxuICogQHBhcmFtIHthcnJheX0gdGFnc0FyclxyXG4gKiBAcGFyYW0ge2VsZW1lbnR9IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gaW5zZXJ0VGFncyAodGFnc0FyciwgcGFyZW50KSB7XHJcbiAgICB0YWdzQXJyLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICAgIHZhciB0YWdFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgdmFyIHRhZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0YWcpO1xyXG4gICAgICAgIHRhZ0VsLmFwcGVuZENoaWxkKHRhZ1RleHQpO1xyXG4gICAgICAgIHRhZ0VsLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSk7XHJcbiAgICAgICAgdGFnRWwuaWQgPSB0YWc7XHJcbiAgICAgICAgdGFnRWwuY2xhc3NOYW1lID0gJ3RhZyc7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRhZ0VsKTtcclxuICAgICAgICB0YWdFbC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZHJhZ3N0YXJ0Jyk7XHJcbiAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIGUudGFyZ2V0LmlkKTtcclxuICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiB1cGRhdGUgdGhlIGxpc3RzIG9mIGluY2x1ZGVkL2V4Y2x1ZGVkIGZlYXR1cmUgYWZ0ZXIgZXZlcnkgdGFnIGRyb3BcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkRmVhdHVyZXMgKCkge1xyXG4gICAgdmFyIGluY2x1ZGVkVGFnID0gZ2V0VGFncygpLmluY2x1ZGVkO1xyXG4gICAgdmFyIGV4Y2x1ZGVkVGFnID0gZ2V0VGFncygpLmV4Y2x1ZGVkO1xyXG4gICAgdmFyIGluY2x1ZGVkRmVhdHVyZSA9IFtdO1xyXG4gICAgdmFyIGV4Y2x1ZGVkRmVhdHVyZSA9IFtdO1xyXG5cclxuICAgIChmdW5jdGlvbiBwYXJzZUZlYXR1cmUgKGZlYXR1cmVzT2JqKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXNPYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoZmVhdHVyZXNPYmpba2V5XS50eXBlID09PSAnZmlsZScgJiYgZmVhdHVyZXNPYmpba2V5XS50YWdzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlJbnRlcnNlY3QoZmVhdHVyZXNPYmpba2V5XS50YWdzLCBpbmNsdWRlZFRhZykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWRGZWF0dXJlLnB1c2goZ2V0RmVhdHVyZU5hbWUoZmVhdHVyZXNPYmpba2V5XS5wYXRoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlJbnRlcnNlY3QoZmVhdHVyZXNPYmpba2V5XS50YWdzLCBleGNsdWRlZFRhZykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRGZWF0dXJlLnB1c2goZ2V0RmVhdHVyZU5hbWUoZmVhdHVyZXNPYmpba2V5XS5wYXRoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZlYXR1cmVzT2JqW2tleV0uc3ViRGlyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGZWF0dXJlKGZlYXR1cmVzT2JqW2tleV0uc3ViRGlyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSkoc3RvcmVGZWF0dXJlcy5nZXQoKSk7XHJcblxyXG4gICAgcHJpbnRGZWF0dXJlKGluY2x1ZGVkRmVhdHVyZSwgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG4gICAgcHJpbnRGZWF0dXJlKGV4Y2x1ZGVkRmVhdHVyZSwgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG5cclxuICAgIHVwZGF0ZUZlYXR1cmVzVG9SdW4oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBtYW5hZ2UgdGhlIHRhZ3Mgc2VjdGlvblxyXG4gKiBAcGFyYW0ge2FycmF5fSB0YWdzQXJyIC0gVGhlIGFycmF5IG9mIHRoZSB0YWdzIGZvdW5kIGluIHRoZSBmZWF0dXJlcyBmaWxlc1xyXG4gKi9cclxuZnVuY3Rpb24gbWFuYWdlVGFncyAodGFnc0Fycikge1xyXG4gICAgaW5zZXJ0VGFncyh0YWdzQXJyLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFnc0xpc3QnKSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ3NEcm9wQXJlYScpIHx8IGUudGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdzRHJvcEFyZWEnKSkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWdzRHJvcEFyZWEnKSk/IGUudGFyZ2V0IDogZS50YXJnZXQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgZWwucXVlcnlTZWxlY3RvcigndWwnKS5hcHBlbmRDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKSk7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNlbGVjdGVkRmVhdHVyZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL1Nob3cgY29udGFpbmVyXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFnc0Zvcm1XcmFwcGVyJykuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWFuYWdlVGFncztcclxuIiwiLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjcmVhdGUgYSBsaSBlbGVtZW50IHdpdGggdGhlIGZlYXR1cmUgbmFtZSBhcyBjb250ZW50IGZvciBldmVyeSBmZWF0dXJlIGluIGZlYXR1cmVBcnJheSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgcGFyZW50XHJcbiAqIEBwYXJhbSB7YXJyYXl9IGZlYXR1cmVBcnJheVxyXG4gKiBAcGFyYW0ge2VsZW1lbnR9IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gcHJpbnRGZWF0dXJlIChmZWF0dXJlQXJyYXksIHBhcmVudCkge1xyXG4gICAgcGFyZW50LmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgIGZlYXR1cmVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChmZWF0dXJlKSB7XHJcbiAgICAgICAgdmFyIGZlYXR1cmVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgdmFyIGZlYXR1cmVUeHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmZWF0dXJlKTtcclxuICAgICAgICBmZWF0dXJlRWwuYXBwZW5kQ2hpbGQoZmVhdHVyZVR4dCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGZlYXR1cmVFbCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJpbnRGZWF0dXJlO1xyXG4iLCJpbXBvcnQgcHJpbnRGZWF0dXJlIGZyb20gJy4vcHJpbnRGZWF0dXJlJztcclxuaW1wb3J0IHVwZGF0ZUZlYXR1cmVzVG9SdW4gZnJvbSAnLi91cGRhdGVGZWF0dXJlc1RvUnVuJztcclxuaW1wb3J0IHt0ZXN0UnVubmluZ01zZywgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIsIGV4Y2x1ZGVkRmVhdHVyZXNXcmFwcGVyfSBmcm9tICcuL2dsb2JhbHMnXHJcblxyXG4vKipcclxuICogQG5hbWVzcGFjZVxyXG4gKiBAZGVzYyBNYW5hZ2UgdGhlIHJlc2V0IGJ1dHRvbiBjbGlja1xyXG4gKi9cclxuZnVuY3Rpb24gcmVzZXRDbGljaygpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldEJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0YWdMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhZ3NMaXN0Jyk7XHJcblxyXG4gICAgICAgIC8vTW92ZSBhbGwgdGhlIHRhZ3MgYmFjayB0byB0aGUgdGFnIGxpc3RcclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhZ3NEcm9wQXJlYVdyYXBwZXIgbGknKSwgZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICAgICAgICB0YWdMaXN0LmFwcGVuZENoaWxkKHRhZyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vRW1wdHkgaW5jbHVkZWQvZXhjbHVkZWQgZmVhdHVyZSBsaXN0c1xyXG4gICAgICAgIHByaW50RmVhdHVyZShbXSwgaW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG4gICAgICAgIHByaW50RmVhdHVyZShbXSwgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXIpO1xyXG5cclxuICAgICAgICAvL0Nsb3NlIHRlc3Qgb3V0cHV0XHJcbiAgICAgICAgdGVzdFJ1bm5pbmdNc2cuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lOycpO1xyXG5cclxuICAgICAgICAvL1dhaXQgZm9yIGh0bWwgcmVzZXQgYW5kIHRoZW4gdXBkYXRlIGZlYXR1cmVzIHRvIHJ1biBsaXN0XHJcbiAgICAgICAgc2V0VGltZW91dCh1cGRhdGVGZWF0dXJlc1RvUnVuLCAwKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHJlc2V0Q2xpY2s7XHJcbiIsImltcG9ydCBnZXRUYWdzIGZyb20gJy4vZ2V0VGFncyc7XHJcbmltcG9ydCBhcnJheUludGVyc2VjdCBmcm9tICcuL2FycmF5SW50ZXJzZWN0JztcclxuaW1wb3J0IGdldEZlYXR1cmVOYW1lIGZyb20gJy4vZ2V0RmVhdHVyZU5hbWUnO1xyXG5pbXBvcnQgcHJpbnRGZWF0dXJlIGZyb20gJy4vcHJpbnRGZWF0dXJlJztcclxuaW1wb3J0IHtzdWJtaXRCdG4sIHN0b3JlRmVhdHVyZXN9IGZyb20gJy4vZ2xvYmFscydcclxuXHJcbi8qKlxyXG4gKiBAZGVzYyBVcGRhdGUgdGhlIGxpc3Qgb2YgZmVhdHVyZXMgdG8gcnVuIGFjY29yZGluZyB0byB0aGUgc2VsZWN0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlRmVhdHVyZXNUb1J1biAoZmVhdHVyZXNPYmopIHtcclxuICAgIHZhciBzZWxlY3RlZEZvbGRlckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdHlwZT1cImRpclwiXTpjaGVja2VkJyk7XHJcbiAgICB2YXIgY29sbGVjdGluZyA9IChzZWxlY3RlZEZvbGRlckVsLmRhdGFzZXQucGF0aCA9PT0gJ2FsbCcpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgdmFyIHNlbGVjdGVkRmVhdHVyZXMgPSBbXTtcclxuICAgIHZhciBpbmNsdWRlZFRhZyA9IGdldFRhZ3MoKS5pbmNsdWRlZDtcclxuICAgIHZhciBleGNsdWRlZFRhZyA9IGdldFRhZ3MoKS5leGNsdWRlZDtcclxuICAgIHZhciBleGNsdWRlZEZvbGRlcnMgPSBbXS5tYXAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10eXBlPVwiZXhjbHVkZVwiXTpjaGVja2VkJyksIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHJldHVybiBlbC5kYXRhc2V0LnBhdGg7XHJcbiAgICB9KTtcclxuICAgIHZhciBzZWxlY3RlZEZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZmlsZVwiXTpjaGVja2VkJyk7XHJcbiAgICB2YXIgZmVhdHVyZXNUb1J1bkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmZWF0dXJlc1RvUnVuJyk7XHJcblxyXG4gICAgZmVhdHVyZXNUb1J1bkNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAoZnVuY3Rpb24gcHJvY2Vzc0ZlYXR1cmVMaW5lIChvYmopIHtcclxuICAgICAgICB2YXIga2V5O1xyXG5cclxuICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9ialtrZXldLnR5cGUgPT09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhcnJheUludGVyc2VjdChleGNsdWRlZFRhZywgb2JqW2tleV0udGFncykubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgY29sbGVjdGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICYmICghaW5jbHVkZWRUYWcubGVuZ3RoIHx8IGFycmF5SW50ZXJzZWN0KGluY2x1ZGVkVGFnLCBvYmpba2V5XS50YWdzKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCFleGNsdWRlZEZvbGRlcnMubGVuZ3RoIHx8IGV4Y2x1ZGVkRm9sZGVycy5ldmVyeShmdW5jdGlvbiAoZXhjbHVkZWRGb2xkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJvb2xlYW4ob2JqW2tleV0ucGF0aC5pbmRleE9mKGV4Y2x1ZGVkRm9sZGVyKSA9PT0gLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICghc2VsZWN0ZWRGaWxlIHx8IG9ialtrZXldLnBhdGggPT09IHNlbGVjdGVkRmlsZS5kYXRhc2V0LnBhdGgpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVzLnB1c2goZ2V0RmVhdHVyZU5hbWUob2JqW2tleV0ucGF0aCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9ialtrZXldLnN1YkRpcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpba2V5XS5wYXRoLmluZGV4T2Yoc2VsZWN0ZWRGb2xkZXJFbC5kYXRhc2V0LnBhdGgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRGb2xkZXJFbC5kYXRhc2V0LnBhdGggIT09ICdhbGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0ZlYXR1cmVMaW5lKG9ialtrZXldLnN1YkRpcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KShzdG9yZUZlYXR1cmVzLmdldCgpKTtcclxuXHJcbiAgICBpZiAoIXNlbGVjdGVkRmVhdHVyZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlcyA9IFsnTm8gZmVhdHVyZXMgc2VsZWN0ZWQhJ107XHJcbiAgICAgICAgZmVhdHVyZXNUb1J1bkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG4gICAgICAgIHN1Ym1pdEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9IGVsc2UgIHtcclxuICAgICAgICBmZWF0dXJlc1RvUnVuQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XHJcbiAgICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwcmludEZlYXR1cmUoc2VsZWN0ZWRGZWF0dXJlcywgZmVhdHVyZXNUb1J1bkNvbnRhaW5lcik7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZUZlYXR1cmVzVG9SdW47Il19
