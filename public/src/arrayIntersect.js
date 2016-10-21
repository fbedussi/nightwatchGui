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

export default arrayIntersect;
