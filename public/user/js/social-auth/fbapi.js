window.fbAsyncInit = function() {
  FB.init({
    appId      : '957295484766781',
    cookie     : true,
    xfbml      : true,
    version    : 'v8.0'
  });
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response){
  if(response.status == 'connected'){
    FB.api('/me?fields=name,picture',function(res){
      RegisterOrComeback(res.id,res.name,res.picture.data.url);
    });
  }else{
    console.log('you are not logged in');
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function FB_SignOut(){
    FB.logout();
    console.log('facebook logout');
};

function RegisterOrComeback(id,name,avatar){
  $.ajax({
    url:'/auth/facebook/register-or-login',
    type:'get',
    data:{
      id:id,
      name:name,
      avatar:avatar
    },
    success:function(data){
      if(data.code == 200){
        LoadProfile();
        let user = {
          username:data.user.username,
          member_code:data.user.member_code,
          avatar:data.user.avatar,              
          fullname:data.user.fullname
        };    
        socket.emit('logged-user',user);
        $('#modalLogin').modal('hide');
      }
    }
  });
}
