import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockTempleLetters = [
  {
    id: 'TDL-AP-TTD-2025-000001',
    applicant_name: 'Suresh Kumar',
    mobile: '9876543210',
    temple_name: 'Tirumala Venkateswara',
    darshan_type: 'VIP',
    preferred_date: '2025-02-15',
    status: 'APPROVED',
    quota_available: 45,
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'TDL-AP-TTD-2025-000002',
    applicant_name: 'Meera Devi',
    mobile: '9876543211',
    temple_name: 'Tirumala Venkateswara',
    darshan_type: 'GENERAL',
    preferred_date: '2025-02-20',
    status: 'REQUESTED',
    quota_available: 120,
    created_at: '2025-01-16T14:30:00Z',
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
    key: 'applicant_name',
    label: 'Applicant',
    sortable: true,
  },
  {
    key: 'temple_name',
    label: 'Temple',
    sortable: true,
  },
  {
    key: 'darshan_type',
    label: 'Type',
    sortable: true,
    render: (value: string) => (
      <Badge variant={value === 'VIP' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'preferred_date',
    label: 'Preferred Date',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: 'quota_available',
    label: 'Quota Available',
    render: (value: number) => (
      <span className={value < 50 ? 'text-destructive' : 'text-foreground'}>
        {value}
      </span>
    ),
  },
  {
    key: 'created_at',
    label: 'Age',
    render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

const filters = [
  {
    key: 'temple_name',
    label: 'Temple',
    type: 'select' as const,
    options: [
      { value: 'Tirumala Venkateswara', label: 'Tirumala Venkateswara' },
      { value: 'Srikalahasti', label: 'Srikalahasti' },
      { value: 'Simhachalam', label: 'Simhachalam' },
    ],
  },
  {
    key: 'darshan_type',
    label: 'Darshan Type',
    type: 'select' as const,
    options: [
      { value: 'VIP', label: 'VIP' },
      { value: 'GENERAL', label: 'General' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'REQUESTED', label: 'Requested' },
      { value: 'IN_REVIEW', label: 'In Review' },
      { value: 'APPROVED', label: 'Approved' },
      { value: 'LETTER_ISSUED', label: 'Letter Issued' },
      { value: 'UTILIZED', label: 'Utilized' },
      { value: 'EXPIRED', label: 'Expired' },
    ],
  },
];

const savedViews = [
  { id: 'pending-approval', name: 'Pending Approval', filters: {} },
  { id: 'vip-requests', name: 'VIP Requests', filters: {} },
  { id: 'quota-low', name: 'Low Quota', filters: {} },
];

export default function TempleLetters() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockTempleLetters);

  const handleRowClick = (record: any) => {
    navigate(`/admin/temple-letters/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/temple-letters/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="Temple Letters"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New Temple Letter"
      searchPlaceholder="Search by ID, applicant name..."
    />
  );
}