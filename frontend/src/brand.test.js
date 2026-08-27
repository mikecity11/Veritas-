import { describe, expect, it } from 'vitest';
describe('brand configuration', () => it('keeps a usable API default', () => expect(import.meta.env.VITE_API_URL || 'http://localhost:8787').toMatch(/^http/)));
