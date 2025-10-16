import { useState } from 'react';
import { Search, Plus, Check, UserCheck, Send, Bell, User, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { NewTaskWizard } from '@/components/admin/NewTaskWizard';
import { BulkApprovalModal } from '@/components/admin/BulkApprovalModal';
import { AssignDrawer } from '@/components/shared/AssignDrawer';
import { NotificationModal } from '@/components/admin/NotificationModal';

interface MasterAdminTopbarProps {
  onContextToggle: () => void;
  contextOpen: boolean;
}

export const MasterAdminTopbar = ({ onContextToggle, contextOpen }: MasterAdminTopbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskWizard, setShowNewTaskWizard] = useState(false);
  const [showBulkApproval, setShowBulkApproval] = useState(false);
  const [showAssignDrawer, setShowAssignDrawer] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Search logic - can search by ID, phone, name
    console.log('Searching for:', searchQuery);
    // TODO: Implement global search
  };

  const quickActions = [
    {
      label: 'New Task',
      icon: Plus,
      onClick: () => setShowNewTaskWizard(true),
      variant: 'default' as const,
    },
    {
      label: 'Bulk Approve',
      icon: Check,
      onClick: () => setShowBulkApproval(true),
      variant: 'secondary' as const,
    },
    {
      label: 'Assign',
      icon: UserCheck,
      onClick: () => setShowAssignDrawer(true),
      variant: 'secondary' as const,
    },
    {
      label: 'Send Notice',
      icon: Send,
      onClick: () => setShowNotificationModal(true),
      variant: 'secondary' as const,
    },
  ];

  return (
    <>
      <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-full items-center justify-between px-6">
          {/* Left side - Global Search */}
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, phone, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>
          </div>

          {/* Center - Quick Actions */}
          <div className="flex items-center gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="sm"
                onClick={action.onClick}
                className="flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Right side - User menu, notifications, context panel */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                3
              </Badge>
            </Button>

            {/* Context Panel Toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onContextToggle}
              className={contextOpen ? 'bg-muted' : ''}
            >
              <PanelRight className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Master Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Switch Role</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showNewTaskWizard && (
        <NewTaskWizard 
          open={showNewTaskWizard}
          onClose={() => setShowNewTaskWizard(false)}
        />
      )}
      
      {showBulkApproval && (
        <BulkApprovalModal
          open={showBulkApproval}
          onClose={() => setShowBulkApproval(false)}
        />
      )}
      
      {showAssignDrawer && (
        <AssignDrawer
          open={showAssignDrawer}
          onOpenChange={() => setShowAssignDrawer(false)}
          recordId=""
          recordType="general"
          onAssign={async (assigneeId: string, departmentId?: string, notes?: string) => {
            console.log('Assignment completed:', { assigneeId, departmentId, notes });
            setShowAssignDrawer(false);
          }}
        />
      )}
      
      {showNotificationModal && (
        <NotificationModal
          open={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </>
  );
};