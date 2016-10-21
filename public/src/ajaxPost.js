/**
 * @description send the POST request
 * @param dataObj {object} - data to send
 * @param url {string}
 * @param callback {function}
 */
function ajaxPost (dataObj, url, callback) {
    window.fetch(url, {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        }),
        body: JSON.stringify(dataObj)
    }).then(function (response) {
        console.log('Form submit status: ', response.statusText);
        callback();
    }).catch(function (err) {
        console.log('post error: ',err);
        alert('Server not responding, check if it\'s running');
    });
}

export default ajaxPost;
