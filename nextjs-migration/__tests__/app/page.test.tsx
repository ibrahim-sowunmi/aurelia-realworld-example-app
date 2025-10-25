import { render } from '@testing-library/react';
import Home from '../../app/page';
import HomePage from '../../app/_components/Home/HomePage';

jest.mock('../../app/_components/Home/HomePage', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="home-page">Home Page Component</div>),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the HomePage component', () => {
    const { getByTestId } = render(Home());
    
    expect(getByTestId('home-page')).toBeInTheDocument();
    expect(HomePage).toHaveBeenCalled();
  });
});
