import { describe, expect, it } from 'vitest';
import { starsFromScience } from './scoring';

const t = [20, 45, 70, 95, 120] as const;

describe('starsFromScience', () => {
  it('awards a star at exactly each threshold', () => {
    expect(starsFromScience(0, t)).toBe(0);
    expect(starsFromScience(19, t)).toBe(0);
    expect(starsFromScience(20, t)).toBe(1);
    expect(starsFromScience(94, t)).toBe(3);
    expect(starsFromScience(120, t)).toBe(5);
    expect(starsFromScience(500, t)).toBe(5);
  });
});
