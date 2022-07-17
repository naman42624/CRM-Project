
// const disableModal = async () => {
    
// }

$(document).ready(function() {
    $('.editDetails').each(function(){
        const arr = ($(this).attr('value')).split('/');
        const call = arr[0];
        const followUps = arr[1];
        console.log(call);
        console.log(followUps);
        if(call !== "Answered" && Number(followUps) <2){
            $(this).addClass('disabled');
        }
    });
})

// $('.editDetails').()
    

// $('.editDetails').click(function(){
//     const arr = ($(this).attr('value')).split('/');
//     const call = arr[0];
//     const followUps = arr[1];
//     console.log(call);
//     console.log(followUps);
//     if(call !== "Answered" && followUps !== "2"){
//         $('#updateLead').modal('hide');
//     }
// });
