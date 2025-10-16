import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Upload, 
  Eye, 
  Download,
  AlertTriangle,
  User,
  Users
} from 'lucide-react';
import { FileUpload } from '@/components/shared/FileUpload';
import { useToast } from '@/hooks/use-toast';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: 'PENDING' | 'STAGE_1_APPROVED' | 'STAGE_1_REJECTED' | 'STAGE_2_APPROVED' | 'STAGE_2_REJECTED' | 'VERIFIED';
  stage1Reviewer?: string;
  stage1ReviewedAt?: Date;
  stage1Comments?: string;
  stage2Reviewer?: string;
  stage2ReviewedAt?: Date;
  stage2Comments?: string;
  url?: string;
}

interface VerificationCase {
  id: string;
  caseId: string;
  caseType: string;
  citizenName: string;
  currentStage: 1 | 2;
  overallStatus: 'INITIAL_WORK' | 'STAGE_1_REVIEW' | 'STAGE_2_REVIEW' | 'VERIFIED' | 'REJECTED';
  documents: DocumentItem[];
  assignedTo: string;
  createdAt: Date;
  stage1CompletedAt?: Date;
  stage2CompletedAt?: Date;
}

interface TwoStageVerificationProps {
  userRole: 'L1_MASTER_ADMIN' | 'L2_EXEC_ADMIN';
  userId: string;
}

