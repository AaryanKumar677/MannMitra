import React, { useState, useEffect, Suspense, useContext } from "react";
import Sidebar from "../ai-interface/ai-component/Sidebar/Sidebar";
import Main from "../ai-interface/ai-component/Main/Main";
import Booking from "./ai-component/Booking/Booking";
import Resources from "./ai-component/Resources/Resources";
import SettingsPage from "./ai-component/Settings/SettingsPage";
import LoopHolePortal from "./ai-component/Portal/LoopHolePortal";
import NewUserWelcomeModal from "./ai-component/WelcomeModals/NewUserWelcomeModal";
import WelcomeBackModal from "./ai-component/WelcomeModals/WelcomeBackModal";
import { useAuth } from "../context/AuthContext";
import { Context } from "../ai-interface/context/Context";
import GuestPrompt from "../components/GuestPrompt";

const CommunityPage = React.lazy(() =>
  import("../ai-interface/ai-component/Community/CommunityHub")
);

const AIApp = () => {
  const [activePage, setActivePage] = useState("chat");
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("account");

  // Loop Hole (Wormhole) and Welcome Modals State
  const [showPortal, setShowPortal] = useState(() => {
    return sessionStorage.getItem("mann_trigger_portal") === "true";
  });
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false);
  const [welcomeUserName, setWelcomeUserName] = useState("Friend");

  const handleOpenSettings = (tab = "account") => {
    setSettingsTab(tab);
    setActivePage("settings");
  };

  const authCtx = useAuth();
  if (!authCtx) return <p style={{ padding: 20, color: "red" }}>⚠ AuthContext missing</p>;
  const { user: authUser, loading } = authCtx;

  // only pull what you need from Context to avoid unused warnings
  const { conversations, onSent } = useContext(Context);

  useEffect(() => {
    const triggerPortal = sessionStorage.getItem("mann_trigger_portal");
    const authEvent = sessionStorage.getItem("mann_auth_event");
    const storedName = sessionStorage.getItem("mann_user_name");

    if (storedName) {
      setWelcomeUserName(storedName);
    } else if (authUser?.displayName) {
      setWelcomeUserName(authUser.displayName.split(" ")[0]);
    } else if (authUser?.email) {
      setWelcomeUserName(authUser.email.split("@")[0]);
    }

    if (triggerPortal === "true") {
      setShowPortal(true);
      sessionStorage.removeItem("mann_trigger_portal");
    } else if (authEvent === "new_registration") {
      setShowNewUserModal(true);
      sessionStorage.removeItem("mann_auth_event");
      sessionStorage.removeItem("mann_user_name");
    } else if (authEvent === "welcome_back") {
      setShowWelcomeBackModal(true);
      sessionStorage.removeItem("mann_auth_event");
      sessionStorage.removeItem("mann_user_name");
    }
  }, [authUser]);

  const handlePortalComplete = () => {
    setShowPortal(false);
    const authEvent = sessionStorage.getItem("mann_auth_event");
    const storedName = sessionStorage.getItem("mann_user_name");

    if (storedName) {
      setWelcomeUserName(storedName);
    }

    if (authEvent === "new_registration") {
      setShowNewUserModal(true);
    } else if (authEvent === "welcome_back") {
      setShowWelcomeBackModal(true);
    }

    // Clean up flags so they never re-trigger on routine reload or tab switch
    sessionStorage.removeItem("mann_auth_event");
    sessionStorage.removeItem("mann_user_name");
  };

  useEffect(() => {
    const guestFlag = localStorage.getItem("mann_guest");
    if (!loading && !authUser && !guestFlag) {
      setGuestModalOpen(true);
    } else {
      setGuestModalOpen(false);
    }
  }, [loading, authUser]);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading user session...</p>;
  }

  const userForApp = authUser ? { ...authUser, isGuest: false } : { isGuest: true, id: null, email: null };

  const renderPage = () => {
    switch (activePage) {
      case "chat":
        return <Main user={userForApp} onOpenSettings={handleOpenSettings} />;
      case "booking":
        return <Booking user={userForApp} onOpenSettings={handleOpenSettings} />;
      case "resources":
        return <Resources user={userForApp} onOpenSettings={handleOpenSettings} />;
      case "community":
        return (
          <Suspense fallback={<div style={{ padding: 20 }}>Loading community...</div>}>
            <CommunityPage user={userForApp} onOpenSettings={handleOpenSettings} />
          </Suspense>
        );
      case "settings":
        return (
          <SettingsPage
            initialSection={settingsTab}
            user={userForApp}
            onBack={() => setActivePage("chat")}
            onTriggerPortal={() => setShowPortal(true)}
          />
        );
      default:
        return <Main user={userForApp} onOpenSettings={handleOpenSettings} />;
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", flexDirection: "column", overflow: "hidden" }}>
      {/* 3-Second Cosmic Loop Hole Wormhole Portal */}
      {showPortal && (
        <LoopHolePortal onComplete={handlePortalComplete} duration={3000} />
      )}

      {/* New User Registration Note Popup */}
      <NewUserWelcomeModal
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        userName={welcomeUserName}
      />

      {/* Returning User Welcome Back Popup */}
      <WelcomeBackModal
        isOpen={showWelcomeBackModal}
        onClose={() => setShowWelcomeBackModal(false)}
        userName={welcomeUserName}
      />

      <GuestPrompt open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          style={{ width: "250px" }}
          user={userForApp}
          onOpenSettings={handleOpenSettings}
        />
        <div style={{ flex: 1, overflowY: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
};

export default AIApp;
