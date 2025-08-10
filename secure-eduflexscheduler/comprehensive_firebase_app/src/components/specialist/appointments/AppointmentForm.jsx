
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // Assuming you'll create this
import { Label } from "@/components/ui/label"; // Assuming you'll create this
import { CalendarPlus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Create src/components/ui/textarea.jsx and src/components/ui/label.jsx if they don't exist

const AppointmentForm = ({ appointment, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(
    appointment || {
      studentId: '',
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      isRecurring: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation here
    if (!formData.title || !formData.startTime || !formData.endTime) {
        toast({ title: "Missing Fields", description: "Title, start time, and end time are required.", variant: "destructive"});
        return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-slate-800/80 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarPlus className="mr-2 h-6 w-6 text-pink-400" />
          {appointment ? 'Edit Appointment' : 'Create New Appointment'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-slate-400">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Check-in with John Doe" className="bg-slate-700 border-slate-600 focus:ring-pink-500" />
          </div>
          <div>
            <Label htmlFor="studentId" className="text-slate-400">Student (ID or Search)</Label>
            <Input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Enter Student ID or Search" className="bg-slate-700 border-slate-600 focus:ring-pink-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-slate-400">Start Time</Label>
              <Input id="startTime" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-pink-500" />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-slate-400">End Time</Label>
              <Input id="endTime" name="endTime" type="datetime-local" value={formData.endTime} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-pink-500" />
            </div>
          </div>
          <div>
            <Label htmlFor="location" className="text-slate-400">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Office 101 or Virtual" className="bg-slate-700 border-slate-600 focus:ring-pink-500" />
          </div>
          <div>
            <Label htmlFor="description" className="text-slate-400">Description / Notes</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Details about the appointment..." className="bg-slate-700 border-slate-600 focus:ring-pink-500 min-h-[100px]" />
          </div>
          {/* Add recurring settings component here if needed */}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 border-slate-600 hover:bg-slate-700">Cancel</Button>}
          <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
            {appointment ? 'Save Changes' : 'Create Appointment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AppointmentForm;
