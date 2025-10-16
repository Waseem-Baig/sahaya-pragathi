import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from "lucide-react";

interface SLAData {
  total: number;
  onTime: number;
  nearBreach: number;
  breached: number;
  compliance: number;
}

interface SLAWidgetProps {
  data: SLAData;
  period: string;
  title?: string;
}

export function SLAWidget({ data, period, title = "SLA Compliance" }: SLAWidgetProps) {
  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'success';
    if (compliance >= 75) return 'warning';
    return 'destructive';
  };

  const complianceColor = getComplianceColor(data.compliance);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <Badge variant={complianceColor as any}>
            {data.compliance}%
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{period}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Compliance Rate</span>
            <span className="font-medium">{data.compliance}%</span>
          </div>
          <Progress 
            value={data.compliance} 
            className="h-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <div>
              <p className="font-medium">{data.onTime}</p>
              <p className="text-muted-foreground">On Time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            <div>
              <p className="font-medium">{data.nearBreach}</p>
              <p className="text-muted-foreground">Near Breach</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <div>
              <p className="font-medium">{data.breached}</p>
              <p className="text-muted-foreground">Breached</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-info" />
            <div>
              <p className="font-medium">{data.total}</p>
              <p className="text-muted-foreground">Total Cases</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Target: 90%</span>
            <span className={`font-medium ${data.compliance >= 90 ? 'text-success' : 'text-destructive'}`}>
              {data.compliance >= 90 ? 'Target Met' : 'Below Target'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}