import { initBlock, initDatabase } from '@/modules/notion';

export async function GET(request: Request) {
  const url = new URL(request.url)
  const pageId = new URLSearchParams(url.search).get('id')

  console.log('pageId:', pageId)
  if (pageId) {
    const response = await initBlock(pageId);
    return new Response(JSON.stringify(response), {
      headers: { 'content-type': 'application/json' },
    });
  } else {
    const response = await initDatabase();
    return new Response(JSON.stringify(response), {
      headers: { 'content-type': 'application/json' },
    });
  }
}
