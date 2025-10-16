import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockEducationSupport = [
  {
    id: 'EDU-AP-NLR-2025-000001',
    student_name: 'Rajesh Kumar',
    mobile: '9876543210',
    institution_name: 'IIT Tirupati',
    program_applied: 'B.Tech Computer Science',
    fee_concession_percentage: 75,
    status: 'RECOMMENDED',
    student_age: 18,
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'EDU-AP-NLR-2025-000002',
    student_name: 'Priya Sharma',
    mobile: '9876543211',
    institution_name: 'Anna University',
    program_applied: 'MBA',
    fee_concession_percentage: null,
    status: 'NEW',
    student_age: 22,
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
    key: 'student_name',
    label: 'Student',
    sortable: true,
  },
  {
    key: 'institution_name',
    label: 'Institution',
    sortable: true,
  },
  {
    key: 'program_applied',
    label: 'Program',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline">{value}</Badge>
    ),
  },
  {
    key: 'fee_concession_percentage',
    label: 'Concession %',
    render: (value: number) => value ? `${value}%` : 'Pending',
  },
  {
    key: 'student_age',
    label: 'Age',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: 'created_at',
    label: 'Applied',
    render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

const filters = [
  {
    key: 'institution_name',
    label: 'Institution',
    type: 'select' as const,
    options: [
      { value: 'IIT Tirupati', label: 'IIT Tirupati' },
      { value: 'Anna University', label: 'Anna University' },
      { value: 'Osmania University', label: 'Osmania University' },
    ],
  },
  {
    key: 'program_applied',
    label: 'Program Type',
    type: 'select' as const,
    options: [
      { value: 'B.Tech', label: 'B.Tech' },
      { value: 'MBA', label: 'MBA' },
      { value: 'Medical', label: 'Medical' },
      { value: 'Engineering', label: 'Engineering' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'NEW', label: 'New' },
      { value: 'VERIFIED', label: 'Verified' },
      { value: 'RECOMMENDED', label: 'Recommended' },
      { value: 'ACCEPTED', label: 'Accepted' },
      { value: 'REJECTED', label: 'Rejected' },
    ],
  },
];

const savedViews = [
  { id: 'pending-verification', name: 'Pending Verification', filters: {} },
  { id: 'high-performers', name: 'High Performers', filters: {} },
  { id: 'concession-approved', name: 'Concession Approved', filters: {} },
];

export default function EducationSupport() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockEducationSupport);

  const handleRowClick = (record: any) => {
    navigate(`/admin/education/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/education/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="Education Support"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New Education Support"
      searchPlaceholder="Search by ID, student name..."
    />
  );
}