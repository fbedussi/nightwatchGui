import createEl from './createEl';

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
    var label = createEl({
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

export default insertInput;
