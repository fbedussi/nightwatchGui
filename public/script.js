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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjXFxhamF4UG9zdC5qcyIsInNyY1xcYXJyYXlJbnRlcnNlY3QuanMiLCJzcmNcXGNyZWF0ZUVsLmpzIiwic3JjXFxnZXRGZWF0dXJlTmFtZS5qcyIsInNyY1xcZ2V0Rm9ybURhdGEuanMiLCJzcmNcXGdldFJlcXVlc3QuanMiLCJzcmNcXGdldFNpYmxpbmdCeVR5cGUuanMiLCJzcmNcXGdldFRhZ3MuanMiLCJzcmNcXGdsb2JhbHMuanMiLCJzcmNcXGhhbmRsZUZpbGVDbGljay5qcyIsInNyY1xcaGFuZGxlRm9sZGVyQ2xpY2suanMiLCJzcmNcXGhhbmRsZUZvcm1TdWJtaXQuanMiLCJzcmNcXGluc2VydEZlYXR1cmVMaW5lLmpzIiwic3JjXFxpbnNlcnRJbnB1dC5qcyIsInNyY1xcbWFpbi5qcyIsInNyY1xcbWFuYWdlVGFncy5qcyIsInNyY1xccHJpbnRGZWF0dXJlLmpzIiwic3JjXFxyZXNldENsaWNrLmpzIiwic3JjXFx1cGRhdGVGZWF0dXJlc1RvUnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQTs7Ozs7O0FBTUEsU0FBUyxRQUFULENBQW1CLE9BQW5CLEVBQTRCLEdBQTVCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ3ZDLFdBQU8sS0FBUCxDQUFhLEdBQWIsRUFBa0I7QUFDZCxnQkFBUSxNQURNO0FBRWQsaUJBQVMsSUFBSSxPQUFKLENBQVk7QUFDakIsNEJBQWdCO0FBREMsU0FBWixDQUZLO0FBS2QsY0FBTSxLQUFLLFNBQUwsQ0FBZSxPQUFmO0FBTFEsS0FBbEIsRUFNRyxJQU5ILENBTVEsVUFBVSxRQUFWLEVBQW9CO0FBQ3hCLGdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxTQUFTLFVBQTdDO0FBQ0E7QUFDSCxLQVRELEVBU0csS0FUSCxDQVNTLFVBQVUs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aUIsT0FBakIsQ0FBeUIsSUFBekIsS0FBa0MsS0FBdEMsRUFBNkM7QUFDaEQscUNBQWEsS0FBYjtBQUNIO0FBQ0QsdUNBQW1CLElBQUksR0FBSixFQUFTLE1BQTVCO0FBQ0g7QUFDSjtBQUNKO0FBQ0osS0ExQkQsRUEwQkcsdUJBQWMsR0FBZCxFQTFCSDs7QUE0QkEsUUFBSSxDQUFDLGlCQUFpQixNQUF0QixFQUE4QjtBQUMxQiwyQkFBbUIsQ0FBQyx1QkFBRCxDQUFuQjtBQUNBLCtCQUF1QixTQUF2QixDQUFpQyxHQUFqQyxDQUFxQyxPQUFyQztBQUNBLDJCQUFVLFFBQVYsR0FBcUIsSUFBckI7QUFDSCxLQUpELE1BSVE7QUFDSiwrQkFBdUIsU0FBdkIsQ0FBaUMsTUFBakMsQ0FBd0MsT0FBeEM7QUFDQSwyQkFBVSxRQUFWLEdBQXFCLEtBQXJCO0FBQ0g7QUFDRCxnQ0FBYSxnQkFBYixFQUErQixzQkFBL0I7QUFDSDs7a0JBRWMsbUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBzZW5kIHRoZSBQT1NUIHJlcXVlc3RcclxuICogQHBhcmFtIGRhdGFPYmoge29iamVjdH0gLSBkYXRhIHRvIHNlbmRcclxuICogQHBhcmFtIHVybCB7c3RyaW5nfVxyXG4gKiBAcGFyYW0gY2FsbGJhY2sge2Z1bmN0aW9ufVxyXG4gKi9cclxuZnVuY3Rpb24gYWpheFBvc3QgKGRhdGFPYmosIHVybCwgY2FsbGJhY2spIHtcclxuICAgIHdpbmRvdy5mZXRjaCh1cmwsIHtcclxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCdcclxuICAgICAgICB9KSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhT2JqKVxyXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRm9ybSBzdWJtaXQgc3RhdHVzOiAnLCByZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdwb3N0IGVycm9yOiAnLGVycik7XHJcbiAgICAgICAgYWxlcnQoJ1NlcnZlciBub3QgcmVzcG9uZGluZywgY2hlY2sgaWYgaXRcXCdzIHJ1bm5pbmcnKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhamF4UG9zdDtcclxuIiwiLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiByZXR1cm5zIHRoZSBlbGVtZW50IHRoYXQgMiBhcnJheXMgaGF2ZSBpbiBjb21tb25cclxuICogQHBhcmFtIHthcnJheX0gYXJyMVxyXG4gKiBAcGFyYW0ge2FycmF5fSBhcnIyXHJcbiAqIEByZXR1cm5zIHthcnJheX1cclxuICovXHJcbmZ1bmN0aW9uIGFycmF5SW50ZXJzZWN0KGFycjEsIGFycjIpIHtcclxuICAgIHZhciBhcnJheXMgPSBbYXJyMSwgYXJyMl07XHJcblxyXG4gICAgcmV0dXJuIGFycmF5cy5zb3J0KCkuc2hpZnQoKS5maWx0ZXIoZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gYXJyYXlzLmV2ZXJ5KGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhLmluZGV4T2YodikgIT09IC0xO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFycmF5SW50ZXJzZWN0O1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIGNyZWF0ZSBhbiBlbGVtZW50IHdpdGggYW4gb3B0aW9uYWwgY2xhc3MgYW5kIHRleHQgY29udGVudFxyXG4gKiBAcGFyYW0ge2F0dHJPYmpGb3JDcmVhdGVFbH0gYXR0ck9ialxyXG4gKiBAcmV0dXJucyB7ZWxlbWVudH1cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUVsKGF0dHJPYmopIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGVkZWYge09iamVjdH0gYXR0ck9iakZvckNyZWF0ZUVsXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZWxUYWcgLSBUaGUgdGFnIG9mIHRoZSBlbGVtZW50IHRvIGNyZWF0ZVxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNsYXNzIC0gQ2xhc3MgKG9yIGNsYXNzZXMgc3BhY2Ugc2VwYXJhdGVkKSB0byBhc3NpZ24gdG8gdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudFxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd8ZWxlbWVudH0gdGV4dCAtIHN0cmluZyBvciBlbGVtZW50IHRvIHNldCBhcyBjb250ZW50IG9mIHRoZSBuZXdseSBjcmVhdGVkIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhdHRyT2JqLmVsVGFnKTtcclxuICAgIGlmIChhdHRyT2JqLnRleHQpIHtcclxuICAgICAgICB2YXIgdGV4dCA9ICh0eXBlb2YgYXR0ck9iai50ZXh0ICA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXR0ck9iai50ZXh0KSA6IGF0dHJPYmoudGV4dDtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmNsYXNzKSB7XHJcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gYXR0ck9iai5jbGFzcztcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmlkKSB7XHJcbiAgICAgICAgZWwuaWQgPSBhdHRyT2JqLmlkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFbDtcclxuIiwiZnVuY3Rpb24gZ2V0RmVhdHVyZU5hbWUgKGZlYXR1cmVQYXRoKSB7XHJcbiAgICByZXR1cm4gZmVhdHVyZVBhdGgucmVwbGFjZSgvXi4qZmVhdHVyZXMvLCAnJykuc3Vic3RyKDEpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRGZWF0dXJlTmFtZTtcclxuIiwiaW1wb3J0IGdldFRhZ3MgZnJvbSAnLi9nZXRUYWdzJztcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gZ2F0aGVyIGFsbCB0aGUgZGF0YSBmcm9tIHRoZSBmb3JtXHJcbiAqIEBwYXJhbSBmb3JtIHtlbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Rm9ybURhdGEgKGZvcm0pIHtcclxuICAgIHZhciBkYXRhT2JqID0ge1xyXG4gICAgICAgIGVudmlyb25tZW50czogW10sXHJcbiAgICAgICAgZGlyOiAnJ1xyXG4gICAgfTtcclxuICAgIHZhciB0YWdzSW5jbHVkZWQgPSBnZXRUYWdzKCkuaW5jbHVkZWQ7XHJcbiAgICB2YXIgdGFnc0V4Y2x1ZGVkID0gZ2V0VGFncygpLmV4Y2x1ZGVkO1xyXG5cclxuICAgIFtdLmZpbHRlci5jYWxsKGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmxpbmUsIC5mb2xkZXJCdG4nKSwgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbC5jaGVja2VkO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8uZmlsdGVyKGZ1bmN0aW9uKGVsKSB7IHJldHVybiBlbC5kaXNhYmxlZDsgfSkgLy9EaXNhYmxlZCBlbGVtZW50cyBkaWUuXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIC8vTWFwIGVhY2ggZmllbGQgaW50byBhIG5hbWU9dmFsdWUgc3RyaW5nLCBtYWtlIHN1cmUgdG8gcHJvcGVybHkgZXNjYXBlIVxyXG4gICAgICAgICAgICBzd2l0Y2ggKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJykpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Vudmlyb25tZW50JzpcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmVudmlyb25tZW50cy5wdXNoKGVsLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Rpcic6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5kaXIgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZXhjbHVkZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhT2JqLmV4Y2x1ZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5leGNsdWRlID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouZXhjbHVkZS5wdXNoKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZmlsZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5maWxlID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGlmICh0YWdzSW5jbHVkZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgZGF0YU9iai50YWdzSW5jbHVkZWQgPSB0YWdzSW5jbHVkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhZ3NFeGNsdWRlZC5sZW5ndGgpIHtcclxuICAgICAgICBkYXRhT2JqLnRhZ3NFeGNsdWRlZCA9IHRhZ3NFeGNsdWRlZDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YU9iajtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0Rm9ybURhdGE7XHJcbiIsIi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gZXhlY3V0ZSBhIEdFVCByZXF1ZXN0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcbmZ1bmN0aW9uIGdldFJlcXVlc3QodXJsLCBjYWxsYmFjaykge1xyXG4gICAgd2luZG93LmZldGNoKHVybCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnXHJcbiAgICAgICAgfSlcclxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC50aGVuKHJlc3BvbnNlSnNvbiA9PiBjYWxsYmFjayhyZXNwb25zZUpzb24pKVxyXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6ICcgKyBlcnIpKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVxdWVzdDtcclxuIiwiLyoqXHJcbiAqIEBuYW1lc3BhY2VcclxuICogQGRlc2NyaXB0aW9uIHJldHVybnMgdGhlIHNpYmxpbmcgb2YgYW4gZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgZGF0YS10eXBlXHJcbiAqIEBwYXJhbSB7ZWxlbWVudH0gZWxcclxuICogQHBhcmFtIHtzdHJpbmd9IGVsVHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBzaWJsaW5nIHRvIHJldHVyblxyXG4gKiBAcmV0dXJucyB7ZWxlbWVudH1cclxuICovXHJcbmZ1bmN0aW9uIGdldFNpYmxpbmdCeVR5cGVTdGFydGVyIChlbCwgZWxUeXBlKSB7XHJcbiAgICByZXR1cm4gZ2V0U2libGluZ0J5VHlwZShlbC5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkLCBlbFR5cGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTaWJsaW5nQnlUeXBlIChlbCwgZWxUeXBlKSB7XHJcbiAgICBpZiAoZWwuZGF0YXNldC50eXBlICYmIGVsLmRhdGFzZXQudHlwZSA9PT0gZWxUeXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIWVsLm5leHRFbGVtZW50U2libGluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0U2libGluZ0J5VHlwZShlbC5uZXh0RWxlbWVudFNpYmxpbmcsIGVsVHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRTaWJsaW5nQnlUeXBlU3RhcnRlcjtcclxuIiwiLyoqXHJcbiAqIEBuYW1lc3BhY2VcclxuICogQGRlc2NyaXB0aW9uIGdldCB0aGUgdGFncyB0byBpbmNsdWRlL2V4Y2x1ZGVcclxuICogQHJldHVybnMge3RhZ3N9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRUYWdzKCkge1xyXG4gICAgdmFyIHRhZ3NJbmNsdWRlZCA9IFtdLm1hcC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyN0YWdzSW5jbHVkZWQgbGknKSwgZnVuY3Rpb24gKHRhZ0VsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRhZ0VsLmlkO1xyXG4gICAgfSk7XHJcbiAgICB2YXIgdGFnc0V4Y2x1ZGVkID0gW10ubWFwLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3RhZ3NFeGNsdWRlZCBsaScpLCBmdW5jdGlvbiAodGFnRWwpIHtcclxuICAgICAgICByZXR1cm4gdGFnRWwuaWQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlZGVmIHRhZ3NcclxuICAgICAqIEB0eXBlIE9iamVjdFxyXG4gICAgICogQHByb3BlcnR5IHRhZ3NJbmNsdWRlZCB7YXJyYXl9XHJcbiAgICAgKiBAcHJvcGVydHkgdGFnc0V4Y2x1ZGVkIHthcnJheX1cclxuICAgICAqL1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbmNsdWRlZDogdGFnc0luY2x1ZGVkLFxyXG4gICAgICAgIGV4Y2x1ZGVkOiB0YWdzRXhjbHVkZWRcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFRhZ3M7IiwiLyoqXHJcbiAqIEBkZXNjIE1hbmFnZXMgdGhlIGFwcCBnbG9iYWwgdmFyaWFibGVzXHJcbiAqL1xyXG5cclxuLypUaGUgZmVhdHVyZXMgb2JqZWN0IHRyZWUqL1xyXG52YXIgc3RvcmVGZWF0dXJlc09iajtcclxuZXhwb3J0IGNvbnN0IHN0b3JlRmVhdHVyZXMgPSB7XHJcbiAgICBnZXQ6ICgpID0+IHN0b3JlRmVhdHVyZXNPYmosXHJcbiAgICBzZXQ6IChvYmopID0+IHN0b3JlRmVhdHVyZXNPYmogPSBvYmpcclxufTtcclxuXHJcbi8qQWxsIHRoZSB0YWdzIGZvdW5kIGluIGZlYXR1cmVzIGZpbGVzKi9cclxudmFyIHRhZ3MgPSBbXTtcclxuZXhwb3J0IGNvbnN0IGdsb2JhbFRhZ3MgPSB7XHJcbiAgICBnZXQ6ICgpID0+IHRhZ3MsXHJcbiAgICBzZXQ6IChhcnIpID0+IHRhZ3MgPSBhcnJcclxufTtcclxuXHJcbi8qRE9NIGVsZW1lbnRzKi9cclxuZXhwb3J0IGNvbnN0IHRlc3RSdW5uaW5nTXNnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3RSdW5uaW5nTXNnJyk7XHJcbmV4cG9ydCBjb25zdCBzdWJtaXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0QnRuJyk7XHJcbmV4cG9ydCBjb25zdCBpbmNsdWRlZEZlYXR1cmVzV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmNsdWRlZEZlYXR1cmVzJyk7XHJcbmV4cG9ydCBjb25zdCBleGNsdWRlZEZlYXR1cmVzV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGNsdWRlZGRGZWF0dXJlcycpO1xyXG4iLCJpbXBvcnQgZ2V0U2libGluZ0J5VHlwZSBmcm9tICcuL2dldFNpYmxpbmdCeVR5cGUnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIENoZWNrL1VuY2hlY2sgcGFyZW50IGZvbGRlciBpbmNsdWRlL2V4Y2x1ZGUgYnV0dG9uIHdoZW4gYSBmaWxlIGlzIHNlbGVjdGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVGaWxlQ2xpY2soKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmZWF0dXJlTGlzdFJlYWR5JywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW25hbWU9XCJzZWxlY3RGaWxlXCJdJyksIGZ1bmN0aW9uIChidG4pIHtcclxuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRGb2xkZXJCdG4gPSBnZXRTaWJsaW5nQnlUeXBlKGUuY3VycmVudFRhcmdldC5jbG9zZXN0KCdmaWVsZHNldCcpLmZpcnN0RWxlbWVudENoaWxkLCAnZGlyJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RXhjbHVkZUZvbGRlckJ0biA9IGdldFNpYmxpbmdCeVR5cGUoZS5jdXJyZW50VGFyZ2V0LmNsb3Nlc3QoJ2ZpZWxkc2V0JykuZmlyc3RFbGVtZW50Q2hpbGQsICdleGNsdWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnRGb2xkZXJCdG4uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEZvbGRlckJ0bi5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50RXhjbHVkZUZvbGRlckJ0bi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50RXhjbHVkZUZvbGRlckJ0bi5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXBkYXRlRmVhdHVyZXNUb1J1bigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVGaWxlQ2xpY2s7XHJcbiIsImltcG9ydCBnZXRTaWJsaW5nQnlUeXBlIGZyb20gJy4vZ2V0U2libGluZ0J5VHlwZSc7XHJcbmltcG9ydCB1cGRhdGVGZWF0dXJlc1RvUnVuIGZyb20gJy4vdXBkYXRlRmVhdHVyZXNUb1J1bic7XHJcblxyXG4vKipcclxuICogQGRlc2MgY2hlY2sgaWYgb25lIG9mIGVsIHBhcmVudHMgYXJlIGVxdWFsIHRvIGVsVG9NYXRjaFxyXG4gKiBAcGFyYW0gZWwge2VsZW1lbnR9XHJcbiAqIEBwYXJhbSBlbFRvTWF0Y2gge2VsZW1lbnR9XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gY2hlY2tQYXJlbnRzQXJlIChlbCwgZWxUb01hdGNoKSB7XHJcbiAgICBpZiAoZWwgPT09IGVsVG9NYXRjaCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKCFlbC5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gY2hlY2tQYXJlbnRzQXJlKGVsLnBhcmVudEVsZW1lbnQsIGVsVG9NYXRjaCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZGVzYyByZXR1cm5zIHRoZSBzaWJsaW5nIG9mIGEgZm9sZGVyIHNlbGVjdC9leGNsdWRlIGJ1dHRvblxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlRm9sZGVyQ2xpY2sgKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZmVhdHVyZUxpc3RSZWFkeScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZvbGRlckJ0bicpLCBmdW5jdGlvbiAoYnRuKSB7XHJcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1VuY2hlY2sgc2libGluZyBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2libGluZ0J0biA9IGdldFNpYmxpbmdCeVR5cGUoZS5jdXJyZW50VGFyZ2V0LCAoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudHlwZSA9PT0gJ2RpcicpPyAnZXhjbHVkZScgOiAnZGlyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpYmxpbmdCdG4gJiYgc2libGluZ0J0bi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmdCdG4uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9VbmNoZWNrIGZpbGUgc2VsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsVHlwZSA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LnR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsVHlwZSAmJiAoZWxUeXBlID09PSAnZGlyJyB8fCBlbFR5cGUgPT09ICdleGNsdWRlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVCdG5DaGVja2VkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdHlwZT1cImZpbGVcIl06Y2hlY2tlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZUJ0bkNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVCdG5DaGVja2VkLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9JZiBubyBmb2xkZXIgaXMgc2VsZWN0ZWQgY2hlY2wgXCJzZWxlY3QgYWxsXCJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR5cGU9XCJkaXJcIl06Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RBbGwnKS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vVW5jaGVjayBhbmQgZGlzYWJsZSBleGNsdWRlIGJ1dHRvbiB0aGF0IGFyZSBub3QgY2hpbGRyZW4gb2YgdGhlIHNlbGVjdGVkIGZvbGRlciBhbmQgZW5hYmxlIHRob3NlIHRoYXQgYXJlIGNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LnR5cGUgPT09ICdkaXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZEZvbGRlck9mU2VsZWN0ZWRGb2xkZXIgPSBlLmN1cnJlbnRUYXJnZXQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZmVhdHVyZUZpbGVzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXS5tYXAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10eXBlPVwiZXhjbHVkZVwiXScpLCBmdW5jdGlvbiAoZXhjbHVkZUJ0bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhjbHVkZUJ0bjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChleGNsdWRlQnRuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFjaGVja1BhcmVudHNBcmUoZXhjbHVkZUJ0biwgY2hpbGRGb2xkZXJPZlNlbGVjdGVkRm9sZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZXhjbHVkZUJ0bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVCdG4uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGZWF0dXJlc1RvUnVuKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGhhbmRsZUZvbGRlckNsaWNrOyIsImltcG9ydCBnZXRGb3JtRGF0YSBmcm9tICcuL2dldEZvcm1EYXRhJztcclxuaW1wb3J0IGFqYXhQb3N0IGZyb20gJy4vYWpheFBvc3QnO1xyXG5pbXBvcnQge3N1Ym1pdEJ0biwgdGVzdFJ1bm5pbmdNc2d9IGZyb20gJy4vZ2xvYmFscydcclxuXHJcbnZhciBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVzRm9ybScpO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBoYW5kbGUgdGhlIGZvcm0gc3VibWl0IGJ1dHRvblxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlRm9ybVN1Ym1pdChob3N0KSB7XHJcbiAgICAvKiBnbG9iYWwgaW8gKi9cclxuICAgIHZhciBzb2NrZXQgPSBpby5jb25uZWN0KGhvc3QpO1xyXG4gICAgXHJcbiAgICBzdWJtaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGFPYmogPSBnZXRGb3JtRGF0YShmb3JtKTtcclxuXHJcbiAgICAgICAgYWpheFBvc3QoZGF0YU9iaiwgaG9zdCsnL2xhdW5jaHNweScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGVzdFJ1bm5pbmdNc2cuc2V0QXR0cmlidXRlKCdzdHlsZScsICcnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCBzb2NrZXQgbGlzdGVuZXIgdG8gZ2V0IG5pZ2h0d2F0Y2ggY29uc29sZSBtZXNzYWdlc1xyXG4gICAgICAgIC8vUmVtb3ZlIHByZXZpb3VzIGxpc3RlbmVyIGV2ZW50dWFsbHkgcHJlc2VudCB0byBhdm9pZCBkdXBsaWNhdGVzXHJcbiAgICAgICAgc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygnbmlnaHR3YXRjaENvbnNvbGVNc2cnKTtcclxuICAgICAgICBzb2NrZXQub24oJ25pZ2h0d2F0Y2hDb25zb2xlTXNnJywgZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG1zZyk7XHJcbiAgICAgICAgICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG5cclxuICAgICAgICAgICAgcC5pbm5lckhUTUwgPSBtc2c7XHJcbiAgICAgICAgICAgIHRlc3RSdW5uaW5nTXNnLmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgICAgICB0ZXN0UnVubmluZ01zZy5zY3JvbGxUb3AgPSB0ZXN0UnVubmluZ01zZy5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRm9ybVN1Ym1pdDsiLCJpbXBvcnQgY3JlYXRlRWwgZnJvbSAnLi9jcmVhdGVFbCc7XHJcbmltcG9ydCBpbnNlcnRJbnB1dCBmcm9tICcuL2luc2VydElucHV0JztcclxuaW1wb3J0IHtnbG9iYWxUYWdzfSBmcm9tICcuL2dsb2JhbHMnO1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiByZWN1cnNpdmVseSBwcmludCBmZWF0dXJlcyBmb2xkZXIgY29udGVudFxyXG4gKiBAcGFyYW0ge2ZlYXR1cmVzRGF0YU9ian0gb2JqXHJcbiAqIEBwYXJhbSB7ZWxlbWVudH0gcGFyZW50IC0gVGhlIHBhcmVudCBlbGVtZW50IG9mIHRoZSBuZXcgbGluZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAZGVzYyBjb252ZXJ0cyBhIHJlc3BvbnNlIG9iamVjdCBpbnRvIGFuIGFycmF5XHJcbiAqIEBwYXJhbSBvYmoge29iamVjdH1cclxuICogQHJldHVybnMge0FycmF5fVxyXG4gKi9cclxuZnVuY3Rpb24gY29udmVydFJlc3BvbnNlT2JqVG9BcnJheShvYmopIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxvYmpba2V5XSx7bGFiZWw6IGtleX0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydExpbmUgKG9iaiwgcGFyZW50KSB7XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IGZlYXR1cmVzRGF0YU9ialxyXG4gICAgICogQGRlc2NyaXB0aW9uIGEgcmVjdXJzaXZlIG9iamVjdCBjb250YWluaW5nIGRhdGEgb24gZmVhdHVyZXNcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlIC0gJ2Rpcicgb3IgJ2ZpbGUnXHJcbiAgICAgKiBAcHJvcGVydHkge3BhdGh9IHBhdGggLSB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgZm9sZGVyIG9yIGZpbGVcclxuICAgICAqIEBwcm9wZXJ0eSB7ZmVhdHVyZXNEYXRhT2JqfSBzdWJkaXIgLSBhIGZlYXR1cmVzRGF0YU9iaiBvZiB0aGUgc3ViZm9sZGVyIGV2ZW50dWFsbHkgcHJlc2VudCBpbiBhIGZvbGRlclxyXG4gICAgICogQHByb3BlcnR5IHthcnJheX0gdGFncyAtIHRoZSB0YWdzIGV2ZW50dWFsbHkgcHJlc2VudCBpbiBhIGZlYXR1cmVcclxuICAgICAqL1xyXG5cclxuICAgIHZhciBhcnIgPSBjb252ZXJ0UmVzcG9uc2VPYmpUb0FycmF5KG9iaikuc29ydChmdW5jdGlvbihhLGIpIHtcclxuICAgICAgICByZXR1cm4gYS5sYWJlbCA+IGIubGFiZWw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XHJcbiAgICAgICAgaWYgKGxpbmUudHlwZSA9PT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgIC8vQ29sbGVjdCB0YWdzXHJcbiAgICAgICAgICAgIGxldCBsb2NhbFRhZ3MgPSBsaW5lLnRhZ3M7XHJcbiAgICAgICAgICAgIGxldCBsb2NhbFRhZ3NMYWJlbCA9ICcnO1xyXG4gICAgICAgICAgICBpZiAobG9jYWxUYWdzICYmIGxvY2FsVGFncy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGdsb2JhbFRhZ3Muc2V0KGdsb2JhbFRhZ3MuZ2V0KCkuY29uY2F0KGxvY2FsVGFncykpO1xyXG4gICAgICAgICAgICAgICAgbG9jYWxUYWdzTGFiZWwgPSAnIChUQUc6ICcgKyBsb2NhbFRhZ3Muam9pbignLCAnKSArICcpJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zZXJ0SW5wdXQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzZWxlY3RGaWxlJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBsaW5lLmxhYmVsLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiBsaW5lLmxhYmVsICsgbG9jYWxUYWdzTGFiZWwsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5lJyxcclxuICAgICAgICAgICAgICAgIGRhdGFQYXRoOiBsaW5lLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgaWQ6IGxpbmUubGFiZWwsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHBhcmVudFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgeyAvL2RpcmVjdG9yaWVzXHJcbiAgICAgICAgICAgIHZhciBmaWVsZHNldCA9IGNyZWF0ZUVsKHtcclxuICAgICAgICAgICAgICAgIGVsVGFnOiAnZmllbGRzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdmb2xkZXJXcmFwcGVyICcgKyBsaW5lLmxhYmVsICsgJ193cmFwcGVyJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGNsb3NlQ29udGFpbmVyID0gY3JlYXRlRWwoe1xyXG4gICAgICAgICAgICAgICAgZWxUYWc6ICdzcGFuJyxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdjbG9zZVR4dCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBvcGVuQ29udGFpbmVyID0gY3JlYXRlRWwoe1xyXG4gICAgICAgICAgICAgICAgZWxUYWc6ICdzcGFuJyxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdvcGVuVHh0J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGRpdiA9IGNyZWF0ZUVsKHtcclxuICAgICAgICAgICAgICAgIGVsVGFnOiAnZGl2JyxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiAnZmVhdHVyZUZpbGVzJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIG9wZW5DbG9zZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHJcbiAgICAgICAgICAgIG9wZW5DbG9zZUNvbnRhaW5lci5hcHBlbmRDaGlsZChvcGVuQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgb3BlbkNsb3NlQ29udGFpbmVyLmFwcGVuZENoaWxkKGNsb3NlQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgb3BlbkNsb3NlQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxpbmUubGFiZWwpKTtcclxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGZpZWxkc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGluc2VydElucHV0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbGluZS5sYWJlbCxcclxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogb3BlbkNsb3NlQ29udGFpbmVyLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2xvc2VCdG4nLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxDbGFzczogJ29wZW5DbG9zZScsXHJcbiAgICAgICAgICAgICAgICBkYXRhUGF0aDogbGluZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdjbG9zZScsXHJcbiAgICAgICAgICAgICAgICBpZDogbGluZS5sYWJlbCArICdfY2xvc2UnLFxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhcmVudDogZmllbGRzZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGluc2VydElucHV0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2VsZWN0Rm9sZGVyJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBsaW5lLmxhYmVsLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnc2VsZWN0IGZvbGRlcicsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdmb2xkZXJCdG4nLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxDbGFzczogJ2J1dHRvbiBzZWxlY3RGb2xkZXInLFxyXG4gICAgICAgICAgICAgICAgZGF0YVBhdGg6IGxpbmUucGF0aCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnZGlyJyxcclxuICAgICAgICAgICAgICAgIGlkOiBsaW5lLmxhYmVsICsgJ19lbnRpcmUnLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBmaWVsZHNldFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaW5zZXJ0SW5wdXQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBsaW5lLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnZXhjbHVkZSBmb2xkZXInLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZm9sZGVyQnRuJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsQ2xhc3M6ICdidXR0b24gZXhjbHVkZUZvbGRlcicsXHJcbiAgICAgICAgICAgICAgICBkYXRhUGF0aDogbGluZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdleGNsdWRlJyxcclxuICAgICAgICAgICAgICAgIGlkOiBsaW5lLmxhYmVsICsgJ19lbnRpcmVFeGNsdWRlJyxcclxuICAgICAgICAgICAgICAgIHBhcmVudDogZmllbGRzZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGZpZWxkc2V0LmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICAgICAgICAgIGluc2VydExpbmUobGluZS5zdWJEaXIsIGRpdik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluc2VydExpbmU7XHJcbiIsImltcG9ydCBjcmVhdGVFbCBmcm9tICcuL2NyZWF0ZUVsJztcclxuXHJcbi8qKlxyXG4gKiBAZGVzYyBjcmVhdGUgYW4gaW5wdXQgZmllbGQgKGNoZWNrYm94IG9yIHJhZGlvIGJ1dHRuKSArIGl0cyBsYWJlbCBhbmQgYXBwZW5kIHRoZW0gdG8gdGhlIHBhcmVudFxyXG4gKiBAcGFyYW0ge2F0dHJPYmpGb3JJbnB1dH0gYXR0ck9ialxyXG4gKi9cclxuZnVuY3Rpb24gaW5zZXJ0SW5wdXQgKGF0dHJPYmopIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGVkZWYge09iamVjdH0gYXR0ck9iakZvcklucHV0XHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gaWRcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlIC0gSW5wdXQgdHlwZSAoZWcuICdjaGVja2JveCcgb3IgJ3JhZGlvJylcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfGVsZW1lbnR9IGxhYmVsVGV4dCAtIHN0cmluZyBvciBlbGVtZW50IHRvIHNldCBhcyBjb250ZW50IG9mIHRoZSBpbnB1dCBsYWJlbFxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGxhYmVsQ2xhc3NcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY2xhc3NcclxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gY2hlY2tlZFxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGRhdGFQYXRoIC0gVGhlIHBhdGggdG8gZm9sZGVyL2ZpbGUgdG8gYXNzaWduIHRvIGRhdGEtcGF0aFxyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGRhdGFUeXBlIC0gVGhlIHZhbHVlIG9mIGRhdGEtdHlwZTogJ2Vudmlyb25tZW50JywgJ2ZpbGUnLCAnZGlyJ1xyXG4gICAgICovXHJcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgdmFyIGxhYmVsID0gY3JlYXRlRWwoe1xyXG4gICAgICAgIGVsVGFnOiAnbGFiZWwnLFxyXG4gICAgICAgIHRleHQ6IGF0dHJPYmoubGFiZWxUZXh0XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2lkJywgYXR0ck9iai5pZCk7XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCBhdHRyT2JqLnR5cGUpO1xyXG4gICAgaWYgKGF0dHJPYmoubmFtZSkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnbmFtZScsIGF0dHJPYmoubmFtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXR0ck9iai5jbGFzc05hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGF0dHJPYmouY2xhc3NOYW1lKTtcclxuICAgIH1cclxuICAgIGlmIChhdHRyT2JqLmNoZWNrZWQpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnY2hlY2tlZCcpO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouZGF0YVBhdGgpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcsIGF0dHJPYmouZGF0YVBhdGgpO1xyXG4gICAgfVxyXG4gICAgaWYgKGF0dHJPYmouZGF0YVR5cGUpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScsIGF0dHJPYmouZGF0YVR5cGUpO1xyXG4gICAgfVxyXG4gICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBhdHRyT2JqLmlkKTtcclxuICAgIGlmIChhdHRyT2JqLmxhYmVsQ2xhc3MpIHtcclxuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBhdHRyT2JqLmxhYmVsQ2xhc3M7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0ck9iai5wYXJlbnQuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgYXR0ck9iai5wYXJlbnQuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBpbnNlcnRJbnB1dDtcclxuIiwidmFyIGhvc3QgPSAnaHR0cDovLycrZG9jdW1lbnQubG9jYXRpb24uaG9zdDtcclxudmFyIGZlYXR1cmVMaXN0UmVhZHkgPSBuZXcgRXZlbnQoJ2ZlYXR1cmVMaXN0UmVhZHknLCB7XCJidWJibGVzXCI6IHRydWUsIFwiY2FuY2VsYWJsZVwiOiBmYWxzZX0pO1xyXG5cclxuaW1wb3J0IGdldFJlcXVlc3QgZnJvbSAnLi9nZXRSZXF1ZXN0JztcclxuaW1wb3J0IGluc2VydElucHV0IGZyb20gJy4vaW5zZXJ0SW5wdXQnO1xyXG5pbXBvcnQgaW5zZXJ0RmVhdHVyZUxpbmUgZnJvbSAnLi9pbnNlcnRGZWF0dXJlTGluZSc7XHJcbmltcG9ydCBtYW5hZ2VUYWdzIGZyb20gJy4vbWFuYWdlVGFncyc7XHJcbmltcG9ydCB1cGRhdGVGZWF0dXJlc1RvUnVuIGZyb20gJy4vdXBkYXRlRmVhdHVyZXNUb1J1bic7XHJcbmltcG9ydCBoYW5kbGVGb3JtU3VibWl0IGZyb20gJy4vaGFuZGxlRm9ybVN1Ym1pdCc7XHJcbmltcG9ydCBoYW5kbGVGb2xkZXJDbGljayBmcm9tICcuL2hhbmRsZUZvbGRlckNsaWNrJztcclxuaW1wb3J0IGhhbmRsZUZpbGVDbGljayBmcm9tICcuL2hhbmRsZUZpbGVDbGljayc7XHJcbmltcG9ydCByZXNldENsaWNrIGZyb20gJy4vcmVzZXRDbGljayc7XHJcbmltcG9ydCB7c3RvcmVGZWF0dXJlcywgZ2xvYmFsVGFnc30gZnJvbSAnLi9nbG9iYWxzJztcclxuXHJcblxyXG5nZXRSZXF1ZXN0KGhvc3QrJy9lbnZpcm9ubWVudHMnLCBmdW5jdGlvbiAocmVzcG9uc2VPYmopIHtcclxuICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW52aXJvbm1lbnRzRm9ybUlubmVyJyk7XHJcblxyXG4gICAgT2JqZWN0LmtleXMocmVzcG9uc2VPYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGluc2VydElucHV0KHtcclxuICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgdmFsdWU6IGtleSxcclxuICAgICAgICAgICAgbGFiZWxUZXh0OiBrZXksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmUnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2Vudmlyb25tZW50JyxcclxuICAgICAgICAgICAgaWQ6IGtleSxcclxuICAgICAgICAgICAgY2hlY2tlZDogKGtleSA9PT0gJ2Nocm9tZScpID8gJ2NoZWNrZWQnIDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5nZXRSZXF1ZXN0KGhvc3QrJy9mZWF0dXJlcycsIGZ1bmN0aW9uIChyZXNwb25zZU9iaikge1xyXG4gICAgLy9DYWNoZSByZXNwb25zZVxyXG4gICAgc3RvcmVGZWF0dXJlcy5zZXQocmVzcG9uc2VPYmopO1xyXG5cclxuICAgIGluc2VydEZlYXR1cmVMaW5lKHJlc3BvbnNlT2JqLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZXNGb3JtSW5uZXInKSk7XHJcblxyXG4gICAgaWYgKGdsb2JhbFRhZ3MuZ2V0KCkubGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IHVuaXF1ZVRhZ3MgPSBnbG9iYWxUYWdzLmdldCgpLnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIHBvcywgc2VsZikge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKGl0ZW0pID09PSBwb3M7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWFuYWdlVGFncyh1bmlxdWVUYWdzKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUZlYXR1cmVzVG9SdW4oKTtcclxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZmVhdHVyZUxpc3RSZWFkeSk7XHJcbn0pO1xyXG5cclxuaGFuZGxlRm9ybVN1Ym1pdChob3N0KTtcclxuaGFuZGxlRm9sZGVyQ2xpY2soKTtcclxuaGFuZGxlRmlsZUNsaWNrKCk7XHJcbnJlc2V0Q2xpY2soKTsiLCJpbXBvcnQgZ2V0VGFncyBmcm9tICcuL2dldFRhZ3MnO1xyXG5pbXBvcnQgYXJyYXlJbnRlcnNlY3QgZnJvbSAnLi9hcnJheUludGVyc2VjdCc7XHJcbmltcG9ydCBwcmludEZlYXR1cmUgZnJvbSAnLi9wcmludEZlYXR1cmUnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5pbXBvcnQgZ2V0RmVhdHVyZU5hbWUgZnJvbSAnLi9nZXRGZWF0dXJlTmFtZSc7XHJcbmltcG9ydCB7aW5jbHVkZWRGZWF0dXJlc1dyYXBwZXIsIGV4Y2x1ZGVkRmVhdHVyZXNXcmFwcGVyLCBzdG9yZUZlYXR1cmVzfSBmcm9tICcuL2dsb2JhbHMnXHJcblxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjcmVhdGUgYSBsaSBlbGVtZW50IGZvciBldmVyeSB0YWcsIGluaXRpYWxpc2UgdGhlIGRyYWQmZHJvcCBiZWhhdmlvdXIgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIHBhcmVudFxyXG4gKiBAcGFyYW0ge2FycmF5fSB0YWdzQXJyXHJcbiAqIEBwYXJhbSB7ZWxlbWVudH0gcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnNlcnRUYWdzICh0YWdzQXJyLCBwYXJlbnQpIHtcclxuICAgIHRhZ3NBcnIuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgICAgdmFyIHRhZ0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICB2YXIgdGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRhZyk7XHJcbiAgICAgICAgdGFnRWwuYXBwZW5kQ2hpbGQodGFnVGV4dCk7XHJcbiAgICAgICAgdGFnRWwuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcclxuICAgICAgICB0YWdFbC5pZCA9IHRhZztcclxuICAgICAgICB0YWdFbC5jbGFzc05hbWUgPSAndGFnJztcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGFnRWwpO1xyXG4gICAgICAgIHRhZ0VsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkcmFnc3RhcnQnKTtcclxuICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgZS50YXJnZXQuaWQpO1xyXG4gICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIHVwZGF0ZSB0aGUgbGlzdHMgb2YgaW5jbHVkZWQvZXhjbHVkZWQgZmVhdHVyZSBhZnRlciBldmVyeSB0YWcgZHJvcFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWRGZWF0dXJlcyAoKSB7XHJcbiAgICB2YXIgaW5jbHVkZWRUYWcgPSBnZXRUYWdzKCkuaW5jbHVkZWQ7XHJcbiAgICB2YXIgZXhjbHVkZWRUYWcgPSBnZXRUYWdzKCkuZXhjbHVkZWQ7XHJcbiAgICB2YXIgaW5jbHVkZWRGZWF0dXJlID0gW107XHJcbiAgICB2YXIgZXhjbHVkZWRGZWF0dXJlID0gW107XHJcblxyXG4gICAgKGZ1bmN0aW9uIHBhcnNlRmVhdHVyZSAoZmVhdHVyZXNPYmopIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhmZWF0dXJlc09iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChmZWF0dXJlc09ialtrZXldLnR5cGUgPT09ICdmaWxlJyAmJiBmZWF0dXJlc09ialtrZXldLnRhZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcnJheUludGVyc2VjdChmZWF0dXJlc09ialtrZXldLnRhZ3MsIGluY2x1ZGVkVGFnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlZEZlYXR1cmUucHVzaChnZXRGZWF0dXJlTmFtZShmZWF0dXJlc09ialtrZXldLnBhdGgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhcnJheUludGVyc2VjdChmZWF0dXJlc09ialtrZXldLnRhZ3MsIGV4Y2x1ZGVkVGFnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBleGNsdWRlZEZlYXR1cmUucHVzaChnZXRGZWF0dXJlTmFtZShmZWF0dXJlc09ialtrZXldLnBhdGgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghZmVhdHVyZXNPYmpba2V5XS5zdWJEaXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZlYXR1cmUoZmVhdHVyZXNPYmpba2V5XS5zdWJEaXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KShzdG9yZUZlYXR1cmVzLmdldCgpKTtcclxuXHJcbiAgICBwcmludEZlYXR1cmUoaW5jbHVkZWRGZWF0dXJlLCBpbmNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcbiAgICBwcmludEZlYXR1cmUoZXhjbHVkZWRGZWF0dXJlLCBleGNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcblxyXG4gICAgdXBkYXRlRmVhdHVyZXNUb1J1bigpO1xyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIG1hbmFnZSB0aGUgdGFncyBzZWN0aW9uXHJcbiAqIEBwYXJhbSB7YXJyYXl9IHRhZ3NBcnIgLSBUaGUgYXJyYXkgb2YgdGhlIHRhZ3MgZm91bmQgaW4gdGhlIGZlYXR1cmVzIGZpbGVzXHJcbiAqL1xyXG5mdW5jdGlvbiBtYW5hZ2VUYWdzICh0YWdzQXJyKSB7XHJcbiAgICBpbnNlcnRUYWdzKHRhZ3NBcnIsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWdzTGlzdCcpKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGFnc0Ryb3BBcmVhJykgfHwgZS50YXJnZXQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ3NEcm9wQXJlYScpKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIik7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhZ3NEcm9wQXJlYScpKT8gZS50YXJnZXQgOiBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBlbC5xdWVyeVNlbGVjdG9yKCd1bCcpLmFwcGVuZENoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEpKTtcclxuICAgICAgICAgICAgdXBkYXRlU2VsZWN0ZWRGZWF0dXJlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vU2hvdyBjb250YWluZXJcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWdzRm9ybVdyYXBwZXInKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtYW5hZ2VUYWdzO1xyXG4iLCIvKipcclxuICogQGRlc2NyaXB0aW9uIGNyZWF0ZSBhIGxpIGVsZW1lbnQgd2l0aCB0aGUgZmVhdHVyZSBuYW1lIGFzIGNvbnRlbnQgZm9yIGV2ZXJ5IGZlYXR1cmUgaW4gZmVhdHVyZUFycmF5IGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBwYXJlbnRcclxuICogQHBhcmFtIHthcnJheX0gZmVhdHVyZUFycmF5XHJcbiAqIEBwYXJhbSB7ZWxlbWVudH0gcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBwcmludEZlYXR1cmUgKGZlYXR1cmVBcnJheSwgcGFyZW50KSB7XHJcbiAgICBwYXJlbnQuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgZmVhdHVyZUFycmF5LmZvckVhY2goZnVuY3Rpb24gKGZlYXR1cmUpIHtcclxuICAgICAgICB2YXIgZmVhdHVyZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICB2YXIgZmVhdHVyZVR4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZlYXR1cmUpO1xyXG4gICAgICAgIGZlYXR1cmVFbC5hcHBlbmRDaGlsZChmZWF0dXJlVHh0KTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZmVhdHVyZUVsKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwcmludEZlYXR1cmU7XHJcbiIsImltcG9ydCBwcmludEZlYXR1cmUgZnJvbSAnLi9wcmludEZlYXR1cmUnO1xyXG5pbXBvcnQgdXBkYXRlRmVhdHVyZXNUb1J1biBmcm9tICcuL3VwZGF0ZUZlYXR1cmVzVG9SdW4nO1xyXG5pbXBvcnQge3Rlc3RSdW5uaW5nTXNnLCBpbmNsdWRlZEZlYXR1cmVzV3JhcHBlciwgZXhjbHVkZWRGZWF0dXJlc1dyYXBwZXJ9IGZyb20gJy4vZ2xvYmFscydcclxuXHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIEBkZXNjIE1hbmFnZSB0aGUgcmVzZXQgYnV0dG9uIGNsaWNrXHJcbiAqL1xyXG5mdW5jdGlvbiByZXNldENsaWNrKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2V0QnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRhZ0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFnc0xpc3QnKTtcclxuXHJcbiAgICAgICAgLy9Nb3ZlIGFsbCB0aGUgdGFncyBiYWNrIHRvIHRoZSB0YWcgbGlzdFxyXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFnc0Ryb3BBcmVhV3JhcHBlciBsaScpLCBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgICAgICAgIHRhZ0xpc3QuYXBwZW5kQ2hpbGQodGFnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9FbXB0eSBpbmNsdWRlZC9leGNsdWRlZCBmZWF0dXJlIGxpc3RzXHJcbiAgICAgICAgcHJpbnRGZWF0dXJlKFtdLCBpbmNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcbiAgICAgICAgcHJpbnRGZWF0dXJlKFtdLCBleGNsdWRlZEZlYXR1cmVzV3JhcHBlcik7XHJcblxyXG4gICAgICAgIC8vQ2xvc2UgdGVzdCBvdXRwdXRcclxuICAgICAgICB0ZXN0UnVubmluZ01zZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcblxyXG4gICAgICAgIC8vV2FpdCBmb3IgaHRtbCByZXNldCBhbmQgdGhlbiB1cGRhdGUgZmVhdHVyZXMgdG8gcnVuIGxpc3RcclxuICAgICAgICBzZXRUaW1lb3V0KHVwZGF0ZUZlYXR1cmVzVG9SdW4sIDApO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgcmVzZXRDbGljaztcclxuIiwiaW1wb3J0IGdldFRhZ3MgZnJvbSAnLi9nZXRUYWdzJztcclxuaW1wb3J0IGFycmF5SW50ZXJzZWN0IGZyb20gJy4vYXJyYXlJbnRlcnNlY3QnO1xyXG5pbXBvcnQgZ2V0RmVhdHVyZU5hbWUgZnJvbSAnLi9nZXRGZWF0dXJlTmFtZSc7XHJcbmltcG9ydCBwcmludEZlYXR1cmUgZnJvbSAnLi9wcmludEZlYXR1cmUnO1xyXG5pbXBvcnQge3N1Ym1pdEJ0biwgc3RvcmVGZWF0dXJlc30gZnJvbSAnLi9nbG9iYWxzJ1xyXG5cclxuLyoqXHJcbiAqIEBkZXNjIFVwZGF0ZSB0aGUgbGlzdCBvZiBmZWF0dXJlcyB0byBydW4gYWNjb3JkaW5nIHRvIHRoZSBzZWxlY3Rpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVGZWF0dXJlc1RvUnVuIChmZWF0dXJlc09iaikge1xyXG4gICAgdmFyIHNlbGVjdGVkRm9sZGVyRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZGlyXCJdOmNoZWNrZWQnKTtcclxuICAgIHZhciBjb2xsZWN0aW5nID0gKHNlbGVjdGVkRm9sZGVyRWwuZGF0YXNldC5wYXRoID09PSAnYWxsJykgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB2YXIgc2VsZWN0ZWRGZWF0dXJlcyA9IFtdO1xyXG4gICAgdmFyIGluY2x1ZGVkVGFnID0gZ2V0VGFncygpLmluY2x1ZGVkO1xyXG4gICAgdmFyIGV4Y2x1ZGVkVGFnID0gZ2V0VGFncygpLmV4Y2x1ZGVkO1xyXG4gICAgdmFyIGV4Y2x1ZGVkRm9sZGVycyA9IFtdLm1hcC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXR5cGU9XCJleGNsdWRlXCJdOmNoZWNrZWQnKSwgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsLmRhdGFzZXQucGF0aDtcclxuICAgIH0pO1xyXG4gICAgdmFyIHNlbGVjdGVkRmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR5cGU9XCJmaWxlXCJdOmNoZWNrZWQnKTtcclxuICAgIHZhciBmZWF0dXJlc1RvUnVuQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZlYXR1cmVzVG9SdW4nKTtcclxuXHJcbiAgICBmZWF0dXJlc1RvUnVuQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgIChmdW5jdGlvbiBwcm9jZXNzRmVhdHVyZUxpbmUgKG9iaikge1xyXG4gICAgICAgIHZhciBrZXk7XHJcblxyXG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAob2JqW2tleV0udHlwZSA9PT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFycmF5SW50ZXJzZWN0KGV4Y2x1ZGVkVGFnLCBvYmpba2V5XS50YWdzKS5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAmJiBjb2xsZWN0aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCFpbmNsdWRlZFRhZy5sZW5ndGggfHwgYXJyYXlJbnRlcnNlY3QoaW5jbHVkZWRUYWcsIG9ialtrZXldLnRhZ3MpLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAmJiAoIWV4Y2x1ZGVkRm9sZGVycy5sZW5ndGggfHwgZXhjbHVkZWRGb2xkZXJzLmV2ZXJ5KGZ1bmN0aW9uIChleGNsdWRlZEZvbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQm9vbGVhbihvYmpba2V5XS5wYXRoLmluZGV4T2YoZXhjbHVkZWRGb2xkZXIpID09PSAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCFzZWxlY3RlZEZpbGUgfHwgb2JqW2tleV0ucGF0aCA9PT0gc2VsZWN0ZWRGaWxlLmRhdGFzZXQucGF0aClcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZXMucHVzaChnZXRGZWF0dXJlTmFtZShvYmpba2V5XS5wYXRoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqW2tleV0uc3ViRGlyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtrZXldLnBhdGguaW5kZXhPZihzZWxlY3RlZEZvbGRlckVsLmRhdGFzZXQucGF0aCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZEZvbGRlckVsLmRhdGFzZXQucGF0aCAhPT0gJ2FsbCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRmVhdHVyZUxpbmUob2JqW2tleV0uc3ViRGlyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pKHN0b3JlRmVhdHVyZXMuZ2V0KCkpO1xyXG5cclxuICAgIGlmICghc2VsZWN0ZWRGZWF0dXJlcy5sZW5ndGgpIHtcclxuICAgICAgICBzZWxlY3RlZEZlYXR1cmVzID0gWydObyBmZWF0dXJlcyBzZWxlY3RlZCEnXTtcclxuICAgICAgICBmZWF0dXJlc1RvUnVuQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcbiAgICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH0gZWxzZSAge1xyXG4gICAgICAgIGZlYXR1cmVzVG9SdW5Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcclxuICAgICAgICBzdWJtaXRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHByaW50RmVhdHVyZShzZWxlY3RlZEZlYXR1cmVzLCBmZWF0dXJlc1RvUnVuQ29udGFpbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlRmVhdHVyZXNUb1J1bjsiXX0=
