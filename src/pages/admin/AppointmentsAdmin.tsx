import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockAppointments = [
  {
    id: 'APP-AP-NLR-2025-000001',
    applicant_name: 'Suresh Reddy',
    contact: '9876543210',
    purpose: 'Discussion on infrastructure project',
    preferred_date: '2025-01-25',
    preferred_time: '10:00',
    confirmed_slot: '2025-01-25T10:00:00Z',
    meeting_place: 'Chief Minister Office',
    status: 'CONFIRMED',
    assigned_to: 'Secretary',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'APP-AP-NLR-2025-000002',
    applicant_name: 'Meera Devi',
    contact: '9876543211',
    purpose: 'Personal grievance discussion',
    preferred_date: '2025-01-28',
    preferred_time: '14:00',
    confirmed_slot: null,
    meeting_place: null,
    status: 'REQUESTED',
    assigned_to: null,
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
    key: 'purpose',
    label: 'Purpose',
    sortable: true,
    render: (value: string) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    ),
  },
  {
    key: 'preferred_date',
    label: 'Preferred Date',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'confirmed_slot',
    label: 'Confirmed Slot',
    render: (value: string) => value ? (
      <Badge variant="default">
        {new Date(value).toLocaleString()}
      </Badge>
    ) : (
      <Badge variant="outline">Pending</Badge>
    ),
  },
  {
    key: 'meeting_place',
    label: 'Venue',
    render: (value: string) => value || 'TBD',
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
    key: 'meeting_place',
    label: 'Venue',
    type: 'select' as const,
    options: [
      { value: 'Chief Minister Office', label: 'Chief Minister Office' },
      { value: 'Secretariat', label: 'Secretariat' },
      { value: 'District Collectorate', label: 'District Collectorate' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'REQUESTED', label: 'Requested' },
      { value: 'CONFIRMED', label: 'Confirmed' },
      { value: 'CHECKED_IN', label: 'Checked In' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'NO_SHOW', label: 'No Show' },
    ],
  },
];

const savedViews = [
  { id: 'todays-appointments', name: "Today's Appointments", filters: {} },
  { id: 'pending-confirmation', name: 'Pending Confirmation', filters: {} },
  { id: 'vip-appointments', name: 'VIP Appointments', filters: {} },
];

export default function AppointmentsAdmin() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockAppointments);

  const handleRowClick = (record: any) => {
    navigate(`/admin/appointments/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/appointments/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="Appointments"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New Appointment"
      searchPlaceholder="Search by ID, applicant name..."
    />
  );
}