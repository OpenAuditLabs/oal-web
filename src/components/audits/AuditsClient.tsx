
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AuditStatusCard, ActiveAuditCount, QueuedAuditCount } from "@/components/audits";
import { type ActiveAuditCard as AuditCard, updateActiveAuditStatus as updateActivityStatusAction, removeActiveAudit as closeActivityAction } from "@/actions/active-audits";

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
    // Capture removed card + index from the freshest state inside functional update
    let removedCard: AuditCard | null = null;
    let removedIndex = -1;
    setAuditCards(prev => {
      removedIndex = prev.findIndex(c => c.id === id);
      if (removedIndex === -1) return prev; // nothing to remove
      removedCard = prev[removedIndex];
      const next = [...prev];
      next.splice(removedIndex, 1);
      return next;
    });
    startTransition(async () => {
      const result = await closeActivityAction(id);
      if (!result.deleted && removedCard && removedIndex > -1) {
        // Reinsert only the removed card at its original position
        setAuditCards(prev => {
          // If card already exists (added back concurrently), skip
            if (prev.some(c => c.id === removedCard!.id)) return prev;
            const next = [...prev];
            const index = Math.min(removedIndex, next.length);
            next.splice(index, 0, removedCard!);
            return next;
        });
        if (removedCard.statusType === "active") {
          toast.error("Cannot delete active audits. Only queued audits can be deleted.");
        } else {
          toast.error("Failed to delete audit.");
        }
      } else if (result.deleted) {
        toast.success("Audit deleted successfully.");
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
  <div className="mb-8 space-y-4">
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
  <div className="space-y-4">
        <QueuedAuditCount count={queuedAudits.length} />
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
