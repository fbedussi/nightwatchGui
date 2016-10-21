/* global io */
'use strict';

(function () {
    /** @namespace */
    var app = {};
    var host = 'http://'+document.location.host;
    var form = document.getElementById('filesForm');
    var submitBtn = document.getElementById('submitBtn');
    var includedFeaturesWrapper = document.getElementById('includedFeatures');
    var excludedFeaturesWrapper = document.getElementById('excludeddFeatures');
    var featuresToRunContainer = document.getElementById('featuresToRun');
    var testRunningMsg = document.getElementById('testRunningMsg');
    var featureListReady = new Event('featureListReady', {"bubbles": true, "cancelable": false});
    var tags = [];
    var featuresObj = {};
    var socket = io.connect(host);

    /**
     * @desc returns the path of a feature file relative to the 'feature' folder
     * @param featurePath {string} - the full path of the feature file
     * @returns {string} - the path of a feature file relative to the 'feature' folder
     */
    function getFeatureName (featurePath) {
        return featurePath.replace(/^.*features/, '').substr(1);
    }

    (function () {
        /**
         * @namespace
         * @description execute a GET request
         * @param {string} url
         * @param {function} callback
         * @alias app.getRequest
         */
        function init (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.send(null);

            xhr.onreadystatechange = function () {
                var DONE = 4; // readyState 4 means the request is done.
                var OK = 200; // status 200 is a successful return.
                if (xhr.readyState === DONE) {
                    if (xhr.status === OK) {
                        var responseObj = JSON.parse(xhr.responseText);
                        callback(responseObj);
                    } else {
                        console.log('Error: ' + xhr.status);
                    }
                }
            };
        }

        return app.getRequest = init;
    })();

    (function () {
        /**
         * @namespace
         * @description create a li element with the feature name as content for every feature in featureArray and appends it to the parent
         * @param {array} featureArray
         * @param {element} parent
         * @alias app.printFeature
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

        app.printFeature = printFeature;
    })();

    (function () {
        /**
         * @description returns the element that 2 arrays have in common
         * @param {array} arr1
         * @param {array} arr2
         * @returns {array}
         * @alias app.arrayIntersect
         */
        function arrayIntersect (arr1, arr2) {
            var arrays = [arr1, arr2];

            return arrays.sort().shift().filter(function (v) {
                return arrays.every(function (a) {
                    return a.indexOf(v) !== -1;
                });
            });
        }

        return app.arrayIntersect = arrayIntersect;
    })();

    (function () {
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
            var includedTag = app.getTags().included;
            var excludedTag = app.getTags().excluded;
            var includedFeature = [];
            var excludedFeature = [];

            (function parseFeature (featuresObj) {
                Object.keys(featuresObj).forEach(function (key) {
                    if (featuresObj[key].type === 'file' && featuresObj[key].tags) {
                        if (app.arrayIntersect(featuresObj[key].tags, includedTag).length) {
                            includedFeature.push(getFeatureName(featuresObj[key].path));
                        }
                        if (app.arrayIntersect(featuresObj[key].tags, excludedTag).length) {
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
            })(featuresObj);

            app.printFeature(includedFeature, includedFeaturesWrapper);
            app.printFeature(excludedFeature, excludedFeaturesWrapper);

            app.updateFeaturesToRun();
        }

        /**
         * @namespace
         * @description manage the tags section
         * @param {array} tagsArr - The array of the tags found in the features files
         * @alias app.manageTags
         */
        function init (tagsArr) {
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

        return app.manageTags = init;
    })();

    (function () {
        /**
         * @namespace
         * @description create an element with an optional class and text content
         * @param {attrObjForCreateEl} attrObj
         * @returns {element}
         * @alias app.createEl
         */
        function createEl (attrObj) {
            /**
             * @typedef {Object} attrObjForCreateEl
             * @property {string} elTag - The tag of the element to create
             * @property {string} class - Class (or classes space separated) to assign to the newly created element
             * @property {string|element} text - string or element to set as content of the newly created element
             */
            var el = document.createElement(attrObj.elTag);
            if (attrObj.text) {
                var text = (typeof attrObj.text  === 'string') ? document.createTextNode(attrObj.text) : attrObj.text;
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

        return app.createEl = createEl;
    })();

    (function () {
        /**
         * @desc create an input field (checkbox or radio buttn) + its label and append them to the parent
         * @param {attrObjForInput} attrObj
         */
        function insertInput (attrObj) {
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
            var label = app.createEl({
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

        return app.insertInput = insertInput;
    })();

    (function () {
        /**
         * @namespace
         * @description recursively print features folder content
         * @param {featuresDataObj} obj
         * @param {element} parent - The parent element of the new line
         * @alias app.insertFeatureLine
         */

        /**
         * @desc converts a response object into an array
         * @param obj {object}
         * @returns {Array}
         */
        function convertResponseObjToArray(obj) {
            return Object.keys(obj).map(function(key) {
                return Object.assign({},obj[key],{label: key});
            });
        }
        
        function insertLine (obj, parent) {
            /**
             * @typedef {Object} featuresDataObj
             * @description a recursive object containing data on features
             * @property {string} type - 'dir' or 'file'
             * @property {path} path - the absolute path to the folder or file
             * @property {featuresDataObj} subdir - a featuresDataObj of the subfolder eventually present in a folder
             * @property {array} tags - the tags eventually present in a feature
             */

            var arr = convertResponseObjToArray(obj).sort(function(a,b) {
                return a.label > b.label;
            });

            arr.forEach(function(line) {
                if (line.type === 'file') {
                    //Collect tags
                    let localTags = line.tags;
                    let localTagsLabel = '';
                    if (localTags && localTags.length) {
                        tags = tags.concat(localTags);
                        localTagsLabel = ' (TAG: ' + localTags.join(', ') + ')';
                    }

                    app.insertInput({
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
                } else { //directories
                    var fieldset = app.createEl({
                        elTag: 'fieldset',
                        class: 'folderWrapper ' + line.label + '_wrapper'
                    });
                    var closeContainer = app.createEl({
                        elTag: 'span',
                        text: '',
                        class: 'closeTxt'
                    });
                    var openContainer = app.createEl({
                        elTag: 'span',
                        text: '',
                        class: 'openTxt'
                    });
                    var div = app.createEl({
                        elTag: 'div',
                        class: 'featureFiles'
                    });
                    var openCloseContainer = document.createElement('span');

                    openCloseContainer.appendChild(openContainer);
                    openCloseContainer.appendChild(closeContainer);
                    openCloseContainer.appendChild(document.createTextNode(line.label));
                    parent.appendChild(fieldset);

                    app.insertInput({
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
                    app.insertInput({
                        type: 'radio',
                        name: 'selectFolder',
                        value: line.label,
                        labelText: 'select folder',
                        className: 'folderBtn',
                        labelClass: 'button selectFolder',
                        dataPath: line.path,
                        dataType: 'dir',
                        id: line.value + '_entire',
                        parent: fieldset
                    });
                    app.insertInput({
                        type: 'checkbox',
                        value: line.value,
                        labelText: 'exclude folder',
                        className: 'folderBtn',
                        labelClass: 'button excludeFolder',
                        dataPath: line.path,
                        dataType: 'exclude',
                        id: line.value + '_entireExclude',
                        parent: fieldset
                    });
                    fieldset.appendChild(div);
                    insertLine(line.subDir, div);
                }
            });
        }

        return app.insertFeatureLine = insertLine;
    })();

    (function () {
        /**
         * @namespace
         * @description get the tags to include/exclude
         * @returns {tags}
         * @alias app.getTags
         */
        function init () {
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

        return app.getTags = init;
    })();

    (function () {
        /**
         * @namespace
         * @description gather all the data from the form
         * @param form {element}
         * @alias app.getFormData
         */
        function getFormData (form) {
            var dataObj = {
                environments: [],
                dir: ''
            };
            var tagsIncluded = app.getTags().included;
            var tagsExcluded = app.getTags().excluded;

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

        app.getFormData = getFormData;
    })();

    (function () {
        /**
         * @namespace
         * @description send the POST request
         * @param dataObj {object} - data to send
         * @param url {string}
         * @param callback {function}
         * @alias app.ajaxPost
         */
        function ajaxPost (dataObj, url, callback) {
            var xhr = new XMLHttpRequest();

            xhr.open('POST', url);
            xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        alert('Server not responding, check if it\'s running');
                        return;
                    }
                    console.log(xhr.status, xhr.responseText);
                    callback();
                }
            };

            xhr.send(JSON.stringify(dataObj));

            // window.fetch(url, {
            //     method: 'post',
            //     headers: new Headers({
            //         'Content-Type': 'application/json; charset=UTF-8'
            //     }),
            //     body: JSON.stringify(dataObj)
            // }).then(function (response) {
            //     console.log('Form submit status: ', response.statusText);
            // }).catch(function (err) {
            //     console.log('post error: ',err);
            //     alert('Server not responding, check if it\'s running');
            // });
        }

        return app.ajaxPost = ajaxPost;
    })();

    (function () {
        /**
         * @namespace
         * @description handle the form submit button
         * @alias app.handleFormSubmit
         */
        function init () {
            submitBtn.addEventListener('click', function (e) {
                e.preventDefault();

                var dataObj = app.getFormData(form);

                app.ajaxPost(dataObj, host+'/launchspy', function () {
                    testRunningMsg.setAttribute('style', '');
                });

                //Setup socket listener to get nightwatch console messages
                //Remove previous listener eventually present to avoid duplicates
                socket.removeAllListeners('nightwatchConsoleMsg');
                socket.on('nightwatchConsoleMsg', function (msg) {
                    //console.log(msg);
                    var p = document.createElement('p');

                    p.innerHTML = msg;
                    testRunningMsg.appendChild(p);
                    testRunningMsg.scrollTop = testRunningMsg.scrollHeight;
                });
            });
        }

        return app.handleFormSubmit = init;
    })();

    (function () {
        /**
         * @namespace
         * @description returns the sibling of an element with the specified data-type
         * @alias app.getSiblingByType
         * @param {element} el
         * @param {string} elType - The type of the sibling to return
         * @returns {element}
         */
        function getSiblingByTypeStarter (el, elType) {
            return getSiblingByType(el.parentElement.firstElementChild, elType);
        }

        function getSiblingByType (el, elType) {
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

        return app.getSiblingByType = getSiblingByTypeStarter;
    })();

    (function () {
        /**
         * @desc check if one of el parents are equal to elToMatch
         * @param el {element}
         * @param elToMatch {element}
         * @returns {boolean}
         */
        function checkParentsAre (el, elToMatch) {
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
         * @namespace
         * @desc returns the sibling of a folder select/exclude button
         * @alias app.handleFolderClick
         */
        function init () {
            document.addEventListener('featureListReady', function () {
                [].forEach.call(document.querySelectorAll('.folderBtn'), function (btn) {
                    btn.addEventListener('click', function (e) {
                        if (e.currentTarget.checked) {
                            //Uncheck sibling button
                            let siblingBtn = app.getSiblingByType(e.currentTarget, (e.currentTarget.dataset.type === 'dir')? 'exclude' : 'dir');
                            if (siblingBtn && siblingBtn.checked) {
                                siblingBtn.checked = false;
                            }

                            //Uncheck file selection
                            let elType = e.currentTarget.dataset.type;
                            if (elType && (elType === 'dir' || elType === 'exclude')) {
                                let fileBtnChecked = document.querySelector('[data-type="file"]:checked');
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
                                })
                                .filter(function (excludeBtn) {
                                    return !checkParentsAre(excludeBtn, childFolderOfSelectedFolder);
                                })
                                .forEach(function (excludeBtn) {
                                    excludeBtn.disabled = true;
                                    excludeBtn.checked = false;
                                })
                                ;
                            }
                        }

                        app.updateFeaturesToRun();
                    });
                });
            });
        }

        return app.handleFolderClick = init;
    })();

    (function () {
        /**
         * @namespace
         * @desc Check/Uncheck parent folder include/exclude button when a file is selected
         * @alias app.handleFileClick
         */
        function init () {
            document.addEventListener('featureListReady', function () {

                [].forEach.call(document.querySelectorAll('[name="selectFile"]'), function (btn) {
                    btn.addEventListener('click', function (e) {
                        let parentFolderBtn = app.getSiblingByType(e.currentTarget.closest('fieldset').firstElementChild, 'dir');
                        let parentExcludeFolderBtn = app.getSiblingByType(e.currentTarget.closest('fieldset').firstElementChild, 'exclude');

                        if (!parentFolderBtn.checked) {
                            parentFolderBtn.checked = true;
                        }

                        if (parentExcludeFolderBtn.checked) {
                            parentExcludeFolderBtn.checked = false;
                        }

                        app.updateFeaturesToRun();
                    });
                });
            });
        }

        return app.handleFileClick = init;
    })();

    (function () {
        /**
         * @namespace
         * @desc Manage the reset button click
         * @alias app.resetClick
         */
        function init () {
            document.getElementById('resetButton').addEventListener('click', function () {
                var tagList = document.getElementById('tagsList');

                //Move all the tags back to the tag list
                [].forEach.call(document.querySelectorAll('.tagsDropAreaWrapper li'), function (tag) {
                    tagList.appendChild(tag);
                });

                //Empty included/excluded feature lists
                app.printFeature([], includedFeaturesWrapper);
                app.printFeature([], excludedFeaturesWrapper);

                //Close test output
                testRunningMsg.setAttribute('style', 'display: none;');

                //Wait for html reset and then update features to run list
                setTimeout(app.updateFeaturesToRun, 0);
            });
        }
        return app.resetClick = init;
    })();

    (function () {
        /**
         * @namespace
         * @desc Update the list of features to run according to the selections
         * @alias app.updateFeaturesToRun
         */
        function updateFeaturesToRun () {
            var selectedFolderEl = document.querySelector('[data-type="dir"]:checked');
            var collecting = (selectedFolderEl.dataset.path === 'all') ? true : false;
            var selectedFeatures = [];
            var includedTag = app.getTags().included;
            var excludedTag = app.getTags().excluded;
            var excludedFolders = [].map.call(document.querySelectorAll('[data-type="exclude"]:checked'), function (el) {
                return el.dataset.path;
            });
            var selectedFile = document.querySelector('[data-type="file"]:checked');

            featuresToRunContainer.innerHTML = '';

            (function processFeatureLine (obj) {
                var key;

                for (key in obj) {
                    if (obj[key].type === 'file') {
                        if (!app.arrayIntersect(excludedTag, obj[key].tags).length
                            && collecting
                            && (!includedTag.length || app.arrayIntersect(includedTag, obj[key].tags).length)
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
            })(featuresObj);

            if (!selectedFeatures.length) {
                selectedFeatures = ['No features selected!'];
                featuresToRunContainer.classList.add('error');
                submitBtn.disabled = true;
            } else  {
                featuresToRunContainer.classList.remove('error');
                submitBtn.disabled = false;
            }
            app.printFeature(selectedFeatures, featuresToRunContainer);
        }

        return app.updateFeaturesToRun = updateFeaturesToRun;
    })();

    ////////////////
    //Module calls//
    ////////////////
    app.getRequest(host+'/environments', function (responseObj) {
        var parent = document.getElementById('environmentsFormInner');

        Object.keys(responseObj).forEach(function (key) {
            app.insertInput({
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

    app.getRequest(host+'/features', function (responseObj) {
        //Cache response
        featuresObj = responseObj;

        app.insertFeatureLine(responseObj, document.getElementById('filesFormInner'));

        if (tags.length) {
            let uniqueTags = tags.sort().filter(function (item, pos, self) {
                return self.indexOf(item) === pos;
            });
            app.manageTags(uniqueTags);
        }
        app.updateFeaturesToRun();
        document.dispatchEvent(featureListReady);
    });

    app.handleFormSubmit();
    app.handleFolderClick();
    app.handleFileClick();
    app.resetClick();
})();
