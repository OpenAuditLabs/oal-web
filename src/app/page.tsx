import Sidebar from "../components/common/Sidebar";

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
          

          {/* TBD */}

            

                
        </main>
      </div>
    </div>
  );
}
