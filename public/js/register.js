// function readURL(input) {
//     if (input.files && input.files[0]) {
//       var reader = new FileReader();
//       reader.onload = function(e) {
//         $('#preview').attr('src', e.target.result);
//       }
//       reader.readAsDataURL(input.files[0]);
//     } else {
//       alert('select a file to see preview');
//       $('#preview').attr('src', '');
//     }
//   }
  
//   $("#imageUpload").change(function() {
//     readURL(this);
//   });

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
            $('.nameWarning').text('*Name must be atleast 3 characters long');
        }
        else{
            $(this).css('border', '2px solid green');
            $('.nameWarning').text('');
        }
    })

    $('#email').change(function() {
        if(!isValidEmail($(this).val())){
            $(this).css('border', '2px solid red');
        }
        else{
            $(this).css('border', '2px solid green');
        }
    })

    // $('#password').change(function() {
    //     if(!isValidPassword($(this).val())){
    //         $(this).css('border', '2px solid red');
    //         $('.passWarning').text('*Password must be atleast 8 characters long and must contain atleast one uppercase, one lowercase, one number and one special character');
    //     }
    //     else{
    //         $(this).css('border', '2px solid green');
    //         $('.passWarning').text('');
    //     }
    // })

    // $('#cpassword').change(function() {
    //     if(!isValidPassword($(this).val())){
    //         $(this).css('border', '2px solid red');
    //     }
    //     else{
    //         $(this).css('border', '2px solid green');
    //     }
    // })

    $('#phone').change(function() {
        if(!isValidPhone($(this).val())){
            $(this).css('border', '2px solid red');
        }
        else{
            $(this).css('border', '2px solid green');
        }
    });

    $('#registerForm').submit(function(e) {
        e.preventDefault();
        var count = 0;
        if(!isValidName($('#name').val())){
            $('#name').css('border', '2px solid red');
            $('.nameWarning').text('*Name must be atleast 3 characters long');
            count++;
        }
         if(!isValidEmail($('#email').val())){
            $('#email').css('border', '2px solid red');
            $('#email').val('');
            $('#email').attr('placeholder', 'Email is not valid');
            count++;
        }
        // if(!isValidPassword($('#password').val())){
        //     $('#password').css('border', '2px solid red');
        //     $('#cpassword').css('border', '2px solid red');
        //     $('.passWarning').text('*Password must be atleast 8 characters long and must contain atleast one uppercase, one lowercase, one number and one special character');
        //     count++;
        // }
        // else
        // if($('#password').val() !== $('#cpassword').val()){
        //     $('#cpassword').css('border', '2px solid red');
        //     $('#password').css('border', '2px solid red');
        //     $('#cpassword').val('');
        //     $('#password').val('');
        //     $('#password').attr('placeholder', 'Password does not match');
        //     $('#cpassword').attr('placeholder', 'Password does not match');
        //     count++;
        // }
        if(!isValidPhone($('#phone').val())){
            $('#phone').css('border', '2px solid red');
            $('#phone').val('');
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








