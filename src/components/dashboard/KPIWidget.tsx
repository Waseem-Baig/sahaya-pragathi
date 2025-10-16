import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIWidgetProps {
  title: string;
  value: string | number;
  target?: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'destructive' | 'info';
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function KPIWidget({ 
  title, 
  value, 
  target, 
  change, 
  trend, 
  status = 'info', 
  icon: Icon,
  description 
}: KPIWidgetProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-foreground">{value}</span>
              {target && (
                <span className="text-sm text-muted-foreground">/ {target}</span>
              )}
            </div>
            {change && (
              <div className="flex items-center gap-1">
                <TrendIcon className={`h-3 w-3 ${getTrendColor()}`} />
                <span className={`text-xs font-medium ${getTrendColor()}`}>{change}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {Icon && (
              <div className={`p-3 rounded-full bg-${status}/10`}>
                <Icon className={`h-6 w-6 text-${status}`} />
              </div>
            )}
            {status && (
              <Badge variant={status} className="text-xs">
                {status === 'success' && 'On Track'}
                {status === 'warning' && 'Attention'}
                {status === 'destructive' && 'Critical'}
                {status === 'info' && 'Normal'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}