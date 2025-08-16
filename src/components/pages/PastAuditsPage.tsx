import Header from "@/components/common/Header";
import KPIGrid from "../common/KPIGrid";
import pastAuditData from "@/data/pastAuditKPI.json";


export default function PastAuditPage(){
    return (
        <main className="flex-1 p-8">
            <Header 
                title="Audit History"
                subtitle="Review completed security analysis and findings"
            />
            <KPIGrid kpiData={pastAuditData} />
        </main>
    );
}
