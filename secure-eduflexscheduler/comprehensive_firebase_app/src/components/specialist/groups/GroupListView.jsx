
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GroupListView = ({ groups = [], onCreateGroup }) => {
  const displayGroups = groups.length > 0 ? groups : [
    { id: 'group-1', name: "Study Skills Workshop", memberCount: 12, focusArea: "Academic Support" },
    { id: 'group-2', name: "Social Skills Group", memberCount: 8, focusArea: "Personal Development" },
  ]; // Placeholder

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-emerald-400" />
            Student Groups
          </CardTitle>
          {onCreateGroup && (
            <Button onClick={onCreateGroup} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Group
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {displayGroups.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No student groups found.</p>
          ) : (
            displayGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-slate-700/50 rounded-md border border-slate-600 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-emerald-300">{group.name}</h4>
                  <p className="text-xs text-slate-400">{group.focusArea} - {group.memberCount} members</p>
                </div>
                <Button asChild variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-600">
                  <Link to={`/specialist/student-groups/${group.id}`}><Eye className="mr-1.5 h-4 w-4"/> View</Link>
                </Button>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GroupListView;
