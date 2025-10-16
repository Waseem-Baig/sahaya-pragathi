import { useState } from 'react';
import { RoleSelector } from '@/components/RoleSelector';
import { CitizenPortal } from '@/components/CitizenPortal';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { LeadershipCockpit } from '@/components/LeadershipCockpit';

type UserRole = 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN' | 'L3_CITIZEN' | null;

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleBackToSelection = () => {
    setSelectedRole(null);
  };

  if (!selectedRole) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  if (selectedRole === 'L3_CITIZEN') {
    return <CitizenPortal onBack={handleBackToSelection} />;
  }

  if (selectedRole === 'L2_EXEC_ADMIN') {
    return <ExecutiveDashboard onBack={handleBackToSelection} />;
  }

  if (selectedRole === 'L1_MASTER_ADMIN') {
    return <LeadershipCockpit onBack={handleBackToSelection} />;
  }

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
};

export default Index;
