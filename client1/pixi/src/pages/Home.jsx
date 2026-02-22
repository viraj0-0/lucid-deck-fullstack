// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Code2, 
//   GraduationCap, 
//   BookOpen, 
//   ArrowRight, 
//   Terminal, 
//   Layout, 
//   Cpu, 
//   Zap 
// } from 'lucide-react';
// import Grainient from '../components/Grainient';

// // --- STYLES ---
// // Injecting Space Grotesk font directly
// const FontStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
//     .font-grotesk {
//       font-family: 'Space Grotesk', sans-serif;
//     }
    
//     .glass-panel {
//       background: rgba(255, 255, 255, 0.03);
//       backdrop-filter: blur(16px);
//       -webkit-backdrop-filter: blur(16px);
//       border: 1px solid rgba(255, 255, 255, 0.05);
//     }
    
//     .glass-card-hover {
//       transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//     }
    
//     .glass-card-hover:hover {
//       background: rgba(255, 255, 255, 0.08);
//       transform: translateY(-5px) scale(1.02);
//       border-color: rgba(255, 255, 255, 0.2);
//       box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
//     }

//     .text-glow {
//       text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
//     }
//   `}</style>
// );

// const FeatureCard = ({ title, description, icon: Icon, to, accent }) => (
//   <Link 
//     to={to} 
//     className="glass-panel glass-card-hover rounded-2xl p-8 flex flex-col h-full group relative overflow-hidden"
//   >
//     {/* Hover Gradient Accent */}
//     <div className={`absolute top-0 right-0 w-32 h-32 bg-${accent}-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100 duration-500`} />

//     <div className="mb-6 flex justify-between items-start relative z-10">
//       <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors">
//         <Icon size={32} className="text-white" />
//       </div>
//       <div className={`p-2 rounded-full bg-${accent}-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0`}>
//         <ArrowRight size={16} className={`text-${accent}-400`} />
//       </div>
//     </div>

//     <h3 className="text-2xl font-bold text-white mb-3 font-grotesk tracking-tight relative z-10">
//       {title}
//     </h3>
    
//     <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 relative z-10">
//       {description}
//     </p>

//     <div className="flex items-center gap-2 text-xs font-mono text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest relative z-10">
//       <div className={`w-1.5 h-1.5 rounded-full bg-${accent}-500`} />
//       Launch App
//     </div>
//   </Link>
// );

// const RoadmapItem = ({ stage, title }) => (
//   <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group cursor-default">
//     <div className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">{stage}</div>
//     <div className="text-slate-300 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">{title}</div>
//   </div>
// );

// export default function Home() {
//   return (
//     <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-grotesk selection:bg-cyan-500/30">
//       <FontStyles />
      
//       {/* BACKGROUND LAYER */}
//       <div className="fixed inset-0 z-0">
//         <Grainient
//     color1="#FF9FFC"
//     color2="#5227FF"
//     color3="#B19EEF"
//     timeSpeed={0.25}
//     colorBalance={0}
//     warpStrength={1}
//     warpFrequency={5}
//     warpSpeed={2}
//     warpAmplitude={50}
//     blendAngle={0}
//     blendSoftness={0.05}
//     rotationAmount={500}
//     noiseScale={2}
//     grainAmount={0.1}
//     grainScale={2}
//     grainAnimated={false}
//     contrast={1.5}
//     gamma={1}
//     saturation={1}
//     centerX={0}
//     centerY={0}
//     zoom={0.9}
//   />
//         {/* Vignette Overlay for focus */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />
//       </div>

//       {/* CONTENT LAYER */}
//       <div className="relative z-10 flex flex-col min-h-screen">
        
//         {/* Navbar */}
//         <nav className="px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.5)]">
//               S
//             </div>
//             <span className="text-xl font-bold tracking-tighter">StudentHub<span className="text-cyan-400">.ai</span></span>
//           </div>
//           <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
//             <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
//             <span className="hover:text-white cursor-pointer transition-colors">About</span>
//             <span className="text-white bg-white/10 px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/20 transition-all cursor-pointer">Beta v1.0</span>
//           </div>
//         </nav>

