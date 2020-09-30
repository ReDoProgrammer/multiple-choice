module.exports.isAdmin = function(req,res,next){
  if(req.session.user && req.session.user.is_admin){
    next();
  }else{
      res.redirect('/admin/login');  
  }

}
