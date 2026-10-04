import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('pipeline builder', () => {
  beforeEach(() => {
    const entries = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (key) => entries.get(key) ?? null,
      setItem: (key, value) => entries.set(key, String(value)),
      removeItem: (key) => entries.delete(key),
      clear: () => entries.clear(),
    });
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });
  it('renders the application with its welcome dialog', () => {
    render(<App />);
    expect(screen.getAllByText(/pipeline/i).length).toBeGreaterThan(0);
  });
});
