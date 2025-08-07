// Test setup file
import 'jest';

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  // Suppress logs during testing for cleaner output
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test timeout
jest.setTimeout(30000);
