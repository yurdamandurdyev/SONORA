import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './login.css';

document.querySelector('#app').innerHTML = `
  <main class="login-layout">
    <section class="login-left" aria-labelledby="login-title"><div class="login-inner">
      <a class="login-brand" href="/index.html" aria-label="SONORA home">SONORA</a>
      <div class="login-content"><h1 id="login-title">WELCOME<br><span>BACK.</span></h1><p class="login-switch">Don't have an account? <button type="button" id="mode-toggle">Sign up</button></p>
        <div class="social-actions"><button type="button" data-social="Google"><span class="google-mark" aria-hidden="true">G</span>Continue with Google</button><button type="button" data-social="Apple"><img class="apple-mark" src="/login/apple.svg" alt="">Continue with Apple</button></div>
        <div class="login-divider"><span>OR</span></div>
        <form id="login-form"><label for="login-email">EMAIL ADDRESS</label><input id="login-email" name="email" type="email" autocomplete="email" placeholder="hello@example.com" required><label for="login-password">PASSWORD</label><div class="password-wrap"><input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required><button type="button" id="show-password" aria-pressed="false">SHOW</button></div><div class="login-options"><label class="remember"><input id="remember-me" type="checkbox"><span>Remember me</span></label><button type="button" id="forgot-password">Forgot password?</button></div><button class="login-submit" type="submit" id="login-submit">SIGN IN →</button></form>
        <p class="login-note" id="login-note">Demo: enter any valid email to sign in.</p><p class="login-message" id="login-message" role="status" aria-live="polite"></p>
      </div>
    </div></section>
    <aside class="login-art" aria-label="Vinyl record illustration"><img src="/login/vinyl-records.png" alt="" width="560" height="842"><div class="login-art-copy"><h2>OBJECTS WITH<br>A SOUNDTRACK.</h2><p>Track your orders, curate your collection, and get notified when something worth owning comes back in stock.</p></div></aside>
  </main>
`;

let signupMode = false;
const message = document.querySelector('#login-message');
document.querySelector('#mode-toggle').addEventListener('click', () => {
  signupMode = !signupMode;
  document.querySelector('#login-title').innerHTML = signupMode ? 'JOIN THE<br><span>COLLECTION.</span>' : 'WELCOME<br><span>BACK.</span>';
  document.querySelector('.login-switch').firstChild.textContent = signupMode ? 'Already have an account? ' : "Don't have an account? ";
  document.querySelector('#mode-toggle').textContent = signupMode ? 'Sign in' : 'Sign up';
  document.querySelector('#login-submit').textContent = signupMode ? 'SIGN UP →' : 'SIGN IN →';
  document.querySelector('#login-password').autocomplete = signupMode ? 'new-password' : 'current-password';
  message.textContent = '';
});
document.querySelector('#show-password').addEventListener('click', event => {
  const input = document.querySelector('#login-password');
  const visible = input.type === 'password';
  input.type = visible ? 'text' : 'password';
  event.currentTarget.textContent = visible ? 'HIDE' : 'SHOW';
  event.currentTarget.setAttribute('aria-pressed', visible);
});
document.querySelectorAll('[data-social]').forEach(button => button.addEventListener('click', () => {
  message.textContent = `${button.dataset.social} sign-in is not connected in this demo. Use your email below.`;
}));
document.querySelector('#forgot-password').addEventListener('click', () => {
  message.textContent = 'Password recovery is not connected in this demo. Enter any password to continue.';
});
document.querySelector('#login-form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#login-email').value.trim();
  const session = JSON.stringify({ email, demo: true });
  if (document.querySelector('#remember-me').checked) {
    localStorage.setItem('sonora-demo-user', session);
    sessionStorage.removeItem('sonora-demo-user');
  } else {
    sessionStorage.setItem('sonora-demo-user', session);
    localStorage.removeItem('sonora-demo-user');
  }
  const next = new URLSearchParams(location.search).get('next');
  location.href = next?.startsWith('/') && !next.startsWith('//') ? next : '/wishlist.html';
});
