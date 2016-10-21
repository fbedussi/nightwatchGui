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

export default getTags;