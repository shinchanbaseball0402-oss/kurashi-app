export const config = { runtime: 'edge' };

const PROMPT = `日本の家庭の平日の夕食で使える「主菜」を7品、「副菜または汁物」を7品、提案してください。
できるだけ全て違う食材・調理法にして、バラエティ豊かにしてください。
それぞれ料理名と、必要な具体的な食材を2〜4個タグとして挙げてください(醤油・塩・砂糖・油・味噌・だし等の基本調味料は含めない)。
以下のJSON形式のみで回答してください。説明文やコメントは不要です。
{"mains":[{"name":"料理名","tags":["食材1","食材2"]}],"sides":[{"name":"料理名","tags":["食材1"]}]}
mainsとsidesはそれぞれちょうど7件にしてください。`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'server_not_configured' }), { status: 500 });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: PROMPT }],
      }),
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: 'upstream_error' }), { status: 502 });
    }

    const data = await upstream.json();
    const text = data?.content?.[0]?.text ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 502 });
    }

    const parsed = JSON.parse(match[0]);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'upstream_error' }), { status: 502 });
  }
}
