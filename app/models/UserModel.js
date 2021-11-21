var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    refresh_token: {type: String, required: false},
    access_token: {type: String, required: false},
    expires_in: {type:Number, required: false}
})

module.exports = mongoose.model('User', UserSchema)