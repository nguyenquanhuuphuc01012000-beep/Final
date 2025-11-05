// utils/password.js
export function genPassword() {
  return Math.random().toString(36).slice(-8);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
