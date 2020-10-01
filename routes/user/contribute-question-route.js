const router = require('express').Router();
const middleware = require('../../middlewares/middleware');
const Question = require('../../models/question-model');
router.get('/list',middleware.isLoggedIn,(req,res)=>{

});

// router.post('/add',)

module.exports = router;
