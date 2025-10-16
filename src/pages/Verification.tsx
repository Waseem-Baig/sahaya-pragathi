import { TwoStageVerification } from '@/components/verification/TwoStageVerification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileCheck, Users } from 'lucide-react';

interface VerificationPageProps {
  userRole: 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN';
  userId?: string;
}

export default function Verification({ userRole = 'L2_EXEC_ADMIN', userId = 'current-user' }: VerificationPageProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Verification</h1>
          <p className="text-muted-foreground">
            Two-stage verification process for all citizen portal submissions
          </p>
        </div>
        <Badge variant={userRole === 'L1_MASTER_ADMIN' ? 'default' : 'secondary'}>
          {userRole === 'L1_MASTER_ADMIN' ? 'Stage 2 Reviewer' : 'Stage 1 Reviewer'}
        </Badge>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-primary" />
              Stage 1 Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Executive Admins perform initial document review, validation, and preliminary approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Users className="h-5 w-5 mr-2 text-info" />
              Stage 2 Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Master Admins provide final review and approval for complete verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Shield className="h-5 w-5 mr-2 text-success" />
              Quality Assurance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dual verification ensures accuracy, compliance, and maintains audit trail
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verification Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
              <h4 className="font-medium text-sm">Document Upload</h4>
              <p className="text-xs text-muted-foreground mt-1">Citizens upload required documents</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-info text-info-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
              <h4 className="font-medium text-sm">Stage 1 Review</h4>
              <p className="text-xs text-muted-foreground mt-1">Executive Admin validates documents</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-warning text-warning-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
              <h4 className="font-medium text-sm">Stage 2 Review</h4>
              <p className="text-xs text-muted-foreground mt-1">Master Admin final approval</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
              <h4 className="font-medium text-sm">Case Completion</h4>
              <p className="text-xs text-muted-foreground mt-1">Verified case ready for processing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Stage Verification Component */}
      <TwoStageVerification userRole={userRole} userId={userId} />
    </div>
  );
}