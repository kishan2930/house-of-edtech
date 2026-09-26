import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function HelloWorld() {
  return <h1>Hello, testing!</h1>;
}

describe('HelloWorld', () => {
  it('renders the heading', () => {
    render(<HelloWorld />);
    expect(
      screen.getByRole('heading', { name: 'Hello, testing!' }),
    ).toBeInTheDocument();
  });
});
