function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function sha256(str) {
  const encoded = new TextEncoder().encode(str);
  return crypto.subtle.digest('SHA-256', encoded);
}

function generateCodeVerifier() {
  // 32 random bytes → base64url → 43 chars (RFC 7636 min 43)
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier) {
  const hash = await sha256(verifier);
  return base64UrlEncode(hash);
}

function httpBadgeClass(status) {
  if (status >= 200 && status < 300) return 'http-2xx';
  if (status >= 400 && status < 500) return 'http-4xx';
  if (status >= 500) return 'http-5xx';
  return 'http-other';
}

function validateApiPath(path) {
  if (!path || !path.startsWith('/')) {
    throw new Error('API path must start with /');
  }
}

function validateJsonBody(bodyText) {
  if (bodyText && bodyText.trim()) {
    JSON.parse(bodyText); // throws SyntaxError if invalid
  }
}

export {
  escapeHtml,
  base64UrlEncode,
  sha256,
  generateCodeVerifier,
  generateCodeChallenge,
  httpBadgeClass,
  validateApiPath,
  validateJsonBody,
};
