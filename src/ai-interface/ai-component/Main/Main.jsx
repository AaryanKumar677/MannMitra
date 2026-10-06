import React, { useContext, useState, useEffect, useRef } from 'react'
import '../Main/Main.css'
import { assets } from '../../../assets/assets'
import MannMitraicon from "../../../assets/MannMitraicon.png"
import { Context } from '../../context/Context'
import MarkdownIt from "markdown-it";

const Main = ({ user, onOpenSettings }) => {
  const { conversations, currentChatId, onSent, setInput, input, loading, showResult } = useContext(Context);
  const currentChat = conversations.find(chat => chat.id === currentChatId);
  const currentMessages = currentChat ? currentChat.messages : [];
  const md = new MarkdownIt({
    html: true,
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const resultRef = useRef(null);

  const checkScroll = () => {
    if (!resultRef.current || !resultRef.current.scrollHeight) return;
  
    const { scrollTop, scrollHeight, clientHeight } = resultRef.current;
    setShowScrollButton(scrollTop < scrollHeight - clientHeight - 100);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollTo({
          top: resultRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 0);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
  
    if (resultRef.current && isMounted) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
      checkScroll();
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentMessages]);

  // Enter key handler function
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (input.trim() !== '' || selectedImage)) {
      handleSend();
    }
  };

  const handleCardClick = async (promptText) => {
    setInput("");
    
    onSent(promptText, null);
  };

  // Image select handler
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Send button handler with image support
  const handleSend = () => {
    if (input.trim() !== '' || selectedImage) {
      onSent(input, selectedImage);
      setInput("");
      setSelectedImage(null);
      
      // File input reset
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <div className='main'>
      <div className="nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={MannMitraicon}
            alt="MannMitra Brain"
            style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: 0, flexShrink: 0 }}
          />
          <img
            src={assets.MannMitraname}
            alt="MannMitra"
            className="MannMitraname"
            style={{ marginLeft: "-8px" }}
          />
        </div>
        <img
          src={assets.user_icon}
          alt="Profile & Settings"
          style={{ cursor: "pointer" }}
          title="Profile & Settings"
          onClick={() => onOpenSettings?.("account")}
        />
      </div>
      <div className="main-container">
        {currentMessages.length > 0 ? (
          <div className="result"
              ref={resultRef}
              onScroll={checkScroll}>
              {currentMessages.map((msg, index) => {
                const cleanText = msg.text
                  ? msg.text
                      .replace(/\*\*• (.*?)\*\*/g, "### • $1")
                      .replace(/• /g, "- ")
                  : "";

                return (
                  <div key={index} className={msg.type === 'user' ? 'user-message-box' : 'ai-message-box'}>
                    <img src={msg.type === 'user' ? assets.user_icon : assets.gemini_icon} alt="" />
                      <div className="message">
                      {msg.type === 'ai' && loading && index === currentMessages.length - 1 ? (
                        <div className="loader">
                          <hr className="animated-bg" />
                          <hr className="animated-bg" />
                          <hr className="animated-bg" />
                        </div>
                      ) : (
                        msg.text && (
                          <div
                            className="message-text"
                            dangerouslySetInnerHTML={{ __html: md.render(cleanText) }}
                          ></div>
                        )
                      )}
                      {msg.image && <img src={msg.image} alt="sent" />}
                    </div>
                  </div>
                );
              })}
            </div>
            ) : (
              <>
                <div className="greet">
                  <p><span>Hello, buddy</span></p>
                  <p>How can I help you today?</p>
                </div>
                <div className="cards">
                  <div className="card" onClick={() => handleCardClick("Help me manage exam stress and anxiety")}>
                    <p>Help me manage exam stress and anxiety</p>
                    <img src={assets.compass_icon} alt="" />
                  </div>
                  <div className="card" onClick={() => handleCardClick("Help me calm my anxiety and worries")}>
                    <p>Help me calm my anxiety and worries</p>
                    <img src={assets.bulb_icon} alt="" />
                  </div>
                  <div className="card" onClick={() => handleCardClick("Please suggest a daily mental wellness routine")}>
                    <p>Please suggest a daily mental wellness routine</p>
                    <img src={assets.message_icon} alt="" />
                  </div>
                  <div className="card" onClick={() => handleCardClick("Please suggest some self-care activities for today")}>
                    <p>Please suggest some self-care activities for today</p>
                    <img src={assets.code_icon} alt="" />
                  </div>
                </div>
              </>
            )}

        {/* Selected image preview */}
        {selectedImage && (
          <div className="preview-container">
            <div className="image-preview">
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
              <button onClick={removeImage} className="remove-image-btn">×</button>
            </div>
          </div>
        )}

        {showScrollButton && (
          <button className="scroll-to-bottom visible" onClick={scrollToBottom}>
            ↓
          </button>
        )}

        <div className="main-bottom">
          <div className="search-box">
            {/* Theme Toggle Button */}
            <button 
                className="theme-toggle-btn" 
                onClick={toggleTheme}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '5px',
                    marginRight: '10px'
                }}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Hidden file input */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} 
              ref={fileInputRef}
              style={{ display: 'none' }} 
              id="file-input"
            />
            
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder="Enter a prompt here"
              onKeyPress={handleKeyPress}
            />
            <div>
                <img 
                  src={assets.gallery_icon} 
                  width={30} 
                  alt="" 
                  onClick={() => document.getElementById('file-input').click()}
                  style={{ cursor: 'pointer' }}
                />
                <img src={assets.mic_icon} width={30} alt="" />
                {(input || selectedImage) ? 
                  <img onClick={handleSend} src={assets.send_icon} width={30} alt="" style={{ cursor: 'pointer' }} /> 
                  : null
                }
            </div>
          </div>
          <p className="bottom-info">
            MannMitra may display inaccurate info, including about people, so double-check its responses. Your privacy and MannMitra Apps
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main