//         {/* Hero Section */}
//         <main className="flex-1 flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto w-full pt-10 pb-20">
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             {/* Left: Text */}
//             <div className="space-y-8">
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase animate-in fade-in slide-in-from-left-4 duration-700">
//                 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//                 System Online
//               </div>
              
//               <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-glow animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
//                 The Future of <br/>
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
//                   Academic Focus.
//                 </span>
//               </h1>
              
//               <p className="text-lg text-slate-400 max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
//                 A unified workspace connecting intelligent coding, streamlined admissions, and precision exam prep. Designed for the modern scholar.
//               </p>

//               <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
//                  <Link to="/code" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center gap-2">
//                    Launch IDE <Terminal size={18} />
//                  </Link>
//                  <div className="px-8 py-4 glass-panel rounded-full text-white font-medium hover:bg-white/10 transition-all cursor-pointer border-white/20">
//                    View Roadmap
//                  </div>
//               </div>
//             </div>

//             {/* Right: Feature Cards (Staggered Grid) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative animate-in fade-in zoom-in duration-1000 delay-500">
//                {/* Decorative background glow behind cards */}
//                <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

//                <div className="space-y-4 mt-8 md:mt-12">
//                   <FeatureCard 
//                     title="Gemini IDE" 
//                     description="Context-aware AI coding environment. Write, debug, and optimize with multiprogramming support."
//                     icon={Code2}
//                     to="/code"
//                     accent="cyan"
//                   />

//                </div>

//                <div className="space-y-4">
//                   <FeatureCard 
//                     title="MSBTE Prep" 
//                     description="Subject-wise MCQ mock tests with real-time analytics and detailed performance reports."
//                     icon={BookOpen}
//                     to="/mcq"
//                     accent="emerald" // Greenish teal
//                   />
//                   <FeatureCard 
//                     title="Admissions" 
//                     description="Smart college filtering based on cut-offs and criteria. Find your perfect campus match."
//                     icon={GraduationCap}
//                     to="/admission"
//                     accent="blue"
//                   />
//                </div>
//             </div>
//           </div>

//           {/* Bottom Section: Roadmap Snippet */}
//           <div className="mt-32 border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
//              <div>
//                 <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
//                   <Zap size={20} className="text-yellow-400" /> Coming Soon
//                 </h4>
//                 <p className="text-slate-400 text-sm">
//                   We are actively building features from our community wishlist. Here is what is deploying next.
//                 </p>
//              </div>
             
//              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
//                 <RoadmapItem stage="Q3 2026" title="Mind Maps & visual learning" />
//                 <RoadmapItem stage="Q3 2026" title="Audio Overviews (Text-to-Speech)" />
//                 <RoadmapItem stage="Q4 2026" title="AI Flash Cards Generation" />
//                 <RoadmapItem stage="Q4 2026" title="Auto-Summarizer for PDFs" />
//                 <RoadmapItem stage="In Dev" title="Smart Time Scheduling" />
//                 <RoadmapItem stage="In Dev" title="Context-based AI Chat" />
//              </div>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }












// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Code2, 
//   GraduationCap, 
//   BookOpen, 
//   ArrowRight, 
//   Terminal, 
//   Layout, 
//   Cpu, 
//   Zap,
//   Edit3 // Icon for Whiteboard
// } from 'lucide-react';
// import Grainient from '../components/Grainient';

// // --- STYLES ---
// const FontStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
//     .font-grotesk {
//       font-family: 'Space Grotesk', sans-serif;
//     }
    
//     .glass-panel {
//       background: rgba(255, 255, 255, 0.03);
//       backdrop-filter: blur(16px);
//       -webkit-backdrop-filter: blur(16px);
//       border: 1px solid rgba(255, 255, 255, 0.05);
//     }
    
//     .glass-card-hover {
//       transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//     }
    
//     .glass-card-hover:hover {
//       background: rgba(255, 255, 255, 0.95); /* Switched to bright background on hover */
//       transform: translateY(-5px) scale(1.02);
//       border-color: rgba(255, 255, 255, 1);
//       box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
//     }

