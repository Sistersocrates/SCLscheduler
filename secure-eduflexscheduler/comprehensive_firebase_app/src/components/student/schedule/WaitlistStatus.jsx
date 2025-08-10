
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered, UserMinus, Loader2 } from 'lucide-react';

const WaitlistStatus = ({ seminarTitle, position, totalOnWaitlist, onLeaveWaitlist, isLoading }) => {
  if (position === null || position === undefined) {
    return null; // Don't render if not on waitlist for this specific seminar
  }

  return (
    <Card className="bg-amber-900/30 border-amber-700/50 shadow-md mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold text-amber-300 flex items-center">
          <ListOrdered className="mr-2 h-5 w-5" />
          You are on the Waitlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-slate-300">
          For: <span className="font-medium text-amber-200">{seminarTitle}</span>
        </p>
        <p className="text-slate-300">
          Your Position: <span className="font-bold text-xl text-amber-100">#{position}</span>
        </p>
        <p className="text-slate-400 text-xs">
          Total students on waitlist: {totalOnWaitlist}
        </p>
        {onLeaveWaitlist && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLeaveWaitlist}
            disabled={isLoading}
            className="w-full mt-2 border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <UserMinus className="mr-2 h-4 w-4" />
            Leave Waitlist
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitlistStatus;
