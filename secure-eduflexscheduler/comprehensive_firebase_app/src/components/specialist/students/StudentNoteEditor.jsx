
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileEdit, Lock, Unlock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const StudentNoteEditor = ({ note, studentId, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(
    note || {
      title: '',
      content: '',
      isConfidential: false,
      interventionType: '',
      goalTracked: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, isConfidential: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
        toast({ title: "Missing Fields", description: "Title and content are required for the note.", variant: "destructive"});
        return;
    }
    onSubmit({ ...formData, student_id: studentId });
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-slate-800/80 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FileEdit className="mr-2 h-6 w-6 text-amber-400" />
          {note ? 'Edit Student Note' : 'Create New Student Note'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="noteTitle" className="text-slate-400">Note Title</Label>
            <Input id="noteTitle" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Session Summary 2025-05-22" className="bg-slate-700 border-slate-600 focus:ring-amber-500" />
          </div>
          <div>
            <Label htmlFor="noteContent" className="text-slate-400">Content</Label>
            <Textarea id="noteContent" name="content" value={formData.content} onChange={handleChange} placeholder="Detailed notes about the student interaction..." className="bg-slate-700 border-slate-600 focus:ring-amber-500 min-h-[150px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interventionType" className="text-slate-400">Intervention Type</Label>
              <Input id="interventionType" name="interventionType" value={formData.interventionType} onChange={handleChange} placeholder="e.g., Counseling, Academic Check-in" className="bg-slate-700 border-slate-600 focus:ring-amber-500" />
            </div>
            <div>
              <Label htmlFor="goalTracked" className="text-slate-400">Goal Tracked (Optional)</Label>
              <Input id="goalTracked" name="goalTracked" value={formData.goalTracked} onChange={handleChange} placeholder="e.g., Improve attendance" className="bg-slate-700 border-slate-600 focus:ring-amber-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="isConfidential" checked={formData.isConfidential} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="isConfidential" className="text-slate-300 flex items-center">
              {formData.isConfidential ? <Lock className="mr-1.5 h-4 w-4 text-red-400"/> : <Unlock className="mr-1.5 h-4 w-4 text-emerald-400"/>}
              Mark as Confidential
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 border-slate-600 hover:bg-slate-700">Cancel</Button>}
          <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
            {note ? 'Save Changes' : 'Create Note'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentNoteEditor;
