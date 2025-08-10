
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Activity, ShieldCheck, Settings2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { fetchIntegrationConfigByIdAdmin } from '@/lib/services/adminApi/integrationManagement';

const IntegrationDetailView = () => {
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInstanceDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIntegrationConfigByIdAdmin(instanceId); 
      if (data) {
        setInstance(data);
      } else {
        throw new Error("Integration instance not found.");
      }
    } catch (err) {
      setError(err.message);
      toast({ title: "Error", description: `Failed to load details: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [instanceId, toast]);

  useEffect(() => {
    loadInstanceDetails();
  }, [loadInstanceDetails]);

  if (loading) return <div className="text-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto"></div><p className="mt-3 text-slate-300">Loading details...</p></div>;
  if (error || !instance) return <div className="text-center p-10 text-red-400 bg-red-900/20 rounded-md"><AlertTriangle className="mx-auto h-10 w-10 mb-2"/>{error || "Instance data unavailable."}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="max-w-3xl mx-auto bg-slate-800/60 border-slate-700 text-slate-200 shadow-xl">
        <CardHeader>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="absolute top-4 left-4 text-slate-300 border-slate-600 hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="pt-10 text-center">
            <Settings2 className="mx-auto h-12 w-12 text-sky-400 mb-3" />
            <CardTitle className="text-2xl font-bold text-sky-400 capitalize">
              {instance.integration_type.replace('_', ' ')} Integration Details
            </CardTitle>
            <CardDescription className="text-slate-400">
              Instance ID: {instance.id}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-1">Status</h4>
              <Badge variant={instance.is_active ? 'active' : 'inactive'}>
                {instance.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-1">Last Synchronized</h4>
              <p className="text-slate-200">{instance.last_sync_at ? new Date(instance.last_sync_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-1">Configuration</h4>
            <pre className="bg-slate-900/70 p-4 rounded-md text-xs text-slate-300 overflow-x-auto border border-slate-700">
              {JSON.stringify(instance.config, null, 2)}
            </pre>
          </div>

          <div className="space-y-3">
             <Button variant="outline" className="w-full sm:w-auto text-slate-300 border-slate-600 hover:bg-slate-700" onClick={() => navigate(`/admin/integrations/sync-logs/${instance.id}`)}>
                <Activity className="mr-2 h-4 w-4" /> View Sync Logs
            </Button>
             <Button variant="outline" className="w-full sm:w-auto text-slate-300 border-slate-600 hover:bg-slate-700" onClick={() => navigate(`/admin/integrations/mappings/instance/${instance.id}`)}>
                <ShieldCheck className="mr-2 h-4 w-4" /> Manage Data Mappings
            </Button>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end pt-6 border-t border-slate-700/50">
          <Button onClick={() => navigate(`/admin/integrations/instances/edit/${instance.id}`)} className="bg-sky-600 hover:bg-sky-700 text-white">
            <Edit2 className="mr-2 h-4 w-4" /> Edit Configuration
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default IntegrationDetailView;
