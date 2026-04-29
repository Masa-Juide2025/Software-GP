import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: "Key مفقود" });

    const { message, history } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // موديل قوي جداً ومجاني
        messages: [
          { role: "system", content: "أنت خبير تغذية في NutriSync. احسب السعرات بالعربية باختصار." },
          ...history.map((h: any) => ({
            role: h.role === "bot" ? "assistant" : "user",
            content: h.content,
          })),
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({ success: true, content });

  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل الاتصال بـ Groq" });
  }
}