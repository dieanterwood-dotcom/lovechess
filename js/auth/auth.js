// LOVE CHESS — authentication

function getCurrentPlayer(){
  if(apiCurrentUser?.id)return apiCurrentUser.id;
  return '';
}

async function logoutPlayer(){try{await apiLogout()}catch(error){alert(error.message);return}location.hash='profile';}

async function loginPlayer(username,password){
  try{await apiLogin(username,password);location.hash='profile/'+apiCurrentUser.id}
  catch(error){alert(error.message)}
}

async function registerPlayer(){const username=document.getElementById('registerLogin')?.value||'',password=document.getElementById('registerPassword')?.value||'',nickname=document.getElementById('registerNickname')?.value||'',acceptPrivacy=!!document.getElementById('privacyConsent')?.checked;try{await apiRegister(username,password,nickname,acceptPrivacy);location.hash='profile/'+apiCurrentUser.id}catch(error){alert(error.message)}}

function auth(){route('profile');}

