import { projectIds, serviceIds, engagementIds } from './inquiry';
export const eventNames = ['page_view', 'case_study_view', 'inquiry_click', 'form_start', 'form_success'] as const;
export const pageNames = ['home', 'services', 'about', 'contact', 'catalog', 'case-study', 'blog', 'other'] as const;
export const placements = ['header', 'top', 'work', 'services', 'engagement', 'contact', 'form', 'other'] as const;
export interface ConversionEvent {
  event: typeof eventNames[number];
  page: typeof pageNames[number];
  locale: 'en' | 'pt';
  project: string;
  service: string;
  engagement: string;
  placement: typeof placements[number];
}
export function parseConversion(value: unknown): ConversionEvent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const allowed: Record<keyof ConversionEvent, readonly unknown[]> = {
    event: eventNames, page: pageNames, locale: ['en', 'pt'],
    project: ['', ...projectIds], service: ['', ...serviceIds],
    engagement: ['', ...engagementIds], placement: placements,
  };
  // Reject extra fields so the ingest endpoint cannot retain free-form visitor data.
  if (Object.keys(v).length !== Object.keys(allowed).length) return null;
  for (const [key, values] of Object.entries(allowed)) if (!values.includes(v[key])) return null;
  return v as unknown as ConversionEvent;
}
export function pageName(pathname: string): ConversionEvent['page'] {
  const path = pathname.replace(/^\/pt(?=\/|$)/, '').replace(/\/$/, '') || '/';
  if (path === '/') return 'home';
  if (path === '/projects') return 'catalog';
  if (path.startsWith('/projects/')) return 'case-study';
  if (path.startsWith('/blog')) return 'blog';
  return ['services', 'about', 'contact'].includes(path.slice(1)) ? path.slice(1) as ConversionEvent['page'] : 'other';
}

