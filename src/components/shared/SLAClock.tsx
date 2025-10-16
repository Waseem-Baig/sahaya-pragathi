import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SLAClockProps {
  dueDate: string;
  className?: string;
}

export function SLAClock({ dueDate, className }: SLAClockProps) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const isOverdue = diffMs < 0;
  const isUrgent = diffMs < 4 * 60 * 60 * 1000; // Less than 4 hours

  const formatTimeRemaining = () => {
    if (isOverdue) {
      const overdue = Math.abs(diffHours);
      return `${overdue}h overdue`;
    }
    
    if (diffHours < 24) {
      return `${diffHours}h ${Math.abs(diffMinutes)}m remaining`;
    }
    
    const days = Math.floor(diffHours / 24);
    const hours = diffHours % 24;
    return `${days}d ${hours}h remaining`;
  };

  const getVariant = () => {
    if (isOverdue) return 'destructive';
    if (isUrgent) return 'warning';
    return 'info';
  };

  return (
    <Badge variant={getVariant() as any} className={className}>
      {isOverdue ? (
        <AlertTriangle className="h-3 w-3 mr-1" />
      ) : (
        <Clock className="h-3 w-3 mr-1" />
      )}
      {formatTimeRemaining()}
    </Badge>
  );
}