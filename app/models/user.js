// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
	userId : String,
    createdAt : {type: Date, default: Date.now()},
    updatedAt : {type: Date, default: Date.now()}
}, {
    strict: true
});

userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);