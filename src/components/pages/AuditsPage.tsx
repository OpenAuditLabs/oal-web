"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import AuditStatusCard from "@/components/ui/AuditStatusCard";
import auditsData from "@/data/audits.json";

interface AuditCard {
  id: string;
  title: string;
  currentStatus: string;
  size: string;
  started: string;
  duration: string;
  progress: number;
  statusMessage: string;
  statusType: "active" | "queued";
}

interface AuditsPageProps {
  initialAudits?: AuditCard[];
}

export default function AuditsPage({ initialAudits = [] }: AuditsPageProps) {
  const [auditCards, setAuditCards] = useState<AuditCard[]>(
    initialAudits.length > 0 ? initialAudits : (auditsData.audits as AuditCard[])
  );

  const handleStatusChange = (id: string, newStatus: "active" | "queued") => {
    setAuditCards(prev => prev.map(card => 
      card.id === id 
        ? { 
            ...card, 
            statusType: newStatus
          }
        : card
    ));
  };

  const handleClose = (id: string) => {
    setAuditCards(prev => prev.filter(card => card.id !== id));
  };

  const activeAudits = auditCards.filter(card => card.statusType === "active");
  const queuedAudits = auditCards.filter(card => card.statusType === "queued");

  return (
    <main className="flex-1 p-8">
      <Header 
        title="Audits"
        subtitle="Monitor real-time security analysis and threat detection"
      />

      {/* Active Audits Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Audits</h2>
        {activeAudits.map(card => (
          <AuditStatusCard
            key={card.id}
            id={card.id}
            title={card.title}
            currentStatus={card.currentStatus}
            size={card.size}
            started={card.started}
            duration={card.duration}
            progress={card.progress}
            statusMessage={card.statusMessage}
            statusType={card.statusType}
            onStatusChange={handleStatusChange}
            onClose={handleClose}
          />
        ))}
      </div>

      {/* Queued Audits Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Queued Audits</h2>
        {queuedAudits.map(card => (
          <AuditStatusCard
            key={card.id}
            id={card.id}
            title={card.title}
            currentStatus={card.currentStatus}
            size={card.size}
            started={card.started}
            duration={card.duration}
            progress={card.progress}
            statusMessage={card.statusMessage}
            statusType={card.statusType}
            onStatusChange={handleStatusChange}
            onClose={handleClose}
          />
        ))}
      </div>
    </main>
  );
}
