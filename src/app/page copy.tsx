import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Folder, 
  BarChart3, 
  Hourglass, 
  CheckCircle, 
  Shield, 
  Search, 
  Filter, 
  Upload, 
  Plus 
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="h-1 bg-gray-700"></div>
      
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 text-green-600 bg-green-50 rounded-lg font-medium"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FileText className="w-5 h-5" />
                Audits
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Clock className="w-5 h-5" />
                Past Audits
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Folder className="w-5 h-5" />
                Projects
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Monitor real-time security analysis and threat detection</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Projects</p>
                  <p className="text-2xl font-bold text-gray-800">4</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Hourglass className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Running Audits</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Findings</p>
                  <p className="text-2xl font-bold text-gray-800">8</p>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-dashed border-green-300">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Upload a file to run a quick scan
                </h3>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto mb-3">
                  <Plus className="w-4 h-4" />
                  Add Files
                </button>
                <p className="text-sm text-gray-500">
                  To upload multiple files, create a project
                </p>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">E-Commerce App</h4>
                    <span className="text-sm text-gray-500">42 files - 2.6MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">In Progress</span>
                    <span className="text-sm text-gray-600">69%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '69%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Transport API</h4>
                    <span className="text-sm text-gray-500">42 files - 2.6MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-600 font-medium">Queued</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">E-Commerce App</h4>
                    <span className="text-sm text-gray-500">42 files - 2.6MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">In Progress</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">E-Commerce App</h4>
                    <span className="text-sm text-gray-500">42 files - 2.6MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
