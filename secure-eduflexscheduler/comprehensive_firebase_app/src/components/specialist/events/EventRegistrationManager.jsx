
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCheck, UserX, Users, Search, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const EventRegistrationManager = ({ eventId, initialRegistrations = [] }) => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [searchTerm, setSearchTerm] = useState('');
  // Placeholder for manual registration
  const [manualAddEmail, setManualAddEmail] = useState('');

  const filteredRegistrations = registrations.filter(reg => 
    reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reg.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManualAdd = () => {
    if (!manualAddEmail.trim() || !manualAddEmail.includes('@')) {
      toast({ title: "Invalid Email", description: "Please enter a valid email to add.", variant: "destructive" });
      return;
    }
    // API call to register student by email
    toast({ title: "Manual Registration (Placeholder)", description: `Attempting to register ${manualAddEmail}.` });
    setManualAddEmail('');
  };
  
  const toggleAttendance = (registrationId) => {
    // API call to update attendance
    setRegistrations(prev => prev.map(r => r.id === registrationId ? {...r, attended: !r.attended} : r));
    toast({ title: "Attendance Updated (Placeholder)" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-purple-400" />
            Event Registrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Search registrations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 focus:ring-purple-500"
            />
            <Button variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-600"><Search className="h-4 w-4"/></Button>
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-700">
            <Input 
              type="email" 
              placeholder="Add student by email..." 
              value={manualAddEmail}
              onChange={(e) => setManualAddEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 focus:ring-purple-500"
            />
            <Button onClick={handleManualAdd} className="bg-purple-500 hover:bg-purple-600 text-white"><Mail className="h-4 w-4 mr-2"/> Add</Button>
          </div>
          
          {filteredRegistrations.length === 0 ? (
            <p className="text-slate-400 text-center py-3">No registrations found{searchTerm && ' matching your search'}.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredRegistrations.map(reg => (
                <li key={reg.id} className="flex justify-between items-center p-2 bg-slate-700/40 rounded text-sm">
                  <div>
                    <p className="font-medium text-slate-200">{reg.studentName}</p>
                    <p className="text-xs text-slate-400">{reg.studentEmail}</p>
                  </div>
                  <Button 
                    variant={reg.attended ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => toggleAttendance(reg.id)}
                    className={reg.attended ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border-slate-500 text-slate-300 hover:bg-slate-600"}
                  >
                    {reg.attended ? <UserCheck className="h-4 w-4 mr-1.5"/> : <UserX className="h-4 w-4 mr-1.5"/>}
                    {reg.attended ? "Attended" : "Mark Attended"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventRegistrationManager;
