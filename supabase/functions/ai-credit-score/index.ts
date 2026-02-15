import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { activityData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a credit scoring AI for IndiaChain. Analyze this user's activity data and provide a credit score.

Activity Data:
- Total Shipments: ${activityData.totalShipments}
- Delivered Shipments: ${activityData.deliveredShipments}
- KYC Verified: ${activityData.kycVerified}
- Verification Count: ${activityData.verificationCount}
- Wallet Balance: ₹${activityData.walletBalance}

Based on this data, provide a credit score and analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an AI credit scoring engine. You MUST respond using the suggest_score tool.",
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_score",
              description: "Return a credit score with factors and analysis.",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "integer", description: "Credit score from 0 to 1000" },
                  factors: {
                    type: "object",
                    properties: {
                      delivery_reliability: { type: "integer", description: "Score 0-100" },
                      kyc_trust: { type: "integer", description: "Score 0-100" },
                      activity_volume: { type: "integer", description: "Score 0-100" },
                      financial_health: { type: "integer", description: "Score 0-100" },
                    },
                    required: ["delivery_reliability", "kyc_trust", "activity_volume", "financial_health"],
                    additionalProperties: false,
                  },
                  analysis: { type: "string", description: "2-3 sentence analysis of the credit profile" },
                },
                required: ["score", "factors", "analysis"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_score" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("credit score error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
