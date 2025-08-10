
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, Users, Info, BookOpen, CalendarDays } from 'lucide-react';
import { getPeriodsConfig } from '@/lib/services/studentApiService';

const ClassDetailModal = ({ seminar, isOpen, onClose, onEnroll, onDrop, onWaitlist, enrollmentStatus }) => {
  if (!seminar) return null;

  const periods = getPeriodsConfig();
  const periodInfo = periods.find(p => p.id === seminar.hour);
  const isFull = seminar.current_enrollment >= seminar.capacity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-slate-800 border-slate-700 text-gray-200">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-sky-400 flex items-center">
            <BookOpen className="mr-3 h-6 w-6" /> {seminar.title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Detailed information about the class.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-slate-300 leading-relaxed">{seminar.description || "No detailed description available."}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start p-3 bg-slate-700/50 rounded-lg">
              <CalendarDays className="w-5 h-5 mr-3 mt-0.5 text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Period:</span>
                <p className="text-slate-400">{periodInfo?.name || `Hour ${seminar.hour}`}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-slate-700/50 rounded-lg">
              <Clock className="w-5 h-5 mr-3 mt-0.5 text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Time:</span>
                <p className="text-slate-400">{periodInfo?.time || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-slate-700/50 rounded-lg">
              <User className="w-5 h-5 mr-3 mt-0.5 text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Teacher:</span>
                <p className="text-slate-400">{seminar.teacher_name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-slate-700/50 rounded-lg">
              <MapPin className="w-5 h-5 mr-3 mt-0.5 text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Room:</span>
                <p className="text-slate-400">{seminar.room || "TBD"}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-700/50 rounded-lg">
            <span className="font-semibold text-slate-300">Availability: </span>
            <span className={`${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
              {seminar.current_enrollment || 0} / {seminar.capacity} spots filled.
              {isFull && " (Class is Full)"}
            </span>
            {seminar.waitlist_count > 0 && (
                <p className="text-xs text-amber-400 mt-1">Waitlist: {seminar.waitlist_count} student(s)</p>
            )}
          </div>

          {seminar.community_partner && (
            <div className="flex items-start p-3 bg-slate-700/50 rounded-lg">
              <Users className="w-5 h-5 mr-3 mt-0.5 text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Community Partner:</span>
                <p className="text-slate-400">{seminar.community_partner}</p>
              </div>
            </div>
          )}
          {seminar.notes && (
            <div className="flex items-start p-3 bg-slate-700/50 rounded-lg">
              <Info className="w-5 h-5 mr-3 mt-0.5 text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Additional Notes:</span>
                <p className="text-slate-400 whitespace-pre-wrap">{seminar.notes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">Close</Button>
          {enrollmentStatus === 'enrolled' && onDrop && (
            <Button variant="destructive" onClick={() => onDrop(seminar.enrollment_id, seminar.id)}>Drop Class</Button>
          )}
          {enrollmentStatus === 'not_enrolled' && !isFull && onEnroll && (
            <Button onClick={() => onEnroll(seminar.id, seminar.hour)} className="bg-sky-500 hover:bg-sky-600 text-white">Enroll</Button>
          )}
          {enrollmentStatus === 'not_enrolled' && isFull && onWaitlist && (
            <Button variant="outline" onClick={() => onWaitlist(seminar.id, seminar.hour)} className="border-amber-500 text-amber-400 hover:bg-amber-500/10">Join Waitlist</Button>
          )}
           {enrollmentStatus === 'waitlisted' && onWaitlist && ( // Assuming onWaitlist can also handle leaving waitlist
            <Button variant="outline" onClick={() => onWaitlist(seminar.id, seminar.hour, true)} className="border-red-500 text-red-400 hover:bg-red-500/10">Leave Waitlist</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailModal;
