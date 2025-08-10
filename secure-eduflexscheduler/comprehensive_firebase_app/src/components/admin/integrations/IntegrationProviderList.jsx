
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Settings, PlusCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const providers = [
  { 
    id: 'google', 
    name: 'Google Workspace', 
    description: 'Integrate with Google for authentication, calendar sync, and Google Sheets.', 
    icon: <img  alt="Google logo" class="h-10 w-10" src="https://images.unsplash.com/photo-1678483789111-3a04c4628bd6" />,
    features: ['Authentication (OAuth 2.0)', 'Google Calendar Sync', 'Google Sheets Export'],
    setupPath: '/admin/integrations/setup/google', // Path to specific setup component
    docsLink: 'https://developers.google.com/identity/protocols/oauth2'
  },
  { 
    id: 'classlink', 
    name: 'ClassLink', 
    description: 'Connect with ClassLink for OneClick SSO and roster synchronization.', 
    icon: <img  alt="ClassLink logo" class="h-10 w-10 rounded" src="https://images.unsplash.com/photo-1624388611710-bdf95023d1c2" />,
    features: ['OneClick SSO', 'Roster Sync (coming soon)'],
    setupPath: '/admin/integrations/setup/classlink',
    docsLink: 'https://developer.classlink.com/'
  },
  { 
    id: 'skyward', 
    name: 'Skyward SIS', 
    description: 'Integrate with Skyward for student data import and attendance/credit export.', 
    icon: <img  alt="Skyward logo" class="h-10 w-10" src="https://images.unsplash.com/photo-1658203897456-14cdc8e81146" />,
    features: ['Student Data Import', 'Attendance Export', 'Credit Export'],
    setupPath: '/admin/integrations/setup/skyward',
    docsLink: '#' // Placeholder
  },
  { 
    id: 'infinitecampus', 
    name: 'Infinite Campus SIS', 
    description: 'Connect with Infinite Campus for student data and academic records.', 
    icon: <img  alt="Infinite Campus logo" class="h-10 w-10" src="https://images.unsplash.com/photo-1636051028886-0059ad2383c8" />,
    features: ['Student Data Import', 'Attendance Export', 'Credit Export'],
    setupPath: '/admin/integrations/setup/infinitecampus',
    docsLink: '#' // Placeholder
  },
];

const IntegrationProviderList = () => {
  const navigate = useNavigate();
  // In a real app, you'd fetch configured instances to show status
  const [configuredInstances, setConfiguredInstances] = useState(['google']); // Example

  const handleSetup = (providerId) => {
    // Navigate to a generic form or specific setup component
    const provider = providers.find(p => p.id === providerId);
    if (provider && provider.setupPath) {
        navigate(provider.setupPath);
    } else {
        navigate(`/admin/integrations/instances/new?provider=${providerId}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Available Integration Providers</h2>
        <p className="text-slate-400 mt-1">Select a provider to configure a new integration instance or manage existing ones.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => {
          const isConfigured = configuredInstances.includes(provider.id);
          return (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: providers.indexOf(provider) * 0.1 }}
            >
              <Card className="bg-slate-800/70 border-slate-700 hover:border-sky-500/70 transition-all duration-200 flex flex-col h-full shadow-lg hover:shadow-sky-500/20">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600">
                    {provider.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-sky-300">{provider.name}</CardTitle>
                    {isConfigured && (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center w-fit mt-1">
                        <CheckCircle className="h-3 w-3 mr-1" /> Configured
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-slate-400 text-sm mb-3">{provider.description}</CardDescription>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Features:</h4>
                    <ul className="list-disc list-inside pl-1 space-y-0.5">
                      {provider.features.map(feature => (
                        <li key={feature} className="text-xs text-slate-400">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t border-slate-700/50">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-sky-300 w-full sm:w-auto"
                    onClick={() => window.open(provider.docsLink, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Docs
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto"
                    onClick={() => handleSetup(provider.id)}
                  >
                    {isConfigured ? <Settings className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    {isConfigured ? 'Manage' : 'Set Up'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default IntegrationProviderList;
