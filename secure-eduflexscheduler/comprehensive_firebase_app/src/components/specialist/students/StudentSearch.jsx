
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Placeholder
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Replace with actual API call: const results = await specialistApiService.searchStudents(searchTerm);
    const mockResults = [
      { id: '1', name: 'Alice Wonderland', grade: 10 },
      { id: '2', name: 'Bob The Builder', grade: 9 },
    ].filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(mockResults);
    if (onSearch) onSearch(mockResults);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search students by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-pink-500"
        />
        <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
          <Search className="h-4 w-4 mr-2" /> {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-700/50 p-4 rounded-md border border-slate-600 space-y-2"
          >
            {searchResults.map(student => (
              <motion.div 
                key={student.id} 
                className="p-2 hover:bg-slate-600/50 rounded cursor-pointer text-sm text-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {student.name} - Grade {student.grade}
              </motion.div>
            ))}
          </motion.div>
        )}
        {!loading && searchTerm && searchResults.length === 0 && (
           <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-4 text-slate-400 flex items-center justify-center"
           >
            <UserX className="w-5 h-5 mr-2 text-slate-500"/> No students found matching "{searchTerm}".
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentSearch;
