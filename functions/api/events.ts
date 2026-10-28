import { parseConversion } from '../../src/lib/conversion-schema';

export interface EventsEnv {
  CONVERSIONS?: { writeDataPoint(point: { indexes: string[]; blobs: string[]; doubles: number[] }): void };
}
export async function onRequest({ request, env }: { request: Request; env: EventsEnv }): Promise<Response> {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const respond = (status: number) => new Response(null, { status, headers });
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...headers, Allow: 'POST' } });
  const origin = new URL(request.url).origin;
  if (request.headers.get('Origin') !== origin) return respond(403);
  if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return respond(204);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return respond(415);
  // Bound streaming reads as well as Content-Length; never buffer an unlimited request.
  if (Number(request.headers.get('Content-Length')) > 1024) return respond(413);
  const reader = request.body?.getReader();
  if (!reader) return respond(400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024) { await reader.cancel(); return respond(413); }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    const event = parseConversion(JSON.parse(new TextDecoder().decode(body)));
    if (!event) return respond(400);
    if (!env.CONVERSIONS) return respond(503);
    // No URL, query, referrer, visitor ID, IP, user agent or form content is stored.
    try {
      env.CONVERSIONS.writeDataPoint({
        indexes: [event.event],
        blobs: [event.event, event.page, event.locale, event.project, event.service, event.engagement, event.placement],
        doubles: [1],
      });
    } catch { return respond(503); }
    return respond(204);
  } catch { return respond(400); }
}

