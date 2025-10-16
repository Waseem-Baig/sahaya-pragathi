import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkApprovalModalProps {
  open: boolean;
  onClose: () => void;
}

interface PendingApproval {
  id: string;
  type: string;
  title: string;
  applicant: string;
  amount?: number;
  priority: string;
  dueDate: string;
  canApprove: boolean;
}

const mockPendingApprovals: PendingApproval[] = [
  {
    id: 'CMR-2024-001',
    type: 'CMR',
    title: 'Medical assistance for heart surgery',
    applicant: 'Rajesh Kumar',
    amount: 250000,
    priority: 'P1',
    dueDate: '2024-01-15',
    canApprove: true,
  },
  {
    id: 'EDU-2024-002',
    type: 'Education',
    title: 'Fee concession for engineering',
    applicant: 'Priya Sharma',
    priority: 'P2',
    dueDate: '2024-01-18',
    canApprove: true,
  },
  {
    id: 'TDL-2024-003',
    type: 'Temple',
    title: 'VIP darshan letter - Tirupati',
    applicant: 'Suresh Reddy',
    priority: 'P3',
    dueDate: '2024-01-12',
    canApprove: false, // Example of item that can't be approved due to missing docs
  },
  {
    id: 'CSR-2024-004',
    type: 'CSR',
    title: 'School infrastructure project',
    applicant: 'ABC Foundation',
    amount: 5000000,
    priority: 'P4',
    dueDate: '2024-01-25',
    canApprove: true,
  },
];

export const BulkApprovalModal = ({ open, onClose }: BulkApprovalModalProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const approvableIds = mockPendingApprovals
        .filter(item => item.canApprove)
        .map(item => item.id);
      setSelectedItems(approvableIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) return;

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Bulk Approval Completed",
        description: `Successfully approved ${selectedItems.length} items`,
      });
      
      setSelectedItems([]);
      onClose();
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to process bulk approvals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'destructive';
      case 'P2': return 'warning';
      case 'P3': return 'default';
      case 'P4': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CMR': return 'bg-red-100 text-red-800';
      case 'Education': return 'bg-green-100 text-green-800';
      case 'Temple': return 'bg-orange-100 text-orange-800';
      case 'CSR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const approvableCount = mockPendingApprovals.filter(item => item.canApprove).length;
  const selectedCount = selectedItems.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Approval</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Pending Approvals</p>
                    <p className="text-2xl font-bold">{mockPendingApprovals.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Ready to Approve</p>
                    <p className="text-2xl font-bold">{approvableCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Blocked</p>
                    <p className="text-2xl font-bold">
                      {mockPendingApprovals.length - approvableCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selection Controls */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedItems.length === approvableCount && approvableCount > 0}
                    onCheckedChange={handleSelectAll}
                    disabled={approvableCount === 0}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All Approvable ({approvableCount})
                  </label>
                </div>
                <Badge variant="outline">
                  {selectedCount} of {approvableCount} selected
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Items List */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 p-4">
                  {mockPendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-4 p-3 border rounded-lg ${
                        !item.canApprove ? 'bg-red-50 border-red-200' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        disabled={!item.canApprove}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{item.id}</span>
                          <Badge className={getTypeColor(item.type)} variant="secondary">
                            {item.type}
                          </Badge>
                          <Badge variant={getPriorityColor(item.priority) as any}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.applicant} • Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {item.amount && (
                        <div className="text-right">
                          <p className="text-sm font-medium">₹{item.amount.toLocaleString()}</p>
                        </div>
                      )}
                      
                      {!item.canApprove && (
                        <div className="text-right">
                          <Badge variant="destructive" className="text-xs">
                            Missing Docs
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <div className="space-x-2">
            <Button
              onClick={handleBulkApprove}
              disabled={selectedItems.length === 0 || processing}
              className="flex items-center gap-2"
            >
              {processing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Approve Selected ({selectedCount})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};