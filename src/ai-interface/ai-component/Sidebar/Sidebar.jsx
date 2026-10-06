import React, { useContext, useState, useEffect } from 'react'
import '../Sidebar/Sidebar.css'
import { assets } from '../../../assets/assets'
import { Context } from '../../context/Context';

const Sidebar = ({ activePage, setActivePage, onOpenSettings }) => {
    const [extended, setExtended] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { conversations, setCurrentChatId, newChat, isLightMode } = useContext(Context);
    
    const [isMobile, setIsMobile] = useState(false);

    const handleOpenSettings = (tab = "account") => {
        if (onOpenSettings) {
            onOpenSettings(tab);
        }
        setActivePage("settings");
        if (isMobile) {
            closeMobileSidebar();
        }
    };
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        if(isMobile) {
            if(isLightMode) {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        } else {
            document.body.classList.remove('light-mode');
        }
    }, [isLightMode, isMobile]);

    const loadConversation = (chatId) => {
        setCurrentChatId(chatId);
        if (isMobile) {
            closeMobileSidebar();
        }
        setActivePage("chat");
    };

    const handleNewChat = () => {
        newChat();
        if (isMobile) {
            closeMobileSidebar();
        }
        setActivePage("chat");
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    const communityIcon = assets.community_icon ?? assets.resources_icon ?? assets.message_icon;

    return (
        <>
            {isMobile && !isMobileSidebarOpen && (
                <div className="mobile-menu-icon" onClick={toggleMobileSidebar}>
                    <img src={assets.menu_icon} alt="Menu" />
                </div>
            )}
            
            {isMobile && (
                <div 
                    className={`overlay ${isMobileSidebarOpen ? 'active' : ''}`} 
                    onClick={closeMobileSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`sidebar ${isMobileSidebarOpen ? 'active' : ''}`}>
                <div className="top">
                    <img
                        src={assets.menu_icon}
                        alt=""
                        className="menu"
                        onClick={() => {
                            if (isMobile) {
                                toggleMobileSidebar();
                            } else {
                                setExtended(prev => !prev);
                            }
                        }}    
                    />

                    <div className="features">
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("chat")}>
                            <img src={assets.message_icon} alt="" />
                            {extended ? <p>Chatbot</p> : null}
                        </div>
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("booking")}>
                            <img src={assets.booking_icon} alt="" />
                            {extended ? <p>Booking</p> : null}
                        </div>
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("resources")}>
                            <img src={assets.resources_icon} alt="" />
                            {extended ? <p>Resources</p> : null}
                        </div>

                        {/* COMMUNITY BUTTON - ADDED */}
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("community")}>
                            <img src={assets.community_icon} alt="Community" />
                            {extended ? <p>Community</p> : null}
                        </div>

                        {/* <div className="bottom-item recent-entry" onClick={() => setActivePage("dashboard")}>
                            <img src={assets.dashboard_icon} alt="" />
                            {extended ? <p>Dashboard</p> : null}
                        </div> */}
                    </div>

                    {activePage === "chat" && (
                        <div onClick={handleNewChat} className="new-chat">
                            <img src={assets.plus_icon} alt="" />
                            {extended ? <p>New Chat</p> : null}
                        </div>
                    )}

                    {extended && activePage === "chat" && (
                        <div className="recent">
                            <p className='recent-title'>Recent Chat</p>
                            {conversations.map(chat => (
                                <div
                                    key={chat.id}
                                    onClick={() => loadConversation(chat.id)}
                                    className="recent-entry"
                                >
                                    <img src={assets.message_icon} alt="" />
                                    <p>{chat.title.slice(0, 18)}...</p>
                                </div>
                            ))} 
                        </div>
                    )}
                </div>
            
                <div className="bottom">
                    {/* Bottom Actions */}
                    <div className="bottom-item recent-entry" onClick={() => handleOpenSettings("helplines")}>
                        <img src={assets.question_icon} alt="Help" />
                        {extended ? <p>Help</p> : null}
                    </div>
                    <div className="bottom-item recent-entry" onClick={() => handleOpenSettings("privacy")}>
                        <img src={assets.history_icon} alt="Activity" />
                        {extended ? <p>Activity</p> : null}
                    </div>
                    <div className={`bottom-item recent-entry ${activePage === "settings" ? "active" : ""}`} onClick={() => handleOpenSettings("account")}>
                        <img src={assets.setting_icon} alt="Settings" />
                        {extended ? <p>Settings</p> : null}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
