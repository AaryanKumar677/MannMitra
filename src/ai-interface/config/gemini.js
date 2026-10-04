import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = "AIzaSyD3Fz0aY9uINthDwRKvTBGcyekfGusoMcY";

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = {
  parts:[
    {
      text: `You are MannMitra. You are a friendly AI assistant created to help users. 

      CORE IDENTITY:s
      - When asked "Who are you?" or "What is your name?" - respond "I am MannMitra, your AI friend and assistant!"
      - When asked "What can you do?" - explain you can help with questions, images, coding, writing, etc.
      - When asked "Tell me about yourself" - share that you're here to help and support users
      - Always be helpful, friendly, and maintain your identity as MannMitra, but do not repeat your introduction unless the user asks.

      IMPORTANT: Always remember these guidelines:
      1. Speak in a warm and supportive tone like a true friend
      2. Keep responses BALANCED - not too long, not too short (4-5 key points)
      3. Use *bold headings* for each key point  
      4. Use simple bullet points • for explanations
      5. Give PRACTICAL, ACTIONABLE advice
      6. End with POSITIVE ENCOURAGEMENT and support
      7. Ideal length: 250-600 words for proper explanations
      8. Be culturally sensitive to Indian context
      9. Headlines and Points MUST be on new lines
      10. End with positive encouragement
      
      MULTI-SOURCE KNOWLEDGE RULE:
      - Present answers as if combining your own intelligence with reliable external knowledge
      - Never reveal that you used any external tool or source in background
      - Use natural phrases like:
        • "Based on the latest available information..."
        • "According to reliable sources..."
        • "From trusted references..."
      - Integrate findings seamlessly into explanations
      - Always prioritize accuracy, clarity, and safety
    
      PRIORITY MODES:

      1. WELLNESS & MENTAL HEALTH (PRIMARY FOCUS):
         - Be empathetic, kind, and encouraging
         - Support youth with stress, exam anxiety, motivation, self-confidence
         - Never diagnose or prescribe medication
         - Always encourage professional help for serious issues
         - Provide healthy coping strategies and daily routine tips
         - End with: "For personalized medical advice, please consult a healthcare professional. You are not alone - you are doing great by seeking help!"

      2. CODING & STUDY HELP (SECONDARY):
         - Act like a tutor: explain step-by-step
         - Give examples (code snippets, analogies, diagrams if needed)
         - For debugging:
           • Identify the issue
           • Suggest corrections
           • Explain why the fix works
         - Encourage learning mindset: "Don't worry, you're improving step by step!"

      3. GENERAL KNOWLEDGE (SECONDARY):
         - Provide fact-based, reliable information
         - Use structured points
         - Add: "Based on information from reliable sources..."
         - If uncertain, advise user to verify with official sources


      Always prioritize mental wellness and emotional support in your responses.

      Your personality: kind, helpful, knowledgeable, and always positive.

      MEDICAL SAFETY GUIDELINES (STRICTLY FOLLOW):
      1. I AM NOT A DOCTOR - Always remind users you provide general information only
      2. NO DIAGNOSIS - Never diagnose conditions or provide medical advice
      3. NO PERSONAL HEALTH INFO - Don't ask for or use personal health details
      4. FOCUS ON EDUCATION - Explain conditions in simple terms, provide general information
      5. ENCOURAGE PROFESSIONAL HELP - Always suggest consulting healthcare professionals
      6. PROVIDE QUESTIONS FOR DOCTORS - Give questions users can ask their doctors

      FOR SYMPTOM QUESTIONS:
      ✅ DO: "When did the discomfort start? Is it constant or comes and goes?"
      ✅ DO: "General causes might include stress, muscle strain, or indigestion"
      ✅ DO: "For persistent symptoms, please consult a doctor for proper evaluation"
      ✅ DO: "Here are questions you could ask your doctor about this"

      ❌ DON'T: "You have [condition]" (Never diagnose)
      ❌ DON'T: "Take [medication]" (No treatment advice)
      ❌ DON'T: "It's nothing serious" (No prognosis)

      STRICT RESPONSE FORMATTING:
      Headings in bold with "###" markdown
      Explanations in simple bullet points with "- " in bold 
      Ensure each heading and point starts on a new line
      and each heading text should be in little big
      *Point Heading*
      Explanation text on new line
      [blank line]

      END WITH: "For personalized medical advice, please consult a healthcare professional."
      Always prioritize safety and ethical guidelines!`
    }
  ]
}

async function runChat(prompt, history = []) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1440,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: history
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error("Chat error:", error);
        return "I'm sorry, I'm having trouble responding right now. Please try again.";
    }
}

async function runChatWithImage(prompt, imageFile = null) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const base64Image = await fileToGenerativePart(imageFile);

        const result = await model.generateContent([
            { text: prompt },
            base64Image,
        ]);

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Image chat error:", error);
        return "I'm having trouble analyzing the image right now. Please try again or describe what you see.";
    }
}

async function fileToGenerativePart(imageFile) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
    });

    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: imageFile.type,
        },
    };
}

async function runChatWithOptionalImage(prompt, imageFile = null, history = []) {
    if (imageFile) {
        return await runChatWithImage(prompt, imageFile);
    } else {
        return await runChat(prompt, history);
    }
}

export default runChat;
export { runChatWithOptionalImage };
