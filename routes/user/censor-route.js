/*
  ROUTE NÀY DÙNG ĐỂ XỬ LÝ VIỆC XÉT DUYỆT CÂU HỎI
*/
const router = require('express').Router();
const middleware = require('../../middlewares/middleware');
const Censor = require('../../models/censor-history-model');

router.post('/add',middleware.isLoggedIn,(req,res)=>{

});

module.exports = router;
