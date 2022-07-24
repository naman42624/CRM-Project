const path = require('path');
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const transporter = require("./transporter");
const ejs = require('ejs');

const UserVerification = require("../models/userVerificationModel");

const sendEmail = async (user) => {
    const token = uuidv4() + user.id;
    const url = "http://localhost:3000/user/verify/" + user.id + "/" + token;

    const hashedToken = await bcrypt.hash(token, 10);
        const userVerification = new UserVerification({
            userId: user.id,
            token: hashedToken,
            createdAt: new Date(),      
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
        });
        userVerification.save((err)=>{
                if(err){
                    console.log(err);
                    res.redirect("/500");
                }
                else{
                    console.log("User verification saved")
                }
            });
            const resendUrl = "http://localhost:3000/user/resend/" + user.id + "/" + user.email; 

            const html = await ejs.renderFile(path.join(__dirname +'../../../views/verifyTemplate.ejs'), {
                name: user.name,
                url: url,
                resendUrl: resendUrl
            });

    let mailOptions = {
        from: 'Bells Overseas <'+process.env.EMAIL+'>',
        to: user.email,
        subject: "Verify your Bells Overseas Email Address",
        html: html
                    // `<div style="font-family=Poppins;">
                    // <h1>Verify your email</h1>
                    // <h2 >Hi ${user.name},</h2>
                    // <p>Thanks for signing up to Bells Overseas!</p>
                    // <p>Please click on the link below to verify your email and proceed further.</p>
                    // <a href=${url}><button style="background-color:green;">Verify</button></a>
                    // <br>
                    // <p> This link will expire after <b style="color:red;">2 hours</b>. To request another verification link, please click <a href=${resendUrl}>here</a>.</p>
                    // <p>If you did not sign up to <b>Bells Overseas</b>, please ignore this email.</p>
                    // <p>Regards,</p>
                    // <p>Bells Overseas.</p>
                    // </div>`
    };

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
            // res.redirect("/500");
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = sendEmail;