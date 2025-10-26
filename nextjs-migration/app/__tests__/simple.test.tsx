import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Simple Test', () => {
  it('renders a simple component', () => {
    render(<div data-testid="test">Hello, world!</div>);
    
    const element = screen.getByTestId('test');
    expect(element).toBeTruthy();
    expect(element.textContent).toBe('Hello, world!');
  });
});