//     /* Target text to turn dark when the card is hovered */
//     .glass-card-hover:hover h3, 
//     .glass-card-hover:hover p,
//     .glass-card-hover:hover .launch-text {
//       color: #0f172a !important; /* slate-900 */
//     }
    
//     .glass-card-hover:hover .icon-container {
//       background: rgba(0, 0, 0, 0.05);
//       border-color: rgba(0, 0, 0, 0.1);
//     }
    
//     .glass-card-hover:hover .icon-svg {
//       color: #0f172a !important;
//     }

//     .text-glow {
//       text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
//     }
//   `}</style>
// );

// const FeatureCard = ({ title, description, icon: Icon, to, accent }) => (
//   <Link 
//     to={to} 
//     className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col h-full group relative overflow-hidden"
//   >
//     <div className={`absolute top-0 right-0 w-32 h-32 bg-${accent}-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100 duration-500`} />

//     <div className="mb-4 flex justify-between items-start relative z-10">
//       <div className="icon-container p-3 bg-white/5 rounded-xl border border-white/10 transition-colors">
//         <Icon size={28} className="icon-svg text-white transition-colors" />
//       </div>
//       <div className={`p-2 rounded-full bg-${accent}-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0`}>
//         <ArrowRight size={16} className={`text-${accent}-600`} />
//       </div>
//     </div>

//     <h3 className="text-xl font-bold text-white mb-2 font-grotesk tracking-tight relative z-10 transition-colors">
//       {title}
//     </h3>
    
//     <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 relative z-10 transition-colors">
//       {description}
//     </p>

//     <div className="launch-text flex items-center gap-2 text-[10px] font-mono text-slate-500 transition-colors uppercase tracking-widest relative z-10">
//       <div className={`w-1.5 h-1.5 rounded-full bg-${accent}-500`} />
//       Launch App
//     </div>
//   </Link>
// );

// const RoadmapItem = ({ stage, title }) => (
//   <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group cursor-default">
//     <div className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">{stage}</div>
//     <div className="text-slate-300 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">{title}</div>
//   </div>
// );

// export default function Home() {
//   return (
//     <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-grotesk selection:bg-cyan-500/30">
//       <FontStyles />
      
//       <div className="fixed inset-0 z-0">
//         <Grainient
//           color1="#FF9FFC" color2="#5227FF" color3="#B19EEF"
//           timeSpeed={0.25} noiseScale={2} grainAmount={0.1}
//           contrast={1.5} zoom={0.9}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />
//       </div>

//       <div className="relative z-10 flex flex-col min-h-screen">
//         <nav className="px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.5)]">S</div>
//             <span className="text-xl font-bold tracking-tighter">StudentHub<span className="text-cyan-400">.ai</span></span>
//           </div>
//           <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
//             <span className="text-white bg-white/10 px-4 py-1.5 rounded-full border border-white/10">Beta v1.0</span>
//           </div>
//         </nav>

//         <main className="flex-1 flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto w-full pt-10 pb-20">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
//             {/* Left Column */}
//             <div className="space-y-8 lg:sticky lg:top-24">
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase">
//                 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//                 System Online
//               </div>
//               <h1 className="text-5xl md:text-7xl font-bold leading-tight text-glow">
//                 The Future of <br/>
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
//                   Academic Focus.
//                 </span>
//               </h1>
//               <p className="text-lg text-slate-400 max-w-lg">
//                 A unified workspace connecting intelligent coding, collaborative drawing, and precision exam prep.
//               </p>
//               <div className="flex flex-wrap gap-4">
//                  <Link to="/code" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2">
//                    Get Started <Terminal size={18} />
//                  </Link>
//               </div>
//             </div>

