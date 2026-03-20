// Phase 2a: AI Stylist Worker — Anthropic Claude integration
// Receives wardrobe context + conversation history, returns outfit suggestions

interface Env {
  ANTHROPIC_API_KEY: string;
  ANTHROPIC_MODEL: string;
  ALLOWED_ORIGINS: string;
}

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  season: string;
  formality: string;
  fabricWeight: string;
  tags: string[];
}

interface ConversationMessage {
  sender: "user" | "ai";
  content: string;
}

interface ChatRequest {
  wardrobeItems: WardrobeItem[];
  conversationHistory: ConversationMessage[];
  userMessage: string;
}

interface OutfitSuggestion {
  name: string;
  itemIds: string[];
  explanation: string;
  occasion: string;
}

interface ChatResponse {
  message: string;
  outfit?: OutfitSuggestion;
}

interface AnthropicContentBlock {
  type: "text" | "tool_use";
  text?: string;
  name?: string;
  input?: Record<string, unknown>;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

const OUTFIT_TOOL = {
  name: "suggest_outfit",
  description:
    "Suggest an outfit combination from the user's wardrobe. Call this whenever you recommend an outfit.",
  input_schema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description:
          "A creative, descriptive name for the outfit (e.g. 'Effortless Brunch Look')",
      },
      itemIds: {
        type: "array",
        items: { type: "string" },
        description:
          "Array of wardrobe item IDs that make up this outfit (use exact IDs from the wardrobe list)",
      },
      explanation: {
        type: "string",
        description:
          "Why these pieces work together — mention colors, occasion fit, styling details",
      },
      occasion: {
        type: "string",
        description:
          "The occasion this outfit is best for (e.g. Casual, Date Night, Work, Travel)",
      },
    },
    required: ["name", "itemIds", "explanation", "occasion"],
  },
};

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "*";
  const allowed = env.ALLOWED_ORIGINS || "*";
  const allowOrigin =
    allowed === "*" || allowed.split(",").includes(origin) ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function buildSystemPrompt(items: WardrobeItem[]): string {
  const inventory = items
    .map(
      (item) =>
        `- [${item.id}] ${item.name} (${item.category}) — ${item.color}, ${item.season}, ${item.formality}, ${item.fabricWeight}${item.tags.length ? `, tags: ${item.tags.join(", ")}` : ""}`
    )
    .join("\n");

  return `You are Kaitlyn's Kloset AI Stylist — a warm, knowledgeable personal fashion assistant. You help users create outfits from their own wardrobe.

## Your Personality
- Friendly, encouraging, and fashion-forward
- Speak naturally like a stylish friend giving advice
- Be specific about WHY pieces work together (color harmony, occasion fit, fabric pairing)
- Use the user's actual wardrobe items — never suggest items they don't own

## User's Wardrobe
${inventory}

## Rules
1. ONLY suggest items that exist in the user's wardrobe above (use the exact IDs in brackets)
2. An outfit should have 2-5 items that work together
3. Consider the occasion, season, and formality when building outfits
4. When suggesting an outfit, always use the suggest_outfit tool
5. Keep your text responses conversational and concise (2-3 sentences max before/after an outfit)
6. If the user asks about something unrelated to fashion or their wardrobe, gently steer back`;
}

async function handleChat(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  const headers = { ...cors, "Content-Type": "application/json" };

  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers }
    );
  }

  const { wardrobeItems, conversationHistory, userMessage } = body;

  if (!wardrobeItems?.length || !userMessage?.trim()) {
    return new Response(
      JSON.stringify({
        error: "Missing required fields: wardrobeItems (non-empty array), userMessage (non-empty string)",
      }),
      { status: 400, headers }
    );
  }

  const systemPrompt = buildSystemPrompt(wardrobeItems);

  const messages = [
    ...(conversationHistory ?? []).map((msg) => ({
      role: (msg.sender === "user" ? "user" : "assistant") as
        | "user"
        | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const model = env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      tools: [OUTFIT_TOOL],
    }),
  });

  if (!anthropicRes.ok) {
    const errBody = await anthropicRes.text();
    console.error(
      `Anthropic API error ${anthropicRes.status}: ${errBody.slice(0, 500)}`
    );
    return new Response(
      JSON.stringify({ error: "AI service unavailable" }),
      { status: 502, headers }
    );
  }

  const data = (await anthropicRes.json()) as AnthropicResponse;

  let message = "";
  let outfit: OutfitSuggestion | undefined;

  for (const block of data.content) {
    if (block.type === "text" && block.text) {
      message += block.text;
    } else if (block.type === "tool_use" && block.name === "suggest_outfit" && block.input) {
      outfit = {
        name: block.input.name as string,
        itemIds: block.input.itemIds as string[],
        explanation: block.input.explanation as string,
        occasion: block.input.occasion as string,
      };
    }
  }

  const response: ChatResponse = { message };
  if (outfit) {
    response.outfit = outfit;
  }

  return new Response(JSON.stringify(response), { status: 200, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/stylist/chat" && request.method === "POST") {
        return await handleChat(request, env, cors);
      }

      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Unhandled error:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }
  },
};
