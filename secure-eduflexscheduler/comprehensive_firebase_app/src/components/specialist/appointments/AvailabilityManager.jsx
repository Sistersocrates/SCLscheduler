
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderCog as CalendarCog, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const AvailabilityManager = () => {
  const { toast } = useToast();
  // Placeholder for availability slots
  const [availabilitySlots, setAvailabilitySlots] = useState([
    { id: 1, day: "Monday", startTime: "09:00", endTime: "17:00", recurring: true },
    { id: 2, day: "Wednesday", startTime: "10:00", endTime: "15:00", recurring: true },
  ]);

  const addSlot = () => {
    // Logic to add a new slot, likely opening a form/modal
    toast({ title: "Add Slot (Placeholder)", description: "Functionality to add new availability slot."});
  };

  const removeSlot = (slotId) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
    toast({ title: "Slot Removed (Placeholder)", description: `Slot ${slotId} removed.`});
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <CalendarCog className="mr-3 h-6 w-6 text-sky-400" />
            Manage Availability
          </CardTitle>
          <Button onClick={addSlot} size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Slot
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {availabilitySlots.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No availability slots defined.</p>
          ) : (
            availabilitySlots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-slate-700/50 rounded-md border border-slate-600 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-slate-200">{slot.day}: {slot.startTime} - {slot.endTime}</p>
                  <p className="text-xs text-slate-400">{slot.recurring ? "Recurring Weekly" : "One-time"}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSlot(slot.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AvailabilityManager;
