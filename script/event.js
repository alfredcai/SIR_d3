// misc event
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkError, 10 * 1000);

    function checkError() {
        const error = document.getElementsByClassName('error');
        if (error) {
            for (let i = 0; i < error.length; i++) {
                error[i].remove();
            }
        }
        setTimeout(checkError, 10 * 1000);
    }
});
