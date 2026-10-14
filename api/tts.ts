export const config = {
  runtime: 'edge',
};

function splitTextForTts(text: string, maxLen = 90): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const w of words) {
    if (!w) continue;
    if ((current + " " + w).trim().length <= maxLen) {
      current = (current + " " + w).trim();
    } else {
      if (current) chunks.push(current);
      current = w;
    }
  }
  if (current) chunks.push(current);
  return chunks.slice(0, 15);
}

export default async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = (searchParams.get("text") || "").trim();
    const lang = (searchParams.get("lang") || "uk").toLowerCase().slice(0, 5);

    if (!text) {
      return new Response("Text is required", { status: 400 });
    }

    const chunks = splitTextForTts(text, 90);
    if (chunks.length === 0) {
      return new Response("Empty text", { status: 400 });
    }

    const audioBuffers = await Promise.all(
      chunks.map(async (chunk) => {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          chunk
        )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
        const resp = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        if (!resp.ok) {
          throw new Error(`TTS chunk failed with status ${resp.status}`);
        }
        return resp.arrayBuffer();
      })
    );

    const totalLength = audioBuffers.reduce((acc, b) => acc + b.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const b of audioBuffers) {
      combined.set(new Uint8Array(b), offset);
      offset += b.byteLength;
    }

    return new Response(combined, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err: any) {
    console.error("[TTS Error]:", err?.message || err);
    return new Response("TTS generation failed", { status: 500 });
  }
}
