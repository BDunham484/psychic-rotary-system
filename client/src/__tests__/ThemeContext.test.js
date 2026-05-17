import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../utils/ThemeContext';

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

test('defaults to dark when no localStorage and no system preference', () => {
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('defaults to light when system prefers light and no localStorage', () => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: light)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('light');
});

test('uses localStorage value when present, ignoring matchMedia', () => {
  localStorage.setItem('noisebox-theme', 'light');
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('light');
});

test('toggleTheme switches dark to light and persists to localStorage', () => {
  const { result } = renderHook(() => useTheme(), { wrapper });
  act(() => { result.current.toggleTheme(); });
  expect(result.current.theme).toBe('light');
  expect(localStorage.getItem('noisebox-theme')).toBe('light');
});

test('toggleTheme switches light to dark', () => {
  localStorage.setItem('noisebox-theme', 'light');
  const { result } = renderHook(() => useTheme(), { wrapper });
  act(() => { result.current.toggleTheme(); });
  expect(result.current.theme).toBe('dark');
});

test('sets data-theme on html element when theme changes', () => {
  const { result } = renderHook(() => useTheme(), { wrapper });
  act(() => { result.current.toggleTheme(); });
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});
