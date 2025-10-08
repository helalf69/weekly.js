async function checkUser() {
  const res = await fetch('/api/user');
  const data = await res.json();

  const loginForm = document.getElementById('loginForm');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');

  if (data.username) {
    // bruker er logget inn
    loginForm.style.display = 'none';
    userInfo.style.display = 'inline';
    userName.textContent = data.username;
  } else {
    // ingen bruker i session
    loginForm.style.display = 'inline';
    userInfo.style.display = 'none';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkUser);
} else {
  checkUser();
}
