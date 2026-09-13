import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const conventionalSubject = /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(\([a-z0-9._/-]+\))?: (.+)$/;
const generatedSubject = /^(Merge |Revert "|\[[A-Z]+-[0-9]+\] )/;
const zeroSha = /^0+$/;

export function validateCommitSubject(subject) {
  const normalized = subject.trim();

  if (generatedSubject.test(normalized)) return null;

  const match = normalized.match(conventionalSubject);
  if (!match) {
    return 'use Conventional Commits, for example: feat(projects): add client case studies';
  }

  const summary = match[3].trim();
  if (summary.length < 12) return 'write a descriptive summary of at least 12 characters';
  if (summary.length > 80) return 'keep the summary at 80 characters or fewer';
  if (!/[a-zA-ZÀ-ÿ]/.test(summary)) return 'include a meaningful word in the summary';
  if (/^(.)\1{5,}$/i.test(summary.replace(/\s+/g, ''))) return 'replace repeated characters with a meaningful summary';

  return null;
}

function readSubjects(args) {
  if (args[0] === '--file' && args[1]) {
    return [readFileSync(args[1], 'utf8').split(/\r?\n/, 1)[0]];
  }

  if (args[0] === '--range' && args[1] && args[2]) {
    const [, base, head] = args;
    const revision = zeroSha.test(base) ? head : `${base}..${head}`;
    const maxCount = zeroSha.test(base) ? ['-n', '1'] : [];
    const output = execFileSync('git', ['log', ...maxCount, '--format=%s', revision], { encoding: 'utf8' });
    return output.split(/\r?\n/).filter(Boolean);
  }

  if (args.length > 0) return [args.join(' ')];
  throw new Error('usage: validate-commit-message.mjs --file <path> | --range <base> <head> | <subject>');
}

let failed = false;
for (const subject of readSubjects(process.argv.slice(2))) {
  const error = validateCommitSubject(subject);
  if (!error) continue;
  failed = true;
  console.error(`[ERROR] Invalid commit subject: "${subject}"`);
  console.error(`        ${error}.`);
}

if (failed) process.exit(1);
console.log('[OK] Commit subjects are descriptive and follow the project convention.');
