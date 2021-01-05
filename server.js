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
const passport = require('passport');
const Emitter = require('events')

//DB Connection
const url = "mongodb://localhost/pizza"
mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
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

//event commiter 
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store: mongoStore,
    saveUninitialized:false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
    
}))

//passport config
const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//assets
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//global middleware
app.use((req , res , next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})
//set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname,'./resources/views'));
app.set('view engine','ejs')

require('./routes/web')(app)


const server = app.listen(3000, ()=>{
    console.log(`Listning on port ${PORT}`)
})


const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})