import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { SLAClock } from '@/components/shared/SLAClock';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

const mockWorkItems = [
  {
    id: 'GRV-AP-NLR-2025-000001',
    type: 'Grievance',
    title: 'Water supply issue',
    applicant: 'Ravi Kumar',
    category: 'Water Supply',
    district: 'Nellore',
    assigned_to: 'Priya Sharma',
    status: 'IN_PROGRESS',
    priority: 'P2',
    sla_due_at: '2025-01-20T10:00:00Z',
    created_at: '2025-01-15T10:00:00Z',
    needs_approval: false,
  },
  {
    id: 'CMR-AP-NLR-2025-000001',
    type: 'CM Relief Fund',
    title: 'Heart Surgery - Ramesh Kumar',
    applicant: 'Ramesh Kumar',
    category: 'Medical',
    district: 'Nellore',
    assigned_to: 'Current User',
    status: 'SANCTION_REQUESTED',
    priority: 'P1',
    sla_due_at: '2025-01-18T10:00:00Z',
    created_at: '2025-01-15T10:00:00Z',
    needs_approval: true,
  },
];

const allColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    render: (value: string, record: any) => (
      <div className="space-y-1">
        <span className="font-mono text-sm text-primary">{value}</span>
        <Badge variant="outline" className="text-xs">
          {record.type}
        </Badge>
      </div>
    ),
  },
  {
    key: 'title',
    label: 'Title',
    sortable: true,
  },
  {
    key: 'applicant',
    label: 'Citizen/Party',
    sortable: true,
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline">{value}</Badge>
    ),
  },
  {
    key: 'district',
    label: 'District',
    sortable: true,
  },
  {
    key: 'assigned_to',
    label: 'Assigned To',
    render: (value: string) => value || 'Unassigned',
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: 'sla_due_at',
    label: 'SLA Due',
    render: (value: string) => value ? <SLAClock dueDate={value} /> : '-',
  },
  {
    key: 'created_at',
    label: 'Age',
    render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

const filters = [
  {
    key: 'type',
    label: 'Type',
    type: 'select' as const,
    options: [
      { value: 'Grievance', label: 'Grievance' },
      { value: 'Dispute', label: 'Dispute' },
      { value: 'Temple Letter', label: 'Temple Letter' },
      { value: 'CM Relief Fund', label: 'CM Relief Fund' },
      { value: 'Education Support', label: 'Education Support' },
      { value: 'CSR Industrial', label: 'CSR Industrial' },
      { value: 'Appointment', label: 'Appointment' },
    ],
  },
  {
    key: 'district',
    label: 'District',
    type: 'select' as const,
    options: [
      { value: 'Nellore', label: 'Nellore' },
      { value: 'Tirupati', label: 'Tirupati' },
      { value: 'Vijayawada', label: 'Vijayawada' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'NEW', label: 'New' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'SANCTION_REQUESTED', label: 'Needs Approval' },
      { value: 'RESOLVED', label: 'Resolved' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    type: 'select' as const,
    options: [
      { value: 'P1', label: 'P1 - Critical' },
      { value: 'P2', label: 'P2 - High' },
      { value: 'P3', label: 'P3 - Medium' },
      { value: 'P4', label: 'P4 - Low' },
    ],
  },
];

const savedViews = [
  { id: 'sla-breach', name: 'SLA Breach Risk', filters: {} },
  { id: 'high-priority', name: 'High Priority (P1-P2)', filters: {} },
  { id: 'unassigned', name: 'Unassigned Items', filters: {} },
];

export default function WorkQueues() {
  const navigate = useNavigate();
  const [data] = useState(mockWorkItems);

  const handleRowClick = (record: any) => {
    const type = record.type.toLowerCase().replace(/\s+/g, '-');
    navigate(`/admin/${type}/${record.id}`);
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  const allItems = data;
  const myApprovals = data.filter(item => item.needs_approval);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Work Queues</h1>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items ({allItems.length})</TabsTrigger>
          <TabsTrigger value="my-approvals">
            My Approvals ({myApprovals.length})
            {myApprovals.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {myApprovals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <RecordList
            title=""
            data={allItems}
            columns={allColumns}
            filters={filters}
            savedViews={savedViews}
            loading={false}
            onRowClick={handleRowClick}
            onBatchAction={handleBatchAction}
            searchPlaceholder="Search across all work items..."
          />
        </TabsContent>

        <TabsContent value="my-approvals">
          <RecordList
            title=""
            data={myApprovals}
            columns={allColumns}
            filters={filters.filter(f => f.key !== 'status')} // Remove status filter for approvals
            loading={false}
            onRowClick={handleRowClick}
            onBatchAction={handleBatchAction}
            searchPlaceholder="Search approval items..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}