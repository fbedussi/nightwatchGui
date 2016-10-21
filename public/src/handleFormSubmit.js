import getFormData from './getFormData';
import ajaxPost from './ajaxPost';
import {submitBtn, testRunningMsg} from './globals'

var form = document.getElementById('filesForm');

/**
 * @description handle the form submit button
 */
function handleFormSubmit(host) {
    /* global io */
    var socket = io.connect(host);
    
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        var dataObj = getFormData(form);

        ajaxPost(dataObj, host+'/launchspy', function () {
            testRunningMsg.setAttribute('style', '');
        });

        //Setup socket listener to get nightwatch console messages
        //Remove previous listener eventually present to avoid duplicates
        socket.removeAllListeners('nightwatchConsoleMsg');
        socket.on('nightwatchConsoleMsg', function (msg) {
            //console.log(msg);
            var p = document.createElement('p');

            p.innerHTML = msg;
            testRunningMsg.appendChild(p);
            testRunningMsg.scrollTop = testRunningMsg.scrollHeight;
        });
    });
}

export default handleFormSubmit;