
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { motion } from "framer-motion";

const CreditProgressWidget = ({ credits }) => {
  // Assuming credits is an object like: { core: 10, elective: 5, total_required: 30 }
  // Or an array of credit objects. For now, using placeholder data.
  const placeholderCredits = {
    earned: credits?.total_earned || 15,
    required: credits?.total_required || 24,
    types: [
      { name: "Core Subjects", earned: credits?.core_earned || 8, required: credits?.core_required || 12, color: "bg-sky-500" },
      { name: "Electives", earned: credits?.elective_earned || 5, required: credits?.elective_required || 8, color: "bg-emerald-500" },
      { name: "Other", earned: credits?.other_earned || 2, required: credits?.other_required || 4, color: "bg-amber-500" },
    ]
  };

  const overallProgress = placeholderCredits.required > 0 ? (placeholderCredits.earned / placeholderCredits.required) * 100 : 0;

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-200 flex items-center">
          <BarChart3 className="mr-3 h-6 w-6 text-amber-400" />
          Credit Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-300">Overall Progress</span>
            <span className="text-sm font-bold text-amber-300">{placeholderCredits.earned} / {placeholderCredits.required} Credits</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">{Math.round(overallProgress)}% Complete</p>
        </div>

        <div className="space-y-4">
          {placeholderCredits.types.map((type, index) => {
            const typeProgress = type.required > 0 ? (type.earned / type.required) * 100 : 0;
            return (
              <motion.div 
                key={type.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-400">{type.name}</span>
                  <span className="text-xs font-medium text-slate-300">{type.earned} / {type.required}</span>
                </div>
                <div className="w-full bg-slate-600/50 rounded-full h-2.5">
                  <div 
                    className={`${type.color} h-2.5 rounded-full`}
                    style={{ width: `${Math.min(typeProgress, 100)}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="pt-2 text-center">
            <p className="text-sm text-slate-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400"/> Keep up the great work!
            </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default CreditProgressWidget;
