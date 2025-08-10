
import React from "react";
import SeminarCard from "@/components/student/SeminarCard";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const PeriodSection = ({ 
  period, 
  seminars, 
  registrations, 
  onRegister, 
  onUnregister,
  onJoinWaitlist,
  onLeaveWaitlist 
}) => {
  const { user } = useAuth();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Debug logging
  console.log('Period:', period.id, 'Seminars:', seminars);
  console.log('Registrations:', registrations);
  console.log('User:', user);

  // Filter seminars for this period and ensure they're not locked
  const availableSeminars = seminars.filter(seminar => {
    const isForThisPeriod = seminar.hour === period.id;
    const isNotLocked = !seminar.is_locked;
    console.log(`Seminar ${seminar.id}: period match=${isForThisPeriod}, not locked=${isNotLocked}`);
    return isForThisPeriod && isNotLocked;
  });

  console.log('Available seminars for period', period.id, ':', availableSeminars);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {period.name}
          </h2>
          <p className="text-gray-600">{period.time}</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 rounded-lg">
          <span className="text-blue-700 font-medium">
            {availableSeminars.length} {availableSeminars.length === 1 ? 'Seminar' : 'Seminars'} Available
          </span>
        </div>
      </div>

      {availableSeminars.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No seminars available for this period</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {availableSeminars.map((seminar) => {
            const isRegistered = registrations[period.id] === seminar.id;
            console.log(`Rendering seminar ${seminar.id}: registered=${isRegistered}`);
            
            return (
              <motion.div key={seminar.id} variants={item}>
                <SeminarCard
                  seminar={seminar}
                  isRegistered={isRegistered}
                  onRegister={() => {
                    console.log('Registering for seminar:', seminar.id);
                    onRegister(seminar.id, period.id);
                  }}
                  onUnregister={() => {
                    console.log('Unregistering from period:', period.id);
                    onUnregister(period.id);
                  }}
                  onJoinWaitlist={onJoinWaitlist}
                  onLeaveWaitlist={onLeaveWaitlist}
                  disabled={registrations[period.id] && registrations[period.id] !== seminar.id}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default PeriodSection;
