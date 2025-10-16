import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Scale, 
  Church, 
  Heart, 
  GraduationCap, 
  Building2, 
  Calendar,
  User,
  Phone,
  Mail
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { GrievanceForm } from "./forms/GrievanceForm";
import { TempleLetterForm } from "./forms/TempleLetterForm";
import { CMRFForm } from "./forms/CMRFForm";
import { CaseCard } from "./dashboard/CaseCard";
import type { GrievanceFormData, TempleLetterFormData, CMRFFormData } from "@/types/government";

interface CitizenPortalProps {
  onBack: () => void;
}

export function CitizenPortal({ onBack }: CitizenPortalProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'grievance' | 'temple' | 'cmrf'>('dashboard');
  const [submittedCases, setSubmittedCases] = useState<(GrievanceFormData | TempleLetterFormData | CMRFFormData)[]>([]);
  const services = [
    {
      id: 'grievance',
      title: 'Submit Grievance',
      description: 'Report issues with government services, infrastructure, or citizen concerns',
      icon: FileText,
      color: 'from-primary to-primary-hover',
    },
    {
      id: 'dispute',
      title: 'Dispute Resolution',
      description: 'Mediation services for land, society, or benefit disputes',
      icon: Scale,
      color: 'from-info to-info/80',
    },
    {
      id: 'temple',
      title: 'Temple Darshan Letter',
      description: 'Request VIP or General darshan letters for government temples',
      icon: Church,
      color: 'from-warning to-warning/80',
    },
    {
      id: 'cmrf',
      title: 'CM Relief Fund',
      description: 'Apply for medical treatment support and hospital recommendations',
      icon: Heart,
      color: 'from-destructive to-destructive/80',
    },
    {
      id: 'education',
      title: 'Education Support',
      description: 'Request education recommendations and fee concessions',
      icon: GraduationCap,
      color: 'from-success to-success/80',
    },
    {
      id: 'csr',
      title: 'CSR & Industrial Relations',
      description: 'Corporate social responsibility projects and tender information',
      icon: Building2,
      color: 'from-primary to-info',
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'grievance') setCurrentView('grievance');
    if (serviceId === 'temple') setCurrentView('temple');
    if (serviceId === 'cmrf') setCurrentView('cmrf');
  };

  const handleFormSubmit = (data: GrievanceFormData | TempleLetterFormData | CMRFFormData) => {
    setSubmittedCases(prev => [data, ...prev]);
    setCurrentView('dashboard');
    // Here you would typically send to API
    console.log('Submitted:', data);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'grievance') {
    return <GrievanceForm onBack={handleBackToDashboard} onSubmit={handleFormSubmit} />;
  }

  if (currentView === 'temple') {
    return <TempleLetterForm onBack={handleBackToDashboard} onSubmit={handleFormSubmit} />;
  }

  if (currentView === 'cmrf') {
    return <CMRFForm onBack={handleBackToDashboard} onSubmit={handleFormSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Citizen Portal</h1>
            <p className="text-muted-foreground">Access government services and track your requests</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Change Role
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="shadow-card border-primary/20">
            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Most commonly used services
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="government" size="lg" className="h-16 flex-col">
                  <FileText className="h-6 w-6 mb-1" />
                  New Grievance
                </Button>
                <Button variant="outline" size="lg" className="h-16 flex-col">
                  <Calendar className="h-6 w-6 mb-1" />
                  Book Appointment
                </Button>
                <Button variant="outline" size="lg" className="h-16 flex-col">
                  <Phone className="h-6 w-6 mb-1" />
                  Emergency Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Available Services</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card 
                    key={service.id}
                    className="relative overflow-hidden hover:shadow-elevated transition-smooth cursor-pointer group"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-smooth`} />
                    <CardHeader className="relative z-10 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-gradient-card shadow-card">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <Button variant="ghost" size="sm">
                          Apply →
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Requests */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">My Recent Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submittedCases.length > 0 ? (
                  <>
                    {submittedCases.slice(0, 3).map((case_) => (
                      <CaseCard 
                        key={case_.id} 
                        case={case_} 
                        showActions={false}
                        userRole="L3"
                      />
                    ))}
                    {submittedCases.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All {submittedCases.length} Requests
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No requests submitted yet</p>
                    <p className="text-xs">Submit your first request to see it here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Helpline: 1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@gov.ap.in</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Live Chat Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}