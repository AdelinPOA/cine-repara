import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup după fiecare test
afterEach(() => {
  cleanup();
});
