import Header from "@/components/common/Header";
import KPIGrid from "../common/KPIGrid";
import AuditTable from "../common/AuditTable";
import pastAuditData from "@/data/pastAuditKPI.json";
import pastAuditsData from "@/data/pastAudits.json";


export default function PastAuditPage(){
    return (
        <main className="flex-1 p-8">
            <Header 
                title="Audit History"
                subtitle="Review completed security analysis and findings"
            />
            <KPIGrid kpiData={pastAuditData} />
            <AuditTable audits={pastAuditsData} />
        </main>
    );
}
