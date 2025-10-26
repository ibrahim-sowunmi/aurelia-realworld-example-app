import React from 'react';
import { render, screen } from '@testing-library/react';

const SimpleComponent = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <p>This is a simple test component</p>
    </div>
  );
};

describe('SimpleComponent', () => {
  it('renders without crashing', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('This is a simple test component')).toBeInTheDocument();
  });
});
