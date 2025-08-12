import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="h-1 bg-gray-700"></div>
      
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          

          {/* Dashboard Header */}
          <Header 
            title="Dashboard"
            subtitle="Monitor real-time security analysis and threat detection"
          />  

            

                
        </main>
      </div>
    </div>
  );
}
