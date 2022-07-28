
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




// <%- include('../partials/header') -%>

//     <link rel="stylesheet" href="/css/application.css">
//     </head>

    // <script src="https://code.jquery.com/jquery-1.12.4.min.js">
    // </script>
    // <script>

    //     $(document).ready(function () {
    //         $('#currentStatus').each(function () {
    //             const arr = ($(this).attr('value')).split('/');
    //             const status = arr[0];
    //             const paymentStatus = arr[1];
    //             console.log(status);
    //             console.log(paymentStatus);
    //             if (status === 'enrolled') {
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', false);
    //                 $("#applicationApplied").attr('disabled', false);                              
    //                 $("#offerLetterReceived").attr('disabled', true);
    //                 $("#offerLetterRejected").attr('disabled', true);
    //                 $("#documentsRequestedByInstitution").attr('disabled', true); 
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', false);
    //                 $("fullFeePaid").attr('disabled', false);         
    //                 $("#fileLodged").attr('disabled', true);
    //                 $("#visaFileProcessing").attr('disabled', true);
    //                 $("#biometricsDone").attr('disabled', true);
    //                 $("#visaApproved").attr('disabled', true);
    //                 $("#visaRejected").attr('disabled', true);
    //                 $("#interviewScheduled").attr('disabled', false);
    //                 $("#interviewDone").attr('disabled', false);
    //                 $("#interviewCleared").attr('disabled', false);
    //                 $("#interviewRejected").attr('disabled', false);
    //             }
    //             else if(status === 'applicationSent'){
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', true);
    //                 $("#applicationApplied").attr('disabled', false);                              
    //                 $("#offerLetterReceived").attr('disabled', false);
    //                 $("#offerLetterRejected").attr('disabled', false);
    //                 $("#documentsRequestedByInstitution").attr('disabled', false);  
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', false);
    //                 $("fullFeePaid").attr('disabled', false);                                             
    //                 $("#fileLodged").attr('disabled', true);
    //                 $("#visaFileProcessing").attr('disabled', true);
    //                 $("#biometricsDone").attr('disabled', true);
    //                 $("#visaApproved").attr('disabled', true);
    //                 $("#visaRejected").attr('disabled', true);
    //                 $("#interviewScheduled").attr('disabled', false);
    //                 $("#interviewDone").attr('disabled', false);
    //                 $("#interviewCleared").attr('disabled', false);
    //                 $("#interviewRejected").attr('disabled', false);
    //             }
    //             else if(status === 'applicationApplied'){
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', true);
    //                 $("#applicationApplied").attr('disabled', true);                              
    //                 $("#offerLetterReceived").attr('disabled', false);
    //                 $("#offerLetterRejected").attr('disabled', false);
    //                 $("#documentsRequestedByInstitution").attr('disabled', false);   
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', false);
    //                 $("fullFeePaid").attr('disabled', false);                                            
    //                 $("#fileLodged").attr('disabled', true);
    //                 $("#visaFileProcessing").attr('disabled', true);
    //                 $("#biometricsDone").attr('disabled', true);
    //                 $("#visaApproved").attr('disabled', true);
    //                 $("#visaRejected").attr('disabled', true);
    //                 $("#interviewScheduled").attr('disabled', false);
    //                 $("#interviewDone").attr('disabled', false);
    //                 $("#interviewCleared").attr('disabled', false);
    //                 $("#interviewRejected").attr('disabled', false);
    //         }
    //             else if(status === 'offerLetterReceived'){
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', true);
    //                 $("#applicationApplied").attr('disabled', true);                              
    //                 $("#offerLetterReceived").attr('disabled', true);
    //                 $("#offerLetterRejected").attr('disabled', false);
    //                 $("#documentsRequestedByInstitution").attr('disabled', true);    
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', false);
    //                 $("fullFeePaid").attr('disabled', false);                                           
    //                 $("#fileLodged").attr('disabled', true);
    //                 $("#visaFileProcessing").attr('disabled', true);
    //                 $("#biometricsDone").attr('disabled', true);
    //                 $("#visaApproved").attr('disabled', true);
    //                 $("#visaRejected").attr('disabled', true);
    //                 $("#interviewScheduled").attr('disabled', false);
    //                 $("#interviewDone").attr('disabled', false);
    //                 $("#interviewCleared").attr('disabled', false);
    //                 $("#interviewRejected").attr('disabled', false);
    //             }
    //             else if(status === 'offerLetterRejected'){
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', true);
    //                 $("#applicationApplied").attr('disabled', true);                              
    //                 $("#offerLetterReceived").attr('disabled', true);
    //                 $("#offerLetterRejected").attr('disabled', true);
    //                 $("#documentsRequestedByInstitution").attr('disabled', true); 
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', true);
    //                 $("fullFeePaid").attr('disabled', true);                                              
    //                 $("#fileLodged").attr('disabled', true);
    //                 $("#visaFileProcessing").attr('disabled', true);
    //                 $("#biometricsDone").attr('disabled', true);
    //                 $("#visaApproved").attr('disabled', true);
    //                 $("#visaRejected").attr('disabled', true);
    //                 $("#interviewScheduled").attr('disabled', true);
    //                 $("#interviewDone").attr('disabled', true);
    //                 $("#interviewCleared").attr('disabled', true);
    //                 $("#interviewRejected").attr('disabled', true);
    //             }
    //             else if(status === 'documentsRequestedByInstitution'){
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', true);
    //                 $("#applicationApplied").attr('disabled', true);                              
    //                 $("#offerLetterReceived").attr('disabled', false);
    //                 $("#offerLetterRejected").attr('disabled', false);
    //                 $("#documentsRequestedByInstitution").attr('disabled', true); 
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', false);
    //                 $("fullFeePaid").attr('disabled', false);                                              
    //                 $("#fileLodged").attr('disabled', true);
    //                 $("#visaFileProcessing").attr('disabled', true);
    //                 $("#biometricsDone").attr('disabled', true);
    //                 $("#visaApproved").attr('disabled', true);
    //                 $("#visaRejected").attr('disabled', true);
    //                 $("#interviewScheduled").attr('disabled', false);
    //                 $("#interviewDone").attr('disabled', false);
    //                 $("#interviewCleared").attr('disabled', false);
    //                 $("#interviewRejected").attr('disabled', false);
    //             }
    //             else if(status === 'documentsRequestedByFilingTeam'){
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', true);
    //                 $("#applicationApplied").attr('disabled', true);                              
    //                 $("#offerLetterReceived").attr('disabled', true);
    //                 $("#offerLetterRejected").attr('disabled', true);
    //                 $("#documentsRequestedByInstitution").attr('disabled', true); 
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', false);
    //                 $("fullFeePaid").attr('disabled', false);                                              
    //                 $("#fileLodged").attr('disabled', true);
    //                 $("#visaFileProcessing").attr('disabled', false);
    //                 $("#biometricsDone").attr('disabled', true);
    //                 $("#visaApproved").attr('disabled', true);
    //                 $("#visaRejected").attr('disabled', true);
    //                 $("#interviewScheduled").attr('disabled', false);
    //                 $("#interviewDone").attr('disabled', false);
    //                 $("#interviewCleared").attr('disabled', false);
    //                 $("#interviewRejected").attr('disabled', false);
    //             }
    //             else if(status === 'partialFeePaid'){
    //                 $("#enrolled").attr('disabled', true);                           
    //                 $("#applicationSent").attr('disabled', true);
    //                 $("#applicationApplied").attr('disabled', true);                              
    //                 $("#offerLetterReceived").attr('disabled', false);
    //                 $("#offerLetterRejected").attr('disabled', false);
    //                 $("#documentsRequestedByInstitution").attr('disabled', true); 
    //                 $("#documentsRequestedByFilingTeam").attr('disabled', true); 
    //                 $("#partialFeePaid").attr('disabled', true);
    //                 $("fullFeePaid").attr('disabled', false);
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }
    //             else if(status === 'fileLodged'){
                    
    //             }

    //         })
    //     });

    //         //     $('.enrolled').show();
    //             //     $('.notEnrolled').hide();
    //             //     $('.paymentStatus').show();
    //             //     if (paymentStatus === 'Paid') {
    //             //         $('.paid').show();
    //             //         $('.notPaid').hide();
    //             //     } else {
    //             //         $('.paid').hide();
    //             //         $('.notPaid').show();
    //             //     }
    //             // } else {
    //             //     $('.enrolled').hide();
    //             //     $('.notEnrolled').show();
    //             //     $('.paymentStatus').hide();
    //             // }

    //         // $(document).ready(function () {
    //         //     $("#highestDegree").change(function () {
    //         //         $(this).find("option:selected")
    //         //             .each(function () {
    //         //                 var optionValue = $(this).attr("value");
    //         //                 if (optionValue === "") {
                              
    //         //                 } else if(optionValue === ""){
                               
    //         //                 }
    //         //                 else if(optionValue === ""){
                                
    //         //                 }
    //         //                 else {
                             
    //         //                 }
    //         //             });
    //         //     }).change();
    //         // });


    //     $(document).ready(function () {
    //         $("#currentStatus").change(function () {
    //             $(this).find("option:selected")
    //                 .each(function () {
    //                     var optionValue = $(this).attr("value");
    //                     if (optionValue) {
    //                         $(".box").not("." + optionValue).hide();
    //                         $("." + optionValue).show();
    //                     } else {
    //                         $(".box").hide();
    //                     }
    //                 });
    //         }).change();
    //     });
    // // </script>

    // // <body>

        // <!-- Tab-bar -->
        // <%- include('../partials/navBar') -%>
        //     <%- include('../partials/tabBar',{lead: enrolledLead}) -%>


