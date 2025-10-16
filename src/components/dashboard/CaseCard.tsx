import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { GrievanceFormData, TempleLetterFormData, CMRFFormData } from "@/types/government";

interface CaseCardProps {
  case: GrievanceFormData | TempleLetterFormData | CMRFFormData;
  onViewDetails?: (id: string) => void;
  onTakeAction?: (id: string) => void;
  showActions?: boolean;
  userRole?: 'L1' | 'L2' | 'L3';
}

export function CaseCard({ case: caseData, onViewDetails, onTakeAction, showActions = true, userRole = 'L3' }: CaseCardProps) {
  const getCaseTypeLabel = (id: string) => {
    if (id.startsWith('GRV')) return 'Grievance';
    if (id.startsWith('TDL')) return 'Temple Letter';
    if (id.startsWith('CMR')) return 'CMRF';
    if (id.startsWith('DSP')) return 'Dispute';
    if (id.startsWith('EDU')) return 'Education';
    if (id.startsWith('CSR')) return 'CSR';
    return 'Unknown';
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    return (
      <Badge 
        variant={
          priority === 'P1' ? 'destructive' : 
          priority === 'P2' ? 'warning' : 
          priority === 'P3' ? 'info' : 'secondary'
        }
        className="text-xs"
      >
        {priority}
      </Badge>
    );
  };

  const getSLAInfo = (caseData: any) => {
    if (!caseData.priority) return null;
    
    const slaHours = {
      'P1': 48,
      'P2': 120, // 5 days
      'P3': 240, // 10 days
      'P4': 480, // 20 days
    }[caseData.priority] || 240;
    
    const createdAt = new Date(caseData.createdAt);
    const now = new Date();
    const hoursElapsed = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
    const hoursRemaining = slaHours - hoursElapsed;
    
    const isBreached = hoursRemaining < 0;
    const isNearBreach = hoursRemaining < 24 && hoursRemaining > 0;
    
    return {
      hoursRemaining: Math.abs(hoursRemaining),
      isBreached,
      isNearBreach,
      slaHours
    };
  };

  const getMainInfo = (caseData: any) => {
    if (caseData.id.startsWith('GRV')) {
      return {
        title: caseData.citizenName || 'Grievance',
        subtitle: caseData.category || 'General',
        location: `${caseData.ward || 'Unknown'}, ${caseData.mandal || 'Unknown'}`,
        assignee: caseData.assignedTo || 'Unassigned'
      };
    }
    
    if (caseData.id.startsWith('TDL')) {
      return {
        title: caseData.primaryApplicantName || 'Temple Letter',
        subtitle: `${caseData.letterType || 'General'} Darshan`,
        location: caseData.templeCode || 'Unknown Temple',
        assignee: caseData.assignedTo || 'Under Review'
      };
    }
    
    if (caseData.id.startsWith('CMR')) {
      return {
        title: caseData.patientName || 'CMRF Application',
        subtitle: caseData.medicalCondition || 'Medical Support',
        location: caseData.hospitalCode || 'Unknown Hospital',
        assignee: caseData.assignedTo || 'Under Review'
      };
    }
    
    return {
      title: 'Case',
      subtitle: 'Unknown Type',
      location: 'Unknown',
      assignee: 'Unassigned'
    };
  };

  const slaInfo = getSLAInfo(caseData);
  const mainInfo = getMainInfo(caseData);
  const caseType = getCaseTypeLabel(caseData.id);

  return (
    <Card className="hover:shadow-card transition-smooth">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {caseType}
            </Badge>
            {getPriorityBadge((caseData as any).priority)}
            {slaInfo && (
              <div className="flex items-center gap-1 text-xs">
                {slaInfo.isBreached ? (
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                ) : (
                  <Clock className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={slaInfo.isBreached ? 'text-destructive' : slaInfo.isNearBreach ? 'text-warning' : 'text-muted-foreground'}>
                  {slaInfo.isBreached ? `${slaInfo.hoursRemaining}h overdue` : `${slaInfo.hoursRemaining}h left`}
                </span>
              </div>
            )}
          </div>
          <StatusBadge status={caseData.status} />
        </div>
        
        <h4 className="font-semibold text-sm mb-1">{mainInfo.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{mainInfo.subtitle}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-4">
            <span>ID: {caseData.id}</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {mainInfo.location}
            </div>
          </div>
          {userRole !== 'L3' && (
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              <span>{mainInfo.assignee}</span>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails?.(caseData.id)}
            >
              View Details
            </Button>
            {userRole !== 'L3' && (
              <Button 
                variant="government" 
                size="sm"
                onClick={() => onTakeAction?.(caseData.id)}
              >
                Take Action
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}