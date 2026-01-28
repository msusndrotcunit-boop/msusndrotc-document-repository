import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Folder, 
  Upload, 
  FileText, 
  Download, 
  Menu, 
  ChevronRight, 
  LayoutDashboard,
  Shield,
  Target,
  Award,
  Users
} from 'lucide-react';

const SECTIONS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'corp_commander', name: 'Corp Commander', icon: Users },
  { id: 's1_personnel', name: 'S1 - Personnel', icon: Folder },
  { id: 's2_intelligence', name: 'S2 - Intelligence', icon: Folder },
  { id: 's3_training_ops', name: 'S3 - Training & Ops', icon: Folder },
  { id: 's4_logistics', name: 'S4 - Logistics', icon: Folder },
  { id: 's7_cmo', name: 'S7 - CMO', icon: Folder },
];

const TYPES = [
  { id: 'incoming', name: 'Incoming Documents' },
  { id: 'outgoing', name: 'Outgoing Documents' },
];

function App() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [activeType, setActiveType] = useState(TYPES[0].id);
  const [files, setFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) setIsSidebarOpen(true);
      if (mobile && isSidebarOpen) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (activeSection !== 'dashboard') {
      fetchFiles();
    }
  }, [activeSection, activeType]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`/api/files/${activeSection}/${activeType}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', activeSection);
    formData.append('type', activeType);

    setUploading(true);
    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (filename) => {
    window.open(`/api/download/${activeSection}/${activeType}/${filename}`, '_blank');
  };

  const activeSectionName = SECTIONS.find(s => s.id === activeSection)?.name;

  const renderDashboard = () => (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Mission Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] p-6 border-t-4 border-emerald-600 hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.2)] transition-all relative overflow-hidden group border-x border-b border-emerald-100">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
          <Target className="w-32 h-32 text-emerald-900" />
        </div>
        <div className="flex items-center mb-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-500/30 rounded-lg mr-4 text-white transform group-hover:rotate-6 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-emerald-900 tracking-wider">MISSION</h3>
        </div>
        <p className="text-emerald-900/70 leading-relaxed relative z-10 text-sm font-semibold">
          To train and develop college students to be responsible citizens and officers of the armed forces, imbued with the values of honor, patriotism, and duty.
        </p>
      </div>

      {/* Vision Card */}
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-[0_4px_20px_-4px_rgba(245,158,11,0.1)] p-6 border-t-4 border-amber-500 hover:shadow-[0_8px_30px_-4px_rgba(245,158,11,0.2)] transition-all relative overflow-hidden group border-x border-b border-amber-100">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
          <Award className="w-32 h-32 text-amber-900" />
        </div>
        <div className="flex items-center mb-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 rounded-lg mr-4 text-white transform group-hover:-rotate-6 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-amber-900 tracking-wider">VISION</h3>
        </div>
        <p className="text-amber-900/70 leading-relaxed relative z-10 text-sm font-semibold">
          A world-class leadership development program aimed at producing future leaders of the AFP and the nation, committed to excellence and service.
        </p>
      </div>

      {/* Core Values / Purpose Card */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-[0_4px_20px_-4px_rgba(71,85,105,0.1)] p-6 border-t-4 border-slate-600 hover:shadow-[0_8px_30px_-4px_rgba(71,85,105,0.2)] transition-all relative overflow-hidden group border-x border-b border-slate-200">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
          <Shield className="w-32 h-32 text-slate-900" />
        </div>
        <div className="flex items-center mb-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg shadow-slate-500/30 rounded-lg mr-4 text-white transform group-hover:rotate-3 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-wider">CORE VALUES</h3>
        </div>
        <ul className="text-slate-600 space-y-2 relative z-10 text-sm font-bold grid grid-cols-2 gap-x-4">
          <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2 shadow-sm"></span>Loyalty</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2 shadow-sm"></span>Duty</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2 shadow-sm"></span>Respect</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2 shadow-sm"></span>Selfless Service</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2 shadow-sm"></span>Honor</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2 shadow-sm"></span>Integrity</li>
          <li className="flex items-center col-span-2"><span className="w-2 h-2 bg-emerald-500 rounded-sm mr-2 shadow-sm"></span>Personal Courage</li>
        </ul>
      </div>

      {/* Quick Stats / Info */}
      <div className="col-span-1 md:col-span-3 mt-4">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-xl p-6 text-white border-l-8 border-amber-500 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-all duration-700">
             <Target className="w-80 h-80 text-white" />
          </div>
          <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
             <h3 className="text-lg md:text-2xl font-black tracking-widest text-amber-500 uppercase">Unit Information</h3>
             <div className="px-3 py-1 bg-emerald-900/50 border border-emerald-500/30 rounded text-emerald-400 text-xs font-mono tracking-widest animate-pulse">
               SYSTEM ONLINE
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            <div className="group/item">
              <p className="text-slate-400 text-xs font-bold tracking-widest mb-2 uppercase group-hover/item:text-emerald-400 transition-colors">Unit Name</p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-white group-hover/item:translate-x-1 transition-transform">MSU-SND ROTC UNIT</p>
            </div>
            <div className="group/item">
              <p className="text-slate-400 text-xs font-bold tracking-widest mb-2 uppercase group-hover/item:text-emerald-400 transition-colors">Location</p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-white group-hover/item:translate-x-1 transition-transform">Mindanao State University</p>
            </div>
            <div className="group/item">
              <p className="text-slate-400 text-xs font-bold tracking-widest mb-2 uppercase group-hover/item:text-emerald-400 transition-colors">Operational Status</p>
              <div className="flex items-center mt-1">
                 <div className="relative flex h-4 w-4 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                 </div>
                 <p className="text-2xl md:text-3xl font-bold tracking-tight text-emerald-400 shadow-emerald-500/20 drop-shadow-lg">ACTIVE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFileManager = () => (
    <div className="flex flex-col h-full px-4 md:px-6 pb-6">
      {/* Tabs */}
      <div className="flex space-x-2 mb-0 overflow-x-auto no-scrollbar pb-1 md:pb-0">
        {TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`whitespace-nowrap px-6 md:px-8 py-3 text-center font-bold text-[10px] md:text-xs focus:outline-none transition-all uppercase tracking-wider rounded-t-xl border-t border-l border-r relative overflow-hidden flex-shrink-0 ${
              activeType === type.id
                ? 'border-emerald-500 bg-white text-emerald-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10'
                : 'border-transparent bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700'
            }`}
          >
            {activeType === type.id && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>}
            {type.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-b-xl rounded-tr-xl shadow-lg border border-slate-200 flex flex-col flex-1 relative overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-slate-50 to-white gap-4 sm:gap-0">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
             <div className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-bold font-mono shadow-md flex-shrink-0">
               {files.length} FILE{files.length !== 1 ? 'S' : ''}
             </div>
             <span className="text-slate-300">|</span>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center truncate">
               <Folder className="w-4 h-4 mr-1 text-amber-500 flex-shrink-0" />
               <span className="truncate max-w-[150px] sm:max-w-none">{activeSectionName}</span>
               <ChevronRight className="w-3 h-3 mx-1 text-slate-300 flex-shrink-0" /> 
               <span className="truncate max-w-[100px] sm:max-w-none">{TYPES.find(t => t.id === activeType)?.name}</span>
             </span>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center justify-center sm:justify-start w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 cursor-pointer transition-all shadow-md hover:shadow-lg font-bold text-xs tracking-wide uppercase transform hover:-translate-y-0.5 active:translate-y-0 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </label>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50/50">
          {files.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="p-8 bg-slate-100 rounded-full mb-6 shadow-inner animate-pulse">
                <Folder className="w-16 h-16 text-slate-300" />
              </div>
              <p className="uppercase tracking-widest font-bold text-sm text-slate-500">No documents found</p>
              <p className="text-xs text-slate-400 mt-2">Upload a file to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-xl transition-all hover:border-emerald-500 flex flex-col justify-between relative overflow-hidden duration-300"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-emerald-500 transition-colors"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full -mr-8 -mt-8 group-hover:from-emerald-50 transition-colors"></div>
                  
                  <div className="pl-3 mb-4 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors shadow-sm">
                        <FileText className="w-6 h-6 text-slate-500" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-700 truncate text-sm mb-1 group-hover:text-emerald-800 transition-colors" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide flex items-center">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-1.5 group-hover:bg-emerald-400"></span>
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(file.name)}
                    className="w-full mt-2 py-2.5 px-3 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all uppercase tracking-wide ml-1 w-[calc(100%-4px)] shadow-sm hover:shadow-md"
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:hidden'
        } ${
          isMobile ? 'fixed inset-y-0 left-0 w-72 shadow-2xl' : 'relative w-72'
        } ${
          !isMobile && !isSidebarOpen ? 'w-0' : ''
        } bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white transition-all duration-300 flex flex-col z-30 border-r border-slate-800`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="h-24 flex items-center px-6 bg-slate-950/80 border-b border-slate-800 relative backdrop-blur-sm z-10">
          <div className="w-1.5 h-full bg-gradient-to-b from-amber-500 to-amber-600 absolute left-0 top-0 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <div>
            <h1 className="font-black text-2xl tracking-wider text-white drop-shadow-md">MSU-SND <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">ROTC</span></h1>
            <div className="flex items-center mt-1">
               <div className="h-px w-8 bg-slate-600 mr-2"></div>
               <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Document Repository</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 space-y-1.5 px-4 sidebar-scroll relative z-10">
          <div className="px-4 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
             <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2"></span>
             Main Command
          </div>
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3.5 flex items-center transition-all duration-300 rounded-xl group relative overflow-hidden ${
                  isActive 
                    ? 'bg-emerald-900/30 text-emerald-100 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>}
                <Icon className={`w-5 h-5 mr-3 transition-colors relative z-10 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`text-sm font-bold uppercase tracking-wide relative z-10 ${isActive ? 'text-emerald-50' : ''}`}>{section.name}</span>
                {isActive && (
                   <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 bg-black/40 border-t border-slate-800 relative z-10 backdrop-blur-md">
          <div className="flex items-center justify-center space-x-2 text-amber-500/80 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-widest font-bold">OFFICIAL USE ONLY</span>
          </div>
          <div className="text-[9px] text-center text-slate-600 font-mono">
            SECURE CONNECTION ESTABLISHED
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-100 relative">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Header */}
        <header className="bg-white h-16 md:h-20 shadow-sm px-4 md:px-8 flex items-center justify-between z-10 border-b border-slate-200 relative">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 md:p-2.5 rounded-xl hover:bg-slate-100 mr-3 md:mr-6 text-slate-500 focus:outline-none transition-colors border border-transparent hover:border-slate-200"
            >
              {isSidebarOpen ? <Menu className="w-5 h-5 md:w-6 md:h-6" /> : <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <div>
              <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                <span className="hidden sm:inline">System</span>
                <ChevronRight className="w-3 h-3 mx-1 text-slate-300 hidden sm:block" />
                <span className="text-emerald-600">Secure</span>
                <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
                <span className="text-slate-500">Node-1</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center">
                 {activeSectionName}
                 {activeSection !== 'dashboard' && <span className="ml-3 px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold tracking-wider border border-amber-200 shadow-sm">RESTRICTED</span>}
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-8">
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Current Session</p>
                <p className="text-sm font-bold text-slate-700 font-mono">{new Date().toLocaleDateString()}</p>
             </div>
             <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-amber-500 font-bold text-xs border border-slate-700 shadow-lg relative group cursor-pointer">
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
               </span>
               HQ
               <div className="absolute inset-0 border-2 border-amber-500/20 rounded-xl group-hover:border-amber-500/50 transition-colors"></div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-0 scroll-smooth">
          {activeSection === 'dashboard' ? renderDashboard() : renderFileManager()}
        </main>
      </div>
    </div>
  );
}

export default App;
