import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Scale,
  Building2,
  Heart,
  GraduationCap,
  Factory,
  Calendar,
  Users,
} from 'lucide-react';

interface ModuleSelectorProps {
  selectedModule: string;
  onSelect: (module: string) => void;
}

const modules = [
  {
    id: 'grievance',
    title: 'Grievance',
    description: 'Citizen complaints and issues',
    icon: MessageSquare,
    color: 'bg-blue-500',
    avgSLA: '48 hours',
  },
  {
    id: 'dispute',
    title: 'Dispute Resolution',
    description: 'Mediation and conflict resolution',
    icon: Scale,
    color: 'bg-purple-500',
    avgSLA: '7 days',
  },
  {
    id: 'temple',
    title: 'Temple Darshan Letter',
    description: 'Temple visit permits and quotas',
    icon: Building2,
    color: 'bg-orange-500',
    avgSLA: '24 hours',
  },
  {
    id: 'cmr',
    title: 'CM Relief Fund',
    description: 'Medical assistance applications',
    icon: Heart,
    color: 'bg-red-500',
    avgSLA: '72 hours',
  },
  {
    id: 'education',
    title: 'Education Support',
    description: 'Student assistance and recommendations',
    icon: GraduationCap,
    color: 'bg-green-500',
    avgSLA: '5 days',
  },
  {
    id: 'csr',
    title: 'CSR & Industrial',
    description: 'Corporate partnerships and projects',
    icon: Factory,
    color: 'bg-indigo-500',
    avgSLA: '14 days',
  },
  {
    id: 'appointment',
    title: 'Appointments',
    description: 'Meeting scheduling and management',
    icon: Calendar,
    color: 'bg-teal-500',
    avgSLA: '2 hours',
  },
  {
    id: 'program',
    title: 'Programs/Job Melas',
    description: 'Events and employment programs',
    icon: Users,
    color: 'bg-pink-500',
    avgSLA: '10 days',
  },
];

export const ModuleSelector = ({ selectedModule, onSelect }: ModuleSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Module</h3>
        <p className="text-muted-foreground mb-4">
          Choose the type of task you want to create. Each module has different fields and workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedModule === module.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelect(module.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${module.color} text-white`}>
                  <module.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {module.avgSLA}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="text-base mb-2">{module.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};