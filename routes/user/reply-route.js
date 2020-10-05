const router = require('express').Router();
const config = require('../../configs/config');
const middleware = require('../../middlewares/middleware');
const Comment = require('../../models/comment-model');
const Reply = require('../../models/reply-model');

router.get('/list',(req,res)=>{

});

router.post('/create',middleware.isLoggedIn,(req,res)=>{

});

router.post('/update',middleware.isLoggedIn,(req,res)=>{

});
router.post('/like',middleware.isLoggedIn,(req,res)=>{

});

router.delete('/delete',middleware.isLoggedIn,(req,res)=>{

});

module.exports = router;
