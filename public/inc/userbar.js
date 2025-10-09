async function checkUser() {
  const res = await fetch('/api/user');
  const data = await res.json();

  const form = document.getElementById('loginForm');
  const info = document.getElementById('user-info');
  const name = document.getElementById('user-name');

  if (data.username) {
    // bruker er logget inn → vis info, skjul form
    form.style.display = 'none';
    info.style.display = 'inline';
    name.textContent = data.username;
  } else {
    // ingen bruker i session → vis form, skjul info
    form.style.display = 'inline';
    info.style.display = 'none';
    name.textContent = '';
  }
}

// kjør når siden er lastet
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkUser);
} else {
  checkUser();
}
