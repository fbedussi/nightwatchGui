/**
 * @description execute a GET request
 * @param {string} url
 * @param {function} callback
 */
function getRequest(url, callback) {
    window.fetch(url, {
            method: 'get'
        })
    .then(response => response.json())
    .then(responseJson => callback(responseJson))
    .catch(err => console.log('Error: ' + err));
}

export default getRequest;
