
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { ArrowLeft, Save, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createIntegrationConfigAdmin } from '@/lib/services/adminApi/integrationManagement';

const GoogleAuthSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [clientId, setClientId] = useState('');
  const [clientSecretKeyName, setClientSecretKeyName] = useState(''); // Name of the secret in Supabase Vault
  const [redirectUri, setRedirectUri] = useState(window.location.origin + '/auth/callback');
  const [scopes, setScopes] = useState('openid,email,profile,https://www.googleapis.com/auth/calendar.events');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    if (!user?.tenant_id) {
      setFormError("Tenant information is missing.");
      setLoading(false);
      return;
    }
    if (!clientId || !clientSecretKeyName) {
      setFormError("Client ID and Client Secret Key Name are required.");
      setLoading(false);
      return;
    }

    const payload = {
      tenant_id: user.tenant_id,
      integration_type: 'google',
      config: {
        client_id: clientId,
        client_secret_key_name: clientSecretKeyName,
        redirect_uri: redirectUri,
        scopes: scopes.split(',').map(s => s.trim()),
      },
      is_active: true, // Default to active
    };

    try {
      await createIntegrationConfigAdmin(payload);
      toast({ title: "Success", description: "Google integration configured successfully." });
      // You might want to store the GOOGLE_CLIENT_ID in .env or a global config after successful setup
      // For now, we navigate back to the instances list.
      navigate('/admin/integrations/instances');
    } catch (err) {
      setFormError(err.message || "An unexpected error occurred.");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <Card className="max-w-2xl mx-auto bg-slate-800/60 border-slate-700 text-slate-200 shadow-xl">
        <CardHeader>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="absolute top-4 left-4 text-slate-300 border-slate-600 hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <CardTitle className="text-2xl font-bold text-sky-400 pt-10 text-center">Configure Google Integration</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Set up OAuth 2.0 for Google services.
            <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="block text-xs text-sky-400 hover:underline mt-1">
              Visit Google Cloud Console <ExternalLink className="inline h-3 w-3 ml-0.5"/>
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client_id" className="text-slate-300">Google Client ID</Label>
              <Input id="client_id" value={clientId} onChange={(e) => setClientId(e.target.value)} className="bg-slate-700/50 border-slate-600" placeholder="Enter Google Client ID from Google Cloud Console" required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_secret_key_name" className="text-slate-300">Google Client Secret (Supabase Vault Key Name)</Label>
              <Input id="client_secret_key_name" value={clientSecretKeyName} onChange={(e) => setClientSecretKeyName(e.target.value)} className="bg-slate-700/50 border-slate-600" placeholder="Name of the secret in Supabase Vault" required/>
              <p className="text-xs text-slate-400">Store your Google Client Secret in Supabase Vault (Project Settings &gt; Vault) and enter its name here (e.g., <code className="bg-slate-700 p-0.5 rounded text-xs">GOOGLE_CLIENT_SECRET</code>).</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="redirect_uri" className="text-slate-300">Authorized Redirect URI</Label>
              <Input id="redirect_uri" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} className="bg-slate-700/50 border-slate-600" placeholder="e.g., https://your-app.com/auth/callback" required/>
              <p className="text-xs text-slate-400">This URI must be added to your Google Cloud Console OAuth 2.0 client settings. For Supabase Edge Functions, this might be your app's callback page that then calls the function.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="scopes" className="text-slate-300">Scopes (comma-separated)</Label>
              <Input id="scopes" value={scopes} onChange={(e) => setScopes(e.target.value)} className="bg-slate-700/50 border-slate-600" placeholder="e.g., openid,email,profile,https://www.googleapis.com/auth/calendar.events" required/>
               <p className="text-xs text-slate-400">Default scopes for profile, email, and calendar events are included. Adjust as needed.</p>
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
        <CardFooter className="flex justify-end pt-6 border-t border-slate-700/50">
            <Button type="submit" onClick={handleSubmit} className="bg-sky-600 hover:bg-sky-700 text-white" disabled={loading}>
                <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Google Configuration'}
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GoogleAuthSetup;
