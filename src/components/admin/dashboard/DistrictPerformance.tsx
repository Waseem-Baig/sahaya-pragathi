import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface District {
  district: string;
  sla: number;
  closed: number;
  rating: number;
  status: string;
}

interface DistrictPerformanceProps {
  districts: District[];
}

export function DistrictPerformance({ districts }: DistrictPerformanceProps) {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>District Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {districts.map((district) => (
            <div
              key={district.district}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex-1">
                <h4 className="font-medium">{district.district}</h4>
                <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                  <span>SLA: {district.sla}%</span>
                  <span>Closed: {district.closed}</span>
                  <span>Rating: {district.rating}/5</span>
                </div>
              </div>
              <Badge variant={getStatusVariant(district.status)}>
                {district.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
