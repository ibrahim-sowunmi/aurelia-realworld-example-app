require('@testing-library/jest-dom');

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  }),
  useParams: () => ({}),
  usePathname: () => ''
}));
