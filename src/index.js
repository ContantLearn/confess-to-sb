let href = window.location.href;
if (href.indexOf("?") > -1) {
    window.location.href = 'confess.html?' + href.split("?")[1];
}
else {
    window.location.href = 'confess.html';
}


