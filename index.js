// modules =================================================
var mongoose       = require('mongoose');
var schedule	   = require('node-schedule');
var botkit 		   = require('botkit');
//var express		   = require('express');
//var app			   = express();

// code ====================================================
var db = require("./app/db");
var utils = require("./app/utils");
mongoose.connect(db.url);

var controller = botkit.slackbot();
var bot = controller.spawn({ token: db.token });
bot.startRTM(function(err, bot, payload) {
	if (err)
		throw new Error('Could not connect to Slack');
});

var listener = require("./app/listener")(controller);
var action = require("./app/action");

var j = schedule.scheduleJob({hour: db.scrumHourMin, minute: 0, dayOfWeek: db.scrumDayOfWeek}, function() { //Wednesdays at 7 PM hold Virtual Scrum Meeting
	console.log("Scheduled startConversations action.");
	action.startConversations(bot, controller);
});

var k = schedule.scheduleJob({hour: db.scrumHourMax, minute: 0, dayOfWeek: db.scrumDayOfWeek}, function() { //Wednesdays at 8 PM post Bulletin
	console.log("Scheduled postBulletin action.");
	action.postBulletin(bot, controller);
});

/*app.get('*', function (req, res) {
  	res.send('Hello World!');
});

app.listen(db.port, function () {
  	console.log('Listening on port ' + db.port + '!');
});*/

//action.postBulletin(bot, controller);









