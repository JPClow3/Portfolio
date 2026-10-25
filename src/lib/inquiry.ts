// Stable IDs are shared by contact links, locale switching and aggregate analytics.
export const projectIds = ['moto-track', 'agrohub', 'inova-rio-verde', 'lorebound', 'climagro', 'throughline', 'signal-ledger', 'dbs-telecom', 'ai-dev-controller', 'hefesto', 'pax-nulla', 'project-rift-idle', 'farm-fin', 'fatec', 'league-ai-oracle', 'portfolio', 'resonant-echoes', 'veins-of-eridun'] as const;
export const serviceIds = ['platforms', 'apis', 'automation', 'data', 'ai', 'cloud'] as const;
export const engagementIds = ['project', 'partnership', 'consulting'] as const;
export type InquiryContext = { project: string; service: string; engagement: string };
export function readInquiryContext(search: string): InquiryContext {
  const params = new URLSearchParams(search);
  const pick = (key: string, allowed: readonly string[]) => {
    const value = params.get(key) ?? '';
    return allowed.includes(value) ? value : '';
  };
  return { project: pick('project', projectIds), service: pick('service', serviceIds), engagement: pick('engagement', engagementIds) };
}
export function inquirySearch(context: InquiryContext): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(context)) if (value) params.set(key, value);
  return params.size ? '?' + params.toString() : '';
}

