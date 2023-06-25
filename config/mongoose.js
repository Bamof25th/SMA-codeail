const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/codeieal_developement');

const db = mongoose.connection;


db.on('error',console.error.bind(console, "error connected to MongoDB"));


db.once('open',function(){

    console.log('Connected to the databse :: MongoDB');
                            
});


module.exports = db;
