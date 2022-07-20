
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


// <%- include('../partials/header')  -%> 

// <link rel="stylesheet" href="/css/application.css">
// </head>
// <body>
//            <!-- Tab-bar -->
//            <%- include('../partials/navBar') -%> 
//            <%- include('../partials/tabBar',{lead: enrolledLead}) -%>
          
   
//                <div class="p-4">
//                    <div class="head">
//                        <div class="table-responsive">
//                            <table class="table table-hover" width="100%" cellspacing="0">
//                                <thead class="table-light">
//                                    <tr>
//                                        <th>Name</th>
//                                        <th>Email</th>
//                                        <th>Phone</th>
//                                        <th>Student Enrolment Date</th>
//                                    </tr>
//                                </thead>
//                                <tbody class="table-group-divider">
//                                    <tr>
//                                        <td>
//                                            <%= enrolledLead.name %>
//                                        </td>
//                                        <td>
//                                            <%= enrolledLead.username %>
//                                        </td>
//                                        <td>
//                                            <%= enrolledLead.phone %>
//                                        </td>
//                                        <td>
//                                            <% const cDate1=new Date(enrolledLead.enrollmentDate).toLocaleDateString("en-GB") %>
//                                                <%= cDate1 %>
//                                        </td>
//                                    </tr>
//                                </tbody>
//                            </table>
//                        </div>
//                    </div>
   
//                    <ul class="nav nav-tabs nav-fill bg-light">
//                        <li class="nav-item active">
//                            <a class="nav-link fs-4 fw-bold" href="/enrolled/application/<%= enrolledLead._id %>">Apply To Program</a>
//                        </li>
//                        <li class="nav-item">
//                            <a class="nav-link fs-4 fw-bold" href="/enrolledUser/appliedProgram/<%= enrolledLead._id %>">Applied Programs</a>
//                        </li>    
//                    </ul>
//                 <% for(var i = 0; i < application.length; i++){ %>
                
//                     Name : <%= application[i].name %> <br>
//                     Status : <%= application[i].status %> <br>
                    
//                     <form action="/">
//                         <select name="currentStatus" id="currentStatus" value="<%= application[i].status >/<%= application[i].paymentStatus >">
//                             <% if(<%= application[i].status >){ %>
//                             <option value=""><%= application[i].status ></option>
//                             <% } %>
//                             <option value="Enrolled">Enrolled</option>
//                             <option value="applicationSent">Application Sent</option>------------|
//                             <option value="applicationApplied">Application Applied</option>------|
//                     |-------<option value="offerLetterReceived">Offer Letter Received</option>--------------------------------------------------------------|
//                     |    only Fee after this---|----<option value="offerLetterRejected">Offer Letter Rejected</option>--------------------------------------|-e
//                     |<-----<option value="documentsRequestedByInstitution">Documents Requested By Institution</option>-------------------------------------|
//                     documents can be requested after partial fee
//                     document request by filing/sop
//                     don't move below before full fee paymentß
//                             <option value="visaFileProcessing">Visa File Processing</option>
//                             <option value="fileLodged">File Lodged</option>
//                             <option value="biometricsDone">Biometrics Done</option>
//                             <option value="visaApproved">Visa Approved</option>
//                             <option value="visaRejected">Visa Rejected</option>
//                             <option value="interviewScheduled">Interview Scheduled</option>
//                             <option value="interviewDone">Interview Done</option>
//                             <option value="interviewCleared">Interview Cleared</option>
//                             <option value="interviewRejected">Interview Rejected</option>
//                         </select>
//                     </form>
//                     <% } %>

//                     <div class="enrolld box">
//                         <h1>enrolld</h1>
//                     </div>
//                     <div class="applicationSent box">
//                         <h1>applicationSent</h1>
//                     </div>
//                     <div class="applicationApplied box">
//                         <h1>applicationApplied</h1>
//                     </div>
//                     <div class="offerLetterReceived box">
//                         <h1>offerLetterReceived</h1>
//                     </div>
//                     <div class="offerLetterRejected box">
//                         <h1>offerLetterRejected</h1>
//                     </div>
//                     <div class="documentsRequestedByInstitution box">
//                         <h1>documentsRequestedByInstitution</h1>
//                     </div>
//                     <div class="visaFileProcessing box">
//                         <h1>visaFileProcessing</h1>
//                     </div>
//                     <div class="fileLodged box">
//                         <h1>fileLodged</h1>
//                     </div>
//                     <div class="visaApproved box">
//                         <h1>visaApproved</h1>
//                     </div>
//                     <div class="visaRejected box">
//                         <h1>visaRejected</h1>
//                     </div>
//                     <div class="biometricsDone box">
//                         <h1>biometricsDone</h1>
//                     </div>
//                     <div class="interviewDone box">
//                         <h1>interviewDone</h1>
//                     </div>
//                     <div class="interviewScheduled box">
//                         <h1>interviewScheduled</h1>
//                     </div>
//                     <div class="interviewCleared box">
//                         <h1>interviewCleared</h1>
//                     </div>
//                     <div class="interviewRejected box">
//                         <h1>interviewRejected</h1>
//                     </div>

//                 <script>

// $(document).ready(function() {
//     $('#currentStatus').each(function(){
//         const arr = ($(this).attr('value')).split('/');
//         const status = arr[0];
//         const paymentStatus = arr[1];

//     });
// })

// $(document).ready(function () {
//             $("#currentStatus").change(function () {
//                 $(this).find("option:selected")
//                        .each(function () {
//                     var optionValue = $(this).attr("value");
//                     if (optionValue) {
//                         $(".box").not("." + optionValue).hide();
//                         $("." + optionValue).show();
//                     } else {
//                         $(".box").hide();
//                     }
//                 });
//             }).change();
//         });
//                 </script>
// <%- include('../partials/footer')  -%>

// </body>
// </html>