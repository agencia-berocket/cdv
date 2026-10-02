/**
 * session-guard.js — Proteção de Acesso & Autenticação de Sessão (b.rocket Digital Engine)
 * -----------------------------------------------------------------------------------
 * Garante que o acesso só ocorra após autenticação na tela de login (login.html).
 * Suporta persistência via localStorage para abas abertas em paralelo e navegadores locais.
 */

(function enforceAuth() {
  let sessionToken = sessionStorage.getItem('b_rocket_session') || localStorage.getItem('b_rocket_session');
  
  // Se for ambiente local (file:// ou localhost), garante a sessão autenticada sem redirecionamento em novas abas
  if (!sessionToken && (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    sessionToken = 'cdv_authenticated';
    sessionStorage.setItem('b_rocket_session', 'cdv_authenticated');
    localStorage.setItem('b_rocket_session', 'cdv_authenticated');
  }

  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.endsWith('login.html');

  if (!isLoginPage && sessionToken !== 'cdv_authenticated') {
    if (currentPath.includes('/Google_Ads/') || currentPath.includes('/SEO/') || currentPath.includes('/GEO/')) {
      window.location.href = '../login.html';
    } else {
      window.location.href = './login.html';
    }
  } else if (sessionToken === 'cdv_authenticated') {
    sessionStorage.setItem('b_rocket_session', 'cdv_authenticated');
    localStorage.setItem('b_rocket_session', 'cdv_authenticated');
  }
})();

/**
 * Função global de logout
 */
function realizarLogout() {
  sessionStorage.removeItem('b_rocket_session');
  sessionStorage.removeItem('b_rocket_user');
  localStorage.removeItem('b_rocket_session');
  localStorage.removeItem('b_rocket_user');
  
  const currentPath = window.location.pathname;
  if (currentPath.includes('/Google_Ads/') || currentPath.includes('/SEO/') || currentPath.includes('/GEO/')) {
    window.location.href = '../login.html';
  } else {
    window.location.href = './login.html';
  }
}
