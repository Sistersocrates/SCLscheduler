
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Edit2, Trash2, ShieldAlert, UserCog, ChevronsUpDown, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchAllUsers, deleteUserAdmin, updateUserRoleAdmin, fetchRoles } from '@/lib/services/adminApiService';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";


const UserListView = ({ onEditUser, onCreateUser }) => {
  const { toast } = useToast();
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [roleChangePopover, setRoleChangePopover] = useState({ open: false, userId: null });


  const loadUsers = useCallback(async (page = 1, limit = 10) => {
    if (!adminUser?.tenant_id) {
      setError("Tenant ID is missing. Cannot load users.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { users: fetchedUsers, count } = await fetchAllUsers(adminUser.tenant_id, {
        search: searchTerm,
        page,
        limit,
      });
      setUsers(fetchedUsers || []);
      setPagination(prev => ({ ...prev, page, limit, total: count || 0 }));
    } catch (err) {
      console.error("Failed to load users:", err);
      const descriptiveError = `Could not load user data: ${err.message || 'Unknown error'}`;
      setError(descriptiveError);
      toast({ title: "Error Loading Users", description: descriptiveError, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast, adminUser?.tenant_id, searchTerm]);

  const loadRoles = useCallback(async () => {
    if (!adminUser?.tenant_id) return;
    try {
      const fetchedRoles = await fetchRoles(adminUser.tenant_id);
      setRoles(fetchedRoles || []);
    } catch (err) {
      toast({ title: "Error Loading Roles", description: err.message, variant: "destructive" });
    }
  }, [toast, adminUser?.tenant_id]);

  useEffect(() => {
    loadUsers(pagination.page, pagination.limit);
    loadRoles();
  }, [loadUsers, loadRoles, pagination.page, pagination.limit]);


  const handleSearch = () => {
    loadUsers(1, pagination.limit);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUserAdmin(userId);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      setPagination(prev => ({...prev, total: prev.total -1}));
      toast({ title: "User Deleted", description: "User has been successfully deleted." });
    } catch (err) {
      toast({ title: "Error Deleting User", description: err.message, variant: "destructive" });
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    try {
        await updateUserRoleAdmin(userId, newRoleId);
        // Update user in local state
        setUsers(prevUsers => prevUsers.map(u => 
            u.id === userId ? { ...u, role_id: newRoleId, role: roles.find(r => r.id === newRoleId) } : u
        ));
        toast({ title: "User Role Updated", description: "User role has been successfully updated." });
    } catch (err) {
        toast({ title: "Error Updating Role", description: err.message, variant: "destructive" });
    }
    setRoleChangePopover({ open: false, userId: null });
  };


  if (loading && users.length === 0) return <div className="text-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div><p className="mt-3 text-slate-300">Loading users...</p></div>;
  if (error) return <div className="text-center p-10 text-red-400 bg-red-900/20 rounded-md"><ShieldAlert className="mx-auto h-10 w-10 mb-2"/>{error}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200 shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center text-2xl font-bold text-yellow-400">
            <UserCog className="mr-3 h-7 w-7" />
            User Management
          </CardTitle>
          <Button onClick={onCreateUser} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold shadow-md transition-transform hover:scale-105">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <Input
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 focus:ring-yellow-500 focus:border-yellow-500 flex-grow placeholder-slate-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-yellow-400">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/30">
            <Table>
              <TableHeader>
                <TableRow className="border-b-slate-700 hover:bg-slate-700/40">
                  <TableHead className="text-slate-300 font-semibold px-4 py-3">Name</TableHead>
                  <TableHead className="text-slate-300 font-semibold px-4 py-3">Email</TableHead>
                  <TableHead className="text-slate-300 font-semibold px-4 py-3">Role</TableHead>
                  <TableHead className="text-slate-300 font-semibold px-4 py-3">Status</TableHead>
                  <TableHead className="text-slate-300 font-semibold px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && users.length > 0 && (
                    <TableRow><TableCell colSpan="5" className="text-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto"></div></TableCell></TableRow>
                )}
                {!loading && users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center text-slate-400 py-10 text-lg">No users found{searchTerm && ' matching your search'}.</TableCell>
                  </TableRow>
                ) : users.map(user => (
                  <TableRow key={user.id} className="border-b-slate-700 hover:bg-slate-750/60 transition-colors duration-150">
                    <TableCell className="font-medium text-slate-100 px-4 py-3">{user.first_name} {user.last_name}</TableCell>
                    <TableCell className="text-slate-300 px-4 py-3">{user.email}</TableCell>
                    <TableCell className="text-slate-300 capitalize px-4 py-3">
                        <Popover open={roleChangePopover.userId === user.id && roleChangePopover.open} onOpenChange={(isOpen) => setRoleChangePopover({ open: isOpen, userId: user.id })}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={roleChangePopover.userId === user.id && roleChangePopover.open}
                                    className="w-[150px] justify-between text-slate-300 border-slate-600 hover:bg-slate-700"
                                >
                                    {user.role?.name || "Select role"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0 bg-slate-800 border-slate-700">
                                <Command>
                                    <CommandInput placeholder="Search role..." className="h-9 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"/>
                                    <CommandList>
                                        <CommandEmpty>No role found.</CommandEmpty>
                                        <CommandGroup>
                                            {roles.map((role) => (
                                            <CommandItem
                                                key={role.id}
                                                value={role.name}
                                                onSelect={() => handleRoleChange(user.id, role.id)}
                                                className="text-slate-300 hover:bg-slate-700 !cursor-pointer"
                                            >
                                                {role.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        user.role_id === role.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        user.status === 'active' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50' : 
                        user.status === 'inactive' ? 'bg-rose-600/30 text-rose-200 border border-rose-500/50' :
                        'bg-slate-600/30 text-slate-200 border border-slate-500/50'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1 px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => onEditUser(user)} className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 h-9 w-9 rounded-full"><Edit2 className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 w-9 rounded-full"><Trash2 className="h-4 w-4"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pagination.total > pagination.limit && (
            <div className="flex justify-center items-center space-x-2 mt-6">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadUsers(pagination.page - 1, pagination.limit)} 
                    disabled={pagination.page <= 1 || loading}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                    Previous
                </Button>
                <span className="text-slate-400 text-sm">Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}</span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadUsers(pagination.page + 1, pagination.limit)} 
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || loading}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                    Next
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserListView;