//             {/* Right Column: Cards Grid (Fixed Overlap) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FeatureCard 
//                 title="Gemini IDE" 
//                 description="Context-aware AI coding environment. Write, debug, and optimize with multiprogramming support."
//                 icon={Code2} to="/code" accent="cyan"
//               />
//               <FeatureCard 
//                 title="Whiteboard" 
//                 description="Visualize complex problems with our collaborative canvas and AI-assisted diagrams."
//                 icon={Edit3} to="/whiteboard" accent="purple"
//               />
//               <FeatureCard 
//                 title="MSBTE Prep" 
//                 description="Subject-wise MCQ mock tests with real-time analytics and performance reports."
//                 icon={BookOpen} to="/mcq" accent="emerald"
//               />
//               <FeatureCard 
//                 title="Admissions" 
//                 description="Smart college filtering based on cut-offs and criteria. Find your perfect campus match."
//                 icon={GraduationCap} to="/admission" accent="blue"
//               />
//             </div>
//           </div>

//           {/* Roadmap Section */}
//           <div className="mt-24 border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
//              <div>
//                 <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
//                   <Zap size={20} className="text-yellow-400" /> Coming Soon
//                 </h4>
//                 <p className="text-slate-400 text-sm">Deploying features from our community wishlist.</p>
//              </div>
//              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
//                 <RoadmapItem stage="Q3 2026" title="Mind Maps & visual learning" />
//                 <RoadmapItem stage="Q3 2026" title="Audio Overviews" />
//                 <RoadmapItem stage="Q4 2026" title="AI Flash Cards" />
//                 <RoadmapItem stage="Q4 2026" title="Auto-Summarizer" />
//                 <RoadmapItem stage="In Dev" title="Smart Time Scheduling" />
//                 <RoadmapItem stage="In Dev" title="Context-based AI Chat" />
//              </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }














// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Code2, 
//   GraduationCap, 
//   BookOpen, 
//   ArrowRight, 
//   Terminal, 
//   Cpu, 
//   Zap,
//   Edit3 
// } from 'lucide-react';
// import Grainient from '../components/Grainient';

// // --- STYLES ---
// const FontStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
//     .font-grotesk {
//       font-family: 'Space Grotesk', sans-serif;
//     }
    
//     .glass-panel {
//       background: rgba(255, 255, 255, 0.03);
//       backdrop-filter: blur(16px);
//       -webkit-backdrop-filter: blur(16px);
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       transition: all 0.3s ease;
//     }
    
//     .glass-card-hover:hover {
//       background: rgba(255, 255, 255, 0.07); /* Subtle lift, not white */
//       transform: translateY(-4px);
//       border-color: rgba(255, 255, 255, 0.15);
//       box-shadow: 0 15px 30px -10px rgba(0,0,0,0.4);
//     }

//     .text-glow {
//       text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
//     }
//   `}</style>
// );

// const FeatureCard = ({ title, description, icon: Icon, to, accentColor, accentClass }) => (
//   <Link 
//     to={to} 
//     className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col h-full group relative overflow-hidden"
//   >
//     {/* Animated Gradient Spot */}
//     <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} 
//          style={{ backgroundColor: accentColor }} />

//     <div className="mb-5 flex justify-between items-start relative z-10">
//       <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors">
//         <Icon size={28} className="text-white" />
//       </div>
//       <div className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}
//            style={{ backgroundColor: `${accentColor}20` }}>
//         <ArrowRight size={16} style={{ color: accentColor }} />
//       </div>
//     </div>

//     <h3 className="text-xl font-bold text-white mb-2 font-grotesk tracking-tight relative z-10">
//       {title}
//     </h3>
    
//     <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 relative z-10">
//       {description}
//     </p>

//     <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest relative z-10">
//       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
//       Launch App
//     </div>
//   </Link>
// );

// const RoadmapItem = ({ stage, title }) => (
//   <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group cursor-default">
//     <div className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">{stage}</div>
//     <div className="text-slate-300 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">{title}</div>
//   </div>
// );

// export default function Home() {
//   return (
//     <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-grotesk selection:bg-cyan-500/30">
//       <FontStyles />
      
//       {/* BACKGROUND */}
//       <div className="fixed inset-0 z-0">
//         <Grainient
//           color1="#FF9FFC" color2="#5227FF" color3="#B19EEF"
//           timeSpeed={0.25} noiseScale={2} grainAmount={0.1}
//           contrast={1.5} zoom={0.9}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none" />
//       </div>

