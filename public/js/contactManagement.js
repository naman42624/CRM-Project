$(document).ready(function() {
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        var form = $(this);
        var formData = form.serialize();
        console.log(formData);
        $.ajax({
            type: 'POST',
            url: '/user/contactManagement',
            data: formData,
            success: function(data) {
                $('#contactForm > .card').fadeOut(1000).fadeIn(1000);
                $('#contactForm').find('textarea').val('');
                $('#contactForm').find('select').val($('#contactForm').find('select option:first').val());
            }
        });
    });
});