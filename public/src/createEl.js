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

export default createEl;
