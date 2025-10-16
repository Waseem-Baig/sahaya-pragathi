import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  MapPin,
  FileCheck,
  Target,
  Award,
  AlertTriangle,
  Plus,
  UserCheck,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const kpis = [
    {
      title: "Overall SLA Compliance",
      value: "87%",
      target: "90%",
      trend: "+2%",
      status: "warning",
    },
    {
      title: "Cases Closed This Month",
      value: "1,247",
      target: "1,200",
      trend: "+8%",
      status: "success",
    },
    {
      title: "Citizen Satisfaction",
      value: "4.2/5",
      target: "4.0/5",
      trend: "+0.3",
      status: "success",
    },
    {
      title: "Pending Approvals",
      value: "23",
      target: "<50",
      trend: "-12",
      status: "success",
    },
  ];

  const topCategories = [
    { name: 'Water Supply', count: 342, percentage: 28, trend: '+5%' },
    { name: 'Roads & Transport', count: 298, percentage: 24, trend: '+2%' },
    { name: 'Electricity', count: 187, percentage: 15, trend: '-3%' },
    { name: 'Healthcare', count: 156, percentage: 13, trend: '+8%' },
    { name: 'Education', count: 123, percentage: 10, trend: '+1%' },
  ];

  const districtPerformance = [
    { district: 'SPSR Nellore', sla: 89, closed: 234, rating: 4.3, status: 'success' },
    { district: 'Guntur', sla: 85, closed: 198, rating: 4.1, status: 'warning' },
    { district: 'Vijayawada', sla: 92, closed: 267, rating: 4.4, status: 'success' },
    { district: 'Visakhapatnam', sla: 83, closed: 189, rating: 3.9, status: 'warning' },
  ];

  const pendingApprovals = [
    { type: 'Temple Letters', count: 8, urgency: 'high' },
    { type: 'CM Relief Fund', count: 12, urgency: 'medium' },
    { type: 'Education Recos', count: 3, urgency: 'low' },
    { type: 'CSR Projects', count: 0, urgency: 'none' },
  ];

  const recentActivity = [
    { type: 'case_resolved', caseId: 'GRV-2024-001234', category: 'Infrastructure', time: '2 mins ago' },
    { type: 'new_assignment', description: 'Temple letter to Exec Admin', time: '5 mins ago' },
    { type: 'sla_warning', caseId: 'CMR-2024-005678', deadline: '2 hours', time: '10 mins ago' }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'case_resolved': return 'bg-green-500';
      case 'new_assignment': return 'bg-blue-500';
      case 'sla_warning': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Master Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete system overview and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileCheck className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-foreground">{kpi.value}</span>
                    <span className="text-sm text-muted-foreground">/ {kpi.target}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">{kpi.trend}</span>
                  </div>
                </div>
                <Badge 
                  variant={kpi.status === 'success' ? 'default' : 'warning'}
                  className="ml-2"
                >
                  {kpi.status === 'success' ? 'On Track' : 'Needs Focus'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Overview */}
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-muted-foreground">Total Cases</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">892</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">355</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">23</div>
                  <div className="text-sm text-muted-foreground">SLA Breached</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top 5 Request Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">{category.count} cases</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-green-600 font-medium">{category.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* District Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                District Performance Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {districtPerformance.map((district) => (
                  <div key={district.district} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{district.district}</h4>
                      <Badge variant={district.status === 'success' ? 'default' : 'warning'}>
                        {district.status === 'success' ? 'Excellent' : 'Needs Attention'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">SLA Compliance</p>
                        <p className="font-semibold text-lg">{district.sla}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cases Closed</p>
                        <p className="font-semibold text-lg">{district.closed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-lg">{district.rating}</span>
                          <Award className="h-4 w-4 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Priority Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Priority Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">SLA Breach Alert</div>
                    <div className="text-xs text-muted-foreground">23 cases overdue</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Due Today</div>
                    <div className="text-xs text-muted-foreground">67 cases require attention</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Pending Approvals</div>
                    <div className="text-xs text-muted-foreground">12 items awaiting review</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.type} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{approval.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {approval.count === 0 ? 'All cleared' : `${approval.count} pending`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {approval.urgency === 'high' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    {approval.urgency === 'medium' && (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                    {approval.urgency === 'low' && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                    {approval.count > 0 && (
                      <Badge variant={
                        approval.urgency === 'high' ? 'destructive' :
                        approval.urgency === 'medium' ? 'secondary' : 'outline'
                      }>
                        {approval.count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Button size="sm" className="w-full">
                Review All Approvals
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {activity.type === 'case_resolved' ? 'Case Resolved' :
                         activity.type === 'new_assignment' ? 'New Assignment' :
                         'SLA Warning'}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {activity.caseId ? `${activity.caseId} - ${activity.category}` : activity.description}
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New Task
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Bulk Approvals
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Reassign Cases
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileCheck className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}