
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const GroupForm = ({ group, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(
    group || {
      group_name: '',
      description: '',
      focus_area: '',
      meeting_schedule: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.group_name || !formData.focus_area) {
        toast({ title: "Missing Fields", description: "Group name and focus area are required.", variant: "destructive"});
        return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-slate-800/80 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Users2 className="mr-2 h-6 w-6 text-emerald-400" />
          {group ? 'Edit Student Group' : 'Create New Student Group'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="group_name" className="text-slate-400">Group Name</Label>
            <Input id="group_name" name="group_name" value={formData.group_name} onChange={handleChange} placeholder="e.g., Senior Year Planning" className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
          </div>
          <div>
            <Label htmlFor="focus_area" className="text-slate-400">Focus Area</Label>
            <Input id="focus_area" name="focus_area" value={formData.focus_area} onChange={handleChange} placeholder="e.g., College Applications, Stress Management" className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
          </div>
          <div>
            <Label htmlFor="description" className="text-slate-400">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Details about the group's purpose and activities..." className="bg-slate-700 border-slate-600 focus:ring-emerald-500 min-h-[100px]" />
          </div>
          <div>
            <Label htmlFor="meeting_schedule" className="text-slate-400">Meeting Schedule (Text)</Label>
            <Input id="meeting_schedule" name="meeting_schedule" value={formData.meeting_schedule} onChange={handleChange} placeholder="e.g., Tuesdays 3-4 PM, Room 102" className="bg-slate-700 border-slate-600 focus:ring-emerald-500" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 border-slate-600 hover:bg-slate-700">Cancel</Button>}
          <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            {group ? 'Save Changes' : 'Create Group'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GroupForm;
