export const DELETION_EMAIL = 'comercial@pontesocialconsultoria.com.br';

export function deletionMailto(email, subject, body) {
  const normalized = email.trim();
  if (!normalized || normalized.length > 254 || /[\r\n]/.test(normalized)
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Invalid email');
  return `mailto:${DELETION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace('{email}', normalized))}`;
}
