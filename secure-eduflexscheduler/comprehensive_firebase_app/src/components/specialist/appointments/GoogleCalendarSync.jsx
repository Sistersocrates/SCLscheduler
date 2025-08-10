
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Link2, Unlink2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const GoogleCalendarSync = () => {
  const { toast } = useToast();
  const [isSynced, setIsSynced] = useState(false); // Placeholder
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSynced(true);
    toast({ title: "Google Calendar Synced", description: "Your appointments are now syncing with Google Calendar." });
    setLoading(false);
  };
  
  const handleUnsync = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSynced(false);
    toast({ title: "Google Calendar Unlinked", description: "Syncing has been disabled.", variant: "destructive" });
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <RefreshCw className="mr-3 h-6 w-6 text-emerald-400" />
            Google Calendar Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {isSynced ? (
            <>
              <p className="text-emerald-300">Your calendar is currently synced with Google Calendar.</p>
              <Button onClick={handleUnsync} variant="destructive" disabled={loading}>
                <Unlink2 className="mr-2 h-4 w-4" /> {loading ? 'Processing...' : 'Unlink Google Calendar'}
              </Button>
            </>
          ) : (
            <>
              <p className="text-slate-400">Connect your Google Calendar to automatically sync appointments.</p>
              <Button onClick={handleSync} className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
                <Link2 className="mr-2 h-4 w-4" /> {loading ? 'Connecting...' : 'Link Google Calendar'}
              </Button>
            </>
          )}
           <p className="text-xs text-slate-500 pt-2">Last sync: Never (Placeholder)</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoogleCalendarSync;
