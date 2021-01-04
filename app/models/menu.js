const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    name :{type: String , require: true},
    image :{type: String , require: true},
    price :{type: String , require: true},
    size :{type: String , require: true}
})


module.exports = mongoose.model('Menu' , menuSchema);