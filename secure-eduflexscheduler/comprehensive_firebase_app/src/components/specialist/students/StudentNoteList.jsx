
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentNoteList = ({ notes = [], onEditNote, onDeleteNote }) => {
  const displayNotes = notes.length > 0 ? notes : [
    { id: 1, title: "Initial Consultation", date: "2025-05-20", contentSnippet: "Discussed academic goals...", isConfidential: false },
    { id: 2, title: "Follow-up Session", date: "2025-05-22", contentSnippet: "Reviewed progress on study habits...", isConfidential: true },
  ]; // Placeholder

  return (
    <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FileText className="mr-3 h-6 w-6 text-amber-400" />
          Student Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayNotes.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No notes found for this student.</p>
        ) : (
          displayNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-slate-700/50 rounded-md border border-slate-600"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-amber-300 flex items-center">
                    {note.isConfidential && <Lock className="mr-1.5 h-3.5 w-3.5 text-red-400" />}
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-500">{new Date(note.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-1">
                  {onEditNote && <Button variant="ghost" size="icon" className="h-7 w-7 text-sky-400 hover:text-sky-300" onClick={() => onEditNote(note)}><Edit2 className="h-4 w-4"/></Button>}
                  {onDeleteNote && <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => onDeleteNote(note.id)}><Trash2 className="h-4 w-4"/></Button>}
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-1 truncate">{note.contentSnippet}</p>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default StudentNoteList;
