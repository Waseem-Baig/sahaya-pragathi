import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordList } from '@/components/shared/RecordList';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const mockPrograms = [
  {
    id: 'PRG-AP-NLR-2025-000001',
    event_name: 'Mega Job Mela - IT Sector',
    type: 'job_mela',
    date_range: '2025-02-15 to 2025-02-17',
    venue: 'Vijayawada Convention Center',
    partners: ['TCS', 'Infosys', 'Wipro'],
    registrations: 2500,
    status: 'REGISTRATION',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'PRG-AP-NLR-2025-000002',
    event_name: 'Skill Development Program',
    type: 'program',
    date_range: '2025-03-01 to 2025-03-05',
    venue: 'Nellore Technical Institute',
    partners: ['NASSCOM', 'FICCI'],
    registrations: 150,
    status: 'PLANNED',
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
    key: 'event_name',
    label: 'Event Name',
    sortable: true,
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (value: string) => (
      <Badge variant={value === 'job_mela' ? 'default' : 'secondary'}>
        {value.replace('_', ' ').toUpperCase()}
      </Badge>
    ),
  },
  {
    key: 'date_range',
    label: 'Date Range',
    sortable: true,
  },
  {
    key: 'venue',
    label: 'Venue',
    sortable: true,
  },
  {
    key: 'partners',
    label: 'Partners',
    render: (value: string[]) => (
      <div className="flex flex-wrap gap-1">
        {value.slice(0, 2).map(partner => (
          <Badge key={partner} variant="outline" className="text-xs">
            {partner}
          </Badge>
        ))}
        {value.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{value.length - 2} more
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: 'registrations',
    label: 'Registrations',
    render: (value: number) => (
      <Badge variant="secondary">{value}</Badge>
    ),
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
    key: 'type',
    label: 'Type',
    type: 'select' as const,
    options: [
      { value: 'job_mela', label: 'Job Mela' },
      { value: 'program', label: 'Program' },
    ],
  },
  {
    key: 'venue',
    label: 'Venue',
    type: 'select' as const,
    options: [
      { value: 'Vijayawada Convention Center', label: 'Vijayawada Convention Center' },
      { value: 'Nellore Technical Institute', label: 'Nellore Technical Institute' },
      { value: 'Tirupati Auditorium', label: 'Tirupati Auditorium' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'PLANNED', label: 'Planned' },
      { value: 'REGISTRATION', label: 'Registration Open' },
      { value: 'SCREENING', label: 'Screening' },
      { value: 'SELECTION', label: 'Selection' },
      { value: 'OFFER', label: 'Offer Phase' },
      { value: 'JOINED', label: 'Joined' },
      { value: 'REPORTING_CLOSED', label: 'Reporting Closed' },
    ],
  },
];

const savedViews = [
  { id: 'upcoming-events', name: 'Upcoming Events', filters: {} },
  { id: 'high-registrations', name: 'High Registrations (>1000)', filters: {} },
  { id: 'job-melas-only', name: 'Job Melas Only', filters: {} },
];

export default function Programs() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockPrograms);

  const handleRowClick = (record: any) => {
    navigate(`/admin/programs/${record.id}`);
  };

  const handleNew = () => {
    navigate('/admin/programs/new');
  };

  const handleBatchAction = (action: string, selectedIds: string[]) => {
    console.log(`Batch ${action} for:`, selectedIds);
    // Handle batch actions here
  };

  return (
    <RecordList
      title="Programs & Job Melas"
      data={data}
      columns={columns}
      filters={filters}
      savedViews={savedViews}
      loading={false}
      onRowClick={handleRowClick}
      onNew={handleNew}
      onBatchAction={handleBatchAction}
      newButtonText="New Program/Event"
      searchPlaceholder="Search by ID, event name..."
    />
  );
}