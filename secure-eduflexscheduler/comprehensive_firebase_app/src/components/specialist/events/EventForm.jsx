
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Palette as PresentationIcon } from 'lucide-react'; // Changed from Presentation
import { useToast } from "@/components/ui/use-toast";

const EventForm = ({ event, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(
    event || {
      event_title: '',
      description: '',
      start_time: '',
      end_time: '',
      location: '',
      capacity: '',
      eligibility_criteria: '',
      credit_value: '0.00',
      registration_deadline: '',
    }
  );

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.event_title || !formData.start_time || !formData.end_time) {
        toast({ title: "Missing Fields", description: "Event title, start time, and end time are required.", variant: "destructive"});
        return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-slate-800/80 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <PresentationIcon className="mr-2 h-6 w-6 text-purple-400" />
          {event ? 'Edit Special Event' : 'Create New Special Event'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="event_title" className="text-slate-400">Event Title</Label>
            <Input id="event_title" name="event_title" value={formData.event_title} onChange={handleChange} placeholder="e.g., Financial Aid Night" className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start_time" className="text-slate-400">Start Time</Label>
              <Input id="start_time" name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
            </div>
            <div>
              <Label htmlFor="end_time" className="text-slate-400">End Time</Label>
              <Input id="end_time" name="end_time" type="datetime-local" value={formData.end_time} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <Label htmlFor="location" className="text-slate-400">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Auditorium, Virtual" className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
          </div>
          <div>
            <Label htmlFor="description" className="text-slate-400">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Details about the event..." className="bg-slate-700 border-slate-600 focus:ring-purple-500 min-h-[80px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="capacity" className="text-slate-400">Capacity (Optional)</Label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="e.g., 100" className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
            </div>
            <div>
              <Label htmlFor="credit_value" className="text-slate-400">Credit Value (Optional)</Label>
              <Input id="credit_value" name="credit_value" type="number" step="0.01" value={formData.credit_value} onChange={handleChange} placeholder="e.g., 0.5" className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <Label htmlFor="eligibility_criteria" className="text-slate-400">Eligibility (Optional)</Label>
            <Input id="eligibility_criteria" name="eligibility_criteria" value={formData.eligibility_criteria} onChange={handleChange} placeholder="e.g., Grades 11-12" className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
          </div>
          <div>
            <Label htmlFor="registration_deadline" className="text-slate-400">Registration Deadline (Optional)</Label>
            <Input id="registration_deadline" name="registration_deadline" type="datetime-local" value={formData.registration_deadline} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-purple-500" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-3">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 border-slate-600 hover:bg-slate-700">Cancel</Button>}
          <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
            {event ? 'Save Changes' : 'Create Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EventForm;
