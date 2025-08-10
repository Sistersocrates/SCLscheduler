
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarPlus, ListChecks } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const GroupSessionPlanner = ({ groupId, onPlanSession }) => {
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    objectives: '',
    activities: '',
    materialsNeeded: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessionData.title || !sessionData.date || !sessionData.startTime || !sessionData.endTime) {
      toast({ title: "Missing Fields", description: "Session title, date, and times are required.", variant: "destructive" });
      return;
    }
    // API call to save session plan
    onPlanSession({ ...sessionData, group_id: groupId });
    toast({ title: "Session Planned (Placeholder)", description: `Session "${sessionData.title}" planned.` });
    // Reset form or close modal
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-slate-800/80 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarPlus className="mr-2 h-6 w-6 text-emerald-400" />
          Plan Group Session
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="sessionTitle" className="text-slate-400">Session Title</Label>
            <Input id="sessionTitle" name="title" value={sessionData.title} onChange={handleChange} placeholder="e.g., Week 1: Introductions" className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="sessionDate" className="text-slate-400">Date</Label>
              <Input id="sessionDate" name="date" type="date" value={sessionData.date} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
            </div>
            <div>
              <Label htmlFor="startTime" className="text-slate-400">Start Time</Label>
              <Input id="startTime" name="startTime" type="time" value={sessionData.startTime} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-slate-400">End Time</Label>
              <Input id="endTime" name="endTime" type="time" value={sessionData.endTime} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <Label htmlFor="objectives" className="text-slate-400">Objectives</Label>
            <Textarea id="objectives" name="objectives" value={sessionData.objectives} onChange={handleChange} placeholder="What will participants learn/achieve?" className="bg-slate-700 border-slate-600 focus:ring-emerald-500 min-h-[60px]" />
          </div>
          <div>
            <Label htmlFor="activities" className="text-slate-400">Activities / Agenda</Label>
            <Textarea id="activities" name="activities" value={sessionData.activities} onChange={handleChange} placeholder="Outline of activities..." className="bg-slate-700 border-slate-600 focus:ring-emerald-500 min-h-[80px]" />
          </div>
           <div>
            <Label htmlFor="materialsNeeded" className="text-slate-400">Materials Needed (Optional)</Label>
            <Input id="materialsNeeded" name="materialsNeeded" value={sessionData.materialsNeeded} onChange={handleChange} placeholder="e.g., Handouts, markers" className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <ListChecks className="mr-2 h-4 w-4" /> Plan Session
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GroupSessionPlanner;
