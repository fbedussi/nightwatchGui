import getSiblingByType from './getSiblingByType';
import updateFeaturesToRun from './updateFeaturesToRun';

/**
 * @desc Check/Uncheck parent folder include/exclude button when a file is selected
 */
function handleFileClick() {
    document.addEventListener('featureListReady', function () {

        [].forEach.call(document.querySelectorAll('[name="selectFile"]'), function (btn) {
            btn.addEventListener('click', function (e) {
                let parentFieldset = e.currentTarget.closest('fieldset');
                let parentFolderBtn = parentFieldset? getSiblingByType(parentFieldset.firstElementChild, 'dir') : null;
                let parentExcludeFolderBtn = parentFieldset? getSiblingByType(parentFieldset.firstElementChild, 'exclude') : null;

                if (parentFolderBtn && !parentFolderBtn.checked) {
                    parentFolderBtn.checked = true;
                }

                if (parentExcludeFolderBtn && parentExcludeFolderBtn.checked) {
                    parentExcludeFolderBtn.checked = false;
                }

                updateFeaturesToRun();
            });
        });
    });
}

export default handleFileClick;
