const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name :{type: String , require: true},
    email :{type: String , require: true , unique:true},
    password :{type: String , require: true},
    role :{type: String, default:'customer' },
    
},{timestamps:true})


module.exports = mongoose.model('User' , userSchema);