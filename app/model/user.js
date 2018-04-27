// User Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    name : {type: String},
    email_id : {type: String, required: true},
    password : {type: String, required: true},
    is_admin : {type: Boolean, default: false},
    created_at : {type: Date}
});

module.exports = mongoose.model('user', UserSchema);