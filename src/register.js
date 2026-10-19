import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './login.css';
import './register.css';

document.querySelector('#app').innerHTML = `
  <main class="register-layout">
    <aside class="register-art"><img src="/register/album-covers.png" alt="" width="520" height="1050"><div class="register-art-copy"><h2>THE FORMAT<br><span>MATTERS.</span></h2><p>Join a community of listeners and collectors who believe music sounds better when it has weight and texture.</p></div></aside>
    <section class="register-panel" aria-labelledby="register-title"><div class="register-inner">
      <a class="login-brand" href="/index.html" aria-label="SONORA home">SONORA</a>
      <div class="register-content"><h1 id="register-title">MAKE MUSIC<br>PART<br>OF YOUR<br>COLLECTION.</h1><p class="login-switch">Already have an account? <a href="/login.html">Sign in</a></p>
        <div class="social-actions"><button type="button" data-social="Google"><span class="google-mark" aria-hidden="true">G</span>Sign up with Google</button><button type="button" data-social="Apple"><img class="apple-mark" src="/login/apple.svg" alt="">Sign up with Apple</button></div>
        <div class="login-divider"><span>OR</span></div>
        <form id="register-form"><label for="register-name">FIRST NAME (OPTIONAL)</label><input id="register-name" name="name" type="text" autocomplete="given-name" placeholder="Jane"><label for="register-email">EMAIL ADDRESS</label><input id="register-email" name="email" type="email" autocomplete="email" placeholder="hello@example.com" required><label for="register-password">PASSWORD</label><div class="password-wrap"><input id="register-password" name="password" type="password" autocomplete="new-password" placeholder="Min. 8 characters" minlength="8" required><button type="button" data-toggle-password="register-password" aria-label="Show password" aria-pressed="false">SHOW</button></div><label class="confirm-label" for="register-confirm">CONFIRM PASSWORD</label><input id="register-confirm" name="confirm" type="password" autocomplete="new-password" placeholder="Repeat your password" required>
          <label class="register-terms"><input type="checkbox" id="register-agree" required><span>I agree to SONORA's <button type="button" data-legal="Terms of Service">Terms of Service</button> and <button type="button" data-legal="Privacy Policy">Privacy Policy</button></span></label><button class="login-submit" type="submit">CREATE ACCOUNT →</button>
        </form><p class="login-note">Demo only: no account is created and no password is saved.</p><p class="login-message" id="register-message" role="status" aria-live="polite"></p>
      </div>
    </div></section>
  </main>`;

const message = document.querySelector('#register-message');
document.querySelectorAll('[data-social]').forEach(button => button.addEventListener('click', () => {
  message.textContent = `${button.dataset.social} sign-up is not connected in this demo.`;
}));
document.querySelectorAll('[data-legal]').forEach(button => button.addEventListener('click', () => {
  message.textContent = `${button.dataset.legal} is not available yet. No real account will be created.`;
}));
document.querySelector('[data-toggle-password]').addEventListener('click', event => {
  const input = document.getElementById(event.currentTarget.dataset.togglePassword);
  const visible = input.type === 'password';
  input.type = visible ? 'text' : 'password';
  event.currentTarget.textContent = visible ? 'HIDE' : 'SHOW';
  event.currentTarget.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
  event.currentTarget.setAttribute('aria-pressed', String(visible));
});
document.querySelector('#register-form').addEventListener('submit', event => {
  event.preventDefault();
  const password = document.querySelector('#register-password');
  const confirm = document.querySelector('#register-confirm');
  if (password.value !== confirm.value) {
    confirm.setCustomValidity('Passwords do not match');
    confirm.reportValidity();
    message.textContent = 'Passwords do not match.';
    return;
  }
  confirm.setCustomValidity('');
  const email = document.querySelector('#register-email').value.trim();
  sessionStorage.setItem('sonora-demo-user', JSON.stringify({ email, demo: true }));
  location.href = '/account.html';
});
document.querySelector('#register-confirm').addEventListener('input', event => event.currentTarget.setCustomValidity(''));
