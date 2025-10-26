import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
    }
    
    type Mock<T extends (...args: any) => any> = {
      (...args: Parameters<T>): ReturnType<T>;
      mockClear: () => void;
      mockReset: () => void;
      mockRestore: () => void;
      mockImplementation: (fn: T) => Mock<T>;
      mockImplementationOnce: (fn: T) => Mock<T>;
      mockReturnValue: (value: ReturnType<T>) => Mock<T>;
      mockReturnValueOnce: (value: ReturnType<T>) => Mock<T>;
    };
  }
}
