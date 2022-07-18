
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

// $(document).ready(function() {
//     $('.editDetail').each(function(){
//         const arr = ($(this).attr('value')).split('/');
//         const status = arr[0];
//         const followUps = arr[1];
//         console.log(status);
//         console.log(followUps);
//         if(Number(followUps) < 2){
//             $(this).addClass('disabled');
//         }
//         else if(status !== "Cold" && (Number(followUps) === 2 || (Number(followUps)-2)%4 === 0)){
//             $(this).addClass('disabled');
//         }
//         else{
//             $(this).addClass('disabled');
//         }
//     });
// })
// $(document).ready(function() {
//     $('.editDetail').each(function(){
//         const arr = ($(this).attr('value')).split('/');
//         const status = arr[0];
//         const followUps = arr[1];
//         console.log(status);
//         console.log(followUps);
//         $(this).addClass('disabled');
//         if(Number(followUps) === 2 || (Number(followUps)-2)%4 === 0){
//             $(this).removeClass('disabled');
//         }
//         // cold -> hot anytime
//         // cold -> dead 3 followups
//     });
// })


$(document).ready(function() {
    $('.editDetail').each(function(){
        const arr = ($(this).attr('value')).split('/');
        const status = arr[0];
        const followUps = arr[1];
        const washot = arr[2];
        console.log(status);
        console.log(followUps);
        console.log(washot);
        if(status ==="Hot"){
            $("#dead").attr('disabled', true);
            if(Number(followUps) > 1 && Number(followUps) < 5){
                $("#cold").attr('disabled', true);
            }
        }
        else if(status ==="Cold"){
            if(Number(followUps) < 4 && washot === "false"){
                $("#dead").attr('disabled', true);
            }
            else if(Number(followUps) < 3 && washot === "true"){
                $("#dead").attr('disabled', true);
            }   
        }
        // cold -> hot anytime
        // cold -> dead 3 followups
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
