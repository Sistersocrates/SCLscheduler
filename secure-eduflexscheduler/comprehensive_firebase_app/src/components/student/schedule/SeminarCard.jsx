
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { getPeriodsConfig } from '@/lib/services/studentApiService';

const SeminarCard = ({ seminar, onAction, actionType, isLoading, isEnrolledInPeriod, isFull, isWaitlisted }) => {
  const periodTime = getPeriodsConfig().find(p => p.id === seminar.hour)?.time || 'N/A';

  let actionButton;
  if (actionType === 'enroll') {
    actionButton = (
      <Button 
        onClick={() => onAction(seminar.id, seminar.hour)} 
        disabled={isLoading || isEnrolledInPeriod || isFull}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isFull ? 'Class Full' : (isEnrolledInPeriod ? 'Period Full' : 'Enroll')}
      </Button>
    );
  } else if (actionType === 'drop') {
     actionButton = (
      <Button 
        onClick={() => onAction(seminar.enrollment_id, seminar.id)} 
        disabled={isLoading}
        variant="destructive"
        className="w-full"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Drop Class
      </Button>
    );
  } else if (actionType === 'waitlist') {
     actionButton = (
      <Button 
        onClick={() => onAction(seminar.id, seminar.hour)} 
        disabled={isLoading || isEnrolledInPeriod}
        variant="outline"
        className="w-full border-amber-500 text-amber-400 hover:bg-amber-500/10"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isWaitlisted ? 'Leave Waitlist' : 'Join Waitlist'}
      </Button>
    );
  }


  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className="bg-slate-700/50 border-slate-600/70 shadow-lg hover:shadow-sky-500/10 transition-shadow h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-sky-300">{seminar.title}</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Period {seminar.hour} ({periodTime})
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm">
          <p className="text-slate-300 line-clamp-3">{seminar.description || "No description available."}</p>
          <p className="text-slate-400"><span className="font-medium">Teacher:</span> {seminar.teacher_name}</p>
          <p className="text-slate-400"><span className="font-medium">Room:</span> {seminar.room || 'TBD'}</p>
          <p className={`font-medium ${isFull && !isWaitlisted ? 'text-red-400' : 'text-emerald-400'}`}>
            <span className="font-medium">Availability:</span> {seminar.current_enrollment || 0} / {seminar.capacity}
            {isFull && !isWaitlisted && " (Full)"}
          </p>
           {seminar.waitlist_count > 0 && (
            <p className="text-amber-400 text-xs">Waitlist: {seminar.waitlist_count} student(s)</p>
          )}
        </CardContent>
        <CardFooter className="mt-auto">
          {actionButton}
          {isFull && actionType === 'enroll' && !isEnrolledInPeriod && (
             <Button 
              onClick={() => onAction(seminar.id, seminar.hour, true)} 
              disabled={isLoading || isEnrolledInPeriod}
              variant="outline"
              className="w-full border-amber-500 text-amber-400 hover:bg-amber-500/10 mt-2"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Join Waitlist
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SeminarCard;
