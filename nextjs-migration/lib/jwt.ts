import { config } from './config';

export const jwtService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(config.token_key);
  },

  saveToken(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(config.token_key, token);
  },

  destroyToken(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(config.token_key);
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
