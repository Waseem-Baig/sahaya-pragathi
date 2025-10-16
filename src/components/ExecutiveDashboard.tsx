import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Users, 
  FileText, 
  TrendingUp,
  MapPin,
  Filter,
  Search,
  Plus,
  Scale,
  Church,
  Heart,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  Send,
  CheckSquare
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Input } from "@/components/ui/input";
import { NewRecordForm } from "./forms/NewRecordForm";
import { BulkApprovalModal } from "./admin/BulkApprovalModal";
import { NotificationModal } from "./admin/NotificationModal";
import { CaseDetailModal } from "./shared/CaseDetailModal";
import { ActionModal } from "./shared/ActionModal";
import { FilterModal } from "./shared/FilterModal";
import { useToast } from "@/hooks/use-toast";

interface ExecutiveDashboardProps {
  onBack: () => void;
}

export function ExecutiveDashboard({ onBack }: ExecutiveDashboardProps) {
  const [newRecordOpen, setNewRecordOpen] = useState(false);
  const [bulkApprovalOpen, setBulkApprovalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<string>("");
  const [caseDetailOpen, setCaseDetailOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState({
    type: "",
    status: "",
    priority: "",
    location: ""
  });
  const { toast } = useToast();
  const stats = [
    {
      title: "SLA Breaches Today",
      value: "12",
      change: "-3 from yesterday",
      icon: AlertTriangle,
      color: "destructive",
    },
    {
      title: "Due Today",
      value: "45",
      change: "8 high priority",
      icon: Clock,
      color: "warning",
    },
    {
      title: "Completed Today",
      value: "28",
      change: "+12 from yesterday",
      icon: CheckCircle,
      color: "success",
    },
    {
      title: "New Intakes",
      value: "34",
      change: "Across all modules",
      icon: Plus,
      color: "info",
    },
  ];

  const recentCases = [
    {
      id: 'GRV-AP-NLR-2025-000318-A1',
      type: 'Grievance',
      citizen: 'Ramesh Kumar',
      category: 'Water Supply',
      priority: 'P1',
      status: 'ASSIGNED',
      assignee: 'Officer Reddy',
      slaHours: 18,
      location: 'Nellore, Ward 12',
    },
    {
      id: 'DSP-AP-NLR-2025-000042-B3',
      type: 'Dispute',
      citizen: 'Lakshmi Devi vs Ravi',
      category: 'Land Boundary',
      priority: 'P2',
      status: 'MEDIATION_SCHEDULED',
      assignee: 'Mediator Singh',
      slaHours: 72,
      location: 'Nellore, Mandal XYZ',
    },
    {
      id: 'TDL-AP-NLR-2025-000046-C2',
      type: 'Temple Letter',
      citizen: 'Venkat Family',
      category: 'VIP Darshan',
      priority: 'P3',
      status: 'IN_REVIEW',
      assignee: 'Temple Coordinator',
      slaHours: 24,
      location: 'Tirumala Request',
    },
  ];

  const departments = [
    { name: 'Water Supply', pending: 8, overdue: 2 },
    { name: 'Roads & Transport', pending: 12, overdue: 1 },
    { name: 'Healthcare', pending: 5, overdue: 3 },
    { name: 'Revenue', pending: 15, overdue: 0 },
  ];

  // Filter and search logic
  const filteredCases = recentCases.filter(case_ => {
    const matchesSearch = !searchQuery || 
      case_.citizen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !filterOptions.type || case_.type === filterOptions.type;
    const matchesStatus = !filterOptions.status || case_.status === filterOptions.status;
    const matchesPriority = !filterOptions.priority || case_.priority === filterOptions.priority;
    const matchesLocation = !filterOptions.location || 
      case_.location.toLowerCase().includes(filterOptions.location.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesLocation;
  });

  // Event handlers
  const handleViewDetails = (case_: any) => {
    setSelectedCase(case_);
    setCaseDetailOpen(true);
  };

  const handleTakeAction = (case_: any) => {
    setSelectedCase(case_);
    setActionModalOpen(true);
  };

  const handleFilter = () => {
    setFilterOpen(true);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setFilterOptions({
      type: "",
      status: "",
      priority: "",
      location: ""
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Executive Operations</h1>
            <p className="text-muted-foreground">Case management and operational oversight</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Change Role
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-light`}>
                      <IconComponent className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Cases */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Active Cases Queue
                    </CardTitle>
                    <CardDescription>Cases requiring immediate attention</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleFilter}>
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                      <Search className="h-4 w-4 mr-1" />
                      Clear Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCases.map((case_) => (
                    <div 
                      key={case_.id} 
                      className="p-4 border border-border rounded-lg bg-gradient-card hover:shadow-card transition-smooth"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {case_.type}
                          </Badge>
                          <Badge 
                            variant={
                              case_.priority === 'P1' ? 'destructive' : 
                              case_.priority === 'P2' ? 'warning' : 'info'
                            }
                            className="text-xs"
                          >
                            {case_.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            SLA: {case_.slaHours}h remaining
                          </span>
                        </div>
                        <StatusBadge status={case_.status} />
                      </div>
                      
                      <h4 className="font-semibold text-sm mb-1">{case_.citizen}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{case_.category}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>ID: {case_.id}</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {case_.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{case_.assignee}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(case_)}>
                          View Details
                        </Button>
                        <Button variant="government" size="sm" onClick={() => handleTakeAction(case_)}>
                          Take Action
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Department Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Department Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card border border-border">
                    <div>
                      <p className="font-medium text-sm">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.pending} pending
                      </p>
                    </div>
                    <div className="text-right">
                      {dept.overdue > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {dept.overdue} overdue
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-xs">
                          On track
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Master Admin Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Create New Records</CardTitle>
                <CardDescription>Submit for Master Admin approval</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("grievance")}
                    >
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">Grievance</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("dispute")}
                    >
                      <Scale className="h-5 w-5" />
                      <span className="text-xs">Dispute</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("temple")}
                    >
                      <Church className="h-5 w-5" />
                      <span className="text-xs">Temple Letter</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("cmrf")}
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-xs">CM Relief</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("education")}
                    >
                      <GraduationCap className="h-5 w-5" />
                      <span className="text-xs">Education</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("csr")}
                    >
                      <Building2 className="h-5 w-5" />
                      <span className="text-xs">CSR Industrial</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("appointment")}
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs">Appointment</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedRecordType("program")}
                    >
                      <Briefcase className="h-5 w-5" />
                      <span className="text-xs">Program</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="government" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setBulkApprovalOpen(true)}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Bulk Approval
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setNotificationOpen(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Notifications
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Bulk Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Search */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input 
                  placeholder="Search by ID, Name, or Phone" 
                  value={searchQuery}
                  onChange={(e) => handleQuickSearch(e.target.value)}
                />
                <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <Dialog open={newRecordOpen} onOpenChange={setNewRecordOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New {selectedRecordType.charAt(0).toUpperCase() + selectedRecordType.slice(1)} Record</DialogTitle>
            </DialogHeader>
            <NewRecordForm 
              recordType={selectedRecordType}
              onSubmit={(data) => {
                console.log('Submitting record for approval:', data);
                toast({
                  title: "Record Submitted",
                  description: `${selectedRecordType.charAt(0).toUpperCase() + selectedRecordType.slice(1)} record submitted for Master Admin approval.`,
                });
                setNewRecordOpen(false);
              }}
              onCancel={() => setNewRecordOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <BulkApprovalModal 
          open={bulkApprovalOpen}
          onClose={() => setBulkApprovalOpen(false)}
        />

        <NotificationModal 
          open={notificationOpen}
          onClose={() => setNotificationOpen(false)}
        />

        <CaseDetailModal
          open={caseDetailOpen}
          onClose={() => setCaseDetailOpen(false)}
          case={selectedCase}
        />

        <ActionModal
          open={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          case={selectedCase}
        />

        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filterOptions}
          onApplyFilters={setFilterOptions}
        />
      </div>
    </div>
  );
}