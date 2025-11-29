import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Church, Building2, MapPin, Users } from "lucide-react";
import { TemplesTab } from "./master-data/TemplesTab";
import { InstitutionsTab } from "./master-data/InstitutionsTab";
import { DepartmentsTab } from "./master-data/DepartmentsTab";
import { LocationsTab } from "./master-data/LocationsTab";

interface MasterDataManagerProps {
  userRole: 'L1';
}

export function MasterDataManager({ userRole }: MasterDataManagerProps) {
  const [activeTab, setActiveTab] = useState('temples');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Master Data Management</h2>
          <p className="text-muted-foreground">Manage temples, institutions, departments, and system configurations</p>
        </div>
        <Badge variant="primary">L1 Admin Access</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temples" className="flex items-center gap-2">
            <Church className="h-4 w-4" />
            Temples
          </TabsTrigger>
          <TabsTrigger value="institutions" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Institutions
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="temples">
          <TemplesTab />
        </TabsContent>

        <TabsContent value="institutions">
          <InstitutionsTab />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>

        <TabsContent value="locations">
          <LocationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}