//       <div className="relative z-10 flex flex-col min-h-screen">
        
//         {/* Navbar */}
//         <nav className="px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.4)]">
//               S
//             </div>
//             <span className="text-xl font-bold tracking-tighter">StudentHub<span className="text-cyan-400">.ai</span></span>
//           </div>
//           <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400 items-center">
//             <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
//             <span className="text-white bg-white/10 px-4 py-1.5 rounded-full border border-white/10">Beta v1.0</span>
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="flex-1 px-6 md:px-12 max-w-7xl mx-auto w-full pt-12 pb-20">
          
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
//             {/* Left Column: Hero Text */}
//             <div className="lg:col-span-5 space-y-8 lg:pt-10">
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest">
//                 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//                 System Online
//               </div>
              
//               <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-glow">
//                 The Future of <br/>
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
//                   Academic Focus.
//                 </span>
//               </h1>
              
//               <p className="text-lg text-slate-400 leading-relaxed max-w-md">
//                 A unified workspace connecting intelligent coding, collaborative drawing, and precision exam prep.
//               </p>

//               <div className="flex flex-wrap gap-4 pt-4">
//                  <Link to="/code" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-xl">
//                    Get Started <Terminal size={18} />
//                  </Link>
//               </div>
//             </div>

//             {/* Right Column: Cards Grid (Fixed Layout) */}
//             <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FeatureCard 
//                 title="Code IDE" 
//                 description="Context-aware AI coding environment. Write, debug, and optimize with multiprogramming support."
//                 icon={Code2} to="/code" accentColor="#22d3ee" // Cyan 400
//               />
//               <FeatureCard 
//                 title="Whiteboard" 
//                 description="Visualize complex problems with our collaborative canvas and AI-assisted diagrams."
//                 icon={Edit3} to="/whiteboard" accentColor="#a855f7" // Purple 500
//               />
//               <FeatureCard 
//                 title="MSBTE Prep" 
//                 description="Subject-wise MCQ mock tests with real-time analytics and performance reports."
//                 icon={BookOpen} to="/mcq" accentColor="#10b981" // Emerald 500
//               />
//               <FeatureCard 
//                 title="Admissions" 
//                 description="Smart college filtering based on cut-offs and criteria. Find your perfect campus match."
//                 icon={GraduationCap} to="/admission" accentColor="#3b82f6" // Blue 500
//               />
              
//               {/* System Stats Card (Small) */}
//               <div className="md:col-span-2 glass-panel rounded-2xl p-5 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="p-2 bg-cyan-500/10 rounded-lg"><Cpu size={20} className="text-cyan-400" /></div>
//                   <div>
//                     <div className="text-xs text-slate-500 uppercase font-mono">Neural Engine</div>
//                     <div className="text-sm font-bold text-white">Active & Optimized</div>
//                   </div>
//                 </div>
//                 <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden hidden sm:block">
//                   <div className="h-full bg-cyan-400 w-2/3 animate-pulse" />
//                 </div>
//               </div>
//             </div>

//           </div>

//           {/* Roadmap Footer */}
//           <div className="mt-24 border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
//              <div>
//                 <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
//                   <Zap size={20} className="text-yellow-400" /> Coming Soon
//                 </h4>
//                 <p className="text-slate-400 text-sm">
//                   We are building features from our community wishlist. Here is what is deploying next.
//                 </p>
//              </div>
             
//              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
//                 <RoadmapItem stage="Q3 2026" title="Mind Maps & visual learning" />
//                 <RoadmapItem stage="Q3 2026" title="Audio Overviews (TTS)" />
//                 <RoadmapItem stage="Q4 2026" title="AI Flash Cards Generation" />
//                 <RoadmapItem stage="Q4 2026" title="Auto-Summarizer for PDFs" />
//                 <RoadmapItem stage="In Dev" title="Smart Time Scheduling" />
//                 <RoadmapItem stage="In Dev" title="Context-based AI Chat" />
//              </div>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }











// ui change







import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Zap,
  Edit3 
} from 'lucide-react';
import Grainient from '../components/Grainient';

