import {JwtService} from '../../src/shared/services/jwt-service';

describe('JwtService', () => {
  let jwtService;

  beforeEach(() => {
    jwtService = new JwtService();
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('can be instantiated', () => {
    expect(jwtService).toBeDefined();
  });

  it('saves token to localStorage', () => {
    jwtService.saveToken('test-token');
    expect(window.localStorage.jwtToken).toBe('test-token');
  });

  it('gets token from localStorage', () => {
    window.localStorage.jwtToken = 'test-token';
    expect(jwtService.getToken()).toBe('test-token');
  });

  it('destroys token from localStorage', () => {
    window.localStorage.jwtToken = 'test-token';
    jwtService.destroyToken();
    expect(window.localStorage.jwtToken).toBeUndefined();
  });

  it('returns false when token is invalid', () => {
    expect(jwtService.isTokenValid()).toBe(false);
  });

  it('returns true when token is valid', () => {
    jwtService.saveToken('valid-token');
    expect(jwtService.isTokenValid()).toBe(true);
  });

  it('returns authorization header when token is valid', () => {
    jwtService.saveToken('my-token');
    expect(jwtService.getAuthorizationHeader()).toBe('Token my-token');
  });

  it('returns undefined for authorization header when token is invalid', () => {
    expect(jwtService.getAuthorizationHeader()).toBeUndefined();
  });
});
