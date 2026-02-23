// import React, { useState } from 'react';
// import { 
//   BookOpen, Code2, GraduationCap, PenTool, Layout, 
//   ChevronRight, Box, Type, Droplet, Layers, 
//   Terminal, ShieldCheck, Cpu, Download, Search,
//   Menu, X, Github, ExternalLink, Zap
// } from 'lucide-react';
// import Grainient from '../components/Grainient';

// // --- STYLES (Matching Home Page) ---
// const FontStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
//     .font-grotesk {
//       font-family: 'Space Grotesk', sans-serif;
//     }
    
//     .glass-panel {
//       background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
//       backdrop-filter: blur(24px);
//       -webkit-backdrop-filter: blur(24px);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-top: 1px solid rgba(255, 255, 255, 0.2);
//       border-left: 1px solid rgba(255, 255, 255, 0.2);
//       box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
//       transition: all 0.3s ease;
//     }
    
//     .glass-card-hover:hover {
//       background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%);
//       transform: translateY(-4px);
//       border-color: rgba(255, 255, 255, 0.25);
//       box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
//     }
//   `}</style>
// );

// const THEME = {
//   gradientText: "bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
// };

// const MODULES = [
//   {
//     id: 'ide',
//     title: 'Nexus IDE',
//     icon: Code2,
//     color: 'from-blue-500 to-indigo-600',
//     desc: 'Browser-based integrated development environment with syntax highlighting for 6+ languages.',
//     features: ['Gemini AI Assistance', 'Live HTML Preview', 'PDF Export', 'Syntax Highlighting']
//   },
//   {
//     id: 'admission',
//     title: 'Admission Portal',
//     icon: GraduationCap,
//     color: 'from-cyan-500 to-blue-500',
//     desc: 'Real-time college search engine with probability calculation and comparison tools.',
//     features: ['Smart Filtering', 'Cutoff Comparison', 'Shortlist Persistence', 'Chance Predictor']
//   },
//   {
//     id: 'mcq',
//     title: 'Exam Engine',
//     icon: ShieldCheck,
//     color: 'from-emerald-500 to-teal-600',
//     desc: 'Robust MCQ testing platform with timer logic, negative marking, and result analytics.',
//     features: ['Subject/Unit Modes', 'Real-time Timer', 'Performance Analytics', 'Question Banking']
//   },
//   {
//     id: 'whiteboard',
//     title: 'Infinite Canvas',
//     icon: PenTool,
//     color: 'from-pink-500 to-rose-600',
//     desc: 'Vector-based whiteboard for diagramming and brainstorming with export capabilities.',
//     features: ['Pan & Zoom', 'Shape Primitives', 'Image Upload', 'Dark/Light Modes']
//   }
// ];

// const NexusDocs = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <div className="min-h-screen font-grotesk selection:bg-cyan-500/30 selection:text-white bg-black text-slate-100 relative overflow-hidden">
//       <FontStyles />
      
//       {/* --- AMBIENT BACKGROUND --- */}
//       <div className="fixed inset-0 z-0">
//         <Grainient
//           color1="#FF9FFC" color2="#5227FF" color3="#B19EEF"
//           timeSpeed={0.25} noiseScale={2} grainAmount={0.1}
//           contrast={1.5} zoom={0.9}
//         />
//         <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/80 to-black pointer-events-none" />
//       </div>

//       <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        
//         {/* --- SIDEBAR NAVIGATION --- */}
//         <aside className={`fixed md:sticky top-0 h-screen w-72 glass-panel !rounded-none !border-y-0 !border-l-0 border-r border-white/10 z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
//           <div className="p-6 flex flex-col h-full bg-black/20">
//             <div className="flex items-center gap-3 mb-10">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
//                 <Layout className="text-white" size={20} />
//               </div>
//               <div>
//                 <h1 className="font-bold text-xl tracking-tight text-white">Nexus Docs</h1>
//                 <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">System v2.0</p>
//               </div>
//             </div>

