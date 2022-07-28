/* global bootstrap: false */
(() => {
    'use strict'
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
  })()


$(".collapse-head").hover(
    function() {
       $('#collapseLeads').collapse('show');
       $('.dropdown-img-leads').css('transform', 'rotate(180deg)');
     }, function() {
       $('#collapseLeads').collapse('hide');
         $('.dropdown-img-leads').css('transform', 'rotate(0deg)');
     }
   );

$(".collapse-head-Contact").hover(
    function() {
       $('#collapseContact').collapse('show');
       $('.dropdown-img-contact').css('transform', 'rotate(180deg)');
     }, function() {
       $('#collapseContact').collapse('hide');
         $('.dropdown-img-contact').css('transform', 'rotate(0deg)');
     }
   );


$(".nav-link").click(function () {
    // If the clicked element has the active class, remove the active class from EVERY .nav-link>.state element
    if ($(this).hasClass("active")) {
      $(".nav-link").removeClass("active");
    }
    // Else, the element doesn't have the active class, so we remove it from every element before applying it to the element that was clicked
    else {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    }
  });

// set the current page to active
$('.nav-link').each(function () {
    var $this = $(this);
    // console.log($this.attr('href'));
    // console.log(window.location.pathname);
    if ($this.attr('href') === window.location.pathname) {
      $(".nav-link").removeClass("active");
        $this.addClass('active');
    }
}
);

// Highlight the collapse head if collapse body is active
$('.list').each(function(){
  if($(this).hasClass('active')){
    console.log($(this).siblings());
    // $(this).parent().addClass('highlight');
    $(this).parent().parent().parent().siblings('.nav-link').addClass('higlightBg');
  }
})

if(window.location.href.match(/\/task/)){
  $('.sidebar-button > .nav-link').removeClass('active');
  $('.task').addClass('active');
}

// Highlight on hover


