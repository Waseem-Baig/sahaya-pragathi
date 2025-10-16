import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface IDBadgeProps {
  id: string;
  className?: string;
  showCopy?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}

export function IDBadge({ id, className, showCopy = true, variant = 'outline' }: IDBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy ID:', error);
    }
  };

  // Parse ID components for display
  const parseId = (idString: string) => {
    const parts = idString.split('-');
    if (parts.length >= 6) {
      return {
        type: parts[0],
        state: parts[1],
        district: parts[2],
        year: parts[3],
        sequence: parts[4],
        checksum: parts[5],
        isValid: true,
      };
    }
    return { isValid: false };
  };

  const idParts = parseId(id);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge 
        variant={variant}
        className="font-mono text-xs px-2 py-1"
      >
        {id}
      </Badge>
      
      {idParts.isValid && (
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
          <span className="px-1 py-0.5 bg-muted rounded text-[10px]">
            {idParts.type}
          </span>
          <span className="px-1 py-0.5 bg-muted rounded text-[10px]">
            {idParts.district}
          </span>
          <span className="px-1 py-0.5 bg-muted rounded text-[10px]">
            {idParts.year}
          </span>
        </div>
      )}
      
      {showCopy && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0"
        >
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
}