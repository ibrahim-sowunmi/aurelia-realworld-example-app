import {config} from '../../src/shared/services/config';

describe('Config', () => {
  it('is defined', () => {
    expect(config).toBeDefined();
  });

  it('has api_url property', () => {
    expect(config.api_url).toBeDefined();
  });

  it('api_url is a string', () => {
    expect(typeof config.api_url).toBe('string');
  });

  it('api_url contains https protocol', () => {
    expect(config.api_url).toContain('https://');
  });

  it('api_url points to realworld.io', () => {
    expect(config.api_url).toContain('realworld.io');
  });
});
