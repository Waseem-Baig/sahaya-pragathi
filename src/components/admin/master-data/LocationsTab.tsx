import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Settings } from "lucide-react";

export function LocationsTab() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Hierarchy
        </CardTitle>
        <CardDescription>
          Manage district, mandal, and ward/village hierarchy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Location hierarchy management</p>
          <p className="text-xs">District → Mandal → Ward/Village structure</p>
          <Button variant="outline" className="mt-4">
            Configure Locations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
