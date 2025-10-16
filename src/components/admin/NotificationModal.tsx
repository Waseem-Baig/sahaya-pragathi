import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}

const channels = [
  { value: 'sms', label: 'SMS', icon: Phone, cost: '₹0.50 per message' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, cost: '₹0.25 per message' },
  { value: 'email', label: 'Email', icon: Mail, cost: 'Free' },
];

const templates = {
  sms: [
    {
      id: 'status_update',
      name: 'Status Update',
      content: 'Dear {name}, your {type} request {id} status has been updated to {status}. For details, visit our office or call us.',
    },
    {
      id: 'appointment_confirmation',
      name: 'Appointment Confirmation',
      content: 'Hi {name}, your appointment on {date} at {time} is confirmed. Venue: {venue}. Please bring required documents.',
    },
    {
      id: 'document_required',
      name: 'Document Required',
      content: 'Dear {name}, additional documents needed for {id}. Please submit: {documents}. Contact us for queries.',
    },
  ],
  whatsapp: [
    {
      id: 'status_update_wa',
      name: 'Status Update',
      content: 'Hello {name}! 👋\n\nYour {type} request *{id}* has been updated:\n\n📋 Status: *{status}*\n📅 Date: {date}\n\nThank you for your patience!',
    },
    {
      id: 'approval_notification',
      name: 'Approval Notification',
      content: '🎉 Great news {name}!\n\nYour {type} application *{id}* has been *APPROVED*.\n\n📋 Next steps: {next_steps}\n📞 Contact: {contact}',
    },
  ],
  email: [
    {
      id: 'detailed_update',
      name: 'Detailed Status Update',
      content: 'Subject: Update on your {type} request {id}\n\nDear {name},\n\nWe are writing to inform you about the status of your {type} request {id}.\n\nCurrent Status: {status}\nLast Updated: {date}\nAssigned Officer: {officer}\n\nNext Steps: {next_steps}\n\nIf you have any questions, please feel free to contact us.\n\nBest regards,\nPolitical Office Team',
    },
  ],
};

export const NotificationModal = ({ open, onClose }: NotificationModalProps) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [recipients, setRecipients] = useState<string>('');
  const { toast } = useToast();

  const handleSend = async () => {
    if (!selectedChannel || (!selectedTemplate && !customMessage) || !recipients) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const recipientCount = recipients.split(',').length;
      
      toast({
        title: "Notification Sent",
        description: `Successfully sent ${selectedChannel} to ${recipientCount} recipient(s)`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSelectedTemplate = () => {
    if (!selectedChannel || !selectedTemplate) return null;
    return templates[selectedChannel as keyof typeof templates]?.find(t => t.id === selectedTemplate);
  };

  const selectedTemplateData = getSelectedTemplate();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-auto">
          {/* Channel Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {channels.map((channel) => (
                  <div
                    key={channel.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                      selectedChannel === channel.value ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedChannel(channel.value)}
                  >
                    <div className="flex items-center gap-3">
                      <channel.icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{channel.label}</p>
                        <p className="text-xs text-muted-foreground">{channel.cost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          {selectedChannel && (
            <Card>
              <CardHeader>
                <CardTitle>Message Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template">Choose Template</Label>
                  <Select onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template or write custom message" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates[selectedChannel as keyof typeof templates]?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate && selectedTemplateData ? (
                  <div className="space-y-2">
                    <Label>Template Preview</Label>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      {selectedTemplateData.content}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Available variables: {'{name}'}, {'{id}'}, {'{status}'}, {'{date}'}, {'{time}'}, {'{venue}'}, {'{type}'}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="customMessage">Custom Message</Label>
                    <Textarea
                      id="customMessage"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Write your custom message here..."
                      rows={4}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="recipients">
                  {selectedChannel === 'email' ? 'Email Addresses' : 'Phone Numbers'}
                </Label>
                <Textarea
                  id="recipients"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder={
                    selectedChannel === 'email' 
                      ? 'Enter email addresses separated by commas...' 
                      : 'Enter phone numbers separated by commas...'
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple recipients with commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cost Estimation */}
          {selectedChannel && recipients && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Cost:</span>
                  <Badge variant="outline">
                    {selectedChannel === 'email' 
                      ? 'Free' 
                      : `₹${(recipients.split(',').length * (selectedChannel === 'sms' ? 0.5 : 0.25)).toFixed(2)}`
                    }
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {recipients.split(',').length} recipient(s) via {selectedChannel.toUpperCase()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <Button onClick={handleSend}>
            Send Notification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};