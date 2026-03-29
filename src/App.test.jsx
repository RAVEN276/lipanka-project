import { describe, it, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Simple example test
describe('App Component', () => {
  it('renders without crashing', () => {
    // We need to wrap App in BrowserRouter because it uses routing internally
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // You can add more specific assertions here based on what your App renders initially
    // For example, checking if the LoadingScreen or HeroPage appears
  });

  test('simple math test', () => {
    expect(1 + 1).toBe(2);
  });
});
