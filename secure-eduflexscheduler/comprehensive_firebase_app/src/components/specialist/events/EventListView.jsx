
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Presentation, PlusCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventListView = ({ events = [], onCreateEvent }) => {
  const displayEvents = events.length > 0 ? events : [
    { id: 'event-1', title: "College Application Workshop", date: "2025-06-10", capacity: 50, registered: 35 },
    { id: 'event-2', title: "Mindfulness Seminar", date: "2025-06-15", capacity: 30, registered: 20 },
  ]; // Placeholder

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <Presentation className="mr-3 h-6 w-6 text-purple-400" />
            Special Events
          </CardTitle>
          {onCreateEvent && (
            <Button onClick={onCreateEvent} size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Event
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {displayEvents.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No special events found.</p>
          ) : (
            displayEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-slate-700/50 rounded-md border border-slate-600 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-purple-300">{event.title}</h4>
                  <p className="text-xs text-slate-400">Date: {new Date(event.date).toLocaleDateString()} | Registered: {event.registered}/{event.capacity}</p>
                </div>
                <Button asChild variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-600">
                  <Link to={`/specialist/special-events/${event.id}`}><Eye className="mr-1.5 h-4 w-4"/> Manage</Link>
                </Button>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventListView;
