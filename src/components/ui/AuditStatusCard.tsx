"use client";

import { FileText, Clock, Activity, Play, Pause, X } from "lucide-react";

interface AuditStatusCardProps {
  id: string;
  title: string;
  currentStatus: string;
  size: string;
  started: string;
  duration: string;
  progress: number;
  statusMessage: string;
  statusType: "active" | "queued";
  onStatusChange: (id: string, newStatus: "active" | "queued") => void;
  onClose: (id: string) => void;
}

export default function AuditStatusCard({
  id,
  title,
  currentStatus,
  size,
  started,
  duration,
  progress,
  statusMessage,
  statusType,
  onStatusChange,
  onClose
}: AuditStatusCardProps) {
  const isActive = statusType === "active";
  
  const handleStatusToggle = () => {
    const newStatus = isActive ? "queued" : "active";
    onStatusChange(id, newStatus);
  };

  const handleClose = () => {
    onClose(id);
  };
  
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {isActive ? (
            <button 
              onClick={handleStatusToggle}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (
            <button 
              onClick={handleStatusToggle}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Play className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Current status */}
      <p className="text-sm text-muted-foreground mb-4">{currentStatus}</p>

      {/* Details grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Size: {size}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Started: {started}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Duration: {duration}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Analysis Progress</span>
          <span className="text-sm font-medium text-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-accent rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-yellow-500'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Status message */}
      <div className={`px-3 py-2 rounded-lg border ${
        isActive 
          ? "bg-accent text-accent-foreground border-primary" 
          : "bg-yellow-50 text-yellow-700 border-yellow-300"
      }`}>
        <span className="text-sm">{statusMessage}</span>
      </div>
    </div>
  );
}
