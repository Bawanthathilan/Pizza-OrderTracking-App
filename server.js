const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');

//assets
app.use(express.static('public'))


//set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname,'./resources/views'));
app.set('view engine','ejs')

app.get('/', (req,res)=>{
    res.render('home');
})

app.get('/cart',(req,res)=>{
    res.render('customers/cart');
});

app.get('/login',(req,res)=>{
    res.render('auth/login');
});

app.get('/register',(req,res)=>{
    res.render('auth/register');
});

const PORT = process.env.PORT || 3000
app.listen(3000, ()=>{
    console.log(`Listning on port ${PORT}`)
})