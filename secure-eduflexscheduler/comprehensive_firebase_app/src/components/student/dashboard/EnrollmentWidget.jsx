
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const EnrollmentWidget = ({ availableSeminars, currentRegistrations, studentUserId, tenantId }) => {
  const enrolledCount = currentRegistrations ? Object.keys(currentRegistrations).filter(key => currentRegistrations[key].status === 'enrolled').length : 0;
  const waitlistedCount = currentRegistrations ? Object.keys(currentRegistrations).filter(key => currentRegistrations[key].status === 'waitlisted').length : 0;
  const openSpotsCount = availableSeminars?.reduce((acc, seminar) => {
    const spots = seminar.capacity - (seminar.current_enrollment || 0);
    return acc + (spots > 0 ? spots : 0);
  }, 0) || 0;

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-200 flex items-center">
          <BookOpen className="mr-3 h-6 w-6 text-emerald-400" />
          Class Enrollment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div 
            className="p-4 bg-slate-700/50 rounded-lg text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-3xl font-bold text-emerald-300">{enrolledCount}</p>
            <p className="text-sm text-slate-400">Classes Enrolled</p>
          </motion.div>
          <motion.div 
            className="p-4 bg-slate-700/50 rounded-lg text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-3xl font-bold text-amber-300">{waitlistedCount}</p>
            <p className="text-sm text-slate-400">Waitlisted Classes</p>
          </motion.div>
        </div>
        
        <div className="p-4 bg-slate-700/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-sky-300">{openSpotsCount}</p>
            <p className="text-sm text-slate-400">Total Open Spots Available</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all">
            <Link to="/student/browse-classes">
              <PlusCircle className="mr-2 h-5 w-5" /> Browse & Enroll
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700/70 hover:text-white transition-colors">
            <Link to="/student/schedule">
              <ListChecks className="mr-2 h-5 w-5" /> View My Schedule
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentWidget;
