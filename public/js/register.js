    $('#showPassword').click(function() {
        var $pwd = $('#password');
        var $cpwd = $('#cpassword');
        if ($pwd.attr('type') === 'password' && $cpwd.attr('type') === 'password') {
            $pwd.attr('type', 'text');
            $cpwd.attr('type', 'text');
        } else {
            $pwd.attr('type', 'password');
            $cpwd.attr('type', 'password');
        }
    });

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const isValidPassword = password => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(String(password));
    }

    const isValidPhone = phone => {
        const re = /^[0-9]{10}$/;
        return re.test(String(phone));
    }

    const isValidName = name => {
        const re = /^[a-zA-Z ]{2,30}$/;
        return re.test(String(name));
    }

    $('#name').change(function() {
        if(!isValidName($(this).val())){
            $(this).css('border', '2px solid red');
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
            $('.nameWarning').text('*Name must be atleast 3 characters long');
        }
        else{
            $(this).css('border', '2px solid green');
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
            $('.nameWarning').text('');
        }
    })

    $('#email').change(function() {
        if(!isValidEmail($(this).val())){
            $(this).css('border', '2px solid red');
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        }
        else{
            $(this).css('border', '2px solid green');
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
    })

    $('#password').change(function() {
        if(!isValidPassword($(this).val())){
            $(this).css('border', '2px solid red');
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
            $('.passWarning').text('*Password must be atleast 8 characters long and must contain atleast one uppercase, one lowercase, one number and one special character');
        }
        else{
            $(this).css('border', '2px solid green');
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
            $('.passWarning').text('');

        }
    })

    $('#cpassword').change(function() {
        if(!isValidPassword($(this).val())){
            $(this).css('border', '2px solid red');
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        }
        else{
            $(this).css('border', '2px solid green');
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
    })

    $('#phone').change(function() {
        if(!isValidPhone($(this).val())){
            $(this).css('border', '2px solid red');
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        }
        else{
            $(this).css('border', '2px solid green');
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
    });

    $('#address').change(function() {
        if($(this).val().length < 5){
            $(this).css('border', '2px solid red');
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        }
        else{
            $(this).css('border', '2px solid green');
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
    });

    $('#registerForm').submit(function(e) {
        e.preventDefault();
        var count = 0;
        if(!isValidName($('#name').val())){
            $('#name').css('border', '2px solid red');
            $('#name').addClass('is-invalid');
            $('.nameWarning').text('*Name must be atleast 3 characters long');
            count++;
        }
         if(!isValidEmail($('#email').val())){
            $('#email').css('border', '2px solid red');
            $('#email').val('');
            $('#email').addClass('is-invalid');
            $('#email').attr('placeholder', 'Email is not valid');
            count++;
        }
        if(!isValidPassword($('#password').val())){
            $('#password').css('border', '2px solid red');
            $('#cpassword').css('border', '2px solid red');
            $('#password').addClass('is-invalid');
            $('#cpassword').addClass('is-invalid');
            $('.passWarning').text('*Password must be atleast 8 characters long and must contain atleast one uppercase, one lowercase, one number and one special character');
            count++;
        }
        else
        if($('#password').val() !== $('#cpassword').val()){
            $('#cpassword').css('border', '2px solid red');
            $('#password').css('border', '2px solid red');
            $('#cpassword').val('');
            $('#password').val('');
            $('#cpassword').addClass('is-invalid');
            $('#password').addClass('is-invalid');
            $('#password').attr('placeholder', 'Password does not match');
            $('#cpassword').attr('placeholder', 'Password does not match');
            count++;
        }
        if(!isValidPhone($('#phone').val())){
            $('#phone').css('border', '2px solid red');
            $('#phone').val('');
            $('#phone').addClass('is-invalid');
            $('#phone').attr('placeholder', 'Phone number must be 10 digits');
            count++;
        }
        if(count == 0){
            $(this).unbind('submit').submit();
        }
    });

    function onlyNumberKey(evt) {
          
        // Only ASCII character in that range allowed
        var ASCIICode = (evt.which) ? evt.which : evt.keyCode
        if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
            return false;
        return true;
    }

    $('#phone').keypress(function(e) {
        return onlyNumberKey(e);
    });








