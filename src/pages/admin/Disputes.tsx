import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { SLAClock } from '@/components/shared/SLAClock';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockDisputes = [
  {
    id: 'DSP-AP-NLR-2025-000001',
    party_a_name: 'Rama Rao',
    party_b_name: 'Krishna Murthy',
    category: 'Land',
    district: 'Nellore',
    assigned_to: 'Mediator A',
    status: 'MEDIATION_SCHEDULED',
    hearing_date: '2025-01-25T10:00:00Z',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'DSP-AP-NLR-2025-000002',
    party_a_name: 'Sita Devi',
    party_b_name: 'Govind Reddy',
    category: 'Society',
    district: 'Nellore',
    assigned_to: null,
    status: 'NEW',
    hearing_date: null,
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
    key: 'party_a_name',
    label: 'Party A',
    sortable: true,
  },
  {
    key: 'party_b_name',
    label: 'Party B',
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
    label: 'Mediator',
    render: (value: string) => value || 'Unassigned',
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: 'hearing_date',
    label: 'Next Hearing',
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
      { value: 'Land', label: 'Land' },
      { value: 'Society', label: 'Society' },
      { value: 'Benefits', label: 'Benefits' },
      { value: 'Tenancy', label: 'Tenancy' },
      { value: 'Other', label: 'Other' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'NEW', label: 'New' },
      { value: 'MEDIATION_SCHEDULED', label: 'Mediation Scheduled' },
      { value: 'SETTLED', label: 'Settled' },
      { value: 'REFERRED_TO_COURT', label: 'Referred to Court' },
    ],
  },
];

const savedViews = [
  { id: 'hearings-due', name: 'Hearings Due', filters: {} },
  { id: 'unassigned', name: 'Unassigned', filters: {} },
  { id: 'pending-settlement', name: 'Pending Settlement', filters: {} },
];

export default function Disputes() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockDisputes);

  const handleRowClick = (record: any) => {
    navigate(`/admin/disputes/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/disputes/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="Disputes"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New Dispute"
      searchPlaceholder="Search by ID, party names..."
    />
  );
}