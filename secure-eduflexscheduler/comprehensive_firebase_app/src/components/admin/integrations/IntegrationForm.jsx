
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox component exists
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { ArrowLeft, Save, TestTube2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createIntegrationConfigAdmin, fetchIntegrationConfigByIdAdmin, updateIntegrationConfigAdmin } from '@/lib/services/adminApi/integrationManagement'; // Assuming fetch by ID and update

const IntegrationForm = () => {
  const navigate = useNavigate();
  const { instanceId } = useParams(); // For editing
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerTypeFromQuery = queryParams.get('provider');

  const { toast } = useToast();
  const { user } = useAuth();

  const [integrationType, setIntegrationType] = useState(providerTypeFromQuery || '');
  const [config, setConfig] = useState({}); // Store specific config fields like client_id, client_secret_key_name
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [pageTitle, setPageTitle] = useState('Add New Integration');

  useEffect(() => {
    if (instanceId) {
      setPageTitle('Edit Integration Instance');
      setLoading(true);
      fetchIntegrationConfigByIdAdmin(instanceId) // This function needs to be created in service
        .then(data => {
          if (data) {
            setIntegrationType(data.integration_type);
            setConfig(data.config || {});
            setIsActive(data.is_active);
          } else {
            toast({ title: "Error", description: "Could not load integration instance.", variant: "destructive" });
            navigate('/admin/integrations/instances');
          }
        })
        .catch(err => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
          setFormError(err.message);
        })
        .finally(() => setLoading(false));
    } else if (providerTypeFromQuery) {
        setIntegrationType(providerTypeFromQuery);
        setPageTitle(`Configure ${providerTypeFromQuery.charAt(0).toUpperCase() + providerTypeFromQuery.slice(1)} Integration`);
    }
  }, [instanceId, providerTypeFromQuery, toast, navigate]);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    if (!user?.tenant_id) {
      setFormError("Tenant information is missing.");
      setLoading(false);
      return;
    }
    if (!integrationType) {
        setFormError("Integration type is required.");
        setLoading(false);
        return;
    }

    const payload = {
      tenant_id: user.tenant_id,
      integration_type: integrationType,
      config: config,
      is_active: isActive,
    };

    try {
      if (instanceId) {
        await updateIntegrationConfigAdmin(instanceId, payload); // updateIntegrationConfigAdmin needs to handle the payload structure
        toast({ title: "Success", description: "Integration instance updated successfully." });
      } else {
        await createIntegrationConfigAdmin(payload);
        toast({ title: "Success", description: "Integration instance created successfully." });
      }
      navigate('/admin/integrations/instances');
    } catch (err) {
      setFormError(err.message || "An unexpected error occurred.");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const renderConfigFields = () => {
    // Dynamically render fields based on integrationType
    switch (integrationType) {
      case 'google':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="client_id" className="text-slate-300">Google Client ID</Label>
              <Input id="client_id" name="client_id" value={config.client_id || ''} onChange={handleConfigChange} className="bg-slate-700/50 border-slate-600" placeholder="Enter Google Client ID"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_secret_key_name" className="text-slate-300">Google Client Secret (Supabase Vault Key Name)</Label>
              <Input id="client_secret_key_name" name="client_secret_key_name" value={config.client_secret_key_name || ''} onChange={handleConfigChange} className="bg-slate-700/50 border-slate-600" placeholder="Name of the secret in Supabase Vault"/>
              <p className="text-xs text-slate-400">Store your Google Client Secret in Supabase Vault and enter its name here.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="redirect_uri" className="text-slate-300">Redirect URI</Label>
              <Input id="redirect_uri" name="redirect_uri" value={config.redirect_uri || (window.location.origin + '/auth/callback')} onChange={handleConfigChange} className="bg-slate-700/50 border-slate-600" placeholder="e.g., https://yourapp.com/auth/callback"/>
               <p className="text-xs text-slate-400">This should match the one configured in your Google Cloud Console.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scopes" className="text-slate-300">Scopes (comma-separated)</Label>
              <Input id="scopes" name="scopes" value={Array.isArray(config.scopes) ? config.scopes.join(',') : (config.scopes || 'openid,email,profile')} onChange={(e) => setConfig(prev => ({...prev, scopes: e.target.value.split(',').map(s=>s.trim())}))} className="bg-slate-700/50 border-slate-600" placeholder="e.g., openid,email,profile,https://www.googleapis.com/auth/calendar"/>
            </div>
          </>
        );
      case 'classlink':
         return (
          <>
            <div className="space-y-2">
              <Label htmlFor="classlink_client_id" className="text-slate-300">ClassLink Client ID</Label>
              <Input id="classlink_client_id" name="classlink_client_id" value={config.classlink_client_id || ''} onChange={handleConfigChange} className="bg-slate-700/50 border-slate-600" placeholder="Enter ClassLink Client ID"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classlink_client_secret_key_name" className="text-slate-300">ClassLink Client Secret (Supabase Vault Key Name)</Label>
              <Input id="classlink_client_secret_key_name" name="classlink_client_secret_key_name" value={config.classlink_client_secret_key_name || ''} onChange={handleConfigChange} className="bg-slate-700/50 border-slate-600" placeholder="Name of the secret in Supabase Vault"/>
            </div>
          </>
        );
      // Add cases for skyward, infinitecampus etc.
      default:
        return <p className="text-slate-400">Configuration fields for '{integrationType}' will appear here once selected or defined.</p>;
    }
  };


  if (loading && instanceId) return <div className="text-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto"></div><p className="mt-3 text-slate-300">Loading configuration...</p></div>;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <Card className="max-w-2xl mx-auto bg-slate-800/60 border-slate-700 text-slate-200 shadow-xl">
        <CardHeader>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="absolute top-4 left-4 text-slate-300 border-slate-600 hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <CardTitle className="text-2xl font-bold text-sky-400 pt-10 text-center">{pageTitle}</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            {instanceId ? 'Modify the details for this integration instance.' : 'Set up a new connection to an external system.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="integration_type" className="text-slate-300">Integration Provider</Label>
              <Input id="integration_type" name="integration_type" value={integrationType} disabled className="bg-slate-700 border-slate-600 opacity-70 cursor-not-allowed" />
            </div>
            
            {renderConfigFields()}

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="is_active" checked={isActive} onCheckedChange={setIsActive} className="border-slate-600 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"/>
              <Label htmlFor="is_active" className="text-slate-300 font-medium">Enable this integration instance</Label>
            </div>

            {formError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-md text-sm flex items-center"
              >
                <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                {formError}
              </motion.div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-700/50">
            <Button type="button" variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700 w-full sm:w-auto" onClick={() => {/* Test connection logic */ toast({title: "Test Connection", description: "Test functionality not yet implemented."})}}>
                <TestTube2 className="mr-2 h-4 w-4" /> Test Connection
            </Button>
            <Button type="submit" onClick={handleSubmit} className="bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto" disabled={loading}>
                <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : (instanceId ? 'Save Changes' : 'Create Instance')}
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default IntegrationForm;
