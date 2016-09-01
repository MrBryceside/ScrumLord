// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var scrumSchema = mongoose.Schema({
	user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //user ref
	answer1 : String,
	answer2 : String,
	answer3 : String,
    createdAt : {type: Date, default: Date.now()},
    updatedAt : {type: Date, default: Date.now()}
}, {
    strict: true
});

scrumSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Scrum', scrumSchema);