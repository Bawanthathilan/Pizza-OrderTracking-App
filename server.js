const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');

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



//assets
app.use(express.static('public'))


//set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname,'./resources/views'));
app.set('view engine','ejs')

require('./routes/web')(app)


app.listen(3000, ()=>{
    console.log(`Listning on port ${PORT}`)
})