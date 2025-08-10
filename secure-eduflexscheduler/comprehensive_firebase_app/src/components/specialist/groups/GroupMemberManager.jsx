
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserMinus, Users, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const GroupMemberManager = ({ groupId, initialMembers = [] }) => {
  const { toast } = useToast();
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  // Placeholder for available students to add
  const [availableStudents, setAvailableStudents] = useState([
    { id: 'student-101', name: 'Charlie Brown' }, { id: 'student-102', name: 'Lucy Van Pelt' }
  ]);

  const addMember = (student) => {
    if (members.find(m => m.id === student.id)) {
      toast({ title: "Already Member", description: `${student.name} is already in this group.`, variant: "destructive" });
      return;
    }
    setMembers(prev => [...prev, student]);
    // API call to add member to group
    toast({ title: "Member Added (Placeholder)", description: `${student.name} added to group.` });
  };

  const removeMember = (studentId) => {
    setMembers(prev => prev.filter(m => m.id !== studentId));
    // API call to remove member
    toast({ title: "Member Removed (Placeholder)", description: `Member removed from group.` });
  };

  const filteredAvailableStudents = availableStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !members.find(m => m.id === s.id)
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-emerald-400" />
            Manage Group Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-md font-semibold text-slate-300 mb-2">Current Members ({members.length})</h4>
            {members.length === 0 ? <p className="text-xs text-slate-400">No members yet.</p> : (
              <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {members.map(member => (
                  <li key={member.id} className="flex justify-between items-center p-1.5 bg-slate-700/30 rounded text-sm">
                    {member.name}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-300" onClick={() => removeMember(member.id)}>
                      <UserMinus className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="pt-2 border-t border-slate-700">
            <h4 className="text-md font-semibold text-slate-300 mb-2">Add New Members</h4>
            <div className="flex gap-2 mb-2">
              <Input 
                type="text" 
                placeholder="Search students to add..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 focus:ring-emerald-500"
              />
              <Button variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-600"><Search className="h-4 w-4"/></Button>
            </div>
            {filteredAvailableStudents.length === 0 && searchTerm ? <p className="text-xs text-slate-400">No matching students found or already members.</p> : (
              <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {filteredAvailableStudents.map(student => (
                  <li key={student.id} className="flex justify-between items-center p-1.5 bg-slate-700/30 rounded text-sm hover:bg-slate-600/50">
                    {student.name}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-400 hover:text-emerald-300" onClick={() => addMember(student)}>
                      <UserPlus className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GroupMemberManager;
