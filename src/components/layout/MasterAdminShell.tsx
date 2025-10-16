import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MasterAdminSidebar } from './MasterAdminSidebar';
import { MasterAdminTopbar } from './MasterAdminTopbar';
import { ContextPanel } from './ContextPanel';

export const MasterAdminShell = () => {
  const [contextPanelOpen, setContextPanelOpen] = useState(false);
  const [contextData, setContextData] = useState<any>(null);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MasterAdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <MasterAdminTopbar 
            onContextToggle={() => setContextPanelOpen(!contextPanelOpen)}
            contextOpen={contextPanelOpen}
          />
          
          <div className="flex flex-1">
            <main className="flex-1 p-6 overflow-auto">
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
  );
};