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
    const allowed = ["Counsellor", "Branch Manager", "Application Team", "Admin"];
    const role = $('#role').val();
    console.log(role);
    if(role === "Student"){
        $("input").attr("Disabled", "true");
        $("textarea").attr("Disabled", "true");
        $("select").attr("Disabled", "true");
        $("#submit").attr("Disabled", "true");
        $("button").attr("Disabled", "true");
    }
    if(!allowed.includes(role)){
        console.log("Not allowed");
        $('.box > input[type=checkbox]').prop('disabled', true);
        $('.box > input[type=text]').attr('disabled', true);
        $('.box > input[type=file]').attr('disabled', true);
        $('.box > button').attr('disabled', true);
        $('.box > a').attr('disabled', true);
    }

        $('#currentStatus').each(function () {
            const role = $("#role").attr('value');
            const allowed = ["Counsellor", "Branch Manager", "Application Team", "Admin", "Filing Team"];
            const arr = ($(this).attr('value')).split('/');
            const status = arr[0];
            const paymentStatus = arr[1];
            console.log(status);
            console.log(paymentStatus);
            console.log(role);
            if (allowed.includes(role)) {
                if (status === 'Enrolled') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', false);
                    $("#applicationApplied").attr('disabled', false);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', false);
                    $("fullFeePaid").attr('disabled', false);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Application Sent') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', false);
                    $("#offerLetterReceived").attr('disabled', false);
                    $("#offerLetterRejected").attr('disabled', false);
                    $("#documentsRequestedByInstitution").attr('disabled', false);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', false);
                    $("fullFeePaid").attr('disabled', false);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Application Applied') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', false);
                    $("#offerLetterRejected").attr('disabled', false);
                    $("#documentsRequestedByInstitution").attr('disabled', false);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', false);
                    $("fullFeePaid").attr('disabled', false);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Offer Letter Received') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', false);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', false);
                    $("fullFeePaid").attr('disabled', false);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Offer Letter Rejected') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', true);
                    $("fullFeePaid").attr('disabled', true);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', true);
                    $("#interviewDone").attr('disabled', true);
                    $("#interviewCleared").attr('disabled', true);
                    $("#interviewRejected").attr('disabled', true);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Documents Requested By Institution') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', false);
                    $("#offerLetterRejected").attr('disabled', false);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', false);
                    $("fullFeePaid").attr('disabled', false);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Documents Requested By Filing Team') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', true);
                    $("fullFeePaid").attr('disabled', false);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Partial Fee Paid') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', false);
                    $("#partialFeePaid").attr('disabled', true);
                    $("fullFeePaid").attr('disabled', false);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Full Fee Paid') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', false);
                    $("#partialFeePaid").attr('disabled', true);
                    $("fullFeePaid").attr('disabled', true);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', false);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Visa File Processing') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', false);
                    $("#partialFeePaid").attr('disabled', true);
                    $("fullFeePaid").attr('disabled', true);
                    $("#fileLodged").attr('disabled', false);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'File Lodged') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', true);
                    $("fullFeePaid").attr('disabled', true);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', false);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Biometrics Done') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', true);
                    $("fullFeePaid").attr('disabled', true);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', false);
                    $("#visaRejected").attr('disabled', false);
                    $("#interviewScheduled").attr('disabled', false);
                    $("#interviewDone").attr('disabled', false);
                    $("#interviewCleared").attr('disabled', false);
                    $("#interviewRejected").attr('disabled', false);
                    $("#studentDrop").attr('disabled', false);
                }
                else if (status === 'Visa Approved'||status === 'Student Drop') {
                    $("#enrolled").attr('disabled', true);
                    $("#applicationSent").attr('disabled', true);
                    $("#applicationApplied").attr('disabled', true);
                    $("#offerLetterReceived").attr('disabled', true);
                    $("#offerLetterRejected").attr('disabled', true);
                    $("#documentsRequestedByInstitution").attr('disabled', true);
                    $("#documentsRequestedByFilingTeam").attr('disabled', true);
                    $("#partialFeePaid").attr('disabled', true);
                    $("#fullFeePaid").attr('disabled', true);
                    $("#fileLodged").attr('disabled', true);
                    $("#visaFileProcessing").attr('disabled', true);
                    $("#biometricsDone").attr('disabled', true);
                    $("#visaApproved").attr('disabled', true);
                    $("#visaRejected").attr('disabled', true);
                    $("#interviewScheduled").attr('disabled', true);
                    $("#interviewDone").attr('disabled', true);
                    $("#interviewCleared").attr('disabled', true);
                    $("#interviewRejected").attr('disabled', true);
                    $("#studentDrop").attr('disabled', false);
                }
            }
            else {
                $('.saveStatus').addClass('disabled');
                $(this).attr('disabled', true);
            }
        })
        $("#currentStatus").change(function () {
            $(this).find("option:selected")
                .each(function () {
                    var optionValue = $(this).val();
                    console.log(optionValue);
                    if (optionValue) {
                        $(".box").each(function () {
                            if($(this).attr('data-status') === optionValue){
                                $(this).show();
                            }
                            else{
                                $(this).hide();
                            }
                        });
                    } else {
                        $(".box").hide();
                    }
                });
        }).change();

        $('.saveStatus').click(function () {
            $('#updateStatus').submit();
        });
        var index =0;
        if($('#docsLength').val()){
         index=$('#docsLength').val();
        }
        $('#addForm').click(function(){
            index++;
          let form = $('#formTemplate > form').clone().attr('id','formTemplate'+index);
          form.find('input[type=hidden]').val(index);
          form.find('input[type=text]').val('');
          console.log(form);
          form.appendTo('#formList');
        });
        // $('#formTemplateForFiling').hide();
        var indexFiling =0;
        if($('#docsLengthFiling').val()){
         indexFiling=$('#docsLengthFiling').val();
        }
        $('#addFormFiling').click(function(){
            indexFiling++;
          let form = $('#formTemplateFiling > form').clone().attr('id','formTemplateFiling'+index);
          form.find('input[type=hidden]').val(indexFiling);
          form.find('input[type=text]').val('');
        //   form.find('label').text('');
          console.log(form);
          form.appendTo('#formListFiling');
        })
});
