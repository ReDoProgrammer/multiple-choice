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
      RegisterOrLoginFacebook(res.id,res.name,res.picture.data.url);
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

function RegisterOrLoginFacebook(id,name,avatar){
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
        if(data.isNew){
          io.emit('new-member');
        }
      }
    }
  });
}