//     //             <div class="p-4">
//     //                 <div class="head">
//     //                     <div class="table-responsive">
//     //                         <table class="table table-hover" width="100%" cellspacing="0">
//     //                             <thead class="table-light">
//     //                                 <tr>
                                        // <th>Name</th>
                                        // <th>Email</th>
                                        // <th>Phone</th>
                                        // <th>Student Enrolment Date</th>
//     //                                 </tr>
//     //                             </thead>
//     //                             <tbody class="table-group-divider">
//     //                                 <tr>
                                        // <td>
                                        //     <%= enrolledLead.name %>
                                        // </td>
                                        // <td>
                                        //     <%= enrolledLead.username %>
                                        // </td>
                                        // <td>
                                        //     <%= enrolledLead.phone %>
                                        // </td>
                                        // <td>
                                        //     <% const cDate1=new
                                        //         Date(enrolledLead.enrollmentDate).toLocaleDateString("en-GB") %>
                                        //         <%= cDate1 %>
                                        // </td>
//     //                                 </tr>
//     //                             </tbody>
//     //                         </table>
//     //                     </div>
//     //                 </div>
//     //             </div>
                    // <ul class="nav nav-tabs nav-fill bg-light">
                    //     <li class="nav-item active">
                    //         <a class="nav-link fs-4 fw-bold" href="/enrolled/application/<%= enrolledLead._id %>">Apply
                    //             To Program</a>
                    //     </li>
                    //     <li class="nav-item">
                    //         <a class="nav-link fs-4 fw-bold"
                    //             href="/enrolledUser/appliedProgram/<%= enrolledLead._id %>">Applied Programs</a>
                    //     </li>
                    // </ul>

