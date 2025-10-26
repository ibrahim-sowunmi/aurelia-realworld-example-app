
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toBeFocused(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toBeEmptyDOMElement(): R;
      toHaveValue(value: string | string[] | number): R;
    }
  }
}
