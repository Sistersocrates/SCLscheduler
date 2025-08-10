
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from 'lucide-react'; // Using Activity for usage analytics
import { motion } from 'framer-motion';

const SystemUsageAnalyticsView = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Activity className="mr-3 h-6 w-6 text-yellow-400" />
            System Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Analytics on system usage, user engagement, and feature adoption.</p>
          <div className="h-[300px] flex items-center justify-center bg-slate-700/30 rounded-md mt-4">
            <p className="text-slate-400 text-lg">Usage Metrics & Charts Area</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemUsageAnalyticsView;
