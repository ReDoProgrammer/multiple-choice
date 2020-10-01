module.exports={
  mongodb:{
		mongodb:'mongodb://localhost:27017/multiple_choice'
	},
  fb_api:{
    clientID: '957295484766781',
    clientSecret: '1bfa1916430b3797d684be824331b5f8',
    callbackURL: "http://localhost:3000/thanh-vien/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender','photos']
  },
  pageSize:20,
  commentSize:5,
  questionNumber:55,
  timeRemain: 45,
  secretKey:'how_can_i_help_you?',
}
