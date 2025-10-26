import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { useAuth } from '../../../../contexts/AuthContext';

jest.mock('../../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Header', () => {
  test('renders unauthenticated navigation links when user is not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    
    expect(screen.queryByText(/New Article/i)).not.toBeInTheDocument();
  });

  test('renders authenticated navigation links when user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        username: 'testuser',
        email: 'test@example.com',
        image: 'https://example.com/image.jpg',
      },
      isAuthenticated: true,
    });

    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    
    expect(screen.getByText(/New Article/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });
});
