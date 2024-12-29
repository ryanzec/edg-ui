import { expect, test, describe } from 'vitest';
import { stringUtils } from '$lib/utils/string';

describe('string utils', () => {
  test('toTitleCase', () => {
    expect(stringUtils.toTitleCase('testing title case')).toBe('Testing Title Case');
  });

  test('splitOnceWithAll', () => {
    expect(stringUtils.splitOnceWithAll('testing.spliting.once.with.all', '.')).toStrictEqual([
      'testing',
      'spliting.once.with.all',
    ]);
  });
});
