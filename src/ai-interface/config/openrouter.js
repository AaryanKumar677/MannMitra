const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const API_KEY =
  import.meta.env?.VITE_OPENROUTER_API_KEY ||
  "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";

const DEFAULT_MODEL =
  import.meta.env?.VITE_OPENROUTER_MODEL || "openrouter/free";

// List of fallback free models in case of upstream rate-limiting
const FALLBACK_MODELS = [
  DEFAULT_MODEL,
  "openrouter/free",
  "minimax/minimax-m3.1-flash:free",
  "nvidia/nemotron-3.5-lightning:free",
  "liquid/lfm-2.5-2.6b:free",
  "thinkingmachines/inkling:free",
];

// Deduplicate fallback models
const TEXT_MODELS = Array.from(new Set(FALLBACK_MODELS));

const VISION_MODELS = [
  "nvidia/nemotron-3.5-super-vl:free",
  "openrouter/free",
];

const SYSTEM_INSTRUCTION = `You are MannMitra. You are a friendly AI assistant and mental wellness companion created to help users.

CORE IDENTITY:
- When asked "Who are you?" or "What is your name?" - respond "I am MannMitra, your AI friend and assistant!"
- When asked "What can you do?" - explain you can help with wellness questions, emotional support, images, coding, writing, etc.
- When asked "Tell me about yourself" - share that you're here to help and support users
- Always be helpful, friendly, empathetic, and maintain your identity as MannMitra.

IMPORTANT GUIDELINES:
1. Speak in a warm, kind, and supportive tone like a true friend.
2. Keep responses BALANCED - not too long, not too short (4-5 key points).
3. Use *bold headings* for each key point (e.g. ### Point Title).
4. Use simple bullet points (- or •) for clear explanations.
5. Give PRACTICAL, ACTIONABLE advice.
6. End with POSITIVE ENCOURAGEMENT and warmth.
7. Ideal length: 200-500 words for proper explanations.
8. Be culturally sensitive to Indian context, supporting youth, students, and professionals.
9. Headlines and Points MUST be on new lines.

PRIORITY MODES:
1. WELLNESS & MENTAL HEALTH (PRIMARY FOCUS):
   - Be empathetic, kind, and encouraging.
   - Support youth with stress, exam anxiety, motivation, self-confidence.
   - Never diagnose or prescribe medication.
   - Always encourage professional help for serious issues.
   - Provide healthy coping strategies, grounding, breathing, and daily routine tips.
   - End with: "For personalized medical advice, please consult a healthcare professional. You are not alone - you are doing great by seeking help!"

2. CODING & STUDY HELP (SECONDARY):
   - Act like a patient tutor: explain step-by-step.
   - Give examples (code snippets, analogies, diagrams).
   - Encourage a growth mindset: "Don't worry, you're improving step by step!"

3. GENERAL KNOWLEDGE (SECONDARY):
   - Provide fact-based, reliable, and structured information.

MEDICAL SAFETY GUIDELINES (STRICTLY FOLLOW):
1. I AM NOT A DOCTOR - Always remind users you provide educational and supportive information only.
2. NO DIAGNOSIS - Never diagnose conditions or prescribe treatment.
3. ENCOURAGE PROFESSIONAL HELP - Always suggest consulting qualified professionals when appropriate.

Always prioritize user safety, privacy, and emotional well-being!`;

// Convert image file (Blob/File) to Base64 data URL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Format history array into standard OpenAI/OpenRouter messages format
function formatConversationHistory(history = []) {
  const formatted = [];

  for (const msg of history) {
    if (!msg) continue;
    const role =
      msg.role === "assistant" || msg.role === "model" || msg.type === "ai"
        ? "assistant"
        : "user";

    let textContent = "";
    if (Array.isArray(msg.parts)) {
      textContent = msg.parts.map((p) => p.text || "").join("\n");
    } else if (typeof msg.content === "string") {
      textContent = msg.content;
    } else if (typeof msg.text === "string") {
      textContent = msg.text;
    }

    if (textContent && textContent.trim()) {
      formatted.push({
        role,
        content: textContent.trim(),
      });
    }
  }

  return formatted;
}

// Request OpenRouter API with automatic model fallback
async function callOpenRouter(models, messages, temperature = 0.7) {
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            typeof window !== "undefined" && window.location?.origin
              ? window.location.origin
              : "https://mannmitra.app",
          "X-Title": "MannMitra AI Mental Wellness Companion",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 1500,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn(`OpenRouter model ${model} failed (${response.status}):`, data?.error?.message || data);
        lastError = new Error(data?.error?.message || `HTTP ${response.status}`);
        continue; // Try next model in list
      }

      const reply = data?.choices?.[0]?.message?.content;
      if (reply) {
        return reply;
      } else if (data?.error) {
        console.warn(`OpenRouter error with ${model}:`, data.error);
        lastError = new Error(data.error.message || "Model returned error");
        continue;
      }
    } catch (err) {
      console.warn(`Network error trying model ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to get response from AI service.");
}

/**
 * Text Chat
 */
async function runChat(prompt, history = []) {
  try {
    const formattedHistory = formatConversationHistory(history);

    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...formattedHistory,
      { role: "user", content: prompt },
    ];

    return await callOpenRouter(TEXT_MODELS, messages);
  } catch (error) {
    console.error("OpenRouter Chat Error:", error);
    return "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
  }
}

/**
 * Chat with Image attachment
 */
async function runChatWithImage(prompt, imageFile = null) {
  try {
    if (!imageFile) {
      return await runChat(prompt);
    }

    const dataUrl = await fileToDataUrl(imageFile);

    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt || "Please analyze this image and provide helpful feedback.",
          },
          {
            type: "image_url",
            image_url: {
              url: dataUrl,
            },
          },
        ],
      },
    ];

    return await callOpenRouter(VISION_MODELS, messages);
  } catch (error) {
    console.error("OpenRouter Image Chat Error:", error);
    return "I'm having trouble analyzing the image right now. Please try again or describe what you see.";
  }
}

/**
 * Chat with optional image and history
 */
async function runChatWithOptionalImage(prompt, imageFile = null, history = []) {
  if (imageFile) {
    return await runChatWithImage(prompt, imageFile);
  } else {
    return await runChat(prompt, history);
  }
}

export default runChat;
export { runChatWithOptionalImage, runChatWithImage };
