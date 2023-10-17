const queue = require('../config/kue'); // import a kue(queue) present in redis
const commentsMailer = require('../mailers/comments_mailer'); 

// each kue(queue) has a process func to be executed on each new job addition
//1st arguement is this keu's name/type and 2ns cb func
queue.process('emails', function (job, done) {
    console.log("Emails Worker is Processing its Job", job.data); //job is the task data is comment
    commentsMailer.newComment(job.data); //task to be done
    done();
});
