/*
  route này xử lý các thông tin liên quan đến cấu hình, thống kê website
*/
const router = require('express').Router();
const middleware = require('../../middlewares/middleware');
const Config = require('../../models/config-model');

router.post('/access',(req,res)=>{
  let type = req.body.type;
  Config.findOne({key:'current_access'},function(err,cf){
    if(err){
      console.log('find config current access failed: '+new Error(err));
    }else{
      if(cf){
        let current_access = Number(cf.value);
        current_access = type==1?(++current_access):(--current_access);

        Config.findOneAndUpdate({key:'current_access'},{
           value: current_access
        },{new:true},function(err,config){
          if(err){
            console.log('update current access failed: '+new Error(err));
          }else{

            res.send({code:200,msg:'update current access successfully',config})
          }
        });
      }else{
        Config.create({key:'current_access',value:0},function(err,config){
          if(err){
            console.log('create config current access failed: '+new Error(err));
          }else{
            res.send({code:200,msg:'init current access successfully',config:config});
          }
        });
      }
    }
  });
});


module.exports = router;
