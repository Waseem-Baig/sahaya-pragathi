import { MasterAdminShell } from './layout/MasterAdminShell';

interface LeadershipCockpitProps {
  onBack: () => void;
}

export function LeadershipCockpit({ onBack }: LeadershipCockpitProps) {
  return <MasterAdminShell />;
}