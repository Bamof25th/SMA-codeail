
const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a methord
exports.newComment =  (comment) => {
    // console.log('inside new comment mailer' , comment);
          let htmlString =nodeMailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs')
    nodeMailer.transporter.sendMail({
        from: 'baghelbam@email.com',
        to: comment.user.email,
        subject : 'new comment published',
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending mail', err);
            return;
        }
        // console.log('Message sent', info);
        return;
        });

    }
