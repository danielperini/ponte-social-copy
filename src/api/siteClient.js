let csrf;
export async function request(action, body) {
  if (body && !csrf) csrf = (await request('session')).csrf;
  const response = await fetch(`/api/index.php?action=${encodeURIComponent(action)}`, {
    method: body ? 'POST' : 'GET', credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(25000),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 403) csrf = undefined;
    throw Object.assign(new Error(data.message || 'Serviço indisponível.'), { status: response.status });
  }
  return data;
}
const unavailable = async () => { throw new Error('Este fluxo não está habilitado.'); };
export const site = {
  requestDeletion: body => request('deletion', body),
  requestContact: body => request('contact', body),
  auth: {
    me: () => request('me'),
    logout: async () => { await request('logout', {}); csrf = undefined; },
    redirectToLogin: () => { window.location.href = '/login?returnTo=' + encodeURIComponent(window.location.pathname); },
    loginWithProvider: (provider, returnTo = '/') => {
      if (provider !== 'google') return unavailable();
      window.location.href = '/api/index.php?action=google-start&returnTo=' + encodeURIComponent(returnTo);
    },
    // Legacy screens remain in source, with no fallback to production.
    loginViaEmailPassword: unavailable, register: unavailable, verifyOtp: unavailable,
    setToken: unavailable, resendOtp: unavailable, resetPasswordRequest: unavailable, resetPassword: unavailable,
  },
};
