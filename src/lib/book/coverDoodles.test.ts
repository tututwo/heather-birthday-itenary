import { describe, expect, it } from 'vitest';
import { coverDoodles } from './coverDoodles';

describe('coverDoodles', () => {
  it('uses teacher birthday classroom motifs for the front cover', () => {
    expect(coverDoodles.map((doodle) => doodle.id)).toEqual(
      expect.arrayContaining(['birthday-cake', 'teacher-apple', 'pencil', 'sparkles'])
    );
    expect(coverDoodles).toHaveLength(4);
  });
});
