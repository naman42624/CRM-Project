$(document).ready(function() {
    if(window.location.href.match(/\/assignedBy/)){
        $('#taskBread > #assignedTo').addClass('active');
        $('#taskBread > #assignedTo > a').addClass('text-muted');
    }
    else{
        $('#taskBread > #assignedBy').addClass('active');
        $('#taskBread > #assignedBy > a').addClass('text-muted');
    }
    
})