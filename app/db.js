module.exports = {
	token : process.env.SLACK_API_TOKEN || '',
	url : process.env.MONGO_URL || '',
	port : process.env.OPENSHIFT_NODEJS_PORT || 8080,
	scrumDayOfWeek : process.env.SCRUM_DAY_OF_WEEK || 3,
	scrumHourMin : process.env.SCRUM_HOUR_MINIMUM || 19,
	scrumHourMax : process.env.SCRUM_HOUR_MAXIMUM || 20,
	scrumChannelId : process.env.SCRUM_CHANNEL_ID || "#general",
	scrumQuestion1 : process.env.SCRUM_QUESTION_1 || "What have you done since last meeting?",
	scrumQuestion2 : process.env.SCRUM_QUESTION_2 || "What will you do before next meeting?",
	scrumQuestion3 : process.env.SCRUM_QUESTION_3 || "Is anything blocking you?"
};
