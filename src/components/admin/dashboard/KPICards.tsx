import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, CheckCircle, Target } from "lucide-react";

interface KPI {
  title: string;
  value: string;
  target: string;
  trend: string;
  status: string;
}

interface KPICardsProps {
  kpis: KPI[];
}

export function KPICards({ kpis }: KPICardsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">{kpi.value}</h3>
                  <Badge variant="outline" className="text-xs">
                    Target: {kpi.target}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStatusColor(kpi.status)}`}>
                    {kpi.trend}
                  </span>
                  <span className="text-xs text-muted-foreground">vs target</span>
                </div>
              </div>
              <div className="ml-2">{getStatusIcon(kpi.status)}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
