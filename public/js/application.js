$(document).ready(function() {
    if(window.location.href.match(/\application/)){
        $('.application').addClass('active');
    }
    if(window.location.href.match(/\applyTo/)){
        $('.applied').removeClass('active');
        $('.applyTo').addClass('active');
    }
    else if(window.location.href.match(/\applied/)){
        $('.applyTo').removeClass('active');
        $('.applied').addClass('active');
    }
    $('.allApplications').each(function(){
        const href = $(this).attr('href');
        if(window.location.href.includes(href)){
            $(this).children('.card').addClass('light');
        }
    });
});