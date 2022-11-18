const nodemailer = require("nodemailer");
require("dotenv").config();
function sendMail(email, otp) {
  let result = "";
  const htmlPage = `<html><body><span>Hii OTP for forgot password is ${otp}</span></body></html>`;
  transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "prajwali@valueaddsofttech.com",

      pass: "", //your mail password is here

      // html: `<h1>Successfully Registered On Movie-Rental</h1><br>
      // <h5>Hii ${name} ,Thank you  for visiting our Movie Rental application.you are successfully
    },
  });
  const mailConfigurations = {
    // It should be a string of sender email
    from: "prajwali@valueaddsofttech.com",
    // Comma Separated list of mails
    to: email,
    // Subject of Email
    subject: `Inventory Managment System - Forgot Password`,

    // registered on Movie-Rental application.</h5>`,
    html: htmlPage,
  };
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      result = "error";
      console.log(error);
      throw Error(error);
    } else {
      console.log("Email Sent Successfully");
    }
  });
}

module.exports = sendMail;
