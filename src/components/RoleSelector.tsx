import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, User } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN' | 'L3_CITIZEN') => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'L1_MASTER_ADMIN' as const,
      title: 'Master Admin',
      subtitle: 'Minister/MLA/MP',
      description: 'Strategic oversight, policy decisions, and high-level approvals',
      icon: Shield,
      gradient: 'from-primary to-primary-hover',
    },
    {
      id: 'L2_EXEC_ADMIN' as const,
      title: 'Executive Admin',
      subtitle: 'PA/PS/OSD',
      description: 'Operations management, case assignments, and day-to-day execution',
      icon: Users,
      gradient: 'from-info to-info/80',
    },
    {
      id: 'L3_CITIZEN' as const,
      title: 'Citizen Portal',
      subtitle: 'Public Access',
      description: 'Submit requests, track status, and manage appointments',
      icon: User,
      gradient: 'from-success to-success/80',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Government Citizen Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Centralized platform for citizen requests, grievance management, and government services
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id} 
                className="relative overflow-hidden hover:shadow-elevated transition-smooth cursor-pointer group"
                onClick={() => onRoleSelect(role.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-5 group-hover:opacity-10 transition-smooth`} />
                <CardHeader className="relative z-10 text-center pb-4">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-card shadow-card w-fit">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{role.title}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {role.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 text-center">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {role.description}
                  </p>
                  <Button variant="government" className="w-full">
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card max-w-2xl mx-auto">
            <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
            <p className="text-muted-foreground text-sm">
              All portals use role-based authentication with government-grade security. 
              Access is logged and monitored for compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}