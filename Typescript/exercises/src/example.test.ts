import { sum } from './example';

describe('sum function', () => {
  it('adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('handles negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});