import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  base64UrlEncode,
  generateCodeVerifier,
  generateCodeChallenge,
  httpBadgeClass,
  validateApiPath,
  validateJsonBody,
} from '../src/pkce-utils.js';

// ── escapeHtml ────────────────────────────────────────────────

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });
  it('escapes less-than', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
  });
  it('escapes greater-than', () => {
    expect(escapeHtml('x>y')).toBe('x&gt;y');
  });
  it('escapes double-quote', () => {
    expect(escapeHtml('"value"')).toBe('&quot;value&quot;');
  });
  it('escapes all XSS special chars together', () => {
    expect(escapeHtml('<script src="x">&</script>'))
      .toBe('&lt;script src=&quot;x&quot;&gt;&amp;&lt;/script&gt;');
  });
  it('returns safe strings unchanged', () => {
    expect(escapeHtml('hello world 123')).toBe('hello world 123');
  });
  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });
  it('coerces numbers to string', () => {
    expect(escapeHtml(42)).toBe('42');
  });
});

// ── base64UrlEncode ───────────────────────────────────────────

describe('base64UrlEncode', () => {
  it('replaces + with -', () => {
    // [0xFB, 0xEF, 0xBE] encodes to standard base64 "++/+" — use known bytes that produce +
    // [0xFB] = 11111011 → in groups of 6: 111110 110000 → 62 48 → '+' '0' with padding
    // Use a known vector: base64 of [0xF8] = "+A==" standard → "-A" url-safe
    const result = base64UrlEncode(new Uint8Array([0xF8]).buffer);
    expect(result).toBe('-A');
  });
  it('replaces / with _', () => {
    // [0xFC] → standard base64 "/A==" → url-safe "_A"
    const result = base64UrlEncode(new Uint8Array([0xFC]).buffer);
    expect(result).toBe('_A');
  });
  it('strips = padding', () => {
    const result = base64UrlEncode(new Uint8Array([0x00]).buffer);
    expect(result).not.toContain('=');
  });
  it('never contains +, / or = for any 32-byte input', () => {
    for (let i = 0; i < 50; i++) {
      const buf = new Uint8Array(32);
      crypto.getRandomValues(buf);
      expect(base64UrlEncode(buf.buffer)).not.toMatch(/[+/=]/);
    }
  });
  it('produces deterministic output for [0x00, 0x01, 0x02]', () => {
    expect(base64UrlEncode(new Uint8Array([0x00, 0x01, 0x02]).buffer)).toBe('AAEC');
  });
});

// ── generateCodeVerifier ──────────────────────────────────────

describe('generateCodeVerifier', () => {
  it('produces exactly 43 characters from 32 random bytes', () => {
    expect(generateCodeVerifier()).toHaveLength(43);
  });
  it('only contains RFC 7636 unreserved characters', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateCodeVerifier()).toMatch(/^[A-Za-z0-9\-._~]+$/);
    }
  });
  it('produces a unique value on each call', () => {
    const a = generateCodeVerifier();
    const b = generateCodeVerifier();
    expect(a).not.toBe(b);
  });
});

// ── generateCodeChallenge ─────────────────────────────────────

describe('generateCodeChallenge', () => {
  it('matches RFC 7636 Appendix B known vector', async () => {
    // From RFC 7636 Appendix B:
    // code_verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
    // code_challenge = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
    const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
    const challenge = await generateCodeChallenge(verifier);
    expect(challenge).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
  });
  it('produces base64url output (no +, /, =)', async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    expect(challenge).not.toMatch(/[+/=]/);
  });
  it('produces 43 characters (SHA-256 = 32 bytes → 43 base64url chars)', async () => {
    const challenge = await generateCodeChallenge(generateCodeVerifier());
    expect(challenge).toHaveLength(43);
  });
  it('is deterministic for the same verifier', async () => {
    const verifier = generateCodeVerifier();
    const c1 = await generateCodeChallenge(verifier);
    const c2 = await generateCodeChallenge(verifier);
    expect(c1).toBe(c2);
  });
});

// ── httpBadgeClass ────────────────────────────────────────────

describe('httpBadgeClass', () => {
  it('returns http-2xx for 200', () => expect(httpBadgeClass(200)).toBe('http-2xx'));
  it('returns http-2xx for 204', () => expect(httpBadgeClass(204)).toBe('http-2xx'));
  it('returns http-2xx for 299', () => expect(httpBadgeClass(299)).toBe('http-2xx'));
  it('returns http-4xx for 400', () => expect(httpBadgeClass(400)).toBe('http-4xx'));
  it('returns http-4xx for 401', () => expect(httpBadgeClass(401)).toBe('http-4xx'));
  it('returns http-4xx for 404', () => expect(httpBadgeClass(404)).toBe('http-4xx'));
  it('returns http-4xx for 499', () => expect(httpBadgeClass(499)).toBe('http-4xx'));
  it('returns http-5xx for 500', () => expect(httpBadgeClass(500)).toBe('http-5xx'));
  it('returns http-5xx for 503', () => expect(httpBadgeClass(503)).toBe('http-5xx'));
  it('returns http-other for 100', () => expect(httpBadgeClass(100)).toBe('http-other'));
  it('returns http-other for 301', () => expect(httpBadgeClass(301)).toBe('http-other'));
});

// ── validateApiPath ───────────────────────────────────────────

describe('validateApiPath', () => {
  it('passes for /api/v2/users/me', () => {
    expect(() => validateApiPath('/api/v2/users/me')).not.toThrow();
  });
  it('passes for /', () => {
    expect(() => validateApiPath('/')).not.toThrow();
  });
  it('throws for path without leading slash', () => {
    expect(() => validateApiPath('api/v2/users/me')).toThrow('API path must start with /');
  });
  it('throws for empty string', () => {
    expect(() => validateApiPath('')).toThrow('API path must start with /');
  });
  it('throws for null', () => {
    expect(() => validateApiPath(null)).toThrow('API path must start with /');
  });
  it('throws for undefined', () => {
    expect(() => validateApiPath(undefined)).toThrow('API path must start with /');
  });
});

// ── validateJsonBody ──────────────────────────────────────────

describe('validateJsonBody', () => {
  it('passes for valid JSON object', () => {
    expect(() => validateJsonBody('{"key":"value"}')).not.toThrow();
  });
  it('passes for valid JSON array', () => {
    expect(() => validateJsonBody('[1,2,3]')).not.toThrow();
  });
  it('passes for empty string', () => {
    expect(() => validateJsonBody('')).not.toThrow();
  });
  it('passes for whitespace-only string', () => {
    expect(() => validateJsonBody('   ')).not.toThrow();
  });
  it('passes for null/undefined (no body)', () => {
    expect(() => validateJsonBody(null)).not.toThrow();
    expect(() => validateJsonBody(undefined)).not.toThrow();
  });
  it('throws SyntaxError for malformed JSON', () => {
    expect(() => validateJsonBody('{invalid}')).toThrow(SyntaxError);
  });
  it('throws for unclosed brace', () => {
    expect(() => validateJsonBody('{"key":')).toThrow(SyntaxError);
  });
  it('throws for bare string without quotes', () => {
    expect(() => validateJsonBody('hello')).toThrow(SyntaxError);
  });
});
