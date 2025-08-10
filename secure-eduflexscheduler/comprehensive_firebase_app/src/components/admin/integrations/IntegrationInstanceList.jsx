
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit2, Trash2, Power, PowerOff, AlertTriangle, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { fetchIntegrationConfigsAdmin, updateIntegrationConfigAdmin, deleteIntegrationConfigAdmin } from '@/lib/services/adminApi/integrationManagement';
import { useAuth } from '@/contexts/AuthContext';


const IntegrationInstanceList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInstances = useCallback(async () => {
    if (!user?.tenant_id) {
      setError("Tenant information is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIntegrationConfigsAdmin(user.tenant_id, {});
      setInstances(data || []);
    } catch (err) {
      setError(err.message || "Failed to load integration instances.");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.tenant_id, toast]);

  useEffect(() => {
    loadInstances();
  }, [loadInstances]);

  const handleToggleActive = async (instance) => {
    try {
      // The 'config' object should be preserved. Only 'is_active' is toggled.
      const updatedInstance = await updateIntegrationConfigAdmin(instance.id, { 
        config: instance.config, // Pass existing config
        is_active: !instance.is_active 
      });
      toast({ title: "Status Updated", description: `Integration ${updatedInstance.integration_type} is now ${updatedInstance.is_active ? 'active' : 'inactive'}.` });
      loadInstances(); 
    } catch (err) {
      toast({ title: "Error Updating Status", description: err.message, variant: "destructive" });
    }
  };
  
  const handleDeleteInstance = async (instanceId) => {
     if (!window.confirm("Are you sure you want to delete this integration instance? This may affect system functionality.")) return;
    try {
        await deleteIntegrationConfigAdmin(instanceId);
        toast({ title: "Instance Deleted", description: "Integration instance has been removed." });
        loadInstances(); 
    } catch (err) {
        toast({ title: "Error Deleting Instance", description: err.message, variant: "destructive" });
    }
  };


  if (loading) return <div className="text-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto"></div><p className="mt-3 text-slate-300">Loading instances...</p></div>;
  if (error) return <div className="text-center p-10 text-red-400 bg-red-900/20 rounded-md"><AlertTriangle className="mx-auto h-10 w-10 mb-2"/>{error}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200 shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-sky-400">Configured Integrations</CardTitle>
            <CardDescription className="text-slate-400">Manage your active and inactive integration instances.</CardDescription>
          </div>
          <Button onClick={() => navigate('/admin/integrations/providers')} className="bg-sky-600 hover:bg-sky-700 text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Integration
          </Button>
        </CardHeader>
        <CardContent>
          {instances.length === 0 ? (
            <div className="text-center py-10">
              <Settings2 className="mx-auto h-16 w-16 text-slate-500 mb-4" />
              <p className="text-slate-400 text-lg">No integration instances configured yet.</p>
              <p className="text-slate-500 text-sm">Click "Add New Integration" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/30">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-slate-700 hover:bg-slate-700/40">
                    <TableHead className="text-slate-300 font-semibold">Type</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Last Sync</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instances.map((instance) => (
                    <TableRow key={instance.id} className="border-b-slate-700 hover:bg-slate-750/60">
                      <TableCell className="font-medium text-slate-100 capitalize">{instance.integration_type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge variant={instance.is_active ? 'active' : 'inactive'}>
                          {instance.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {instance.last_sync_at ? new Date(instance.last_sync_at).toLocaleString() : 'Never'}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleActive(instance)} className={instance.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-emerald-400 hover:text-emerald-300"}>
                          {instance.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/integrations/instances/edit/${instance.id}`)} className="text-sky-400 hover:text-sky-300">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteInstance(instance.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntegrationInstanceList;
