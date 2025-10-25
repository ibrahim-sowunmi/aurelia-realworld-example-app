import {SharedState} from '../../src/shared/state/shared-state';
import {User} from '../../src/shared/models/user';

describe('SharedState', () => {
  let sharedState;

  beforeEach(() => {
    sharedState = new SharedState();
  });

  it('can be instantiated', () => {
    expect(sharedState).toBeDefined();
  });

  it('initializes with a User instance', () => {
    expect(sharedState.currentUser).toBeDefined();
    expect(sharedState.currentUser instanceof User).toBe(true);
  });

  it('initializes isAuthenticated to false', () => {
    expect(sharedState.isAuthenticated).toBe(false);
  });

  it('can set isAuthenticated to true', () => {
    sharedState.isAuthenticated = true;
    expect(sharedState.isAuthenticated).toBe(true);
  });

  it('can update currentUser', () => {
    sharedState.currentUser.username = 'testuser';
    expect(sharedState.currentUser.username).toBe('testuser');
  });
});
