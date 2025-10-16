import { useState } from 'react';
import { Edit, Trash2, Clock, User, FileText, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { SLAClock } from '@/components/shared/SLAClock';

interface RecordDetailProps {
  record: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onAssign?: () => void;
  onStatusChange?: (status: string) => void;
  loading?: boolean;
  children?: React.ReactNode;
}

interface TimelineItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
  type: 'system' | 'user' | 'status' | 'assignment';
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
}

interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
}

export function RecordDetail({
  record,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
  loading = false,
  children,
}: RecordDetailProps) {
  const [activeTab, setActiveTab] = useState('summary');

  // Mock data - in real app, these would come from props or API
  const timeline: TimelineItem[] = [
    {
      id: '1',
      timestamp: '2025-01-15T10:30:00Z',
      actor: 'System',
      action: 'Record created',
      type: 'system',
    },
    {
      id: '2',
      timestamp: '2025-01-15T11:00:00Z',
      actor: 'Ravi Kumar',
      action: 'Assigned to Department',
      details: 'Assigned to Water Supply Department',
      type: 'assignment',
    },
    {
      id: '3',
      timestamp: '2025-01-15T14:00:00Z',
      actor: 'System',
      action: 'Status changed',
      details: 'Status changed from NEW to IN_PROGRESS',
      type: 'status',
    },
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: 'complaint_evidence.jpg',
      type: 'image/jpeg',
      size: '2.3 MB',
      uploadedAt: '2025-01-15T10:30:00Z',
      uploadedBy: 'Citizen',
    },
    {
      id: '2',
      name: 'location_photo.jpg',
      type: 'image/jpeg',
      size: '1.8 MB',
      uploadedAt: '2025-01-15T10:31:00Z',
      uploadedBy: 'Citizen',
    },
  ];

  const auditLog: AuditLogItem[] = [
    {
      id: '1',
      timestamp: '2025-01-15T10:30:00Z',
      actor: 'system',
      action: 'CREATE',
      ip: '192.168.1.1',
    },
    {
      id: '2',
      timestamp: '2025-01-15T11:00:00Z',
      actor: 'ravi.kumar@ap.gov.in',
      action: 'UPDATE',
      field: 'assigned_to',
      oldValue: null,
      newValue: 'water_dept_001',
      ip: '192.168.1.100',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Shield className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'status':
        return <Activity className="h-4 w-4" />;
      case 'assignment':
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{record.id || 'Record Details'}</CardTitle>
              <div className="flex items-center gap-4">
                <StatusBadge status={record.status} />
                {record.priority && (
                  <Badge variant={record.priority === 'P1' ? 'destructive' : 'warning'}>
                    {record.priority}
                  </Badge>
                )}
                {record.sla_due_at && (
                  <SLAClock dueDate={record.sla_due_at} />
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {onAssign && (
                <Button variant="outline" onClick={onAssign}>
                  Assign
                </Button>
              )}
              {onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {children || (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(record).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm">
                        {typeof value === 'object' && value !== null
                          ? JSON.stringify(value)
                          : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          {getTimelineIcon(item.type)}
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-px h-8 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.action}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(item.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          by {item.actor}
                        </div>
                        {item.details && (
                          <div className="text-sm">{item.details}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(doc.type)}</span>
                      <div className="space-y-1">
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {doc.size} • Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No documents attached
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {timeline.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getTimelineIcon(item.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">{item.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.details}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(item.timestamp)} by {item.actor}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {auditLog.map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.action}</Badge>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Actor:</span> {item.actor}
                      </div>
                      {item.field && (
                        <div className="text-sm">
                          <span className="font-medium">Field:</span> {item.field}
                        </div>
                      )}
                      {item.oldValue !== undefined && (
                        <div className="text-sm">
                          <span className="font-medium">Old Value:</span>{' '}
                          <code className="bg-muted px-1 rounded">
                            {item.oldValue || 'null'}
                          </code>
                        </div>
                      )}
                      {item.newValue !== undefined && (
                        <div className="text-sm">
                          <span className="font-medium">New Value:</span>{' '}
                          <code className="bg-muted px-1 rounded">
                            {item.newValue}
                          </code>
                        </div>
                      )}
                      {item.ip && (
                        <div className="text-xs text-muted-foreground">
                          IP: {item.ip}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}