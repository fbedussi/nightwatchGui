import getTags from './getTags';

/**
 * @description gather all the data from the form
 * @param form {element}
 */
function getFormData(form) {
    var dataObj = {
        environments: [],
        dir: ''
    };
    var tagsIncluded = getTags().included;
    var tagsExcluded = getTags().excluded;

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

export default getFormData;
