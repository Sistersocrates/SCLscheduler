
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAvailableClasses, enrollInClass, dropClassEnrollment, getPeriodsConfig, fetchStudentSchedule } from '@/lib/services/studentApiService';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Search, Filter, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SeminarCard from '@/components/student/schedule/SeminarCard';

const ClassBrowser = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableClasses, setAvailableClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePeriodFilter, setActivePeriodFilter] = useState(null);
  const [actionLoading, setActionLoading] = useState({ type: null, id: null });

  const periods = getPeriodsConfig();

  const loadData = useCallback(async () => {
    if (!user?.profile?.id || !user?.profile?.tenant_id) {
      setError("User profile or tenant information is missing.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [fetchedAvailable, fetchedEnrolled] = await Promise.all([
        fetchAvailableClasses({ search_term: searchTerm, hour: activePeriodFilter }),
        fetchStudentSchedule(user.profile.id) 
      ]);
      setAvailableClasses(fetchedAvailable);
      setEnrolledClasses(fetchedEnrolled);
    } catch (err) {
      console.error("Failed to load class data:", err);
      setError(err.message || "Could not load class information.");
      toast({ title: "Error Loading Classes", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast, searchTerm, activePeriodFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnroll = async (classId, classHour, isWaitlist = false) => {
    setActionLoading({ type: isWaitlist ? 'waitlist' : 'enroll', id: classId });
    try {
      const result = await enrollInClass(user.profile.id, classId, user.profile.tenant_id);
      toast({
        title: `Successfully ${result.status === 'enrolled' ? 'Enrolled' : 'Joined Waitlist'}!`,
        description: `You are now ${result.status} in ${availableClasses.find(c => c.id === classId)?.title || 'the class'}.`,
        variant: result.status === 'enrolled' ? "default" : "info",
        action: <CheckCircle className="text-green-500" />
      });
      loadData(); 
    } catch (err) {
      toast({ title: "Enrollment Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const handleDrop = async (enrollmentId, classId) => {
     setActionLoading({ type: 'drop', id: classId });
    try {
      await dropClassEnrollment(enrollmentId, classId);
      toast({
        title: "Successfully Dropped Class!",
        description: `You have been unenrolled from ${enrolledClasses.find(c => c.id === classId)?.title || 'the class'}.`,
        action: <XCircle className="text-red-500" />
      });
      loadData(); 
    } catch (err) {
      toast({ title: "Drop Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };
  
  const isStudentEnrolledInPeriod = (periodHour) => {
    return enrolledClasses.some(ec => ec.hour === periodHour && ec.enrollment_status === 'enrolled');
  };

  const filteredAvailableClasses = availableClasses.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cls.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = activePeriodFilter ? cls.hour === activePeriodFilter : true;
    return matchesSearch && matchesPeriod;
  });

  if (loading && !availableClasses.length && !enrolledClasses.length) { 
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="ml-3 text-gray-300">Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-700/50 shadow-xl">
        <CardHeader><CardTitle className="text-red-300 flex items-center"><AlertCircle className="mr-2"/>Error</CardTitle></CardHeader>
        <CardContent><p className="text-red-400">{error}</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.h1 
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
      >
        Browse & Manage Classes
      </motion.h1>

      <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-slate-800/50 rounded-lg shadow-md">
        <div className="relative flex-grow w-full sm:w-auto">
          <Input 
            type="text" 
            placeholder="Search classes, teachers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:border-sky-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button 
            variant={activePeriodFilter === null ? "default" : "outline"}
            onClick={() => setActivePeriodFilter(null)}
            className={activePeriodFilter === null ? "bg-sky-500 text-white" : "text-gray-300 border-slate-600 hover:bg-slate-700"}
          >
            All Periods
          </Button>
          {periods.map(p => (
            <Button 
              key={p.id}
              variant={activePeriodFilter === p.id ? "default" : "outline"}
              onClick={() => setActivePeriodFilter(p.id)}
              className={`whitespace-nowrap ${activePeriodFilter === p.id ? "bg-sky-500 text-white" : "text-gray-300 border-slate-600 hover:bg-slate-700"}`}
            >
              Period {p.id}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 rounded-lg">
          <TabsTrigger value="available" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-300">Available Classes ({filteredAvailableClasses.length})</TabsTrigger>
          <TabsTrigger value="enrolled" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-300">My Enrolled ({enrolledClasses.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="mt-4">
          {loading && availableClasses.length === 0 && <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-500" />}
          {!loading && filteredAvailableClasses.length === 0 && (
            <p className="text-center text-gray-400 py-8">No available classes match your criteria.</p>
          )}
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableClasses.map(cls => (
                <SeminarCard 
                  key={cls.id} 
                  seminar={cls} 
                  onAction={handleEnroll}
                  actionType="enroll"
                  isLoading={actionLoading.type === 'enroll' && actionLoading.id === cls.id}
                  isEnrolledInPeriod={isStudentEnrolledInPeriod(cls.hour)}
                  isFull={(cls.current_enrollment || 0) >= cls.capacity}
                />
              ))}
            </div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="enrolled" className="mt-4">
           {loading && enrolledClasses.length === 0 && <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />}
          {!loading && enrolledClasses.length === 0 && (
            <p className="text-center text-gray-400 py-8">You are not enrolled in any classes yet.</p>
          )}
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map(cls => (
                <SeminarCard 
                  key={cls.id} 
                  seminar={cls} 
                  onAction={handleDrop}
                  actionType="drop"
                  isLoading={actionLoading.type === 'drop' && actionLoading.id === cls.id}
                />
              ))}
            </div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassBrowser;
