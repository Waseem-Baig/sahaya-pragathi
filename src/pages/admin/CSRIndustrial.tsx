import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockCSRIndustrial = [
  {
    id: 'CSR-AP-NLR-2025-000001',
    company_name: 'Reliance Industries',
    project_name: 'Rural Development Initiative',
    contact_person: 'Vikram Patel',
    district: 'Nellore',
    mandal: 'Nellore Rural',
    budget: 5000000,
    status: 'MOU_SIGNED',
    progress_notes: 'Phase 1 completed successfully',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'CSR-AP-NLR-2025-000002',
    company_name: 'TCS Foundation',
    project_name: 'Digital Literacy Program',
    contact_person: 'Anita Sharma',
    district: 'Nellore',
    mandal: 'Gudur',
    budget: 2500000,
    status: 'PROPOSAL_SENT',
    progress_notes: null,
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
    key: 'company_name',
    label: 'Company',
    sortable: true,
  },
  {
    key: 'project_name',
    label: 'Project',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline">{value}</Badge>
    ),
  },
  {
    key: 'contact_person',
    label: 'Contact Person',
    sortable: true,
  },
  {
    key: 'district',
    label: 'District',
    sortable: true,
  },
  {
    key: 'budget',
    label: 'Budget',
    render: (value: number) => `₹${(value / 100000).toFixed(1)}L`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
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
    key: 'mandal',
    label: 'Mandal',
    type: 'select' as const,
    options: [
      { value: 'Nellore Rural', label: 'Nellore Rural' },
      { value: 'Gudur', label: 'Gudur' },
      { value: 'Kavali', label: 'Kavali' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'LEAD', label: 'Lead' },
      { value: 'DUE_DILIGENCE', label: 'Due Diligence' },
      { value: 'PROPOSAL_SENT', label: 'Proposal Sent' },
      { value: 'MOU_SIGNED', label: 'MoU Signed' },
      { value: 'IN_EXECUTION', label: 'In Execution' },
      { value: 'MILESTONES_APPROVED', label: 'Milestones Approved' },
      { value: 'CLOSED', label: 'Closed' },
    ],
  },
];

const savedViews = [
  { id: 'pending-mou', name: 'Pending MoU', filters: {} },
  { id: 'high-budget', name: 'High Budget (>50L)', filters: {} },
  { id: 'execution-phase', name: 'In Execution', filters: {} },
];

export default function CSRIndustrial() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockCSRIndustrial);

  const handleRowClick = (record: any) => {
    navigate(`/admin/csr-industrial/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/csr-industrial/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="CSR & Industrial"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New CSR Project"
      searchPlaceholder="Search by ID, company name..."
    />
  );
}