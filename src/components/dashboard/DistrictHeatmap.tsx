import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface DistrictData {
  district: string;
  code: string;
  totalCases: number;
  slaCompliance: number;
  breachedCount: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  priority: 'high' | 'medium' | 'low';
}

interface DistrictHeatmapProps {
  districts: DistrictData[];
  title?: string;
}

export function DistrictHeatmap({ districts, title = "District Performance Heatmap" }: DistrictHeatmapProps) {
  const getDistrictColor = (compliance: number, breachedCount: number) => {
    if (compliance < 75 || breachedCount > 10) return 'destructive';
    if (compliance < 85 || breachedCount > 5) return 'warning'; 
    return 'success';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return TrendingUp;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {districts.map((district) => {
            const TrendIcon = getTrendIcon(district.trend);
            const districtColor = getDistrictColor(district.slaCompliance, district.breachedCount);
            
            return (
              <div
                key={district.code}
                className={`p-4 rounded-lg border-2 bg-gradient-card transition-smooth hover:shadow-card cursor-pointer ${
                  districtColor === 'destructive' ? 'border-destructive/20 bg-destructive/5' :
                  districtColor === 'warning' ? 'border-warning/20 bg-warning/5' :
                  'border-success/20 bg-success/5'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm">{district.district}</h4>
                    <p className="text-xs text-muted-foreground">{district.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {district.breachedCount > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                        <span className="text-xs text-destructive font-medium">
                          {district.breachedCount}
                        </span>
                      </div>
                    )}
                    <Badge variant={districtColor as any} className="text-xs">
                      {district.slaCompliance}%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Total Cases</p>
                    <p className="font-semibold text-lg">{district.totalCases}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SLA Compliance</p>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-lg">{district.slaCompliance}%</p>
                      <TrendIcon className={`h-3 w-3 ${getTrendColor(district.trend)}`} />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">This month:</span>
                    <span className={`font-medium ${getTrendColor(district.trend)}`}>
                      {district.trendValue}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Performance Indicators:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Good (≥85%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span>Attention (75-84%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <span>Critical (&lt;75%)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}