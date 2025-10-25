import {UserService} from '../../src/shared/services/user-service';
import {User} from '../../src/shared/models/user';

describe('UserService', () => {
  let userService;
  let mockApiService;
  let mockJwtService;
  let mockSharedState;

  beforeEach(() => {
    // Create mock services
    mockApiService = {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put')
    };

    mockJwtService = {
      getToken: jasmine.createSpy('getToken'),
      saveToken: jasmine.createSpy('saveToken'),
      destroyToken: jasmine.createSpy('destroyToken')
    };

    mockSharedState = {
      currentUser: null,
      isAuthenticated: false
    };

    userService = new UserService(mockApiService, mockJwtService, mockSharedState);
  });

  it('can be instantiated', () => {
    expect(userService).toBeDefined();
  });

  describe('populate', () => {
    it('fetches user data when token exists', () => {
      const mockUser = { email: 'test@example.com', token: 'abc123', username: 'testuser' };
      mockJwtService.getToken.and.returnValue('abc123');
      mockApiService.get.and.returnValue(Promise.resolve({ user: mockUser }));

      userService.populate();

      expect(mockJwtService.getToken).toHaveBeenCalled();
      expect(mockApiService.get).toHaveBeenCalledWith('/user');
    });

    it('sets auth after fetching user data', (done) => {
      const mockUser = { email: 'test@example.com', token: 'abc123', username: 'testuser' };
      mockJwtService.getToken.and.returnValue('abc123');
      mockApiService.get.and.returnValue(Promise.resolve({ user: mockUser }));

      userService.populate();

      setTimeout(() => {
        expect(mockJwtService.saveToken).toHaveBeenCalledWith('abc123');
        expect(mockSharedState.currentUser).toEqual(mockUser);
        expect(mockSharedState.isAuthenticated).toBe(true);
        done();
      }, 10);
    });

    it('purges auth when no token exists', () => {
      mockJwtService.getToken.and.returnValue(null);

      userService.populate();

      expect(mockJwtService.getToken).toHaveBeenCalled();
      expect(mockApiService.get).not.toHaveBeenCalled();
      expect(mockJwtService.destroyToken).toHaveBeenCalled();
      expect(mockSharedState.isAuthenticated).toBe(false);
    });
  });

  describe('setAuth', () => {
    it('saves token to jwt service', () => {
      const user = { email: 'test@example.com', token: 'abc123', username: 'testuser' };

      userService.setAuth(user);

      expect(mockJwtService.saveToken).toHaveBeenCalledWith('abc123');
    });

    it('sets current user in shared state', () => {
      const user = { email: 'test@example.com', token: 'abc123', username: 'testuser' };

      userService.setAuth(user);

      expect(mockSharedState.currentUser).toEqual(user);
    });

    it('sets isAuthenticated to true', () => {
      const user = { email: 'test@example.com', token: 'abc123', username: 'testuser' };

      userService.setAuth(user);

      expect(mockSharedState.isAuthenticated).toBe(true);
    });
  });

  describe('purgeAuth', () => {
    it('destroys token from jwt service', () => {
      userService.purgeAuth();

      expect(mockJwtService.destroyToken).toHaveBeenCalled();
    });

    it('resets current user to empty User object', () => {
      mockSharedState.currentUser = { email: 'test@example.com' };

      userService.purgeAuth();

      expect(mockSharedState.currentUser).toEqual(jasmine.any(User));
      expect(mockSharedState.currentUser.email).toBe('');
    });

    it('sets isAuthenticated to false', () => {
      mockSharedState.isAuthenticated = true;

      userService.purgeAuth();

      expect(mockSharedState.isAuthenticated).toBe(false);
    });
  });

  describe('attemptAuth', () => {
    const credentials = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    it('calls correct endpoint for login', () => {
      const mockResponse = { user: { ...credentials, token: 'abc123' } };
      mockApiService.post.and.returnValue(Promise.resolve(mockResponse));

      userService.attemptAuth('login', credentials);

      expect(mockApiService.post).toHaveBeenCalledWith('/users/login', { user: credentials });
    });

    it('calls correct endpoint for register', () => {
      const mockResponse = { user: { ...credentials, token: 'abc123' } };
      mockApiService.post.and.returnValue(Promise.resolve(mockResponse));

      userService.attemptAuth('register', credentials);

      expect(mockApiService.post).toHaveBeenCalledWith('/users', { user: credentials });
    });

    it('sets auth on successful login', (done) => {
      const mockUser = { ...credentials, token: 'abc123' };
      const mockResponse = { user: mockUser };
      mockApiService.post.and.returnValue(Promise.resolve(mockResponse));

      userService.attemptAuth('login', credentials).then(() => {
        expect(mockJwtService.saveToken).toHaveBeenCalledWith('abc123');
        expect(mockSharedState.currentUser).toEqual(mockUser);
        expect(mockSharedState.isAuthenticated).toBe(true);
        done();
      });
    });

    it('returns user data on successful authentication', (done) => {
      const mockUser = { ...credentials, token: 'abc123' };
      const mockResponse = { user: mockUser };
      mockApiService.post.and.returnValue(Promise.resolve(mockResponse));

      userService.attemptAuth('login', credentials).then((data) => {
        expect(data).toEqual(mockResponse);
        done();
      });
    });

    it('propagates errors on failed authentication', (done) => {
      const errorResponse = { errors: { email: 'is invalid' } };
      mockApiService.post.and.returnValue(Promise.reject(errorResponse));

      userService.attemptAuth('login', credentials).catch((error) => {
        expect(error).toEqual(errorResponse);
        expect(mockJwtService.saveToken).not.toHaveBeenCalled();
        expect(mockSharedState.isAuthenticated).toBe(false);
        done();
      });
    });
  });

  describe('update', () => {
    it('calls api service with user data', () => {
      const user = { email: 'updated@example.com', username: 'updateduser' };
      const mockResponse = { user };
      mockApiService.put.and.returnValue(Promise.resolve(mockResponse));

      userService.update(user);

      expect(mockApiService.put).toHaveBeenCalledWith('/user', { user });
    });

    it('updates current user in shared state', (done) => {
      const user = { email: 'updated@example.com', username: 'updateduser' };
      const mockResponse = { user };
      mockApiService.put.and.returnValue(Promise.resolve(mockResponse));

      userService.update(user).then(() => {
        expect(mockSharedState.currentUser).toEqual(user);
        done();
      });
    });

    it('returns updated user data', (done) => {
      const user = { email: 'updated@example.com', username: 'updateduser' };
      const mockResponse = { user };
      mockApiService.put.and.returnValue(Promise.resolve(mockResponse));

      userService.update(user).then((updatedUser) => {
        expect(updatedUser).toEqual(user);
        done();
      });
    });

    it('handles update errors', (done) => {
      const user = { email: 'invalid', username: 'test' };
      const errorResponse = { errors: { email: 'is invalid' } };
      mockApiService.put.and.returnValue(Promise.reject(errorResponse));

      userService.update(user).catch((error) => {
        expect(error).toEqual(errorResponse);
        done();
      });
    });
  });
});
