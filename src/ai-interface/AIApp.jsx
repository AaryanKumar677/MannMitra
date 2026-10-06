import React, { useState, useEffect, Suspense, useContext } from "react";
import Sidebar from "../ai-interface/ai-component/Sidebar/Sidebar";
import Main from "../ai-interface/ai-component/Main/Main";
import Booking from "./ai-component/Booking/Booking";
import Resources from "./ai-component/Resources/Resources";
import { useAuth } from "../context/AuthContext";
import { Context } from "../ai-interface/context/Context";
import GuestPrompt from "../components/GuestPrompt";

const CommunityPage = React.lazy(() =>
  import("../ai-interface/ai-component/Community/CommunityHub")
);

const AIApp = () => {
  const [activePage, setActivePage] = useState("chat");
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const authCtx = useAuth();
  if (!authCtx) return <p style={{ padding: 20, color: "red" }}>⚠ AuthContext missing</p>;
  const { user: authUser, loading } = authCtx;

  // only pull what you need from Context to avoid unused warnings
  const { conversations, onSent } = useContext(Context);

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
        return <Main user={userForApp} />;
      case "booking":
        return <Booking user={userForApp} />;
      case "resources":
        return <Resources user={userForApp} />;
      case "community":
        return (
          <Suspense fallback={<div style={{ padding: 20 }}>Loading community...</div>}>
            <CommunityPage user={userForApp} />
          </Suspense>
        );
      default:
        return <Main user={userForApp} />;
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", flexDirection: "column", overflow: "hidden" }}>
      <GuestPrompt open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar activePage={activePage} setActivePage={setActivePage} style={{ width: "250px" }} user={userForApp} />
        <div style={{ flex: 1, overflowY: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
};

export default AIApp;
