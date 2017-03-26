/**
 * Created by tushargupta on 3/26/17.
 */
var button = document.getElementById('buttonup'); // Assumes element with id='button'

button.onclick = function() {
    var div = document.getElementById('newpost');
    div.style.visibility = 'hidden';
    var div = document.getElementById('newpost2');
    div.style.visibility = 'hidden';
};

var button2 = document.getElementById('buttondown'); // Assumes element with id='button'

button2.onclick = function() {
    var div2 = document.getElementById('newpost');
    div2.style.visibility = 'visible';
    var div2 = document.getElementById('newpost2');
    div2.style.visibility = 'visible';
};