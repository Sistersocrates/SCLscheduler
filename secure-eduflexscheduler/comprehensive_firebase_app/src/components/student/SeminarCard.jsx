
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { checkWaitlistPosition, getWaitlistCount } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const SeminarCard = ({ 
  seminar, 
  isRegistered, 
  onRegister, 
  onUnregister, 
  onJoinWaitlist, 
  onLeaveWaitlist, 
  disabled 
}) => {
  const { user } = useAuth();
  const [waitlistPosition, setWaitlistPosition] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWaitlistInfo = async () => {
      if (!user?.email || !seminar?.id) return;
      
      try {
        const [position, count] = await Promise.all([
          checkWaitlistPosition(seminar.id, user.email),
          getWaitlistCount(seminar.id)
        ]);
        setWaitlistPosition(position);
        setWaitlistCount(count);
      } catch (error) {
        console.error('Error fetching waitlist info:', error);
      }
    };

    fetchWaitlistInfo();
  }, [seminar?.id, user?.email]);

  const isFull = seminar.current_enrollment >= seminar.capacity;

  const handleRegister = async () => {
    setLoading(true);
    try {
      await onRegister();
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      await onUnregister();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {seminar.image_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={seminar.image_url}
            alt={seminar.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{seminar.title}</h3>
        <p className="text-gray-600">{seminar.description}</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Room: {seminar.room || 'TBD'}</p>
          <p className="text-sm text-gray-500">
            Enrollment: {seminar.current_enrollment || 0} / {seminar.capacity}
          </p>
          <p className="text-sm text-gray-500">
            Teacher: {seminar.teacher_name}
          </p>
          {seminar.community_partner && (
            <p className="text-sm text-gray-500">
              Partner: {seminar.community_partner}
            </p>
          )}
          {seminar.notes && (
            <p className="text-sm text-gray-500">
              Notes: {seminar.notes}
            </p>
          )}
          {waitlistCount > 0 && (
            <p className="text-sm text-amber-600">
              Waitlist: {waitlistCount} {waitlistCount === 1 ? 'student' : 'students'}
            </p>
          )}
          {waitlistPosition !== null && (
            <p className="text-sm font-medium text-amber-600">
              Your waitlist position: #{waitlistPosition}
            </p>
          )}
        </div>
        
        {isRegistered ? (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleUnregister}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Unregister'}
          </Button>
        ) : waitlistPosition !== null ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onLeaveWaitlist(seminar.id)}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Leave Waitlist'}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={handleRegister}
              disabled={loading || disabled || isFull}
            >
              {loading ? 'Processing...' : isFull ? 'Full' : 'Register'}
            </Button>
            {isFull && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onJoinWaitlist(seminar.id)}
                disabled={loading || disabled}
              >
                {loading ? 'Processing...' : 'Join Waitlist'}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SeminarCard;
