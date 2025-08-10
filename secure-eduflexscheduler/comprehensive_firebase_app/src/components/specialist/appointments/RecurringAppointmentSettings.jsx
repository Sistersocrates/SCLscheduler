
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you'll create this
import { Repeat } from 'lucide-react';

// Create src/components/ui/checkbox.jsx if it doesn't exist

const RecurringAppointmentSettings = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(
    settings || {
      isRecurring: false,
      frequency: 'weekly', // daily, weekly, monthly
      interval: 1, // e.g., every 1 week, every 2 weeks
      daysOfWeek: [], // for weekly: [0, 1, 2] for Sun, Mon, Tue
      endDate: '',
    }
  );

  const handleCheckboxChange = (checked) => {
    setLocalSettings(prev => ({ ...prev, isRecurring: checked }));
  };
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
  };
  
  // Simplified for brevity. A real component would have more complex day/date pickers.

  return (
    <Card className="bg-slate-700/30 border-slate-600 text-slate-300">
      <CardHeader>
        <CardTitle className="flex items-center text-md text-slate-300">
          <Repeat className="mr-2 h-5 w-5 text-pink-400" />
          Recurring Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="isRecurring" checked={localSettings.isRecurring} onCheckedChange={handleCheckboxChange} />
          <Label htmlFor="isRecurring" className="text-slate-300">Make this a recurring appointment</Label>
        </div>
        {localSettings.isRecurring && (
          <div className="space-y-3 pl-6 border-l-2 border-pink-500/50 ml-2 pt-2">
            <div>
              <Label htmlFor="frequency" className="text-xs text-slate-400">Frequency</Label>
              <select 
                id="frequency" name="frequency" 
                value={localSettings.frequency} onChange={handleChange}
                className="w-full mt-1 bg-slate-600 border-slate-500 rounded-md p-2 text-sm focus:ring-pink-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <Label htmlFor="interval" className="text-xs text-slate-400">Repeat every</Label>
              <Input id="interval" name="interval" type="number" min="1" value={localSettings.interval} onChange={handleChange} className="w-full mt-1 bg-slate-600 border-slate-500 focus:ring-pink-500" />
            </div>
             <div>
              <Label htmlFor="endDate" className="text-xs text-slate-400">End Date (Optional)</Label>
              <Input id="endDate" name="endDate" type="date" value={localSettings.endDate} onChange={handleChange} className="w-full mt-1 bg-slate-600 border-slate-500 focus:ring-pink-500" />
            </div>
            <Button size="sm" variant="link" className="text-pink-400 p-0" onClick={() => onSettingsChange(localSettings)}>Apply Recurring Settings</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringAppointmentSettings;