// --- STYLES ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
    .font-grotesk {
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .glass-panel {
      /* Premium Frosted Glass Effect */
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2); /* Creates a subtle 3D highlight edge */
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .glass-card-hover:hover {
      /* Brighter on hover */
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%);
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.25);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
    }

    .text-glow {
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    }
  `}</style>
);

const FeatureCard = ({ title, description, icon: Icon, to, accentColor }) => (
  <Link 
    to={to} 
    className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col h-full group relative overflow-hidden"
  >
    {/* Animated Gradient Spot */}
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} 
         style={{ backgroundColor: accentColor }} />

    <div className="mb-5 flex justify-between items-start relative z-10">
      <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors">
        <Icon size={28} className="text-white" />
      </div>
      <div className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}
           style={{ backgroundColor: `${accentColor}20` }}>
        <ArrowRight size={16} style={{ color: accentColor }} />
      </div>
    </div>

    <h3 className="text-xl font-bold text-white mb-2 font-grotesk tracking-tight relative z-10">
      {title}
    </h3>
    
    <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1 relative z-10">
      {description}
    </p>

    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest relative z-10">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
      Launch App
    </div>
  </Link>
);

const RoadmapItem = ({ stage, title }) => (
  <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group cursor-default">
    <div className="font-mono text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">{stage}</div>
    <div className="text-slate-300 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">{title}</div>
  </div>
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-grotesk selection:bg-cyan-500/30">
      <FontStyles />
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <Grainient
          color1="#FF9FFC" color2="#5227FF" color3="#B19EEF"
          timeSpeed={0.25} noiseScale={2} grainAmount={0.1}
          contrast={1.5} zoom={0.9}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              L
            </div>
            <span className="text-xl font-bold tracking-tighter">Lucid Deck</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm items-center">
            {/* Added glass background to Documentation */}
            <Link 
              to="/nexusdocs" 
              className="text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-medium"
            >
              Documentation
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 max-w-7xl mx-auto w-full pt-12 pb-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-5 space-y-8 lg:pt-10">
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-glow">
                The Future of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                  Academic Focus.
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                A unified workspace connecting intelligent coding, collaborative drawing, and precision exam prep.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                 <Link to="/code" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-xl">
                   Get Started <Terminal size={18} />
                 </Link>
              </div>
            </div>

            {/* Right Column: Cards Grid (Fixed Layout) */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureCard 
                title="Code IDE" 
                description="Context-aware AI coding environment. Write, debug, and optimize with multiprogramming support."
                icon={Code2} to="/code" accentColor="#22d3ee" // Cyan 400
              />
              <FeatureCard 
                title="Whiteboard" 
                description="Visualize complex problems with our collaborative canvas and AI-assisted diagrams."
                icon={Edit3} to="/whiteboard" accentColor="#a855f7" // Purple 500
              />
              <FeatureCard 
                title="MSBTE Prep" 
                description="Subject-wise MCQ mock tests with real-time analytics and performance reports."
                icon={BookOpen} to="/mcq" accentColor="#10b981" // Emerald 500
              />
              <FeatureCard 
                title="Admissions" 
                description="Smart college filtering based on cut-offs and criteria. Find your perfect campus match."
                icon={GraduationCap} to="/admission" accentColor="#3b82f6" // Blue 500
              />
            </div>

          </div>

          {/* Roadmap Footer */}
          <div className="mt-24 border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
             <div>
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Zap size={20} className="text-yellow-400" /> Coming Soon
                </h4>
                <p className="text-slate-400 text-sm">
                  We are building features from our community wishlist. Here is what is deploying next.
                </p>
             </div>
             
             <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
                <RoadmapItem stage="Q3 2026" title="Mind Maps & visual learning" />
                <RoadmapItem stage="Q3 2026" title="Audio Overviews (TTS)" />
                <RoadmapItem stage="Q4 2026" title="AI Flash Cards Generation" />
                <RoadmapItem stage="Q4 2026" title="Auto-Summarizer for PDFs" />
                <RoadmapItem stage="In Dev" title="Smart Time Scheduling" />
                <RoadmapItem stage="In Dev" title="Context-based AI Chat" />
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}