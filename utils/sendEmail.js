const nodemailer = require('nodemailer');
const config = require("../config/config");

// Nodemailer verify?user_id='+user_id
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
              html:'<p>Hi please copy the link to <a href="http://localhost:3000/verify/'+user_id+'">Verify</a> your Email.</p>'
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


const sendSPVerificationMail = (email,serviceProvider_id)=>{
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
              html:'<p>Hi please copy the link to <a href="http://localhost:3000/SPverify/'+serviceProvider_id+'">Verify</a> your Email.</p>'
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
  sendSPVerificationMail
}