
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // CardFooter removed as it's not used
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarPlus, Users } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion'; // Added motion import
// import { fetchTours, scheduleTour } from '@/lib/services/adminApiService'; // Placeholder

const ParentTourScheduler = () => {
  const { toast } = useToast();
  const [tours, setTours] = useState([]); // Placeholder for existing tours
  const [showForm, setShowForm] = useState(false);
  const [newTourData, setNewTourData] = useState({
    parent_name: '', parent_email: '', tour_date_time: '', number_of_attendees: 1, notes: ''
  });

  // useEffect to load tours:
  // useEffect(() => { /* fetchTours().then(setTours) */ }, []);

  const handleInputChange = (e) => {
    setNewTourData({ ...newTourData, [e.target.name]: e.target.value });
  };

  const handleScheduleTour = async (e) => {
    e.preventDefault();
    if (!newTourData.parent_name || !newTourData.parent_email || !newTourData.tour_date_time) {
        toast({title: "Missing Fields", description: "Parent name, email, and tour date/time are required.", variant: "destructive"});
        return;
    }
    try {
      // const scheduled = await scheduleTour(newTourData);
      // setTours(prev => [...prev, scheduled]); // Add to local state (placeholder)
      toast({ title: "Tour Scheduled", description: `Tour for ${newTourData.parent_name} scheduled (Placeholder).` });
      setShowForm(false);
      setNewTourData({ parent_name: '', parent_email: '', tour_date_time: '', number_of_attendees: 1, notes: '' });
    } catch (err) {
      toast({ title: "Error Scheduling Tour", description: err.message, variant: "destructive" });
    }
  };
  
  const mockTours = [
    {id: 'tour1', parent_name: 'Jane Doe', tour_date_time: '2025-06-10T10:00:00Z', status: 'scheduled', number_of_attendees: 2},
    {id: 'tour2', parent_name: 'John Smith', tour_date_time: '2025-06-12T14:00:00Z', status: 'completed', number_of_attendees: 3},
  ];

  return (
    <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex items-center text-xl">
          <CalendarPlus className="mr-3 h-6 w-6 text-yellow-400" />
          Parent Tour Management
        </CardTitle>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold">
          {showForm ? 'Cancel' : 'Schedule New Tour'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleScheduleTour} className="space-y-4 p-4 mb-6 bg-slate-700/50 rounded-md border border-slate-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_name" className="text-slate-400">Parent Name</Label>
                <Input id="parent_name" name="parent_name" value={newTourData.parent_name} onChange={handleInputChange} className="bg-slate-600 border-slate-500 focus:ring-yellow-500" />
              </div>
              <div>
                <Label htmlFor="parent_email" className="text-slate-400">Parent Email</Label>
                <Input id="parent_email" name="parent_email" type="email" value={newTourData.parent_email} onChange={handleInputChange} className="bg-slate-600 border-slate-500 focus:ring-yellow-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tour_date_time" className="text-slate-400">Tour Date & Time</Label>
                <Input id="tour_date_time" name="tour_date_time" type="datetime-local" value={newTourData.tour_date_time} onChange={handleInputChange} className="bg-slate-600 border-slate-500 focus:ring-yellow-500" />
              </div>
              <div>
                <Label htmlFor="number_of_attendees" className="text-slate-400">Attendees</Label>
                <Input id="number_of_attendees" name="number_of_attendees" type="number" min="1" value={newTourData.number_of_attendees} onChange={handleInputChange} className="bg-slate-600 border-slate-500 focus:ring-yellow-500" />
              </div>
            </div>
             <div>
                <Label htmlFor="notes" className="text-slate-400">Notes (Optional)</Label>
                <Input id="notes" name="notes" value={newTourData.notes} onChange={handleInputChange} className="bg-slate-600 border-slate-500 focus:ring-yellow-500" />
              </div>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">Schedule Tour</Button>
          </motion.form>
        )}
        <h4 className="text-md font-semibold text-slate-300 mb-3">Upcoming / Recent Tours</h4>
        <div className="space-y-2">
            {(tours.length > 0 ? tours : mockTours).map(tour => (
                <div key={tour.id} className="p-3 bg-slate-700/30 rounded-md border border-slate-600/80">
                    <p className="font-medium text-slate-100">{tour.parent_name} <span className="text-xs text-slate-400">({tour.parent_email})</span></p>
                    <p className="text-sm text-slate-300">Date: {new Date(tour.tour_date_time).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Attendees: {tour.number_of_attendees} | Status: <span className="font-semibold capitalize">{tour.status}</span></p>
                </div>
            ))}
            {tours.length === 0 && mockTours.length === 0 && <p className="text-slate-400 text-center">No tours scheduled.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentTourScheduler;
