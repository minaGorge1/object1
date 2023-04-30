const nodemailer = require('nodemailer');
const config = require("../config/config");

// Nodemailer
const sendVerificationEmail = async (email,user_id) => {
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

  // 2) Define email options (like from, to, subject, email content)
const mailOptions = {
  from:config.emailUser,
  to:email,
  subject:'For Verification Email',
  html:"<p> hii "+',Please copy the link <a href ="http://localhost:3000/verify?user_id='+user_id+'"> and verify your Email</a>'
};

  // 3) Send email
  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("Mail has been sent :",info.response);
    }

})
}

const sendResetPasswordMail = async (email,token) => {
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
  
    // 2) Define email options (like from, to, subject, email content)
  const mailOptions = {
    from:config.emailUser,
    to:email,
    subject:'Reset Password',
    html:"<p> hii "+',Please copy the link <a href ="http://localhost:3000/resetPassword?token='+token+'"> and Reset your password</a>'
  };
  
    // 3) Send email
    transporter.sendMail(mailOptions,(error,info)=>{
      if(error){
          console.log(error)
      }
      else{
          console.log("Mail has been sent :",info.response);
      }
  
  })
  }

module.exports = {
  sendVerificationEmail,
  sendResetPasswordMail
}