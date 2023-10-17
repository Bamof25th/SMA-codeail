const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy.js')
const passportGoogle = require('./config/passport-google-oauth2-strategies')
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMvare = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static('./assets')); 

// make the uploads path  available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

//flash to send flash calls
app.use(
    session({  
      resave: true,
      saveUninitialized: true,
      secret:"i am Bam",
      cookie: { secure: false, maxAge: 14400000 },
    })
);


// extract styles and shets from sub pages into the layout.
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//set up the view engine 
app.set('view engine', 'ejs');
app.set('views', './views');


//mongo store is used to store a session cookie in the db


app.use(session({
    name: 'codeieal',
    //todo change the secret
    secret : 'blahsomething',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge :(1000 * 60 * 100)
    },
    store : new MongoStore(
        
        {
            mongooseConnection : db,
            autoRemove : 'disabled'
        },
        function (err){
            console.log(err  || 'connect-mongodb setup ok');
        }
    )
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMvare.setFlash);


// use express router
app.use('/',require('./routes'))

app.listen(port, function(err){  
    if(err) {
        
        console.log(`Error in runnning the server : ${err}`);   
    }
         console.log(`srever is running on port ${port}`);
});

