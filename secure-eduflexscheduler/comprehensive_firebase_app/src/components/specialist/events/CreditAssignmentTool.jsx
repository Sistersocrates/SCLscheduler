
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, CheckSquare, Users } from 'lucide-react'; // Replaced UserPlus with Users
import { useToast } from "@/components/ui/use-toast";

const CreditAssignmentTool = ({ eventId, registeredStudents = [] }) => {
  const { toast } = useToast();
  const [creditsToAward, setCreditsToAward] = useState(0.5); // Default credit value
  const [selectedStudents, setSelectedStudents] = useState([]); // IDs of students to award credits

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleAssignCredits = () => {
    if (selectedStudents.length === 0) {
      toast({ title: "No Students Selected", description: "Please select students to award credits.", variant: "destructive" });
      return;
    }
    // API call to assign credits
    toast({ title: "Credits Assigned (Placeholder)", description: `${creditsToAward} credits assigned to ${selectedStudents.length} students.` });
    setSelectedStudents([]); // Reset selection
  };
  
  const attendedStudents = registeredStudents.filter(s => s.attended);

  return (
    <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Award className="mr-3 h-6 w-6 text-purple-400" />
          Assign Credits for Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="creditsToAward" className="text-slate-400">Credits to Award</Label>
          <Input 
            id="creditsToAward" 
            type="number" 
            step="0.1" 
            value={creditsToAward} 
            onChange={(e) => setCreditsToAward(parseFloat(e.target.value))}
            className="bg-slate-700 border-slate-600 focus:ring-purple-500 w-32"
          />
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-300 mb-2 flex items-center">
            <Users className="mr-2 h-5 w-5"/> Attended Students ({attendedStudents.length})
          </h4>
          {attendedStudents.length === 0 ? <p className="text-xs text-slate-400">No students marked as attended.</p> : (
            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {attendedStudents.map(student => (
                <li key={student.id} className="flex items-center justify-between p-1.5 bg-slate-700/30 rounded text-sm">
                  {student.name}
                  <Button 
                    variant={selectedStudents.includes(student.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectStudent(student.id)}
                    className={selectedStudents.includes(student.id) ? "bg-purple-500 hover:bg-purple-600 text-white" : "border-slate-500 text-slate-300 hover:bg-slate-600"}
                  >
                    <CheckSquare className="h-4 w-4 mr-1.5"/> {selectedStudents.includes(student.id) ? "Selected" : "Select"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleAssignCredits} className="bg-purple-500 hover:bg-purple-600 text-white" disabled={selectedStudents.length === 0 || creditsToAward <= 0}>
          Assign {creditsToAward > 0 ? creditsToAward : ''} Credits to {selectedStudents.length} Student(s)
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreditAssignmentTool;
