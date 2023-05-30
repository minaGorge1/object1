const nodemailer = require('nodemailer');
const config = require("../config/config");

// send verify user email
const sendVerificationMail = (email,user_id)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
    });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'Verification Email',
                html:'<p>Hi please copy the link to <a href="http://api-mtgy.onrender.com/verify?user_id='+user_id+'">Verify</a> your Email.</p>'
        };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
        })

} catch (error) {
        console.log(error)
}
}

const sendSPVerificationMail = (email,user_id)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
    });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'Verification Email',
                html:'<p>Hi please copy the link to <a href="http://api-mtgy.onrender.com/SPverify?user_id='+user_id+'">Verify</a> your Email.</p>'
        };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
        })

} catch (error) {
        console.log(error)
}
}
//send reset user password 
const sendResetPasswordMail = (email,token)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'password Reset',
                html:'<p>Hi please copy the link to <a href="http://api-mtgy.onrender.com/resetPassword?token='+token+'">Reset</a> your password.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}

//send sp resetPassword
const sendSPResetPasswordMail = async(email,token) =>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword,
            }
        });
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For reset password',
            html:"<p> hii "+',Please copy the link <a href ="http://api-mtgy.onrender.com/reset-password?token='+token+'"> and reset your password</a>'
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log("Mail has been sent :",info.response);
            }

        })
    } 
    catch (error) {
        res.status(400).send({success:false, msg:error.message})
        
    }

}
// send notify mail for admin
const sendAdminNotifyMail = (title,details,price,category,serviceName,image)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: "ayas66223@gmail.com",
                subject: 'partner created new post offer',
                html:
                '<h3> OFFer Details</h3><p>offerTitle:'+title+'<br>postDetails:'+details+'<br>price:'+price+'<br>category:'+category+'<br>serviceName:'+serviceName+'<br>image:'+image+'<p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}



module.exports = {
    sendVerificationMail,
    sendSPVerificationMail,
    sendResetPasswordMail,
    sendSPResetPasswordMail,
    sendAdminNotifyMail
}