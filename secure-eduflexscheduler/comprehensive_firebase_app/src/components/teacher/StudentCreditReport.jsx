import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { getStudentCreditsForTeacher } from '../../lib/teacherFirebase';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle } from 'lucide-react';

const StudentCreditReport = ({ studentId, studentName }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creditsData, setCreditsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCredits = async () => {
      if (!user || !studentId) {
        setError("Required data is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const rawCredits = await getStudentCreditsForTeacher(user.uid, studentId);

        const summary = { total_earned: 0, types: {} };
        rawCredits.forEach(credit => {
          summary.total_earned += parseFloat(credit.creditAmount || 0);
          const type = credit.creditType || 'general';
          if (!summary.types[type]) {
            summary.types[type] = { earned: 0, count: 0 };
          }
          summary.types[type].earned += parseFloat(credit.creditAmount || 0);
          summary.types[type].count += 1;
        });

        const details = [...rawCredits].sort((a, b) => new Date(b.earnedDate.toDate()) - new Date(a.earnedDate.toDate()));

        setCreditsData({ summary, details });

      } catch (err) {
        console.error("Failed to load student credit report:", err);
        setError(err.message || "Could not load credit information.");
        toast({
          title: "Error Loading Credit Report",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCredits();
  }, [studentId, user, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
     return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold flex items-center"><AlertCircle className="mr-2"/>Error</p>
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Credit Report for {studentName}</h3>
        <p className="text-gray-600">Total Credits Earned: <span className="font-bold">{creditsData?.summary?.total_earned.toFixed(2) || '0.00'}</span></p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(creditsData?.summary?.types || {}).map(([type, data]) => (
          <div key={type} className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500 capitalize">{type}</p>
            <p className="text-2xl font-semibold text-gray-900">{data.earned.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Detailed History</h4>
        <div className="overflow-x-auto max-h-64 bg-white rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {creditsData?.details?.map((credit) => (
                <tr key={credit.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{new Date(credit.earnedDate.toDate()).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{credit.description}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 capitalize">{credit.creditType}</td>
                  <td className="px-4 py-2 text-sm font-medium text-green-600">{credit.creditAmount.toFixed(2)}</td>
                </tr>
              ))}
              {creditsData?.details?.length === 0 && (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No credit history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentCreditReport;
