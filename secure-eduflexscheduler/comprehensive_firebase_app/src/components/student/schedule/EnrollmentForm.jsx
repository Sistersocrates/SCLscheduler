
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const EnrollmentForm = ({ seminar, onSubmit, onCancel, isLoading }) => {
  const [preferences, setPreferences] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    // Basic validation or checks can go here
    if (preferences.length > 500) {
        toast({ title: "Error", description: "Preferences text is too long (max 500 characters).", variant: "destructive"});
        return;
    }
    onSubmit({ preferences });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1 bg-slate-700/30 rounded-lg">
      <div>
        <h3 className="text-xl font-semibold text-sky-300 mb-1">Enroll in: {seminar?.title}</h3>
        <p className="text-sm text-slate-400">Period {seminar?.hour} - Room {seminar?.room || 'TBD'}</p>
      </div>
      
      <div>
        <Label htmlFor="preferences" className="block text-sm font-medium text-slate-300 mb-1">
          Any Preferences or Notes? (Optional)
        </Label>
        <Textarea
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="e.g., specific learning goals, accessibility needs..."
          className="bg-slate-600 border-slate-500 text-gray-200 focus:border-sky-500 min-h-[100px]"
          maxLength={500}
        />
        <p className="text-xs text-slate-500 mt-1 text-right">{preferences.length}/500 characters</p>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="border-slate-500 text-slate-300 hover:bg-slate-600">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-sky-500 hover:bg-sky-600 text-white">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Enrollment
        </Button>
      </div>
    </form>
  );
};

export default EnrollmentForm;
