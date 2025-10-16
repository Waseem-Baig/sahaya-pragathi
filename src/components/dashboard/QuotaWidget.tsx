import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Church, AlertCircle, CheckCircle } from "lucide-react";

interface QuotaData {
  temple: string;
  templeCode: string;
  vipQuota: {
    total: number;
    used: number;
    remaining: number;
  };
  generalQuota: {
    total: number;
    used: number;
    remaining: number;
  };
  month: string;
}

interface QuotaWidgetProps {
  data: QuotaData;
}

export function QuotaWidget({ data }: QuotaWidgetProps) {
  const vipUsagePercent = (data.vipQuota.used / data.vipQuota.total) * 100;
  const generalUsagePercent = (data.generalQuota.used / data.generalQuota.total) * 100;

  const getQuotaStatus = (used: number, total: number) => {
    const percent = (used / total) * 100;
    if (percent >= 90) return { status: 'critical', color: 'destructive' };
    if (percent >= 75) return { status: 'warning', color: 'warning' };
    return { status: 'normal', color: 'success' };
  };

  const vipStatus = getQuotaStatus(data.vipQuota.used, data.vipQuota.total);
  const generalStatus = getQuotaStatus(data.generalQuota.used, data.generalQuota.total);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Church className="h-5 w-5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span>{data.temple}</span>
              <Badge variant="outline" className="text-xs">
                {data.templeCode}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-normal">{data.month}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* VIP Quota */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">VIP Darshan</span>
              {vipStatus.status === 'critical' && <AlertCircle className="h-3 w-3 text-destructive" />}
              {vipStatus.status === 'normal' && <CheckCircle className="h-3 w-3 text-success" />}
            </div>
            <Badge variant={vipStatus.color as any} className="text-xs">
              {data.vipQuota.remaining} left
            </Badge>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{data.vipQuota.used} used</span>
            <span>{data.vipQuota.total} total</span>
          </div>
          <Progress 
            value={vipUsagePercent} 
            className="h-2"
          />
        </div>

        {/* General Quota */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">General Darshan</span>
              {generalStatus.status === 'critical' && <AlertCircle className="h-3 w-3 text-destructive" />}
              {generalStatus.status === 'normal' && <CheckCircle className="h-3 w-3 text-success" />}
            </div>
            <Badge variant={generalStatus.color as any} className="text-xs">
              {data.generalQuota.remaining} left
            </Badge>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{data.generalQuota.used} used</span>
            <span>{data.generalQuota.total} total</span>
          </div>
          <Progress 
            value={generalUsagePercent} 
            className="h-2"
          />
        </div>

        {/* Summary */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Total Letters:</span>
            <span className="font-medium">
              {data.vipQuota.used + data.generalQuota.used} / {data.vipQuota.total + data.generalQuota.total}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}