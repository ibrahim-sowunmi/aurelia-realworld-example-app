import { config } from './config';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export const jwtService = {
  getToken(): string | null {
    return getCookie(config.token_key);
  },

  saveToken(token: string): void {
    setCookie(config.token_key, token);
  },

  destroyToken(): void {
    deleteCookie(config.token_key);
  },

  isTokenValid(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  },

  getAuthorizationHeader(): string | undefined {
    if (this.isTokenValid()) {
      return `Token ${this.getToken()}`;
    }
    return undefined;
  },
};
