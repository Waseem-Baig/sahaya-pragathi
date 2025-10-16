import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecordDetail } from '@/components/shared/RecordDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Building, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';

const mockGrievance = {
  id: 'GRV-AP-NLR-2025-000001',
  citizen_name: 'Ravi Kumar',
  mobile: '9876543210',
  email: 'ravi.kumar@email.com',
  address: 'H.No 12-34, Gandhi Road, Nellore',
  district: 'Nellore',
  mandal: 'Nellore Rural',
  ward: 'Ward 15',
  pincode: '524001',
  category: 'Water Supply',
  subcategory: 'New Connection',
  description: 'I have been waiting for a new water connection for the past 3 months. Despite multiple visits to the water board office and submitting all required documents, no action has been taken. The officials keep asking me to come back later without providing any timeline. This is causing severe inconvenience to my family.',
  incident_date: '2025-01-10',
  incident_place: 'Water Board Office, Nellore',
  priority: 'P2',
  status: 'IN_PROGRESS',
  assigned_to: 'Priya Sharma',
  assigned_dept: 'Water Supply Department',
  officer_contact: '9876543211',
  progress_notes: 'Field verification completed. Connection approval pending from higher authorities.',
  escalation_priority: null,
  sla_due_at: '2025-01-20T10:00:00Z',
  completion_percentage: 60,
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-01-17T14:30:00Z',
  closed_at: null,
  citizen_id: 'citizen-123'
};

export default function GrievanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grievance] = useState(mockGrievance);

  const handleEdit = () => {
    navigate(`/admin/grievances/${id}/edit`);
  };

  const handleAssign = () => {
    // Open assign drawer
    console.log('Assign grievance');
  };

  const handleStatusChange = (status: string) => {
    console.log('Change status to:', status);
  };

  const handleAction = (action: string) => {
    console.log('Perform action:', action);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/admin/grievances')}>
          ← Back to Grievances
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAction('route-dept')}>
            Route to Department
          </Button>
          <Button variant="outline" onClick={() => handleAction('generate-letter')}>
            Generate Letter
          </Button>
          <Button variant="outline" onClick={() => handleAction('request-info')}>
            Request Info
          </Button>
          <Button onClick={() => handleAction('close')}>
            Close Case
          </Button>
        </div>
      </div>

      <RecordDetail
        record={grievance}
        onEdit={handleEdit}
        onAssign={handleAssign}
        onStatusChange={handleStatusChange}
      >
        {/* Custom Summary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Citizen Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Citizen Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium">{grievance.citizen_name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {grievance.mobile}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {grievance.email}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div>
                    {grievance.address}<br />
                    {grievance.district}, {grievance.mandal}<br />
                    Ward: {grievance.ward}, PIN: {grievance.pincode}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grievance Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Grievance Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Category</div>
                  <Badge variant="outline">{grievance.category}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Subcategory</div>
                  <Badge variant="secondary">{grievance.subcategory}</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Incident Date: {new Date(grievance.incident_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">{grievance.incident_place}</span>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                <p className="text-sm leading-relaxed">{grievance.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Assignment & Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Assigned To</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {grievance.assigned_to}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Department</div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {grievance.assigned_dept}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Officer Contact</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {grievance.officer_contact}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Progress Notes</div>
                <p className="text-sm">{grievance.progress_notes}</p>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Completion</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${grievance.completion_percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{grievance.completion_percentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & SLA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Status & SLA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <Badge variant="default">{grievance.status.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Priority</div>
                  <Badge variant={grievance.priority === 'P1' ? 'destructive' : 'warning'}>
                    {grievance.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">SLA Due</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(grievance.sla_due_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Timeline</div>
                <div className="space-y-2 text-sm">
                  <div>Created: {new Date(grievance.created_at).toLocaleString()}</div>
                  <div>Last Updated: {new Date(grievance.updated_at).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </RecordDetail>
    </div>
  );
}