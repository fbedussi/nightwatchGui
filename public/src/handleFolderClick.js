import getSiblingByType from './getSiblingByType';
import updateFeaturesToRun from './updateFeaturesToRun';

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
 * @desc returns the sibling of a folder select/exclude button
 */
function handleFolderClick () {
    document.addEventListener('featureListReady', function () {
        [].forEach.call(document.querySelectorAll('.folderBtn'), function (btn) {
            btn.addEventListener('click', function (e) {
                if (e.currentTarget.checked) {
                    //Uncheck sibling button
                    let siblingBtn = getSiblingByType(e.currentTarget, (e.currentTarget.dataset.type === 'dir')? 'exclude' : 'dir');
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

                updateFeaturesToRun();
            });
        });
    });
}

export default handleFolderClick;