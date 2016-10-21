/**
 * @namespace
 * @description returns the sibling of an element with the specified data-type
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

export default getSiblingByTypeStarter;
