const SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET ?? 'change-this-secret';

export function encryptBoardLink(id: string): string {
  return btoa(
    id
      .split('')
      .map((c, i) =>
        String.fromCharCode(
          c.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length),
        ),
      )
      .join(''),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // URL-safe base64
}

export function decryptBoardLink(encoded: string): string {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(base64);
  return decoded
    .split('')
    .map((c, i) =>
      String.fromCharCode(
        c.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length),
      ),
    )
    .join('');
}
