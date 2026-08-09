# AI workflow addendum — portfolio

This repository already has an `AGENTS.md`, which was left untouched. This file records only what the AI dev controller needs.

## Non-negotiables

- Base branch: `main`
- CI trigger: `pull_request`
- Never merge a pull request. Never push to the base branch. Never force-push.
- Never run migrations, deployments, or destructive operations against production.

## Validation

- `npm run test:unit` (required)
- `npm run build` (required)

## Knowledge map

See `.ai-workflow/knowledge-map.yaml`. Documents under `historical_notes` are superseded and must not be followed.
