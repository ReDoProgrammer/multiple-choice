function renderButton() {
    gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'height': 40,
        'width':350,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

// Sign-in success callback
function onSuccess(googleUser) {
    try {
      gapi.client.load('oauth2', 'v2', function () {
          var request = gapi.client.oauth2.userinfo.get({
              'userId': 'me'
          });
          request.execute(function (resp) {
            if(resp.code == 401){
                onFailure(resp.message);
                GG_SignOut();
            }else{
              RegisterOrComeback(resp.result.id,resp.result.name,resp.result.picture);
            }

          });
      });
    } catch (error) {
      onFailure(error)
    }
}

// Sign-in failure callback
function onFailure(error) {
  console.log(error);
}

// Sign out the user
function GG_SignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('signout google account successfully');
    });
    auth2.disconnect();
}

function RegisterOrComeback(id,name,avatar){
  $.ajax({
    url:'/auth/google/register-or-login',
    type:'get',
    data:{
      id:id,
      name:name,
      avatar:avatar
    },
    success:function(data){
      if(data.code == 200){
        // socket.emit('register-or-comeback',data);
        let user = {
          username:data.user.username,
          member_code:data.user.member_code,
          avatar:data.user.avatar,              
          fullname:data.user.fullname
        };    
        socket.emit('logged-user',user);
        $('#modalLogin').modal('hide');
        LoadProfile();
      }
    }
  });
}
