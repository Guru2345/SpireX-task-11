// Safe storage utility that gracefully handles restricted iframe environments

export function getSafeItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Access denied in sandboxed iframes
  }
  return null;
}

export function setSafeItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Access denied in sandboxed iframes
  }
}
