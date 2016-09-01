var models = require("./models");
var db = require("./db");
var utils = require("./utils");

module.exports = function(controller) {
	controller.hears(["hi", "hello"], ["direct_message","direct_mention","mention"], function(bot, message) {
	  	console.log("received: " + JSON.stringify(message));
	  	bot.reply(message, 'Hello');
	});

	controller.hears(["start scrum"], ["direct_message"], function(bot, message) {
	  	console.log("received: " + JSON.stringify(message));
	  	if(!utils.canStartScrum()) {
	  		bot.reply(message, "It's not time for a scrum meeting yet, they are held " + utils.getDayOfWeekName() + " between " + (db.scrumHourMin - 12) + " and " + (db.scrumHourMax - 12) + " PM")
	  		return;
	  	}

	  	bot.startConversation(message, function(err, convo) {
	    	convo.ask(db.scrumQuestion1, function(response, convo) {
	    		convo.next();
	        }, {'key': 'ans1'});

	    	convo.ask(db.scrumQuestion2, function(response, convo) {
	    		convo.next();
	        }, {'key': 'ans2'});

	    	convo.ask(db.scrumQuestion3, function(response, convo) {
	    		convo.next();
	        }, {'key': 'ans3'});

	        convo.on('end', function(convo) {
	            if (convo.status == 'completed') {
	                bot.reply(message, 'Got it! A bulletin will be posted when everyone else is done.');

	                var ans1 = convo.extractResponse('ans1'),
	                	ans2 = convo.extractResponse('ans2'),
	                	ans3 = convo.extractResponse('ans3');
	                models.User.findOne({userId: message.user}).exec(function(err, user) {
	                	var promise = null;
	                	if(!user) {
	                		user = new models.User();
	                		user.userId = message.user;
	                		promise = user.save();
	                	} else
	                		promise = Promise.resolve(user);

	                	promise.then(function(user) { //guaranteed to have a user here for the scrum save
	                		var scrum = new models.Scrum();
	                		scrum.user = user._id;
	                		scrum.answer1 = ans1;
	                		scrum.answer2 = ans2;
	                		scrum.answer3 = ans3;
	                		return scrum.save();
	                	});
			        });
	            } else {
	                // this happens if the conversation ended prematurely for some reason
	                bot.reply(message, 'OK, nevermind!');
	            }
	        });
		});
	});
}