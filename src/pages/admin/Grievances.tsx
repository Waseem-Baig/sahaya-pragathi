import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { SLAClock } from '@/components/shared/SLAClock';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockGrievances = [
  {
    id: 'GRV-AP-NLR-2025-000001',
    citizen_name: 'Ravi Kumar',
    mobile: '9876543210',
    category: 'Water Supply',
    district: 'Nellore',
    mandal: 'Nellore Rural',
    assigned_to: 'Priya Sharma',
    status: 'IN_PROGRESS',
    priority: 'P2',
    sla_due_at: '2025-01-20T10:00:00Z',
    created_at: '2025-01-15T10:00:00Z',
    description: 'Water connection issue in my area',
  },
  {
    id: 'GRV-AP-NLR-2025-000002',
    citizen_name: 'Lakshmi Devi',
    mobile: '9876543211',
    category: 'Electricity',
    district: 'Nellore',
    mandal: 'Gudur',
    assigned_to: null,
    status: 'NEW',
    priority: 'P3',
    sla_due_at: '2025-01-22T10:00:00Z',
    created_at: '2025-01-16T14:30:00Z',
    description: 'Frequent power cuts in our locality',
  },
];

const columns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    render: (value: string) => (
      <span className="font-mono text-sm text-primary">{value}</span>
    ),
  },
  {
    key: 'citizen_name',
    label: 'Citizen',
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
    render: (value: string) => value || '-',
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
    key: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { value: 'Water Supply', label: 'Water Supply' },
      { value: 'Electricity', label: 'Electricity' },
      { value: 'Roads', label: 'Roads' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'NEW', label: 'New' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
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
  { id: 'sla-risk', name: 'SLA at Risk', filters: {} },
  { id: 'unassigned', name: 'Unassigned', filters: {} },
  { id: 'need-approval', name: 'Need Approval', filters: {} },
];

export default function Grievances() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockGrievances);

  const handleRowClick = (record: any) => {
    navigate(`/admin/grievances/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/grievances/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="Grievances"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New Grievance"
      searchPlaceholder="Search by ID, name, phone..."
    />
  );
}