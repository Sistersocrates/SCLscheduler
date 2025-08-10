
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, Save } from 'lucide-react'; // Changed Settings to Settings2
import { useToast } from "@/components/ui/use-toast";
// import { fetchSystemSettings, updateSystemSettings } from '@/lib/services/adminApiService'; // Placeholder

const SystemSettingsView = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({ // Placeholder data
    siteName: "My School Platform",
    defaultAcademicYear: "2024-2025",
    allowStudentSelfRegistration: true,
    maxSeminarCapacity: 30,
    notificationEmail: "noreply@example.com",
  });
  const [loading, setLoading] = useState(false);

  // useEffect to fetch settings initially:
  // useEffect(() => {
  //   const loadSettings = async () => {
  //     const fetched = await fetchSystemSettings(); setSettings(fetched);
  //   }
  //   loadSettings();
  // }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await updateSystemSettings(settings);
      toast({ title: "Settings Saved", description: "System settings have been updated (Placeholder)." });
    } catch (err) {
      toast({ title: "Error Saving Settings", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Settings2 className="mr-3 h-6 w-6 text-yellow-400" />
          System Configuration
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="siteName" className="text-slate-400">Site Name</Label>
              <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
            </div>
            <div>
              <Label htmlFor="defaultAcademicYear" className="text-slate-400">Default Academic Year</Label>
              <Input id="defaultAcademicYear" name="defaultAcademicYear" value={settings.defaultAcademicYear} onChange={handleChange} placeholder="YYYY-YYYY" className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="maxSeminarCapacity" className="text-slate-400">Default Max Seminar Capacity</Label>
                <Input id="maxSeminarCapacity" name="maxSeminarCapacity" type="number" value={settings.maxSeminarCapacity} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
            </div>
            <div>
                <Label htmlFor="notificationEmail" className="text-slate-400">System Notification Email</Label>
                <Input id="notificationEmail" name="notificationEmail" type="email" value={settings.notificationEmail} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="allowStudentSelfRegistration" 
              name="allowStudentSelfRegistration"
              checked={settings.allowStudentSelfRegistration} 
              onCheckedChange={(checked) => setSettings(prev => ({...prev, allowStudentSelfRegistration: checked}))}
            />
            <Label htmlFor="allowStudentSelfRegistration" className="text-slate-300">Allow Student Self-Registration for Seminars</Label>
          </div>
          {/* Add more settings as needed */}
        </CardContent>
        <CardFooter className="border-t border-slate-700/50 pt-6">
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold" disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save System Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SystemSettingsView;
