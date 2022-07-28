$(document).ready(function() {
    $('#showPassword').click(function() {
        var $pwd = $('#password');
        if ($pwd.attr('type') === 'password') {
            $pwd.attr('type', 'text');
        } else {
            $pwd.attr('type', 'password');
        }
    });
});
