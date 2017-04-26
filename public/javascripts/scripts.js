function changeRoute() {
    
    var keyPressed = event.keyCode || event.which;

    if(keyPressed==13) {
        window.location.href = '/search';
    } else {
        return false;
    }
}

function changeRouteButton() {
    
    
    window.location.href = '/search';
    
}



