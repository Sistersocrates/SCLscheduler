
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, DownloadCloud, AlertCircle } from 'lucide-react';
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const ProgressReports = () => {
  const { toast } = useToast();

  // Placeholder for report generation/download logic
  const handleDownloadReport = (reportType) => {
    toast({
      title: "Report Download Started (Simulated)",
      description: `Your ${reportType} report is being generated. This is a placeholder.`,
    });
    // In a real app, this would trigger an API call or client-side generation
    // For example: generatePdfReport(reportType);
  };

  const availableReports = [
    { id: 'summary', name: 'Overall Progress Summary', description: 'A quick overview of your academic standing.' },
    { id: 'detailed_attendance', name: 'Detailed Attendance Report', description: 'Complete history of your class attendance.' },
    { id: 'credit_transcript', name: 'Credit Transcript (Unofficial)', description: 'List of all credits earned.' },
  ];

  return (
    <div className="space-y-6">
      <motion.h1 
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"
      >
        Progress Reports
      </motion.h1>

      <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-200 flex items-center">
            <FileText className="mr-3 h-6 w-6 text-indigo-400" />
            Downloadable Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableReports.length > 0 ? (
            availableReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <h4 className="font-semibold text-indigo-300">{report.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{report.description}</p>
                </div>
                <Button 
                  onClick={() => handleDownloadReport(report.name)}
                  variant="outline"
                  size="sm"
                  className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 whitespace-nowrap mt-2 sm:mt-0"
                >
                  <DownloadCloud className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No reports are currently available for download.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-slate-500 pt-4">
        <p>Note: All reports are for informational purposes. Official transcripts must be requested through the school office.</p>
      </div>
    </div>
  );
};

export default ProgressReports;
