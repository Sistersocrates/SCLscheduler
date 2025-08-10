
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const IntegrationStatusIndicator = ({ status, size = "sm" }) => {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  
  let IconComponent;
  let colorClass;
  let text;

  switch (status) {
    case 'active':
    case 'connected':
    case 'success':
      IconComponent = CheckCircle;
      colorClass = 'text-emerald-400';
      text = 'Active';
      break;
    case 'inactive':
    case 'disconnected':
      IconComponent = XCircle;
      colorClass = 'text-slate-500';
      text = 'Inactive';
      break;
    case 'error':
    case 'failed':
      IconComponent = AlertTriangle;
      colorClass = 'text-red-400';
      text = 'Error';
      break;
    case 'syncing':
    case 'pending':
      IconComponent = Loader2;
      colorClass = 'text-sky-400 animate-spin';
      text = 'Syncing';
      break;
    default:
      IconComponent = AlertTriangle;
      colorClass = 'text-yellow-400';
      text = 'Unknown';
  }

  return (
    <div className={cn("flex items-center space-x-1", colorClass)}>
      <IconComponent className={iconSize} />
      {size !== "icon" && <span className={cn("text-xs", size === "sm" ? "text-xs" : "text-sm")}>{text}</span>}
    </div>
  );
};

export default IntegrationStatusIndicator;
