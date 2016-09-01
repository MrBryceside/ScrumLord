var db = require("./db");

exports.canStartScrum = function() {
	var now = new Date();
	return now.getDay() == db.scrumDayOfWeek && now.getHours() >= db.scrumHourMin && now.getHours() < db.scrumHourMax;
}

exports.getDayOfWeekName = function() {
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[db.scrumDayOfWeek];
}