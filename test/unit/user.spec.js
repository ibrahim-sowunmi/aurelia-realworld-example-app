import {User} from '../../src/shared/models/user';

describe('User model', () => {
  let user;

  beforeEach(() => {
    user = new User();
  });

  it('can be instantiated', () => {
    expect(user).toBeDefined();
  });

  it('initializes with empty email', () => {
    expect(user.email).toBe('');
  });

  it('initializes with empty token', () => {
    expect(user.token).toBe('');
  });

  it('initializes with empty username', () => {
    expect(user.username).toBe('');
  });

  it('initializes with empty bio', () => {
    expect(user.bio).toBe('');
  });

  it('initializes with empty image', () => {
    expect(user.image).toBe('');
  });

  it('can set email', () => {
    user.email = 'test@example.com';
    expect(user.email).toBe('test@example.com');
  });

  it('can set username', () => {
    user.username = 'testuser';
    expect(user.username).toBe('testuser');
  });

  it('can set token', () => {
    user.token = 'abc123';
    expect(user.token).toBe('abc123');
  });
});
