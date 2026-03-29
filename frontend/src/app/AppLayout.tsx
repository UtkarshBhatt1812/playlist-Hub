import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import NavBar from "@/components/Navbar/navBar";
import Miniplayer from "@/components/Miniplayer/Miniplayer";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

const AppContent: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      className="
        min-h-screen
        flex
        bg-gradient-to-br
        from-[#efe9ff]
        via-[#f6f3ff]
        to-[#e8f6ff]
        pb-24 
      "
    >
      {/* Sidebar — on mobile it renders as fixed overlay, so no aside needed in flow */}
      {!isMobile && (
        <aside
          className={`shrink-0 sticky top-0 h-screen transition-all duration-300
            ${isCollapsed ? "w-24" : "w-72"}`}
        >
          <Sidebar />
        </aside>
      )}

      {/* Mobile sidebar (renders itself as fixed overlay) */}
      {isMobile && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <Miniplayer/>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
};

export default AppLayout;
