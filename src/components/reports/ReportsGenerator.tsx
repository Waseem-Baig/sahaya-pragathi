import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Clock,
  MapPin
} from "lucide-react";
import { format as formatDate, subDays, subMonths } from "date-fns";

interface ReportConfig {
  type: string;
  title: string;
  description: string;
  icon: any;
  categories: string[];
  formats: string[];
}

interface ReportsGeneratorProps {
  userRole: 'L1' | 'L2';
}

export function ReportsGenerator({ userRole }: ReportsGeneratorProps) {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 1),
    to: new Date()
  });
  const [filters, setFilters] = useState({
    districts: [] as string[],
    categories: [] as string[],
    priorities: [] as string[],
    status: [] as string[],
  });
  const [format, setFormat] = useState('PDF');

  const reportConfigs: ReportConfig[] = [
    {
      type: 'sla_compliance',
      title: 'SLA Compliance Report',
      description: 'Detailed analysis of SLA performance across districts and categories',
      icon: Clock,
      categories: ['Performance', 'Compliance'],
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      type: 'case_summary',
      title: 'Case Summary Report',
      description: 'Overview of all cases by type, status, and resolution metrics',
      icon: BarChart3,
      categories: ['Operations', 'Summary'],
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      type: 'district_performance',
      title: 'District Performance Report',
      description: 'Comparative analysis of district-wise performance and trends',
      icon: MapPin,
      categories: ['Performance', 'Analysis'],
      formats: ['PDF', 'Excel']
    },
    {
      type: 'temple_quota',
      title: 'Temple Quota Utilization',
      description: 'Monthly temple darshan quota usage and efficiency metrics',
      icon: PieChart,
      categories: ['Temple', 'Quota'],
      formats: ['PDF', 'Excel']
    },
    {
      type: 'cmrf_analytics',
      title: 'CMRF Analytics Report',
      description: 'CM Relief Fund application trends, sanctions, and impact analysis',
      icon: TrendingUp,
      categories: ['Financial', 'Analysis'],
      formats: ['PDF', 'Excel']
    },
    {
      type: 'officer_productivity',
      title: 'Officer Productivity Report',
      description: 'Individual and team performance metrics for L2 officers',
      icon: Users,
      categories: ['HR', 'Performance'],
      formats: ['PDF', 'Excel']
    }
  ];

  const districts = ['SPSR Nellore', 'Guntur', 'Vijayawada', 'Visakhapatnam'];
  const categories = ['Water Supply', 'Roads & Transport', 'Healthcare', 'Education', 'Revenue'];
  const priorities = ['P1', 'P2', 'P3', 'P4'];
  const statuses = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  const quickDateRanges = [
    { label: 'Last 7 days', from: subDays(new Date(), 7), to: new Date() },
    { label: 'Last 30 days', from: subDays(new Date(), 30), to: new Date() },
    { label: 'Last 3 months', from: subMonths(new Date(), 3), to: new Date() },
    { label: 'Last 6 months', from: subMonths(new Date(), 6), to: new Date() },
  ];

  const selectedReportConfig = reportConfigs.find(r => r.type === selectedReport);

  const handleFilterChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  const handleGenerateReport = () => {
    const reportData = {
      type: selectedReport,
      dateRange,
      filters,
      format,
      generatedAt: new Date().toISOString(),
      generatedBy: userRole
    };
    
    console.log('Generating report:', reportData);
    // Here you would call the API to generate the report
  };

  const clearFilters = () => {
    setFilters({
      districts: [],
      categories: [],
      priorities: [],
      status: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports Generator</h2>
          <p className="text-muted-foreground">Generate comprehensive reports and analytics</p>
        </div>
        <Badge variant={userRole === 'L1' ? 'primary' : 'secondary'}>
          {userRole === 'L1' ? 'Full Access' : 'Operations Reports'}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select Report Type
              </CardTitle>
              <CardDescription>
                Choose the type of report you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {reportConfigs.map((report) => {
                  const IconComponent = report.icon;
                  const isSelected = selectedReport === report.type;
                  const isRestricted = userRole === 'L2' && ['officer_productivity', 'district_performance'].includes(report.type);
                  
                  return (
                    <Card
                      key={report.type}
                      className={`cursor-pointer transition-smooth ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : 
                        isRestricted ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-card'
                      }`}
                      onClick={() => !isRestricted && setSelectedReport(report.type)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-card">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{report.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                            <div className="flex gap-1">
                              {report.categories.map((cat) => (
                                <Badge key={cat} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                            {isRestricted && (
                              <Badge variant="warning" className="text-xs mt-2">
                                L1 Only
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Date Range & Filters */}
          {selectedReport && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Date Range
                </CardTitle>
                <CardDescription>
                  Configure the scope and parameters for your report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Date Range</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickDateRanges.map((range) => (
                      <Button
                        key={range.label}
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange({ from: range.from, to: range.to })}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from-date" className="text-xs">From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {formatDate(dateRange.from, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="to-date" className="text-xs">To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {formatDate(dateRange.to, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Districts</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {districts.map((district) => (
                        <div key={district} className="flex items-center space-x-2">
                          <Checkbox
                            id={`district-${district}`}
                            checked={filters.districts.includes(district)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('districts', district, checked as boolean)
                            }
                          />
                          <Label htmlFor={`district-${district}`} className="text-sm">
                            {district}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Categories</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('categories', category, checked as boolean)
                            }
                          />
                          <Label htmlFor={`category-${category}`} className="text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Priority</Label>
                    <div className="space-y-2">
                      {priorities.map((priority) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority}`}
                            checked={filters.priorities.includes(priority)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('priorities', priority, checked as boolean)
                            }
                          />
                          <Label htmlFor={`priority-${priority}`} className="text-sm">
                            {priority}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Status</Label>
                    <div className="space-y-2">
                      {statuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.status.includes(status)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('status', status, checked as boolean)
                            }
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm">
                            {status.replace(/_/g, ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Report Configuration */}
        <div className="space-y-6">
          {selectedReportConfig && (
            <>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="format">Output Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedReportConfig.formats.map((fmt) => (
                          <SelectItem key={fmt} value={fmt}>
                            {fmt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Filters</Label>
                    <div className="space-y-1 text-xs">
                      {filters.districts.length > 0 && (
                        <p><span className="font-medium">Districts:</span> {filters.districts.join(', ')}</p>
                      )}
                      {filters.categories.length > 0 && (
                        <p><span className="font-medium">Categories:</span> {filters.categories.join(', ')}</p>
                      )}
                      {filters.priorities.length > 0 && (
                        <p><span className="font-medium">Priorities:</span> {filters.priorities.join(', ')}</p>
                      )}
                      {filters.status.length > 0 && (
                        <p><span className="font-medium">Status:</span> {filters.status.join(', ')}</p>
                      )}
                      {Object.values(filters).every(arr => arr.length === 0) && (
                        <p className="text-muted-foreground">No filters applied - all data included</p>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateReport}
                    className="w-full"
                    variant="government"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Report Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{selectedReportConfig.title}</p>
                    <p className="text-xs mt-1">
                      {formatDate(dateRange.from, "MMM dd")} - {formatDate(dateRange.to, "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs mt-2">
                      Report will be generated in {format} format
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!selectedReport && (
            <Card className="shadow-card">
              <CardContent className="p-6 text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a report type to configure options</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}