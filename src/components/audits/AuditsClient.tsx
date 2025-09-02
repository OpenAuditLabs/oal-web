
"use client";

import { useState, useTransition } from "react";
import { AuditStatusCard, ActiveAuditCount } from "@/components/audits";
import { type AuditCard } from "@/actions/activities";
import { updateActivityStatusAction, closeActivityAction } from "@/actions/activities";

interface AuditsClientProps {
  initialAudits: AuditCard[];
  searchQuery?: string;
  statusFilter?: string[];
}

export function AuditsClient({ initialAudits, searchQuery = "", statusFilter = ["active", "queued"] }: AuditsClientProps) {
  const [auditCards, setAuditCards] = useState<AuditCard[]>(initialAudits);

  // Filter audits by search query and status before rendering
  const normalizedSearch = searchQuery.toLowerCase();
  const filteredAudits = auditCards.filter(card => {
    const matchesSearch = normalizedSearch ? card.title.toLowerCase().includes(normalizedSearch) : true;
    const matchesStatus = statusFilter.length > 0 ? statusFilter.includes(card.statusType) : true;
    return matchesSearch && matchesStatus;
  });

  const startTransition = useTransition()[1];

  const handleStatusChange = (id: string, newStatus: "active" | "queued") => {
    // Optimistic update
    setAuditCards(prev => prev.map(card =>
      card.id === id ? { ...card, statusType: newStatus } : card
    ));

    startTransition(async () => {
      const updated = await updateActivityStatusAction(id, newStatus);
      if (!updated) {
        // Revert if failed
        setAuditCards(prev => prev.map(card =>
          card.id === id ? { ...card, statusType: newStatus === 'active' ? 'queued' : 'active' } : card
        ));
      } else {
        // Sync other computed fields from server (progress, messages, etc.)
        setAuditCards(prev => prev.map(card =>
          card.id === id ? { ...card, ...updated } : card
        ));
      }
    });
  };

  const handleClose = (id: string) => {
    // Optimistic removal
    const snapshot = auditCards;
    setAuditCards(prev => prev.filter(card => card.id !== id));
    startTransition(async () => {
      const result = await closeActivityAction(id);
      if (!result.deleted) {
        // Revert on failure
        setAuditCards(snapshot);
      }
    });
  };

  const activeAudits = filteredAudits.filter(card => card.statusType === "active");
  const queuedAudits = filteredAudits.filter(card => card.statusType === "queued");

  return (
    <>
      {/* Active Audit Count Section */}
      <ActiveAuditCount count={activeAudits.length} />

      {/* Active Audits Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Active Audits</h2>
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
        <h2 className="text-xl font-bold text-foreground mb-4">Queued Audits</h2>
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
    </>
  );
}
