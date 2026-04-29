/// <reference types="node" />

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('app background styling', () => {
  it('uses a classroom canvas background instead of a flat slate color', () => {
    const css = readFileSync('src/app.css', 'utf8');

    expect(css).toContain('--teacher-canvas');
    expect(css).toContain('--chalk-line');
    expect(css).not.toContain('--bg: hsl(0, 0%, 30%)');
  });
});