//             <nav className="flex-1 space-y-1">
//               <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={BookOpen} label="Overview" />
//               <NavItem active={activeTab === 'components'} onClick={() => setActiveTab('components')} icon={Box} label="Design System" />
//               <div className="pt-4 pb-2">
//                 <p className="px-4 text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2">Modules</p>
//                 {MODULES.map(m => (
//                   <NavItem 
//                     key={m.id} 
//                     active={activeTab === m.id} 
//                     onClick={() => setActiveTab(m.id)} 
//                     icon={m.icon} 
//                     label={m.title} 
//                   />
//                 ))}
//               </div>
//               <NavItem active={activeTab === 'install'} onClick={() => setActiveTab('install')} icon={Terminal} label="Installation" />
//             </nav>

//             <div className="mt-auto pt-6 border-t border-white/10">
//               <button className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm text-slate-300 backdrop-blur-md">
//                 <Github size={16} /> View Source
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* --- MAIN CONTENT --- */}
//         <main className="flex-1 min-w-0 md:ml-0 transition-all">
//           {/* Mobile Header */}
//           <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 glass-panel !rounded-none sticky top-0 z-40">
//             <div className="font-bold text-white">Nexus Docs</div>
//             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
//               {mobileMenuOpen ? <X /> : <Menu />}
//             </button>
//           </div>

//           <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12">
            
