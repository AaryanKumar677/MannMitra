import { createContext, useState } from "react";
import runChat, { runChatWithOptionalImage } from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    
    const [conversations, setConversations] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState(null);
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")
    const [sentImage, setSentImage] = useState(null);

    const [currentChatId, setCurrentChatId] = useState(null);

    // Crisis detection function
    const checkForCrisis = (prompt) => {
        const crisisKeywords = [
            'suicide', 'kill myself', 'end my life', 'want to die', 
            'want to end it', 'no will to live', 'want to disappear',
            'better off dead', 'suicidal', 'end everything'
        ];
        
        const urgentKeywords = [
            'help me', 'emergency', 'can\'t take it', 'save me',
            'helpless', 'hopeless', 'nothing matters', 'crying help'
        ];
        
        const promptLower = prompt.toLowerCase();
        
        if (crisisKeywords.some(word => promptLower.includes(word))) {
            return "CRISIS_ALERT";
        }
        if (urgentKeywords.some(word => promptLower.includes(word))) {
            return "URGENT_SUPPORT";
        }
        return null;
    };

    function delayPara(index, nextWord) {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index);
    }

    const onSent = async (prompt, imageFile = null) => {
        let finalPrompt = prompt !== undefined ? prompt : input;

        const chatId = currentChatId || Date.now().toString();
        if (!currentChatId) {
            setCurrentChatId(chatId);
            setConversations(prev => [
            ...prev,
            { 
                id: chatId, 
                title: finalPrompt.slice(0, 20), 
                messages: [
                { 
                    type: "ai", 
                    text: "👋 Hello! I’m MannMitra, your AI friend and assistant. How can I help you today?", 
                    timestamp: new Date().toLocaleTimeString(), 
                    chatId 
                }
                ] 
            }
            ]);
        }
    
        
        if (finalPrompt.includes("exam stress") || finalPrompt.includes("exam anxiety")) {
            finalPrompt = "Provide specific techniques for managing exam stress and test anxiety. Include study strategies, relaxation techniques during exams, and mindset tips. Focus on practical actionable advice.";
        } 
        else if (finalPrompt.includes("calm my anxiety") || finalPrompt.includes("reduce anxiety")) {
            finalPrompt = "Provide immediate anxiety relief techniques and calming exercises. Include breathing techniques, grounding exercises, and quick coping strategies for anxiety attacks.";
        } 
        else if (finalPrompt.includes("mental wellness routine")) {
            finalPrompt = "Suggest a comprehensive daily mental wellness routine including morning, afternoon and evening practices for mental health. Include specific activities and their benefits.";
        } 
        else if (finalPrompt.includes("self-care activities")) {
            finalPrompt = "Recommend specific self-care activities that can be done today. Include both quick 5-minute activities and longer self-care practices with step-by-step guidance.";
        }

        const crisisStatus = checkForCrisis(finalPrompt);
        const userMessage = {

            type: "user",
            text: finalPrompt,
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            timestamp: new Date().toLocaleTimeString(),
            chatId: chatId,
        };

        if (crisisStatus === "CRISIS_ALERT") {
            const crisisResponse = `
                <div class="crisis-alert">
                    <h3>🚨 Immediate Support Needed</h3>
                    <p>I'm really concerned about what you're saying. Please know that your life is precious and help is available right now:</p>
                    <div class="emergency-contacts">
                        <p><b>• Vandrevala Foundation:</b> 1860-2662-345 (24/7)</p>
                        <p><b>• iCall:</b> 9152987821 (10AM-8PM)</p>
                        <p><b>• Kiran Helpline:</b> 1800-599-0019 (24/7)</p>
                        <p><b>• Emergency:</b> 112 or 1098 (Childline)</p>
                    </div>
                    <p>Please reach out to these resources immediately. You don't have to go through this alone.</p>
                </div>
            `;

            setConversations((prev) =>
                prev.map((chat) =>
                chat.id === chatId
                    ? { ...chat, messages: [...chat.messages, userMessage, { type: "ai", text: crisisResponse, timestamp: new Date().toLocaleTimeString(), chatId }] }
                    : chat
                )
            );
            
            
            setResultData(crisisResponse);
            setLoading(false);
            setShowResult(true);
            return;
        }
        
        if (crisisStatus === "URGENT_SUPPORT") {
            const urgentResponse = `
                <div class="urgent-support">
                    <h3>💙 I'm Here for You</h3>
                    <p>It sounds like you're going through a really tough time. Please consider reaching out to these resources:</p>
                    <div class="support-contacts">
                        <p><b>• Vandrevala Foundation:</b> 1860-2662-345</p>
                        <p><b>• YourDOST:</b> Available on app</p>
                        <p><b>• TalktoAngel:</b> Online counseling</p>
                    </div>
                    <p>Remember, it's okay to ask for help. I'm here to listen too.</p>
                </div>
            `;

            setConversations((prev) =>
                prev.map((chat) =>
                chat.id === chatId
                    ? { ...chat, messages: [...chat.messages, userMessage, { type: "ai", text: urgentResponse, timestamp: new Date().toLocaleTimeString(), chatId }] }
                    : chat
                )
            );
            
            
            setResultData(urgentResponse);
            setLoading(false);
            setShowResult(true);
            return;
        }


        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        setRecentPrompt({
            text: prompt !== undefined ? prompt : input,
            image: imageFile ? URL.createObjectURL(imageFile) : null
        });
        
        setConversations((prev) =>
            prev.map((chat) =>
                chat.id === chatId
                ? { ...chat, messages: [...chat.messages, userMessage] }
                : chat
            )
        );
        
        let response;
        try {
            let updatedMessages = [
                ...(conversations.find((c) => c.id === chatId)?.messages || []),
                userMessage,
            ];

            setConversations((prev) =>
                prev.map((chat) =>
                    chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
                )
            );
            
            
            const conversationHistory =
                conversations.find((c) => c.id === chatId)?.messages.map((msg) => ({
                    role: msg.type === "user" ? "user" : "model",
                    parts: [{ text: msg.text }],
                })) || [];

            response = await runChatWithOptionalImage(
                finalPrompt,
                imageFile,
                conversationHistory
            );
            
            const aiResponse = {
                type: 'ai',
                text: response,
                timestamp: new Date().toLocaleTimeString(),
                chatId: chatId
            };

            setConversations((prev) =>
                prev.map((chat) =>
                chat.id === chatId
                    ? { ...chat, messages: [...chat.messages, aiResponse] }
                    : chat
                )
            );

            let responseArray = response.split('**');
            let newArray = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newArray += responseArray[i]
                }
                else {
                    newArray += "<b>" + responseArray[i] + "</b>"
                }
            }
            responseArray = newArray.split('*').join("</br>").split(" ");
            for (let i = 0; i < responseArray.length; i++) {
                const nextWord = responseArray[i];
                delayPara(i, nextWord + " ")
            }
        } catch (error) {
            console.error("Error:", error);
            const errorResponse = "Sorry, there was an error processing your request. Please try again.";
            
            const aiResponse = {
                type: 'ai',
                text: errorResponse,
                timestamp: new Date().toLocaleTimeString(),
                chatId: chatId
            };

            setConversations((prev) =>
                prev.map((chat) =>
                chat.id === chatId
                    ? { ...chat, messages: [...chat.messages, aiResponse] }
                    : chat
                )
            );
            
            setResultData(errorResponse);
        }
        
        setLoading(false);
        setInput("")
        setSentImage(null);
    };

    const newChat = () => {
        const chatId = Date.now().toString();
        const newConversation = {
            id: chatId,
            title: "New Chat",
            messages: []
        };

        setConversations(prev => [...prev, newConversation]);
        setCurrentChatId(chatId);
        setLoading(false);
        setShowResult(false);
        setSentImage(null);
        };

    const contextValue = {
        conversations,
        setConversations,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        setLoading,
        resultData,
        input,
        setInput,
        newChat,
        sentImage,
        setSentImage,
        currentChatId,
        setCurrentChatId
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;