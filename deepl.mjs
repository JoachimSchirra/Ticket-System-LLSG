const languages = {de:"DE",en:"EN-GB",it:"IT",es:"ES"};

export async function handleDeepL(request, response, origin, fetchTranslation = fetch) {
  function send(status, data) {
    response.writeHead(status, {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});
    response.end(JSON.stringify(data));
  }
  if (request.method !== "POST" || request.headers.origin !== origin ||
      request.headers.host !== new URL(origin).host ||
      request.headers["content-type"]?.split(";")[0] !== "application/json") {
    return send(403,{error:"forbidden"});
  }
  const key = process.env.LLSG_DEEPL_API_KEY?.trim();
  if (!key) return send(503,{error:"not-configured"});

  let body;
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > 32000) return send(413,{error:"too-large"});
      chunks.push(chunk);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return send(400,{error:"invalid"}); }

  if (!body || !Object.hasOwn(languages,body.source) || !Object.hasOwn(languages,body.target) ||
      body.source === body.target || typeof body.text !== "string" || !body.text.trim() ||
      body.text.length > 5000 || typeof body.context !== "string" || body.context.length > 5000) {
    return send(400,{error:"invalid"});
  }
  const base = key.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
  const signal = AbortSignal.timeout(20000);
  try {
    const upstream = await fetchTranslation(base + "/v2/translate", {
      method:"POST", redirect:"error", signal,
      headers:{"Authorization":"DeepL-Auth-Key " + key, "Content-Type":"application/json"},
      body:JSON.stringify({text:[body.text],source_lang:body.source.toUpperCase(),target_lang:languages[body.target],
        context:body.context,model_type:"prefer_quality_optimized"})
    });
    if (!upstream.ok) return send(502,{error:"provider-error"});
    const value = (await upstream.json()).translations?.[0]?.text;
    if (typeof value !== "string" || !value.trim()) return send(502,{error:"provider-error"});
    return send(200,{text:value});
  } catch { return send(502,{error:"provider-error"}); }
}
