import '@testing-library/jest-dom';

// Mock crypto for Node.js environment
import { vi } from 'vitest';

// Mock environment variables
process.env.DEEPSEEK_API_KEY = 'test-api-key';
