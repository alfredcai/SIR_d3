//misc event
document.addEventListener('DOMContentLoaded', function () {
    var tag = document.querySelectorAll(".tag");
    console.log(tag);
    tag.forEach(function (e) {
        e.addEventListener('click',function(){
            window.location.replace('sir.html')
        })
    })
});