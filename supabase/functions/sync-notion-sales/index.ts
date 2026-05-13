import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const DATA_SOURCE_ID = '6c573709-8eb4-440e-9921-b9c408a560c1';
const NOTION_VERSION = '2025-09-03';

interface SaleRow {
  date: string;
  cash: number;
  card: number;
  ifood: number;
}

function getNumber(prop: any): number {
  if (!prop) return 0;
  if (typeof prop.number === 'number') return prop.number;
  return 0;
}

function getDate(prop: any): string | null {
  if (!prop) return null;
  if (prop.type === 'date' && prop.date?.start) return prop.date.start.slice(0, 10);
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('NOTION_INTERNAL_INTEGRATION_TOKEN');
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'NOTION_INTERNAL_INTEGRATION_TOKEN não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const url = `https://api.notion.com/v1/data_sources/${DATA_SOURCE_ID}/query`;
    const sales: SaleRow[] = [];
    let startCursor: string | undefined;
    let hasMore = true;
    let pages = 0;

    while (hasMore) {
      const body: Record<string, unknown> = { page_size: 100 };
      if (startCursor) body.start_cursor = startCursor;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        return new Response(
          JSON.stringify({
            error: `Notion API ${res.status}: ${data?.message || 'erro desconhecido'}`,
            code: data?.code,
          }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      for (const row of data.results || []) {
        const props = row.properties || {};
        const date = getDate(props['Data Venda']);
        if (!date) continue;
        sales.push({
          date,
          cash: getNumber(props['Dinheiro']),
          card: getNumber(props['Cartões']),
          ifood: getNumber(props['iFood']),
        });
      }

      hasMore = !!data.has_more;
      startCursor = data.next_cursor || undefined;
      pages++;
      if (pages > 50) break; // safety cap
    }

    sales.sort((a, b) => a.date.localeCompare(b.date));

    return new Response(
      JSON.stringify({ sales, count: sales.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
