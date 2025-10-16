import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockCMReliefFund = [
  {
    id: 'CMR-AP-NLR-2025-000001',
    patient_name: 'Ramesh Kumar',
    mobile: '9876543210',
    hospital_name: 'SVIMS Tirupati',
    illness_diagnosis: 'Heart Surgery',
    estimated_cost: 500000,
    sanctioned_amount: 300000,
    status: 'SANCTIONED',
    district: 'Nellore',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'CMR-AP-NLR-2025-000002',
    patient_name: 'Lakshmi Devi',
    mobile: '9876543211',
    hospital_name: 'KIMS Nellore',
    illness_diagnosis: 'Kidney Treatment',
    estimated_cost: 300000,
    sanctioned_amount: null,
    status: 'DOCS_VERIFIED',
    district: 'Nellore',
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
    key: 'patient_name',
    label: 'Patient',
    sortable: true,
  },
  {
    key: 'hospital_name',
    label: 'Hospital',
    sortable: true,
  },
  {
    key: 'illness_diagnosis',
    label: 'Diagnosis',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline">{value}</Badge>
    ),
  },
  {
    key: 'estimated_cost',
    label: 'Estimated Cost',
    render: (value: number) => `₹${value?.toLocaleString() || 0}`,
  },
  {
    key: 'sanctioned_amount',
    label: 'Sanctioned',
    render: (value: number) => value ? `₹${value.toLocaleString()}` : 'Pending',
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: 'district',
    label: 'District',
    sortable: true,
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
    key: 'hospital_name',
    label: 'Hospital',
    type: 'select' as const,
    options: [
      { value: 'SVIMS Tirupati', label: 'SVIMS Tirupati' },
      { value: 'KIMS Nellore', label: 'KIMS Nellore' },
      { value: 'AIIMS Mangalagiri', label: 'AIIMS Mangalagiri' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'INTAKE', label: 'Intake' },
      { value: 'DOCS_VERIFIED', label: 'Documents Verified' },
      { value: 'SANCTION_REQUESTED', label: 'Sanction Requested' },
      { value: 'SANCTIONED', label: 'Sanctioned' },
      { value: 'DISBURSED', label: 'Disbursed' },
      { value: 'CLOSED', label: 'Closed' },
    ],
  },
];

const savedViews = [
  { id: 'pending-sanction', name: 'Pending Sanction', filters: {} },
  { id: 'high-amount', name: 'High Amount (>5L)', filters: {} },
  { id: 'disbursement-due', name: 'Disbursement Due', filters: {} },
];

export default function CMRelief() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockCMReliefFund);

  const handleRowClick = (record: any) => {
    navigate(`/admin/cm-relief/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/cm-relief/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="CM Relief Fund"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New CM Relief Request"
      searchPlaceholder="Search by ID, patient name..."
    />
  );
}