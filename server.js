require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout= require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3000 // doosre system pr chalane ke liye.
const mongoose = require('mongoose');
const session  = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');

// Database Connection

const url = 'mongodb://localhost/pizza';
mongoose.connect(url,
    {useNewUrlParser:true,
        useCreateIndex:true, 
        useUnifiedTopology: true, 
        useFindAndModify : true
    })

    const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});

//Session Store
// let mongoStore = new MongoDbStore({
//      mongooseConnection: connection,
//      collection: 'sessions'
// })

//Passport Config



//Session Config
//cookies ko encrypt krne ke liye
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
   store: MongoDbStore.create({
        client: connection.getClient()
   }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }  //24hrs //milisecond

}))

const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());


app.use(flash()) 


//Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Global Middleware
app.use((req,res,next)=>{
  res.locals.session = req.session; 
  res.locals.user = req.user; 
  next()
})



//set template engine

app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

require('./routes/web')(app);


app.listen(PORT,()=>{
    console.log(`Listening on port xyz ${PORT}`);
})