import {AuthComponent} from '../../src/components/auth/auth-component';

describe('AuthComponent', () => {
  let authComponent;
  let mockUserService;
  let mockSharedState;
  let mockRouter;

  beforeEach(() => {
    // Create mock services
    mockUserService = {
      attemptAuth: jasmine.createSpy('attemptAuth')
    };

    mockSharedState = {
      currentUser: null,
      isAuthenticated: false
    };

    mockRouter = {
      navigateToRoute: jasmine.createSpy('navigateToRoute')
    };

    authComponent = new AuthComponent(mockUserService, mockSharedState, mockRouter);
  });

  it('can be instantiated', () => {
    expect(authComponent).toBeDefined();
  });

  it('initializes with empty type', () => {
    expect(authComponent.type).toBe('');
  });

  it('initializes with empty username', () => {
    expect(authComponent.username).toBe('');
  });

  it('initializes with empty email', () => {
    expect(authComponent.email).toBe('');
  });

  it('initializes with empty password', () => {
    expect(authComponent.password).toBe('');
  });

  it('initializes with null errors', () => {
    expect(authComponent.errors).toBeNull();
  });

  describe('activate', () => {
    it('sets type from route config', () => {
      const routeConfig = { name: 'login' };
      authComponent.activate({}, routeConfig);
      expect(authComponent.type).toBe('login');
    });

    it('sets type to register from route config', () => {
      const routeConfig = { name: 'register' };
      authComponent.activate({}, routeConfig);
      expect(authComponent.type).toBe('register');
    });
  });

  describe('canSave getter', () => {
    describe('for login', () => {
      beforeEach(() => {
        authComponent.type = 'login';
      });

      it('returns false when email is empty', () => {
        authComponent.email = '';
        authComponent.password = 'password123';
        expect(authComponent.canSave).toBe(false);
      });

      it('returns false when password is empty', () => {
        authComponent.email = 'test@example.com';
        authComponent.password = '';
        expect(authComponent.canSave).toBe(false);
      });

      it('returns false when both email and password are empty', () => {
        authComponent.email = '';
        authComponent.password = '';
        expect(authComponent.canSave).toBe(false);
      });

      it('returns true when both email and password are filled', () => {
        authComponent.email = 'test@example.com';
        authComponent.password = 'password123';
        expect(authComponent.canSave).toBe(true);
      });

      it('does not require username for login', () => {
        authComponent.email = 'test@example.com';
        authComponent.password = 'password123';
        authComponent.username = '';
        expect(authComponent.canSave).toBe(true);
      });
    });

    describe('for register', () => {
      beforeEach(() => {
        authComponent.type = 'register';
      });

      it('returns false when username is empty', () => {
        authComponent.username = '';
        authComponent.email = 'test@example.com';
        authComponent.password = 'password123';
        expect(authComponent.canSave).toBe(false);
      });

      it('returns false when email is empty', () => {
        authComponent.username = 'testuser';
        authComponent.email = '';
        authComponent.password = 'password123';
        expect(authComponent.canSave).toBe(false);
      });

      it('returns false when password is empty', () => {
        authComponent.username = 'testuser';
        authComponent.email = 'test@example.com';
        authComponent.password = '';
        expect(authComponent.canSave).toBe(false);
      });

      it('returns false when all fields are empty', () => {
        authComponent.username = '';
        authComponent.email = '';
        authComponent.password = '';
        expect(authComponent.canSave).toBe(false);
      });

      it('returns true when all fields are filled', () => {
        authComponent.username = 'testuser';
        authComponent.email = 'test@example.com';
        authComponent.password = 'password123';
        expect(authComponent.canSave).toBe(true);
      });
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      authComponent.type = 'login';
      authComponent.username = 'testuser';
      authComponent.email = 'test@example.com';
      authComponent.password = 'password123';
    });

    it('clears errors before submission', () => {
      authComponent.errors = { email: 'is invalid' };
      mockUserService.attemptAuth.and.returnValue(Promise.resolve({}));
      
      authComponent.submit();
      
      expect(authComponent.errors).toBeNull();
    });

    it('calls userService.attemptAuth with correct type and credentials', () => {
      mockUserService.attemptAuth.and.returnValue(Promise.resolve({}));
      
      authComponent.submit();
      
      expect(mockUserService.attemptAuth).toHaveBeenCalledWith('login', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('navigates to home on successful authentication', (done) => {
      mockUserService.attemptAuth.and.returnValue(Promise.resolve({ user: {} }));
      
      authComponent.submit();
      
      setTimeout(() => {
        expect(mockRouter.navigateToRoute).toHaveBeenCalledWith('home');
        done();
      }, 10);
    });

    it('sets errors on failed authentication', (done) => {
      const errorResponse = { errors: { email: 'is invalid', password: 'is too short' } };
      mockUserService.attemptAuth.and.returnValue(
        Promise.reject(Promise.resolve(errorResponse))
      );
      
      authComponent.submit();
      
      setTimeout(() => {
        expect(authComponent.errors).toEqual(errorResponse.errors);
        expect(mockRouter.navigateToRoute).not.toHaveBeenCalled();
        done();
      }, 10);
    });

    it('handles register type correctly', () => {
      authComponent.type = 'register';
      mockUserService.attemptAuth.and.returnValue(Promise.resolve({}));
      
      authComponent.submit();
      
      expect(mockUserService.attemptAuth).toHaveBeenCalledWith('register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  describe('determineActivationStrategy', () => {
    it('returns replace strategy', () => {
      const strategy = authComponent.determineActivationStrategy();
      expect(strategy).toBe('replace');
    });
  });
});
