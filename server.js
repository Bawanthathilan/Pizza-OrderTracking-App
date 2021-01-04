require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session)


//DB Connection
const url = "mongodb://localhost/pizza"
mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true
});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Database connected...')
}).catch(err=>{
    console.log('Connection failed...')
});

//session store
let mongoStore = new MongoDbStore({
    mongooseConnection : connection,
    collection: 'sessions'
})
//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store: mongoStore,
    saveUninitialized:false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
    
}))

app.use(flash());

//assets
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//global middleware
app.use((req , res , next)=>{
    res.locals.session = req.session
    next()
})
//set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname,'./resources/views'));
app.set('view engine','ejs')

require('./routes/web')(app)


app.listen(3000, ()=>{
    console.log(`Listning on port ${PORT}`)
})