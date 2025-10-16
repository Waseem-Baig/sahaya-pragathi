import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  ArrowLeft,
  Plus,
  User,
  Building,
  Newspaper,
  Package
} from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { generateID } from "@/utils/idGenerator";

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: string;
  category?: string;
}

interface AppointmentSchedulerProps {
  onBack: () => void;
  userRole: 'L1' | 'L2' | 'L3';
  onAppointmentBook?: (appointment: any) => void;
}

export function AppointmentScheduler({ onBack, userRole, onAppointmentBook }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState({
    category: 'CITIZEN',
    attendees: '1',
    purpose: '',
    requesterName: '',
    phone: '',
    organization: '',
    documents: '',
  });

  // Generate time slots for the day
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const isToday = isSameDay(date, new Date());
    const currentHour = new Date().getHours();
    
    // Morning slots: 10:00 AM - 1:00 PM
    for (let hour = 10; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isPast = isToday && hour < currentHour;
        
        slots.push({
          time: timeStr,
          available: !isPast && Math.random() > 0.3, // Simulate some booked slots
          booked: !isPast && Math.random() > 0.7 ? 'John Doe' : undefined,
        });
      }
    }
    
    // Afternoon slots: 3:00 PM - 6:00 PM
    for (let hour = 15; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isPast = isToday && hour < currentHour;
        
        slots.push({
          time: timeStr,
          available: !isPast && Math.random() > 0.3,
          booked: !isPast && Math.random() > 0.7 ? 'Jane Smith' : undefined,
        });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);
  const availableSlots = timeSlots.filter(slot => slot.available);

  const categories = [
    { value: 'CITIZEN', label: 'Citizen', icon: User, color: 'primary' },
    { value: 'MEDIA', label: 'Media', icon: Newspaper, color: 'warning' },
    { value: 'VENDOR', label: 'Vendor/Business', icon: Package, color: 'info' },
    { value: 'PARTY_CADRE', label: 'Party Cadre', icon: Building, color: 'success' },
  ];

  const handleBookAppointment = () => {
    if (!selectedSlot || !appointmentData.requesterName || !appointmentData.phone) {
      return;
    }

    const appointmentId = generateID('APP', 'NLR');
    const appointment = {
      id: appointmentId,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedSlot,
      ...appointmentData,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };

    onAppointmentBook?.(appointment);
    console.log('Appointment booked:', appointment);
    
    // Reset form
    setSelectedSlot(null);
    setAppointmentData({
      category: 'CITIZEN',
      attendees: '1',
      purpose: '',
      requesterName: '',
      phone: '',
      organization: '',
      documents: '',
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const categoryInfo = getCategoryInfo(appointmentData.category);
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointment Scheduler</h1>
            <p className="text-muted-foreground">Book appointments with the office</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar & Slots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date & Time
                </CardTitle>
                <CardDescription>
                  Choose your preferred appointment date and available time slot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date < startOfDay(new Date()) || date > addDays(new Date(), 30)}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h4 className="font-semibold mb-3">
                      Available Slots - {format(selectedDate, 'PPP')}
                    </h4>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Morning (10:00 AM - 1:00 PM)</p>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.filter(slot => parseInt(slot.time.split(':')[0]) < 13).map((slot) => (
                            <Button
                              key={slot.time}
                              variant={selectedSlot === slot.time ? "government" : slot.available ? "outline" : "ghost"}
                              size="sm"
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot.time)}
                              className="text-xs"
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Afternoon (3:00 PM - 6:00 PM)</p>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.filter(slot => parseInt(slot.time.split(':')[0]) >= 15).map((slot) => (
                            <Button
                              key={slot.time}
                              variant={selectedSlot === slot.time ? "government" : slot.available ? "outline" : "ghost"}
                              size="sm"
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot.time)}
                              className="text-xs"
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedSlot && (
                      <div className="mt-4 p-3 bg-success-light border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium">
                            Selected: {format(selectedDate, 'PPP')} at {selectedSlot}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Slot Summary */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Available slots today: </span>
                    <span className="font-medium">{availableSlots.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Next available: </span>
                    <span className="font-medium">
                      {availableSlots.length > 0 ? availableSlots[0].time : 'No slots'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointment Details */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={appointmentData.category} 
                    onValueChange={(value) => setAppointmentData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{cat.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={appointmentData.requesterName}
                      onChange={(e) => setAppointmentData(prev => ({ ...prev, requesterName: e.target.value }))}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="attendees">Attendees</Label>
                    <Select 
                      value={appointmentData.attendees} 
                      onValueChange={(value) => setAppointmentData(prev => ({ ...prev, attendees: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Person' : 'People'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={appointmentData.phone}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>

                {appointmentData.category !== 'CITIZEN' && (
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={appointmentData.organization}
                      onChange={(e) => setAppointmentData(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder="Company/Organization name"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="purpose">Purpose of Visit *</Label>
                  <Textarea
                    id="purpose"
                    value={appointmentData.purpose}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="Brief description of the meeting purpose"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="documents">Documents to Bring</Label>
                  <Textarea
                    id="documents"
                    value={appointmentData.documents}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, documents: e.target.value }))}
                    placeholder="List any documents or materials you'll bring"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleBookAppointment}
                  disabled={!selectedSlot || !appointmentData.requesterName || !appointmentData.phone || !appointmentData.purpose}
                  className="w-full"
                  variant="government"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Booking Guidelines */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Booking Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Timing</p>
                    <p className="text-muted-foreground">Appointments are available Mon-Fri, 10 AM - 1 PM and 3 PM - 6 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p className="text-muted-foreground">Maximum 5 people per appointment. Larger groups need special approval.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Advance Booking</p>
                    <p className="text-muted-foreground">Book appointments up to 30 days in advance. Same-day slots subject to availability.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}