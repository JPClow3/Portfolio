import { mkdir, readFile, writeFile } from 'node:fs/promises';

export type EventType = 'push' | 'pr' | 'create';

export type NormalizedActivity = {
  repo: string;
  message: string;
  url: string;
  date: string;
  eventType: EventType;
};

type GithubEvent = {
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: {
    commits?: { message?: string }[];
    pull_request?: { title?: string; html_url?: string };
    ref_type?: string;
    ref?: string;
    description?: string;
  };
};

type FallbackEvent = {
  repo: string;
  date: Date;
};

const MAX_ACTIVITY_MESSAGE_LENGTH = 88;
const githubActivityCachePath = new URL('../../.cache/github-activity.json', import.meta.url);
const githubActivityTtlMs = 30 * 60 * 1000;

const normalizeMessage = (message: string): string => {
  const trimmedPrefix = message
    .replace(/^(?:merge pull request #\d+\s+from\s+\S+\s*)/i, '')
    .replace(/^(?:build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\([^)]*\))?!?:\s*/i, '')
    .trim();

  if (trimmedPrefix.length <= MAX_ACTIVITY_MESSAGE_LENGTH) {
    return trimmedPrefix;
  }

  return `${trimmedPrefix.slice(0, MAX_ACTIVITY_MESSAGE_LENGTH - 1).trimEnd()}…`;
};

const normalizeGithubEvent = (event: GithubEvent): NormalizedActivity | null => {
  const repo = event.repo?.name?.split('/')[1] ?? event.repo?.name;
  const date = new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (!repo || !date) return null;

  if (event.type === 'PushEvent') {
    const message = event.payload?.commits?.[0]?.message;
    if (!message) return null;

    return {
      repo,
      message: normalizeMessage(message),
      url: `https://github.com/${event.repo?.name}`,
      date,
      eventType: 'push',
    };
  }

  if (event.type === 'PullRequestEvent') {
    const message = event.payload?.pull_request?.title;
    if (!message) return null;

    return {
      repo,
      message: normalizeMessage(message),
      url: event.payload?.pull_request?.html_url ?? `https://github.com/${event.repo?.name}`,
      date,
      eventType: 'pr',
    };
  }

  if (event.type === 'CreateEvent') {
    const refType = event.payload?.ref_type;
    const refName = event.payload?.ref;
    const description = event.payload?.description;
    const message = description || `Created ${refType}${refName ? ` ${refName}` : ''}`;

    return {
      repo,
      message: normalizeMessage(message),
      url: `https://github.com/${event.repo?.name}`,
      date,
      eventType: 'create',
    };
  }

  return null;
};

const createFallbackGithubActivity = (username: string, fallbackEvents: FallbackEvent[]): NormalizedActivity[] => {
  if (!fallbackEvents.length) {
    return [
      {
        repo: 'Portfolio',
        message: 'Updated portfolio with Astro, Svelte and UI polish',
        url: `https://github.com/${username || 'JPClow3'}/Portfolio`,
        date: 'Recently',
        eventType: 'push',
      },
      {
        repo: 'League-AI-Oracle',
        message: 'Improved data processing for prediction workflows',
        url: `https://github.com/${username || 'JPClow3'}/League-AI-Oracle`,
        date: 'Recently',
        eventType: 'push',
      },
      {
        repo: 'Resonant-Echoes',
        message: 'Refined game systems and balancing pass',
        url: `https://github.com/${username || 'JPClow3'}/Resonant-Echoes`,
        date: 'Recently',
        eventType: 'push',
      },
    ];
  }

  return fallbackEvents.slice(0, 6).map((event) => {
    const [, repo] = event.repo.split('/');
    return {
      repo: repo ?? event.repo,
      message: 'Repository activity synced from profile fallback list',
      url: `https://github.com/${event.repo}`,
      date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(event.date),
      eventType: 'push' as const,
    };
  });
};

async function readGithubActivityCache(username: string) {
  try {
    const rawCache = await readFile(githubActivityCachePath, 'utf-8');
    const parsedCache = JSON.parse(rawCache);

    if (
      !parsedCache ||
      typeof parsedCache !== 'object' ||
      typeof parsedCache.updatedAt !== 'number' ||
      parsedCache.username !== username ||
      !Array.isArray(parsedCache.data)
    ) {
      return null;
    }

    if (Date.now() - parsedCache.updatedAt > githubActivityTtlMs) {
      return null;
    }

    return parsedCache.data as NormalizedActivity[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') {
      console.warn('GitHub activity cache read skipped:', error);
    }
    return null;
  }
}

async function writeGithubActivityCache(username: string, data: NormalizedActivity[]) {
  try {
    await mkdir(new URL('../../.cache', import.meta.url), { recursive: true });
    await writeFile(
      githubActivityCachePath,
      JSON.stringify({ updatedAt: Date.now(), username, data }, null, 2),
      'utf-8',
    );
  } catch (error) {
    console.warn('GitHub activity cache write skipped:', error);
  }
}

export async function getGithubActivity(username: string, fallbackEvents: FallbackEvent[] = []): Promise<NormalizedActivity[]> {
  const fallbackGithubActivity = createFallbackGithubActivity(username, fallbackEvents);

  if (!username) {
    console.warn('GitHub activity fallback: missing GitHub username.');
    return fallbackGithubActivity;
  }

  const cachedActivity = await readGithubActivityCache(username);
  if (cachedActivity?.length) {
    return cachedActivity;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);

    if (!response.ok) {
      console.warn(`GitHub activity request returned ${response.status}. Using fallback activity.`);
      return fallbackGithubActivity;
    }

    const events = (await response.json()) as GithubEvent[];
    const fallbackOrder: GithubEvent['type'][] = ['PushEvent', 'PullRequestEvent', 'CreateEvent'];
    const unique = new Set<string>();
    const normalized: NormalizedActivity[] = [];

    for (const type of fallbackOrder) {
      for (const event of events) {
        if (event.type !== type) continue;

        const activity = normalizeGithubEvent(event);
        if (!activity) continue;

        const key = `${activity.repo}:${activity.date}`;
        if (unique.has(key)) continue;

        unique.add(key);
        normalized.push(activity);
      }
    }

    const latestActivity = normalized.slice(0, 6);
    if (latestActivity.length) {
      await writeGithubActivityCache(username, latestActivity);
    }

    return latestActivity.length ? latestActivity : fallbackGithubActivity;
  } catch (error) {
    console.warn('GitHub activity fetch failed, using fallback. Error:', error);
    return fallbackGithubActivity;
  }
}