//     //                 <% for(var i=0; i < application.length; i++){ %>
//     //                     <div class="card" style="width: 18rem;">
//     //                         <div class="card-body">
//     //                           <h5 class="card-title"><a href="/enrolled/application/list/<%= application[i]._id %>"> <%= application[i].name %></a></h5>
//     //                           <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
//     //                           <p class="card-text">
//     //                             <%= application[i].program %> <br>
//     //                             <%= application[i].institution %> <br>
//     //                             Status : <%= application[i].status %> 
//     //                           </p>
//     //                         </div>
//     //                       </div>
                    
                           
//     //                             <% } %>

//     //                                 <form action="/">
                                        // <select name="currentStatus" id="currentStatus" value="<%= selectedApplication.status %>/<%= selectedApplication.paymentStatus %>">
                                        //     <% if(selectedApplication.status){ %>
                                        //         <option value="">
                                        //             <%= selectedApplication.status %>
                                        //         </option>
                                        //         <% } %>
                                        //             <option id="enrolled" value="enrolled">Enrolled</option>
                                        //             <option id="applicationSent" value="applicationSent">Application Sent</option>
                                        //             ------------|
                                        //             <option id="applicationApplied" value="applicationApplied">Application Applied</option>
                                        //             ------|
                                        //             |-------<option id="offerLetterReceived" value="offerLetterReceived">Offer Letter Received
                                        //             </option>
                                        //             --------------------------------------------------------------|
                                        //             | only Fee after this---|----<option id="offerLetterRejected" value="offerLetterRejected">
                                        //                 Offer
                                        //                 Letter Rejected</option>
                                        //             --------------------------------------|-e
                                        //             |-----<option id="documentsRequestedByInstitution" value="documentsRequestedByInstitution">Documents
                                        //                 Requested By Institution</option>
                                        //             -------------------------------------|
                                        //             documents can be requested after partial fee
                                        //             document request by filing/sop
                                        //             don't move below before full fee paymentß
                                        //             <option id="partialFeePaid" value="partialFeePaid">Partial Fee Paid</option>
                                        //             <option id="fullFeePaid" value="fullFeePaid">Full Fee Paid</option>
                                        //             <option id="documentsRequestedByFilingTeam" value="documentsRequestedByFilingTeam">Documents Requested By Filing Team/SOP Team</option>
                                        //             <option id="visaFileProcessing" value="visaFileProcessing">Visa File Processing</option>
                                        //             <option id="fileLodged" value="fileLodged">File Lodged</option>
                                        //             <option id="biometricsDone" value="biometricsDone">Biometrics Done</option>
                                        //             <option id="visaApproved" value="visaApproved">Visa Approved</option>
                                        //             <option id="visaRejected" value="visaRejected">Visa Rejected</option>
                                        //             <option id="interviewScheduled" value="interviewScheduled">Interview Scheduled</option>
                                        //             <option id="interviewDone" value="interviewDone">Interview Done</option>
                                        //             <option id="interviewCleared" value="interviewCleared">Interview Cleared</option>
                                        //             <option id="interviewRejected" value="interviewRejected">Interview Rejected</option>
                                        // </select>
