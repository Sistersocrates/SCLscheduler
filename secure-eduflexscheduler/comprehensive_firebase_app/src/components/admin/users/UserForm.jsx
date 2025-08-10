
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming you'll create this
import { UserPlus2 } from 'lucide-react'; // Changed UserPlus to UserPlus2
import { useToast } from "@/components/ui/use-toast";
import { fetchRoles } from '@/lib/services/adminApiService'; // Placeholder

// Create src/components/ui/select.jsx if it doesn't exist

const UserForm = ({ user, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role_id: '', // Will store role ID
    status: 'active', // Default status
    ...(user || {}) // Spread existing user data if editing
  });

  useEffect(() => {
    // If editing, and user object has role.id (or similar), set it.
    if (user && user.role_id) {
      setFormData(prev => ({ ...prev, role_id: user.role_id.toString() }));
    } else if (user && user.role && user.role.id) { // Fallback if role object is nested
      setFormData(prev => ({ ...prev, role_id: user.role.id.toString() }));
    }

    const loadRoles = async () => {
        try {
            // const fetchedRoles = await fetchRoles(); // Actual API call
            const fetchedRoles = [ // Placeholder data
                { id: 'role_student_uuid', name: 'student' },
                { id: 'role_teacher_uuid', name: 'teacher' },
                { id: 'role_specialist_uuid', name: 'specialist' },
                { id: 'role_admin_uuid', name: 'admin' },
            ];
            setRoles(fetchedRoles);
        } catch (error) {
            toast({ title: "Error", description: "Could not load roles.", variant: "destructive" });
        }
    };
    loadRoles();
  }, [user, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role_id: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.role_id) {
        toast({ title: "Missing Fields", description: "All fields except password (for new user) are required.", variant: "destructive"});
        return;
    }
    // If new user, might need password field. For updates, password change is separate.
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-slate-800/80 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <UserPlus2 className="mr-2 h-6 w-6 text-yellow-400" />
          {user ? 'Edit User Account' : 'Create New User Account'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-slate-400">First Name</Label>
              <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-slate-400">Last Name</Label>
              <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-slate-400">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
          </div>
          {!user && ( // Password field only for new users. Updates should be separate.
             <div>
                <Label htmlFor="password_new" className="text-slate-400">Password (for new user)</Label>
                <Input id="password_new" name="password" type="password" onChange={handleChange} placeholder="Leave blank if inviting" className="bg-slate-700 border-slate-600 focus:ring-yellow-500" />
             </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role_id" className="text-slate-400">Role</Label>
              <Select name="role_id" value={formData.role_id} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 focus:ring-yellow-500">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-slate-200 border-slate-600">
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id.toString()} className="hover:bg-slate-600">{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
                <Label htmlFor="status" className="text-slate-400">Status</Label>
                <Select name="status" value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 focus:ring-yellow-500">
                    <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-slate-200 border-slate-600">
                        <SelectItem value="active" className="hover:bg-slate-600">Active</SelectItem>
                        <SelectItem value="inactive" className="hover:bg-slate-600">Inactive</SelectItem>
                        <SelectItem value="invited" className="hover:bg-slate-600">Invited</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 border-slate-600 hover:bg-slate-700">Cancel</Button>}
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold">
            {user ? 'Save Changes' : 'Create User'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;
