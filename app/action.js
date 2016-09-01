var models = require("./models");
var moment = require("moment");
var db = require("./db");

exports.startConversations = function(bot, controller) {
	bot.api.im.list({}, function(err, response) {
		for(var i = 0; i < response.ims.length; i++) {
			var im = response.ims[i];
			//if(im.user !== "U1584490D") //not me
			//	continue;
			
			bot.api.chat.postMessage({
				as_user: true,
				link_names: 1,
				channel: im.id, 
				text: "It's that time of the week again! Type 'start scrum' to respond to your three questions."
			}, function(err, response) {
				//console.log("postMessage: " + JSON.stringify(response));
			});
		}
	});
}

exports.postBulletin = function(bot, controller) {
	var start = moment().startOf('day');
	var end = moment(start).add(1, 'day');

	//console.log("start: " + start.format());
	//console.log("end: " + end.format());

	var users = {};

	bot.api.users.list({}, function(err, response) {
		//console.log("user list: " + JSON.stringify(response));
		for(var i = 0; i < response.members.length; i++)
			users[response.members[i].id] = response.members[i].name;

		console.log("users: " + JSON.stringify(users));

		models.Scrum.find({
			"createdAt": {
				"$gte": start, 
				"$lt": end
			}
		}).populate("user").exec(function(err, scrums) { //get all scrums from the day, though theres only a one hour window for submitting them
			//console.log("todays scrums: " + JSON.stringify(scrums));

			for(var i = 0; i < scrums.length; i++) {
				var scrum = scrums[i];
				var username = users[scrum.user.userId];
				console.log("scrumer " + scrum.user.userId + "'s username: " + username);

				bot.api.chat.postMessage({
					link_names: 1,
					channel: db.scrumChannelId, 
					text: "*" + username + "'s Scrum Response:*",
					attachments: [
						{
							pretext: db.scrumQuestion1,
							text: scrum.answer1
						},
						{
							pretext: db.scrumQuestion2,
							text: scrum.answer2
						},
						{
							pretext: db.scrumQuestion3,
							text: scrum.answer3
						}
					]
				}, function(err, response) {
					if(err)
						console.log("postMessage-error: " + JSON.stringify(err));
					//console.log("postMessage: " + JSON.stringify(response));
				});
			}
		});
	});
}