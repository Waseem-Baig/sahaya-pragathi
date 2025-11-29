import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Mail,
  AlertTriangle,
} from "lucide-react";
import { GrievanceForm } from "./forms/GrievanceForm";
import { TempleLetterForm } from "./forms/TempleLetterForm";
import { CMRFForm } from "./forms/CMRFForm";
import { DisputeForm } from "./forms/DisputeForm";
import { EducationSupportForm } from "./forms/EducationSupportForm";
import { CSRIndustrialForm } from "./forms/CSRIndustrialForm";
import { AppointmentBookingForm } from "./forms/AppointmentBookingForm";
import { EmergencySupportForm } from "./forms/EmergencySupportForm";

interface CitizenPortalProps {
  onBack: () => void;
}

export function CitizenPortal({ onBack }: CitizenPortalProps) {
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "grievance"
    | "temple"
    | "cmrf"
    | "dispute"
    | "education"
    | "csr"
    | "appointment"
    | "emergency"
  >("dashboard");

  const services = [
    {
      id: "grievance",
      title: "Submit Grievance",
      description:
        "Report issues with government services, infrastructure, or citizen concerns",
      icon: FileText,
      color: "from-primary to-primary-hover",
    },
    {
      id: "appointment",
      title: "Book Appointment",
      description:
        "Schedule meetings with government officials and departments",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "emergency",
      title: "Emergency Support",
      description:
        "Request immediate assistance for medical, police, or disaster emergencies",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
    },
    {
      id: "dispute",
      title: "Dispute Resolution",
      description: "Mediation services for land, society, or benefit disputes",
      icon: Scale,
      color: "from-info to-info/80",
    },
    {
      id: "temple",
      title: "Temple Darshan Letter",
      description:
        "Request VIP or General darshan letters for government temples",
      icon: Church,
      color: "from-warning to-warning/80",
    },
    {
      id: "cmrf",
      title: "CM Relief Fund",
      description:
        "Apply for medical treatment support and hospital recommendations",
      icon: Heart,
      color: "from-destructive to-destructive/80",
    },
    {
      id: "education",
      title: "Education Support",
      description: "Request education recommendations and fee concessions",
      icon: GraduationCap,
      color: "from-success to-success/80",
    },
    {
      id: "csr",
      title: "CSR & Industrial Relations",
      description:
        "Corporate social responsibility projects and industrial support",
      icon: Building2,
      color: "from-primary to-info",
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    setCurrentView(serviceId as typeof currentView);
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  // Form routing
  if (currentView === "grievance") {
    return (
      <GrievanceForm
        onBack={handleBackToDashboard}
        onSubmit={handleBackToDashboard}
      />
    );
  }

  if (currentView === "temple") {
    return (
      <TempleLetterForm
        onBack={handleBackToDashboard}
        onSubmit={handleBackToDashboard}
      />
    );
  }

  if (currentView === "cmrf") {
    return <CMRFForm onBack={handleBackToDashboard} />;
  }

  if (currentView === "dispute") {
    return <DisputeForm onBack={handleBackToDashboard} />;
  }

  if (currentView === "education") {
    return (
      <EducationSupportForm
        onBack={handleBackToDashboard}
        onSubmit={handleBackToDashboard}
      />
    );
  }

  if (currentView === "csr") {
    return <CSRIndustrialForm onBack={handleBackToDashboard} />;
  }

  if (currentView === "appointment") {
    return <AppointmentBookingForm onBack={handleBackToDashboard} />;
  }

  if (currentView === "emergency") {
    return (
      <EmergencySupportForm
        onBack={handleBackToDashboard}
        onSubmit={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Citizen Portal
            </h1>
            <p className="text-muted-foreground">
              Access government services and track your requests
            </p>
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
                <Button
                  variant="government"
                  size="lg"
                  className="h-16 flex-col"
                  onClick={() => handleServiceClick("grievance")}
                >
                  <FileText className="h-6 w-6 mb-1" />
                  New Grievance
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 flex-col"
                  onClick={() => handleServiceClick("appointment")}
                >
                  <Calendar className="h-6 w-6 mb-1" />
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 flex-col border-red-200 hover:bg-red-50"
                  onClick={() => handleServiceClick("emergency")}
                >
                  <AlertTriangle className="h-6 w-6 mb-1 text-red-500" />
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
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-smooth`}
                    />
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
            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Total Services
                    </span>
                    <span className="font-semibold">{services.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Quick Access</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 font-semibold">
                      ● Online
                    </span>
                  </div>
                </div>
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