//             {/* OVERVIEW TAB */}
//             {activeTab === 'overview' && (
//               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 <div className="max-w-3xl">
//                   <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
//                     Unified <span className={THEME.gradientText}>Digital Ecosystem</span>
//                   </h2>
//                   <p className="text-lg text-slate-300 leading-relaxed">
//                     Nexus is a suite of high-performance React applications sharing a cohesive "Glass & Grain" design language. 
//                     Built for education and productivity, it leverages Tailwind CSS and modern React patterns.
//                   </p>
//                   <div className="flex gap-4 mt-8">
//                     <button className="px-6 py-3 rounded-full bg-cyan-500 text-black font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
//                       <Zap size={18} /> Get Started
//                     </button>
//                     <button className="px-6 py-3 rounded-full glass-panel hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2">
//                       <ExternalLink size={18} /> Live Demo
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {MODULES.map((module) => (
//                     <div key={module.id} className="glass-panel glass-card-hover p-8 rounded-3xl group relative overflow-hidden">
//                       <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${module.color} opacity-0 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
//                       <div className="flex justify-between items-start mb-6 relative z-10">
//                         <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg border border-white/20`}>
//                           <module.icon className="text-white" size={24} />
//                         </div>
//                       </div>

//                       <h3 className="text-2xl font-bold mb-2 text-white relative z-10">{module.title}</h3>
//                       <p className="text-slate-300 mb-6 relative z-10">{module.desc}</p>
                      
//                       <ul className="space-y-3 relative z-10">
//                         {module.features.map((feat, i) => (
//                           <li key={i} className="flex items-center gap-3 text-sm text-slate-400 font-mono">
//                             <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${module.color}`}></div>
//                             {feat}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* DESIGN SYSTEM TAB */}
//             {activeTab === 'components' && (
//               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 <div>
//                   <h2 className="text-3xl font-bold mb-2 text-white">Design System</h2>
//                   <p className="text-slate-400">The core visual language powering Nexus applications.</p>
//                 </div>

//                 {/* Colors */}
//                 <section>
//                   <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
//                     <Droplet size={14} /> Color Palette
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <ColorCard name="Pure Black" hex="#000000" tw="bg-black" />
//                     <ColorCard name="Cyan 400" hex="#22d3ee" tw="bg-cyan-400" />
//                     <ColorCard name="Indigo 500" hex="#6366f1" tw="bg-indigo-500" />
//                     <ColorCard name="Emerald 400" hex="#34d399" tw="bg-emerald-400" />
//                   </div>
//                 </section>

//                 {/* Typography */}
//                 <section>
//                   <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
//                     <Type size={14} /> Typography
//                   </h3>
//                   <div className="glass-panel p-8 rounded-3xl space-y-8">
//                     <div className="space-y-2">
//                       <div className="text-4xl md:text-5xl font-bold text-white">Display Heading</div>
//                       <div className="text-slate-500 font-mono text-xs">font-grotesk font-bold tracking-tight</div>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="text-xl text-slate-300">Body Large: The quick brown fox jumps over the lazy dog.</div>
//                       <div className="text-slate-500 font-mono text-xs">text-lg text-slate-300</div>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="text-sm font-mono text-cyan-400">const nexus = "Future of EdTech";</div>
//                       <div className="text-slate-500 font-mono text-xs">font-mono text-cyan-400</div>
//                     </div>
//                   </div>
//                 </section>

//                 {/* UI Elements */}
//                 <section>
//                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
//                     <Layers size={14} /> Interface Components
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {/* Glass Card */}
//                     <div className="glass-panel p-6 rounded-2xl">
//                       <div className="font-bold text-white mb-2">Glass Card</div>
//                       <p className="text-slate-400 text-sm">Standard container with backdrop blur and thin etched borders.</p>
//                     </div>
                    
//                     {/* Buttons */}
//                     <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 justify-center">
//                        <button className="w-full py-2.5 rounded-full bg-white text-black font-bold text-sm transition-transform hover:scale-105 shadow-[0_4px_15px_rgba(255,255,255,0.2)]">
//                          Primary Action
//                        </button>
//                        <button className="w-full py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-sm transition-colors">
//                          Secondary Action
//                        </button>
//                     </div>

//                     {/* Input */}
//                     <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 justify-center">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
//                         <input type="text" placeholder="Search..." className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/5 transition-all" />
//                       </div>
//                     </div>
//                   </div>
//                 </section>
//               </div>
//             )}

//              {/* INSTALL TAB */}
//              {activeTab === 'install' && (
//               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                  <div>
//                   <h2 className="text-3xl font-bold mb-2 text-white">Installation</h2>
//                   <p className="text-slate-400">Dependencies required to run the Nexus ecosystem.</p>
//                 </div>
                
//                 <div className="glass-panel p-0 rounded-2xl overflow-hidden">
//                   <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
//                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terminal</span>
//                     <div className="flex gap-1.5">
//                       <div className="w-3 h-3 rounded-full bg-red-500/80 border border-white/10"></div>
//                       <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-white/10"></div>
//                       <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-white/10"></div>
//                     </div>
//                   </div>
//                   <div className="p-6 font-mono text-sm text-slate-300 space-y-4 bg-black/40">
//                     <div>
//                       <span className="text-slate-500 select-none">$ </span>
//                       <span className="text-cyan-400">npm</span> install react-router-dom lucide-react framer-motion
//                     </div>
//                     <div>
//                       <span className="text-slate-500 select-none">$ </span>
//                       <span className="text-cyan-400">npm</span> install -D tailwindcss postcss autoprefixer
//                     </div>
//                     <div className="text-slate-500 italic"># Ensure your tailwind.config.js includes standard colors</div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 p-5 rounded-2xl glass-panel border-yellow-500/30">
//                   <Terminal className="shrink-0 text-yellow-400" />
//                   <p className="text-slate-300 text-sm leading-relaxed">
//                     <strong className="text-yellow-400">Note:</strong> The "Grainient" component is a custom implementation. 
//                     Ensure the <code className="text-cyan-400 font-mono bg-black/30 px-1 rounded">Grainient.jsx</code> file is present in your components folder for backgrounds to render correctly.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* DYNAMIC MODULE TABS */}
//             {MODULES.map(m => activeTab === m.id && (
//               <div key={m.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
//                  <div className="flex items-center gap-5 mb-6 glass-panel p-6 rounded-3xl inline-flex">
//                     <div className={`p-4 rounded-2xl bg-gradient-to-br ${m.color} shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20`}>
//                       <m.icon size={32} className="text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-3xl font-bold text-white mb-1">{m.title}</h2>
//                       <p className="text-slate-400 text-sm max-w-md">{m.desc}</p>
//                     </div>
//                  </div>

//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    <div className="glass-panel p-8 rounded-3xl">
//                      <h3 className="font-bold text-white mb-6 flex items-center gap-2">
//                        <Cpu size={20} className="text-cyan-400" /> Key Features
//                      </h3>
//                      <ul className="space-y-4">
//                        {m.features.map(f => (
//                          <li key={f} className="flex items-center gap-3 text-slate-300">
//                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
//                            {f}
//                          </li>
//                        ))}
//                      </ul>
//                    </div>
//                    <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center items-center text-center gap-4 relative overflow-hidden group">
//                       <div className={`absolute inset-0 bg-gradient-to-b ${m.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
//                       <Download className="text-slate-400 group-hover:text-white transition-colors" size={48} />
//                       <h3 className="font-bold text-white text-xl z-10">Export Ready</h3>
//                       <p className="text-sm text-slate-400 z-10 max-w-xs">This module supports high-fidelity export and persistent local storage caching.</p>
//                       <button className="mt-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all z-10">
//                         View Schema
//                       </button>
//                    </div>
//                  </div>
//               </div>
//             ))}

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// // Sub-components
// const NavItem = ({ active, onClick, icon: Icon, label }) => (
//   <button 
//     onClick={onClick}
//     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${active ? 'bg-white/10 text-white shadow-lg shadow-black/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
//   >
//     <Icon size={18} className={active ? 'text-cyan-400' : 'text-slate-500'} />
//     {label}
//     {active && <ChevronRight size={14} className="ml-auto text-slate-500" />}
//   </button>
// );

// const ColorCard = ({ name, hex, tw }) => (
//   <div className="p-3 rounded-xl glass-panel flex items-center gap-3">
//     <div className={`w-10 h-10 rounded-lg shadow-inner border border-white/10 ${tw}`}></div>
//     <div>
//       <div className="text-xs font-bold text-slate-200">{name}</div>
//       <div className="text-[10px] font-mono text-slate-500">{hex}</div>
//     </div>
//   </div>
// );

// export default NexusDocs;















import React, { useState } from 'react';
import { 
  BookOpen, Code2, GraduationCap, PenTool, Layout, 
  ChevronRight, Box, Type, Droplet, Layers, 
  Terminal, ShieldCheck, Cpu, Download, Search,
  Menu, X, Github, ExternalLink, Zap
} from 'lucide-react';
import Grainient from '../components/Grainient'; // Ensure this path matches your folder structure

// --- STYLES ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
    .font-grotesk {
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .glass-panel {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .glass-card-hover:hover {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%);
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.25);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
    }
  `}</style>
);

const THEME = {
  gradientText: "bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
};

const MODULES = [
  {
    id: 'ide',
    title: 'Nexus IDE',
    icon: Code2,
    color: 'from-blue-500 to-indigo-600',
    desc: 'Browser-based integrated development environment with syntax highlighting for 6+ languages.',
    features: ['Gemini AI Assistance', 'Live HTML Preview', 'PDF Export', 'Syntax Highlighting']
  },
  {
    id: 'admission',
    title: 'Admission Portal',
    icon: GraduationCap,
    color: 'from-cyan-500 to-blue-500',
    desc: 'Real-time college search engine with probability calculation and comparison tools.',
    features: ['Smart Filtering', 'Cutoff Comparison', 'Shortlist Persistence', 'Chance Predictor']
  },
  {
    id: 'mcq',
    title: 'Exam Engine',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-600',
    desc: 'Robust MCQ testing platform with timer logic, negative marking, and result analytics.',
    features: ['Subject/Unit Modes', 'Real-time Timer', 'Performance Analytics', 'Question Banking']
  },
  {
    id: 'whiteboard',
    title: 'Infinite Canvas',
    icon: PenTool,
    color: 'from-pink-500 to-rose-600',
    desc: 'Vector-based whiteboard for diagramming and brainstorming with export capabilities.',
    features: ['Pan & Zoom', 'Shape Primitives', 'Image Upload', 'Dark/Light Modes']
  }
];

const NexusDocs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-grotesk selection:bg-cyan-500/30 selection:text-white bg-black text-slate-100 relative overflow-hidden">
      <FontStyles />
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <Grainient
          color1="#FF9FFC" color2="#5227FF" color3="#B19EEF"
          timeSpeed={0.25} noiseScale={2.5} grainAmount={0.12}
          contrast={1.2} zoom={0.9}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/80 to-black pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        
        {/* SIDEBAR */}
        <aside className={`fixed md:sticky top-0 h-screen w-72 glass-panel !rounded-none !border-y-0 !border-l-0 border-r border-white/10 z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 flex flex-col h-full bg-black/20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Layout className="text-white" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-white">Nexus Docs</h1>
                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">System v2.0</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={BookOpen} label="Overview" />
              <NavItem active={activeTab === 'components'} onClick={() => setActiveTab('components')} icon={Box} label="Design System" />
              <div className="pt-4 pb-2">
                <p className="px-4 text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2">Modules</p>
                {MODULES.map(m => (
                  <NavItem 
                    key={m.id} 
                    active={activeTab === m.id} 
                    onClick={() => setActiveTab(m.id)} 
                    icon={m.icon} 
                    label={m.title} 
                  />
                ))}
              </div>
              <NavItem active={activeTab === 'install'} onClick={() => setActiveTab('install')} icon={Terminal} label="Installation" />
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
              <button className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm text-slate-300 backdrop-blur-md">
                <Github size={16} /> View Source
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 md:ml-0 transition-all h-screen overflow-y-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 glass-panel !rounded-none sticky top-0 z-40">
            <div className="font-bold text-white">Nexus Docs</div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="max-w-3xl">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    Unified <span className={THEME.gradientText}>Digital Ecosystem</span>
                  </h2>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    Nexus is a suite of high-performance React applications sharing a cohesive "Glass & Grain" design language. 
                    Built for education and productivity, it leverages Tailwind CSS and modern React patterns.
                  </p>
                  <div className="flex gap-4 mt-8">
                    <button className="px-6 py-3 rounded-full bg-cyan-500 text-black font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      <Zap size={18} /> Get Started
                    </button>
                    <button className="px-6 py-3 rounded-full glass-panel hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2">
                      <ExternalLink size={18} /> Live Demo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MODULES.map((module) => (
                    <div key={module.id} className="glass-panel glass-card-hover p-8 rounded-3xl group relative overflow-hidden">
                      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${module.color} opacity-0 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg border border-white/20`}>
                          <module.icon className="text-white" size={24} />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold mb-2 text-white relative z-10">{module.title}</h3>
                      <p className="text-slate-300 mb-6 relative z-10">{module.desc}</p>
                      
                      <ul className="space-y-3 relative z-10">
                        {module.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-400 font-mono">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${module.color}`}></div>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DESIGN SYSTEM TAB */}
            {activeTab === 'components' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-white">Design System</h2>
                  <p className="text-slate-400">The core visual language powering Nexus applications.</p>
                </div>

                {/* Colors */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <Droplet size={14} /> Color Palette
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ColorCard name="Pure Black" hex="#000000" tw="bg-black" />
                    <ColorCard name="Cyan 400" hex="#22d3ee" tw="bg-cyan-400" />
                    <ColorCard name="Indigo 500" hex="#6366f1" tw="bg-indigo-500" />
                    <ColorCard name="Emerald 400" hex="#34d399" tw="bg-emerald-400" />
                  </div>
                </section>

                {/* Typography */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <Type size={14} /> Typography
                  </h3>
                  <div className="glass-panel p-8 rounded-3xl space-y-8">
                    <div className="space-y-2">
                      <div className="text-4xl md:text-5xl font-bold text-white">Display Heading</div>
                      <div className="text-slate-500 font-mono text-xs">font-grotesk font-bold tracking-tight</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xl text-slate-300">Body Large: The quick brown fox jumps over the lazy dog.</div>
                      <div className="text-slate-500 font-mono text-xs">text-lg text-slate-300</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-mono text-cyan-400">const nexus = "Future of EdTech";</div>
                      <div className="text-slate-500 font-mono text-xs">font-mono text-cyan-400</div>
                    </div>
                  </div>
                </section>

                {/* UI Elements */}
                <section>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <Layers size={14} /> Interface Components
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="font-bold text-white mb-2">Glass Card</div>
                      <p className="text-slate-400 text-sm">Standard container with backdrop blur and thin etched borders.</p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 justify-center">
                       <button className="w-full py-2.5 rounded-full bg-white text-black font-bold text-sm transition-transform hover:scale-105 shadow-[0_4px_15px_rgba(255,255,255,0.2)]">
                         Primary Action
                       </button>
                       <button className="w-full py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-sm transition-colors">
                         Secondary Action
                       </button>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 justify-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input type="text" placeholder="Search..." className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/5 transition-all" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

             {/* INSTALL TAB */}
             {activeTab === 'install' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div>
                  <h2 className="text-3xl font-bold mb-2 text-white">Installation</h2>
                  <p className="text-slate-400">Dependencies required to run the Nexus ecosystem.</p>
                </div>
                
                <div className="glass-panel p-0 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terminal</span>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80 border border-white/10"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-white/10"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-white/10"></div>
                    </div>
                  </div>
                  <div className="p-6 font-mono text-sm text-slate-300 space-y-4 bg-black/40">
                    <div>
                      <span className="text-slate-500 select-none">$ </span>
                      <span className="text-cyan-400">npm</span> install react-router-dom lucide-react framer-motion
                    </div>
                    <div>
                      <span className="text-slate-500 select-none">$ </span>
                      <span className="text-cyan-400">npm</span> install -D tailwindcss postcss autoprefixer
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC MODULE TABS */}
            {MODULES.map(m => activeTab === m.id && (
              <div key={m.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                 <div className="flex items-center gap-5 mb-6 glass-panel p-6 rounded-3xl inline-flex">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${m.color} shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20`}>
                      <m.icon size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{m.title}</h2>
                      <p className="text-slate-400 text-sm max-w-md">{m.desc}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="glass-panel p-8 rounded-3xl">
                     <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                       <Cpu size={20} className="text-cyan-400" /> Key Features
                     </h3>
                     <ul className="space-y-4">
                       {m.features.map(f => (
                         <li key={f} className="flex items-center gap-3 text-slate-300">
                           <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                           {f}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center items-center text-center gap-4 relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-b ${m.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      <Download className="text-slate-400 group-hover:text-white transition-colors" size={48} />
                      <h3 className="font-bold text-white text-xl z-10">Export Ready</h3>
                      <p className="text-sm text-slate-400 z-10 max-w-xs">This module supports high-fidelity export and persistent local storage caching.</p>
                      <button className="mt-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all z-10">
                        View Schema
                      </button>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components
const NavItem = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${active ? 'bg-white/10 text-white shadow-lg shadow-black/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
  >
    <Icon size={18} className={active ? 'text-cyan-400' : 'text-slate-500'} />
    {label}
    {active && <ChevronRight size={14} className="ml-auto text-slate-500" />}
  </button>
);

const ColorCard = ({ name, hex, tw }) => (
  <div className="p-3 rounded-xl glass-panel flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg shadow-inner border border-white/10 ${tw}`}></div>
    <div>
      <div className="text-xs font-bold text-slate-200">{name}</div>
      <div className="text-[10px] font-mono text-slate-500">{hex}</div>
    </div>
  </div>
);

export default NexusDocs;