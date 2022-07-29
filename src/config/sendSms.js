require("dotenv").config();
const https = require('https');


// Super Admin is not added 
// Add it here to reduce redundant code
// Same goes for branch manager

const sendStatusSms = async (application, branchManager, numbers) => {
    let number="";
    if(numbers.length == 0){
        number=application.enrolledLead.phone+","+ application.appliedBy.phone +","+ branchManager.phone;
    }else{
        number = numbers.join(",");
        number+=","+ application.appliedBy.phone +","+ branchManager.phone;
        console.log(number);
    }
    const url = process.env.API+"&numbers=7217453433,"+ number +"&message=Status of your application number "+ (application._id).toString().slice(-5) +" is changed to "+ application.status +".\nBells Overseas\n6292062929";
            console.log(url);
            const options = {
                method: "GET",
                rejectUnauthorized: false,
            };
            const request = https.request(url, options, (response) => {
                console.log(response.statusCode);
                if(response.statusCode == 200){
                    console.log("Status sms sent");
                }
            });
            request.end();
}

const sendFeeSms = async (application, branchManager, numbers) => {
    let number="";
    if(numbers.length == 0){
        number=application.enrolledLead.phone+","+ application.appliedBy.phone +","+ branchManager.phone;
    }else{
        number = numbers.join(",");
        number+=","+ application.appliedBy.phone +","+ branchManager.phone;
        console.log(number);
    }
    const url = process.env.API+"&numbers=7217453433,9569869456,"+ number +"&message=Reminder!!\nPlease pay your tuition fee before the deadline.\nPlease ignore if already paid.\nBells Overseas\n6292062929";
                console.log(url);
                const options = {
                    method: "GET",
                    rejectUnauthorized: false,
                };
                const request = https.request(url, options, (response) => {
                    console.log(response.statusCode);
                    if(response.statusCode == 200){
                        console.log("Fee message sent");
                    }
                });
                request.end();
}

module.exports = { sendStatusSms, sendFeeSms };
