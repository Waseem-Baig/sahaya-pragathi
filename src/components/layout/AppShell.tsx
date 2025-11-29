import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { AppSidebar } from "./AppSidebar";
import { ContextPanel } from "./ContextPanel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { UserRole } from "@/types/government";

interface AppShellProps {
  userRole: UserRole;
  onRoleChange?: () => void;
}

export function AppShell({ userRole, onRoleChange }: AppShellProps) {
  const [contextPanelOpen, setContextPanelOpen] = useState(false);
  const [contextData, setContextData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const handleOpenContext = (data: Record<string, unknown>) => {
    setContextData(data);
    setContextPanelOpen(true);
  };

  const handleCloseContext = () => {
    setContextPanelOpen(false);
    setContextData(null);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar userRole={userRole} />

            <div className="flex-1 flex flex-col min-w-0">
              <Topbar
                userRole={userRole}
                onRoleChange={onRoleChange}
                onOpenContext={handleOpenContext}
              />

              <main className="flex-1 overflow-auto min-w-0">
                <Outlet context={{ onOpenContext: handleOpenContext }} />
              </main>
            </div>

            <ContextPanel
              open={contextPanelOpen}
              onClose={handleCloseContext}
              data={contextData}
            />
          </div>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
