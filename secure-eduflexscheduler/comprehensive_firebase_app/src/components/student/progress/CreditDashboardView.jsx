
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentCredits } from '@/lib/services/studentApiService'; // Assuming this service exists
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookCopy, TrendingUp, AlertCircle, Loader2, Star } from 'lucide-react';

const CreditDashboardView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creditsData, setCreditsData] = useState(null); // Will store { summary: {}, details: [] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCredits = async () => {
      if (!user?.profile?.id) {
        setError("User profile not available.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const rawCredits = await fetchStudentCredits(user.profile.id);
        
        // Process rawCredits into summary and details
        const summary = { total_earned: 0, types: {} };
        rawCredits.forEach(credit => {
          summary.total_earned += parseFloat(credit.credit_amount || 0);
          if (!summary.types[credit.credit_type]) {
            summary.types[credit.credit_type] = { earned: 0, count: 0 };
          }
          summary.types[credit.credit_type].earned += parseFloat(credit.credit_amount || 0);
          summary.types[credit.credit_type].count += 1;
        });
        
        // Sort credits by date ascending to calculate running total correctly
        const sortedCredits = [...rawCredits].sort((a, b) => new Date(a.earned_date) - new Date(b.earned_date));

        let runningTotal = 0;
        const creditsWithRunningTotal = sortedCredits.map(credit => {
          runningTotal += parseFloat(credit.credit_amount || 0);
          return { ...credit, running_total: runningTotal };
        });

        // Create a map for easy lookup
        const runningTotalMap = new Map(creditsWithRunningTotal.map(c => [c.id, c.running_total]));

        // Add the running total to the display-sorted details array (newest first)
        const detailsForDisplay = [...rawCredits].sort((a, b) => new Date(b.earned_date) - new Date(a.earned_date));
        const finalDetails = detailsForDisplay.map(c => ({...c, running_total: runningTotalMap.get(c.id) }));

        setCreditsData({ summary, details: finalDetails });

      } catch (err) {
        console.error("Failed to load credit data:", err);
        setError(err.message || "Could not load credit information.");
        toast({
          title: "Error Loading Credits",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCredits();
  }, [user, toast]);
  
  // Placeholder for required credits, this would ideally come from student_profile or a config
  const requiredCredits = { total: 24, Math: 4, English: 4, Science: 3, History: 3, Elective: 10 };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="ml-3 text-gray-300">Loading credit information...</p>
      </div>
    );
  }
  
  if (error && !creditsData) {
     return (
      <Card className="bg-red-900/20 border-red-700/50 shadow-xl">
        <CardHeader><CardTitle className="text-red-300 flex items-center"><AlertCircle className="mr-2"/>Error</CardTitle></CardHeader>
        <CardContent><p className="text-red-400">{error}</p></CardContent>
      </Card>
    );
  }
  
  const totalEarned = creditsData?.summary?.total_earned || 0;
  const overallProgress = requiredCredits.total > 0 ? (totalEarned / requiredCredits.total) * 100 : 0;

  return (
    <div className="space-y-8">
      <motion.h1 
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
      >
        My Credits
      </motion.h1>

      <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-amber-300 flex items-center">
            <Award className="mr-3 h-6 w-6" /> Overall Progress Towards Graduation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-baseline">
            <p className="text-4xl font-bold text-amber-200">{totalEarned.toFixed(2)}</p>
            <p className="text-lg text-slate-400">/ {requiredCredits.total} credits required</p>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-5 overflow-hidden shadow-inner">
            <motion.div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-5 rounded-full flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallProgress, 100)}%` }}
              transition={{ duration: 1.2, ease: "circOut" }}
            >
              <span className="text-xs font-medium text-orange-900 px-2">{Math.round(overallProgress)}%</span>
            </motion.div>
          </div>
           {overallProgress >= 100 && (
            <p className="text-center text-lg font-semibold text-green-400 flex items-center justify-center mt-3">
                <Star className="w-5 h-5 mr-2 text-yellow-400"/> Congratulations! All credits earned!
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(creditsData?.summary?.types || {}).map(([type, data], index) => {
          const typeRequired = requiredCredits[type] || data.earned; // Fallback if not in requiredCredits
          const typeProgress = typeRequired > 0 ? (data.earned / typeRequired) * 100 : 0;
          return (
            <motion.div 
              key={type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-slate-700/50 border-slate-600/70 shadow-lg h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-semibold text-sky-300 capitalize">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-sky-200">{data.earned.toFixed(2)} <span className="text-sm text-slate-400">/ {typeRequired} credits</span></p>
                  <div className="w-full bg-slate-600 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-sky-500 h-2.5 rounded-full"
                      style={{ width: `${Math.min(typeProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{data.count} {data.count === 1 ? 'class' : 'classes'} taken</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-200 flex items-center">
            <BookCopy className="mr-3 h-6 w-6 text-slate-400" /> Detailed Credit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {creditsData?.details?.length > 0 ? (
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Class/Source</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date Earned</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Running Total</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/30 divide-y divide-slate-700/70">
                  {creditsData.details.map((credit, index) => (
                    <motion.tr 
                      key={credit.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-slate-700/30"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{credit.class?.title || 'External Credit'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300 capitalize">{credit.credit_type}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-emerald-300">{parseFloat(credit.credit_amount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{new Date(credit.earned_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-sky-300">{credit.running_total?.toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-400 py-6">No detailed credit records found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditDashboardView;
