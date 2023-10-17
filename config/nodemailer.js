const nodemailer = require('nodemailer');
// const env = require('./environment');
const ejs = require('ejs');
const path = require('path');


let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "Aniket Baghel",
    pass: "Ab@paisa99",
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
      // place from where this function is being called, the view .ejs file for in mailers
      path.join(__dirname, '../views/mailers', relativePath), 
      data, // main data 
      function (error, template) {
          if(error){
              console.log("Error in Rendering Template ",error);
              return;
          }
          mailHTML = template;
      }
  );
  return mailHTML;
}

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate
}