import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MasterAdminSidebar } from "./MasterAdminSidebar";
import { MasterAdminTopbar } from "./MasterAdminTopbar";
import { ContextPanel } from "./ContextPanel";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const MasterAdminShell = () => {
  const [contextPanelOpen, setContextPanelOpen] = useState(false);
  const [contextData, setContextData] = useState<Record<
    string,
    unknown
  > | null>(null);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <MasterAdminSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <MasterAdminTopbar
              onContextToggle={() => setContextPanelOpen(!contextPanelOpen)}
              contextOpen={contextPanelOpen}
            />

            <div className="flex flex-1 min-h-0">
              <main className="flex-1 overflow-auto min-w-0">
                <Outlet />
              </main>

              {contextPanelOpen && (
                <ContextPanel
                  open={contextPanelOpen}
                  data={contextData}
                  onClose={() => setContextPanelOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};
