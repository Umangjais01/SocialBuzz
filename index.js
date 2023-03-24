const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port= 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const  MongoStore =  require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');

//setup of chatserver to be used with socekt.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

app.use(sassMiddleware({
    src:'./assets/scss',
    dest : './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))

//app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static('./assets'));

//make the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//use express layouts
app.use(expressLayouts);



//set up the view engine
app.set('view engine','ejs');
app.set('views', './views');

// mongo store is used to store the session cookie  in the db
app.use(session({

    name:'SocialApp',//cookie name
    secret:'jkajksj',
    saveUninitialized:false,
    resave:false,
    cookie:
    {
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1:27017'},
    function(err){
        console.log(err);
    })
}));
  

app.use (passport.initialize());
app.use (passport.session());

app.use (passport.setAuthenticatedUser);
// use express router
app.use('/',require('./routes'));




app.listen(port, async function (err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    } else {
        console.log(`This server is running in the port: ${port}`);
    }
});