export function TwoStageVerification({ userRole, userId }: TwoStageVerificationProps) {
  const { toast } = useToast();
  
  const [verificationCases, setVerificationCases] = useState<VerificationCase[]>([
    {
      id: 'VER-001',
      caseId: 'GRV-AP-NLR-2025-000123-X4',
      caseType: 'Grievance',
      citizenName: 'Ram Kumar',
      currentStage: 1,
      overallStatus: 'STAGE_1_REVIEW',
      assignedTo: 'Ravi Kumar',
      createdAt: new Date('2025-01-15'),
      documents: [
        {
          id: 'DOC-001',
          name: 'Identity_Proof.pdf',
          type: 'pdf',
          size: 2048576,
          uploadedAt: new Date('2025-01-15'),
          status: 'STAGE_1_APPROVED',
          stage1Reviewer: 'Executive Admin',
          stage1ReviewedAt: new Date('2025-01-16'),
          stage1Comments: 'Document verified and approved'
        },
        {
          id: 'DOC-002',
          name: 'Address_Proof.jpg',
          type: 'image',
          size: 1536000,
          uploadedAt: new Date('2025-01-15'),
          status: 'PENDING'
        }
      ]
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<VerificationCase | null>(null);
  const [reviewComments, setReviewComments] = useState<string>('');

  const getStageProgress = (caseItem: VerificationCase) => {
    if (caseItem.overallStatus === 'VERIFIED') return 100;
    if (caseItem.overallStatus === 'STAGE_2_REVIEW' || caseItem.stage1CompletedAt) return 66;
    if (caseItem.overallStatus === 'STAGE_1_REVIEW') return 33;
    return 10;
  };

  const getStatusIcon = (status: DocumentItem['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'STAGE_1_APPROVED':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'STAGE_1_REJECTED':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'STAGE_2_APPROVED':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'STAGE_2_REJECTED':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'VERIFIED':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleDocumentReview = (documentId: string, approved: boolean) => {
    if (!selectedCase) return;

    const isStage1 = selectedCase.currentStage === 1;
    const newStatus = approved 
      ? (isStage1 ? 'STAGE_1_APPROVED' : 'STAGE_2_APPROVED')
      : (isStage1 ? 'STAGE_1_REJECTED' : 'STAGE_2_REJECTED');

    setVerificationCases(prev => prev.map(caseItem => 
      caseItem.id === selectedCase.id
        ? {
            ...caseItem,
            documents: caseItem.documents.map(doc => 
              doc.id === documentId
                ? {
                    ...doc,
                    status: newStatus,
                    ...(isStage1 ? {
                      stage1Reviewer: 'Current User',
                      stage1ReviewedAt: new Date(),
                      stage1Comments: reviewComments
                    } : {
                      stage2Reviewer: 'Current User',
                      stage2ReviewedAt: new Date(),
                      stage2Comments: reviewComments
                    })
                  }
                : doc
            )
          }
        : caseItem
    ));

    toast({
      title: approved ? "Document Approved" : "Document Rejected",
      description: `Document has been ${approved ? 'approved' : 'rejected'} for stage ${selectedCase.currentStage}`
    });

    setReviewComments('');
  };

  const handleStageComplete = () => {
    if (!selectedCase) return;

    const allDocsApproved = selectedCase.documents.every(doc => 
      selectedCase.currentStage === 1 
        ? doc.status === 'STAGE_1_APPROVED'
        : doc.status === 'STAGE_2_APPROVED'
    );

    if (!allDocsApproved) {
      toast({
        title: "Cannot Complete Stage",
        description: "All documents must be reviewed and approved to complete this stage",
        variant: "destructive"
      });
      return;
    }

    setVerificationCases(prev => prev.map(caseItem => 
      caseItem.id === selectedCase.id
        ? {
            ...caseItem,
            currentStage: selectedCase.currentStage === 1 ? 2 : 2,
            overallStatus: selectedCase.currentStage === 1 ? 'STAGE_2_REVIEW' : 'VERIFIED',
            ...(selectedCase.currentStage === 1 ? { stage1CompletedAt: new Date() } : { stage2CompletedAt: new Date() })
          }
        : caseItem
    ));

    toast({
      title: "Stage Completed",
      description: `Stage ${selectedCase.currentStage} verification completed successfully`
    });
  };

  const pendingStage1 = verificationCases.filter(c => c.currentStage === 1 && c.overallStatus === 'STAGE_1_REVIEW').length;
  const pendingStage2 = verificationCases.filter(c => c.currentStage === 2 && c.overallStatus === 'STAGE_2_REVIEW').length;
  const completed = verificationCases.filter(c => c.overallStatus === 'VERIFIED').length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm font-medium">Stage 1 Pending</p>
                <p className="text-2xl font-bold">{pendingStage1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Stage 2 Pending</p>
                <p className="text-2xl font-bold">{pendingStage2}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-2xl font-bold">{completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cases">Verification Cases</TabsTrigger>
          <TabsTrigger value="review">Document Review</TabsTrigger>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cases in Verification Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationCases.map((caseItem) => (
                  <div key={caseItem.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{caseItem.caseId}</h4>
                        <p className="text-sm text-muted-foreground">
                          {caseItem.citizenName} - {caseItem.caseType}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={caseItem.overallStatus === 'VERIFIED' ? 'success' : 'secondary'}>
                          Stage {caseItem.currentStage}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedCase(caseItem)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Verification Progress</span>
                        <span>{getStageProgress(caseItem)}%</span>
                      </div>
                      <Progress value={getStageProgress(caseItem)} className="h-2" />
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Assigned: {caseItem.assignedTo}</span>
                      <span>Documents: {caseItem.documents.length}</span>
                      <span>Created: {caseItem.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {selectedCase ? (
            <Card>
              <CardHeader>
                <CardTitle>Document Review - {selectedCase.caseId}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Stage {selectedCase.currentStage} Verification
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCase.documents.map((document) => (
                  <div key={document.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(document.size / 1024 / 1024).toFixed(2)} MB • Uploaded {document.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(document.status)}
                        <Badge variant={document.status.includes('APPROVED') ? 'success' : 
                                       document.status.includes('REJECTED') ? 'destructive' : 'secondary'}>
                          {document.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    {document.status === 'PENDING' && (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          placeholder="Add review comments..."
                          value={reviewComments}
                          onChange={(e) => setReviewComments(e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleDocumentReview(document.id, true)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDocumentReview(document.id, false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Show review history */}
                    {(document.stage1Comments || document.stage2Comments) && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <h5 className="text-sm font-medium mb-2">Review History</h5>
                        {document.stage1Comments && (
                          <div className="text-xs space-y-1">
                            <p><strong>Stage 1:</strong> {document.stage1Comments}</p>
                            <p className="text-muted-foreground">
                              By {document.stage1Reviewer} on {document.stage1ReviewedAt?.toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {document.stage2Comments && (
                          <div className="text-xs space-y-1 mt-2">
                            <p><strong>Stage 2:</strong> {document.stage2Comments}</p>
                            <p className="text-muted-foreground">
                              By {document.stage2Reviewer} on {document.stage2ReviewedAt?.toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Button onClick={handleStageComplete} className="w-full">
                    Complete Stage {selectedCase.currentStage} Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a case to review documents</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents for Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  All uploaded documents will go through a 2-stage verification process. 
                  Stage 1 is reviewed by Executive Admin, Stage 2 by Master Admin.
                </AlertDescription>
              </Alert>
              
              <FileUpload
                maxFiles={10}
                maxSizePerFile={20 * 1024 * 1024}
                acceptedTypes={[
                  'application/pdf',
                  'image/jpeg',
                  'image/png', 
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ]}
                onFilesChange={(files) => {
                  toast({
                    title: "Documents uploaded",
                    description: `${files.length} documents uploaded for verification`
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}