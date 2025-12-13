"use client";

import { Button } from "@/components/ui/button";
import { PastAudit } from "@/types/audit";
import { downloadCsv } from "@/lib/csv";

interface DownloadCsvButtonProps {
  pastAudits: PastAudit[];
}

export function DownloadCsvButton({ pastAudits }: DownloadCsvButtonProps) {
  const handleDownloadCsv = () => {
    downloadCsv("past-audits.csv", pastAudits);
  };

  return (
    <Button onClick={handleDownloadCsv} disabled={pastAudits.length === 0}>
      Download CSV
    </Button>
  );
}