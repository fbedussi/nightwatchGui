import getSiblingByType from './getSiblingByType';
import updateFeaturesToRun from './updateFeaturesToRun';

/**
 * @desc Check/Uncheck parent folder include/exclude button when a file is selected
 */
function handleFileClick() {
    document.addEventListener('featureListReady', function () {

        [].forEach.call(document.querySelectorAll('[name="selectFile"]'), function (btn) {
            btn.addEventListener('click', function (e) {
                let parentFolderBtn = getSiblingByType(e.currentTarget.closest('fieldset').firstElementChild, 'dir');
                let parentExcludeFolderBtn = getSiblingByType(e.currentTarget.closest('fieldset').firstElementChild, 'exclude');

                if (!parentFolderBtn.checked) {
                    parentFolderBtn.checked = true;
                }

                if (parentExcludeFolderBtn.checked) {
                    parentExcludeFolderBtn.checked = false;
                }

                updateFeaturesToRun();
            });
        });
    });
}

export default handleFileClick;
