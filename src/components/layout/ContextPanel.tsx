import { X, Search, Bell, Clock, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ContextPanelProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

export function ContextPanel({ open, onClose, data }: ContextPanelProps) {
  const renderSearchResults = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Search results for "{data?.query}"
      </div>
      {/* Mock search results */}
      <div className="space-y-3">
        <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4" />
            <span className="font-medium">GRV-AP-NLR-2025-000123-X4</span>
            <Badge variant="warning">In Progress</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Water supply issue in Ward 15</p>
        </div>
        <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4" />
            <span className="font-medium">Ram Kumar</span>
          </div>
          <p className="text-sm text-muted-foreground">+91 9876543210 • Nellore</p>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Recent notifications</div>
      <div className="space-y-3">
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <span className="font-medium">SLA Breach Alert</span>
            <Badge variant="destructive">Critical</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            GRV-AP-GTR-2025-000045-Y7 has exceeded SLA time
          </p>
          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
        </div>
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-4 w-4 text-info" />
            <span className="font-medium">New Assignment</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You have been assigned 3 new grievances
          </p>
          <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!data) return null;

    switch (data.type) {
      case 'search':
        return renderSearchResults();
      case 'notifications':
        return renderNotifications();
      default:
        return <div>No content available</div>;
    }
  };

  const getTitle = () => {
    if (!data) return 'Context Panel';
    
    switch (data.type) {
      case 'search':
        return 'Search Results';
      case 'notifications':
        return 'Notifications';
      default:
        return 'Context Panel';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            {getTitle()}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full mt-6">
          {renderContent()}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}