//     //                                 </form>

                                    // <div class="enrolld box">
                                    //     <h1>enrolld</h1>
                                    // </div>
                                    // <div class="applicationSent box">
                                    //     <h1>applicationSent</h1>

                                    // </div>
                                    // <div class="applicationApplied box">
                                    //     <h1>applicationApplied</h1>
                                    // </div>
                                    // <div class="offerLetterReceived box">
                                    //     <h1>offerLetterReceived</h1>
                                    // </div>
                                    // <div class="offerLetterRejected box">
                                    //     <h1>offerLetterRejected</h1>
                                    // </div>
                                    // <div class="documentsRequestedByInstitution box">
                                    //     <h1>documentsRequestedByInstitution</h1>
                                    // </div>
                                    // <div class="visaFileProcessing box">
                                    //     <h1>visaFileProcessing</h1>
                                    // </div>
                                    // <div class="fileLodged box">
                                    //     <h1>fileLodged</h1>
                                    // </div>
                                    // <div class="visaApproved box">
                                    //     <h1>visaApproved</h1>
                                    // </div>
                                    // <div class="visaRejected box">
                                    //     <h1>visaRejected</h1>
                                    // </div>
                                    // <div class="biometricsDone box">
                                    //     <h1>biometricsDone</h1>
                                    // </div>
                                    // <div class="interviewDone box">
                                    //     <h1>interviewDone</h1>
                                    // </div>
                                    // <div class="interviewScheduled box">
                                    //     <h1>interviewScheduled</h1>
                                    // </div>
                                    // <div class="interviewCleared box">
                                    //     <h1>interviewCleared</h1>
                                    // </div>
                                    // <div class="interviewRejected box">
                                    //     <h1>interviewRejected</h1>
                                    // </div>

//     //                                 <%- include('../partials/footer') -%>

//     // </body>

//     // </html>
