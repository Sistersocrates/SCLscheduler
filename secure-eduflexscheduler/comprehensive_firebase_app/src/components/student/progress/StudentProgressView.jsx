import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CreditDashboardView from './CreditDashboardView';
import AttendanceHistoryView from './AttendanceHistoryView';
import { Award, CalendarCheck } from 'lucide-react';

const StudentProgressView = () => {
  const [activeTab, setActiveTab] = useState('credits');

  const tabs = [
    { id: 'credits', name: 'My Credits', icon: Award },
    { id: 'attendance', name: 'My Attendance', icon: CalendarCheck },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 text-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-500 mb-4">
          My Progress
        </h1>
        <p className="text-slate-400 mb-8">
          A detailed overview of your academic credits and attendance history.
        </p>

        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-sky-400 text-sky-300'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center
                `}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'credits' && (
            <motion.div
              key="credits"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <CreditDashboardView />
            </motion.div>
          )}
          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <AttendanceHistoryView />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProgressView;
