import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPIWidget } from "@/components/dashboard/KPIWidget";
import { SLAWidget } from "@/components/dashboard/SLAWidget";
import { QuotaWidget } from "@/components/dashboard/QuotaWidget";
import { DistrictHeatmap } from "@/components/dashboard/DistrictHeatmap";
import { CaseCard } from "@/components/dashboard/CaseCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Mock data for dashboard
  const kpiData = [
    {
      title: "Total Grievances",
      value: 1234,
      change: "+12",
      period: "this month",
      trend: "up" as const,
    },
    {
      title: "Resolved Cases",
      value: 892,
      change: "+8",
      period: "this month",
      trend: "up" as const,
    },
    {
      title: "SLA Compliance",
      value: 87,
      change: "-3",
      period: "this month",
      trend: "down" as const,
      suffix: "%",
    },
    {
      title: "Avg Resolution Time",
      value: 2.3,
      change: "-0.5",
      period: "this month",
      trend: "up" as const,
      suffix: " days",
    },
  ];

  const districtsData = [
    {
      district: "SPSR Nellore",
      code: "NLR",
      totalCases: 156,
      slaCompliance: 87,
      breachedCount: 23,
      trend: "up" as const,
      trendValue: "+12%",
      priority: "medium" as const,
    },
    {
      district: "Guntur",
      code: "GTR",
      totalCases: 203,
      slaCompliance: 92,
      breachedCount: 15,
      trend: "up" as const,
      trendValue: "+8%",
      priority: "low" as const,
    },
    {
      district: "Visakhapatnam",
      code: "VSP",
      totalCases: 189,
      slaCompliance: 73,
      breachedCount: 35,
      trend: "down" as const,
      trendValue: "-5%",
      priority: "high" as const,
    },
    {
      district: "Vijayawada",
      code: "VJW",
      totalCases: 142,
      slaCompliance: 88,
      breachedCount: 18,
      trend: "stable" as const,
      trendValue: "+2%",
      priority: "medium" as const,
    },
  ];

  const slaData = {
    total: 156,
    onTime: 98,
    nearBreach: 35,
    breached: 23,
    compliance: 87,
  };

  const quotaData = {
    temple: "Sri Durga Malleswara Swamy",
    templeCode: "SDMS-VJW",
    vipQuota: {
      total: 100,
      used: 75,
      remaining: 25,
    },
    generalQuota: {
      total: 500,
      used: 375,
      remaining: 125,
    },
    month: "January 2025",
  };

  const recentCases = [
    {
      id: "GRV-AP-NLR-2025-000123-X4",
      citizenName: "Ram Kumar",
      phone: "+91 9876543210",
      address: "Ward 15, Nellore Rural",
      category: "Water Supply",
      subcategory: "No water supply",
      description: "Water supply issue in Ward 15",
      priority: "P2" as const,
      district: "SPSR Nellore",
      mandal: "Nellore",
      ward: "Ward 15",
      department: "Water Supply Department",
      status: "IN_PROGRESS" as const,
      assignedTo: "Ravi Kumar",
      createdAt: "2025-01-15T10:30:00Z",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header with Back Button */}
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Role Selection
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of citizen services and operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPIWidget key={index} {...kpi} />
        ))}
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sla">SLA Monitoring</TabsTrigger>
          <TabsTrigger value="quotas">Quotas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* District Heatmap */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>District Activity Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <DistrictHeatmap districts={districtsData} />
              </CardContent>
            </Card>

            {/* Recent Cases */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCases.map((case_) => (
                  <CaseCard
                    key={case_.id}
                    case={case_}
                    onViewDetails={(id) => console.log("Navigate to case:", id)}
                    onTakeAction={(id) => console.log("Take action on:", id)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Critical Cases
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">23</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Review
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">67</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Today
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">45</div>
                <p className="text-xs text-muted-foreground">Cases resolved</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sla" className="space-y-6">
          <SLAWidget data={slaData} period="This Month" />
        </TabsContent>

        <TabsContent value="quotas" className="space-y-6">
          <QuotaWidget data={quotaData} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Advanced analytics and reporting will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
