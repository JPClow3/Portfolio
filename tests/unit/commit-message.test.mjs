import { describe, expect, it } from 'vitest';
import { validateCommitSubject } from '../../scripts/validate-commit-message.mjs';

describe('commit message policy', () => {
  it('accepts a descriptive conventional subject', () => {
    expect(validateCommitSubject('feat(projects): add client case studies')).toBeNull();
  });

  it.each([
    'hbjklhbjk',
    'fix: typo',
    'chore: çk',
    'feat(projects) add catalog',
  ])('rejects opaque or incomplete subject: %s', (subject) => {
    expect(validateCommitSubject(subject)).not.toBeNull();
  });

  it('allows generated merge subjects', () => {
    expect(validateCommitSubject('Merge pull request #42 from JPClow3/projects')).toBeNull();
  });
});
