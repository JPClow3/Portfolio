// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { readInquiryContext, inquirySearch, projectIds, serviceIds, engagementIds } from '../../src/lib/inquiry';
import { getStudioCopy } from '../../src/lib/studio';
import { onRequest } from '../../functions/api/events';

const event = { event: 'form_success', page: 'contact', locale: 'pt', project: 'agrohub', service: 'apis', engagement: 'consulting', placement: 'form' };
const request = (body: unknown = event, headers: Record<string,string> = {}) => new Request('https://jpclow.dev/api/events', {
  method: 'POST', headers: { Origin: 'https://jpclow.dev', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
});
describe('inquiry context', () => {
  it('accepts known IDs and discards arbitrary input', () => {
    expect(readInquiryContext('?project=agrohub&service=apis&engagement=consulting&email=private')).toEqual({project:'agrohub',service:'apis',engagement:'consulting'});
    expect(readInquiryContext('?project=<script>&service=private@email.test&engagement=unknown')).toEqual({project:'',service:'',engagement:''});
    expect(inquirySearch(readInquiryContext('?engagement=consulting&email=private'))).toBe('?engagement=consulting');
  });
  it('keeps the allowlists synchronized with both content locales', () => {
    for (const locale of ['en', 'pt'] as const) {
      const dir = new URL('../../src/content/projects/' + (locale === 'pt' ? 'pt/' : ''), import.meta.url);
      const slugs = readdirSync(dir).filter(p=>p.endsWith('.md')).map(p=>readFileSync(new URL(p, dir),'utf8').match(/^slug: "(.+)"/m)![1]);
      expect([...projectIds].sort()).toEqual(slugs.sort());
      expect(serviceIds).toEqual(getStudioCopy(locale).services.map(s=>s.id));
      expect(engagementIds).toEqual(getStudioCopy(locale).engagement.map(s=>s.id));
    }
  });
});
describe('conversion ingest', () => {
  it('writes only allowlisted dimensions and no request identity', async () => {
    const writeDataPoint = vi.fn();
    const result = await onRequest({request:request(event,{'User-Agent':'sensitive-agent','CF-Connecting-IP':'192.0.2.1'}),env:{CONVERSIONS:{writeDataPoint}}});
    expect(result.status).toBe(204);
    expect(writeDataPoint).toHaveBeenCalledExactlyOnceWith({indexes:['form_success'],blobs:['form_success','contact','pt','agrohub','apis','consulting','form'],doubles:[1]});
    expect(result.headers.get('Cache-Control')).toBe('no-store');
  });
  it.each([{...event,email:'private@example.com'}, {...event,project:'private-person'}, {...event,event:'unknown'}, null])('rejects malformed or personal fields: %j', async body => {
    const writeDataPoint=vi.fn();
    expect((await onRequest({request:request(body),env:{CONVERSIONS:{writeDataPoint}}})).status).toBe(400);
    expect(writeDataPoint).not.toHaveBeenCalled();
  });
  it('rejects cross-origin requests and unsupported methods', async () => {
    expect((await onRequest({request:request(event,{Origin:'https://evil.example'}),env:{}})).status).toBe(403);
    expect((await onRequest({request:new Request('https://jpclow.dev/api/events'),env:{}})).status).toBe(405);
  });
  it.each(['DNT','Sec-GPC'])('respects %s without storage', async header => {
    const writeDataPoint=vi.fn();
    expect((await onRequest({request:request(event,{[header]:'1'}),env:{CONVERSIONS:{writeDataPoint}}})).status).toBe(204);
    expect(writeDataPoint).not.toHaveBeenCalled();
  });
  it('bounds bodies even without Content-Length and fails visibly when no dataset is bound', async () => {
    expect((await onRequest({request:request({text:'x'.repeat(2000)}),env:{}})).status).toBe(413);
    expect((await onRequest({request:request(),env:{}})).status).toBe(503);
  });
});
