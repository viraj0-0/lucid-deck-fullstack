// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Pencil, 
//   Square, 
//   Circle, 
//   Type, 
//   Image as ImageIcon, 
//   Eraser, 
//   Undo, 
//   Trash2, 
//   Download, 
//   MousePointer2,
//   Minus
// } from 'lucide-react';
// import Grainient from '../components/Grainient.jsx';

// // --- HELPER FUNCTIONS ---

// const getMousePos = (canvas, evt) => {
//   const rect = canvas.getBoundingClientRect();
//   return {
//     x: evt.clientX - rect.left,
//     y: evt.clientY - rect.top
//   };
// };

// // Check if point is near a line segment (for eraser/selection)
// const distanceToSegment = (p, v, w) => {
//   const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
//   if (l2 === 0) return (p.x - v.x) ** 2 + (p.y - v.y) ** 2;
//   let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
//   t = Math.max(0, Math.min(1, t));
//   return (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2;
// };

// // --- COMPONENT ---

// export default function Whiteboard() {
//   // State
//   const [elements, setElements] = useState([]);
//   const [action, setAction] = useState('none'); // none, drawing, typing
//   const [tool, setTool] = useState('pencil'); // pencil, rect, circle, text, image, eraser
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [color, setColor] = useState('#ffffff');
//   const [lineWidth, setLineWidth] = useState(3);
  
//   // Refs
//   const canvasRef = useRef(null);
//   const textAreaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // --- DRAWING LOGIC ---

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // Clear Canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Render all elements
//     elements.forEach(el => {
//       ctx.strokeStyle = el.color;
//       ctx.lineWidth = el.lineWidth;
//       ctx.fillStyle = el.color;
//       ctx.font = `${el.fontSize || 24}px 'Space Grotesk', sans-serif`;
      
//       if (el.type === 'pencil') {
//         if (el.points.length < 2) return;
//         ctx.beginPath();
//         ctx.moveTo(el.points[0].x, el.points[0].y);
//         for (let i = 1; i < el.points.length; i++) {
//           ctx.lineTo(el.points[i].x, el.points[i].y);
//         }
//         ctx.stroke();
//       } 
//       else if (el.type === 'rect') {
//         ctx.strokeRect(el.x, el.y, el.width, el.height);
//       } 
//       else if (el.type === 'circle') {
//         ctx.beginPath();
//         const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//         ctx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
//         ctx.stroke();
//       }
//       else if (el.type === 'text') {
//         ctx.fillText(el.text, el.x, el.y + 24); // Adjust baseline
//       }
//       else if (el.type === 'image' && el.imgObj) {
//         ctx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
//       }
//     });

//   }, [elements]);

//   // Handle Window Resize
//   useEffect(() => {
//     const handleResize = () => {
//       const canvas = canvasRef.current;
//       if(canvas) {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         // Trigger re-render of elements
//         setElements(prev => [...prev]);
//       }
//     };
//     window.addEventListener('resize', handleResize);
//     handleResize(); // Initial sizing
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // --- MOUSE HANDLERS ---

//   const handleMouseDown = (e) => {
//     if (action === 'typing') return;
//     const pos = getMousePos(canvasRef.current, e);

//     if (tool === 'text') {
//       setAction('typing');
//       const id = Date.now();
//       const newEl = { id, type: 'text', x: pos.x, y: pos.y, text: '', color, fontSize: 24 };
//       setElements(prev => [...prev, newEl]);
//       setSelectedElement(newEl);
//       // Focus textarea next tick
//       setTimeout(() => {
//         if(textAreaRef.current) {
//           textAreaRef.current.value = "";
//           textAreaRef.current.focus();
//           textAreaRef.current.style.left = `${pos.x}px`;
//           textAreaRef.current.style.top = `${pos.y}px`;
//           textAreaRef.current.style.color = color;
//           textAreaRef.current.style.fontSize = "24px";
//         }
//       }, 0);
//       return;
//     }

//     if (tool === 'eraser') {
//       setAction('erasing');
//       // Simple logic: delete item under cursor immediately
//       deleteElementAt(pos);
//       return;
//     }

//     // Start Drawing
//     setAction('drawing');
//     const id = Date.now();
//     let newEl;

//     if (tool === 'pencil') {
//       newEl = { id, type: 'pencil', points: [pos], color, lineWidth };
//     } else if (tool === 'rect' || tool === 'circle') {
//       newEl = { id, type: tool, x: pos.x, y: pos.y, width: 0, height: 0, color, lineWidth };
//     }

//     if (newEl) {
//       setElements(prev => [...prev, newEl]);
//       setSelectedElement(newEl); // Track current element being drawn
//     }
//   };

//   const handleMouseMove = (e) => {
//     const pos = getMousePos(canvasRef.current, e);

//     if (action === 'erasing') {
//       deleteElementAt(pos);
//       return;
//     }

//     if (action === 'drawing' && selectedElement) {
//       setElements(prev => prev.map(el => {
//         if (el.id === selectedElement.id) {
//           if (tool === 'pencil') {
//             return { ...el, points: [...el.points, pos] };
//           } else if (tool === 'rect' || tool === 'circle') {
//             return { ...el, width: pos.x - el.x, height: pos.y - el.y };
//           }
//         }
//         return el;
//       }));
//     }
//   };

//   const handleMouseUp = () => {
//     if (action === 'drawing' || action === 'erasing') {
//       setAction('none');
//       setSelectedElement(null);
//     }
//   };

//   const deleteElementAt = (pos) => {
//     // Simple collision detection for eraser
//     setElements(prev => prev.filter(el => {
//       // Keep element if NOT hit
//       if (el.type === 'rect') {
//         const r = { x: el.x, y: el.y, w: el.width, h: el.height };
//         // Normalize rect
//         if(r.w < 0) { r.x += r.w; r.w = Math.abs(r.w); }
//         if(r.h < 0) { r.y += r.h; r.h = Math.abs(r.h); }
//         return !(pos.x >= r.x && pos.x <= r.x + r.w && pos.y >= r.y && pos.y <= r.y + r.h);
//       }
//       if (el.type === 'pencil') {
//         // Check distance to any segment
//         const threshold = 100; // tolerance squared
//         for(let i=0; i<el.points.length-1; i++) {
//           if (distanceToSegment(pos, el.points[i], el.points[i+1]) < threshold) return false;
//         }
//         return true;
//       }
//       if (el.type === 'image') {
//          const r = { x: el.x, y: el.y, w: el.width, h: el.height };
//          return !(pos.x >= r.x && pos.x <= r.x + r.w && pos.y >= r.y && pos.y <= r.y + r.h);
//       }
//       if (el.type === 'text' || el.type === 'circle') {
//          // Simplified hit box for text/circle
//          const dist = Math.sqrt(Math.pow(pos.x - el.x, 2) + Math.pow(pos.y - el.y, 2));
//          return dist > 30; // Approx radius
//       }
//       return true;
//     }));
//   };

//   // --- TEXT & IMAGE HANDLERS ---

//   const handleTextBlur = () => {
//     if (selectedElement && selectedElement.type === 'text') {
//       const text = textAreaRef.current.value;
//       if (text.trim() === '') {
//         setElements(prev => prev.filter(el => el.id !== selectedElement.id));
//       } else {
//         setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, text } : el));
//       }
//     }
//     setAction('none');
//     setSelectedElement(null);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (evt) => {
//         const img = new Image();
//         img.onload = () => {
//           // Fit image to a reasonable size
//           const maxDim = 300;
//           let w = img.width;
//           let h = img.height;
//           if (w > maxDim || h > maxDim) {
//             const ratio = w / h;
//             if (w > h) { w = maxDim; h = maxDim / ratio; }
//             else { h = maxDim; w = maxDim * ratio; }
//           }
          
//           const newEl = { 
//             id: Date.now(), 
//             type: 'image', 
//             x: 100, 
//             y: 100, 
//             width: w, 
//             height: h, 
//             imgObj: img 
//           };
//           setElements(prev => [...prev, newEl]);
//         };
//         img.src = evt.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     const link = document.createElement('a');
//     link.download = 'whiteboard.png';
//     link.href = canvasRef.current.toDataURL();
//     link.click();
//   };

//   const handleUndo = () => {
//     setElements(prev => prev.slice(0, -1));
//   };

//   const handleClear = () => {
//     if(window.confirm('Clear entire whiteboard?')) {
//       setElements([]);
//     }
//   };

//   // --- UI COMPONENTS ---

//   const ToolButton = ({ t, icon: Icon, active }) => (
//     <button 
//       onClick={() => setTool(t)}
//       className={`p-3 rounded-xl transition-all ${active ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
//     >
//       <Icon size={20} />
//     </button>
//   );

//   const ColorButton = ({ c }) => (
//     <button 
//       onClick={() => setColor(c)}
//       className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
//       style={{ backgroundColor: c }}
//     />
//   );

//   return (
//     <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans selection:bg-cyan-500/30">
      
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 z-0">
//         <Grainient 
//           color1="#0f172a" 
//           color2="#0e7490" 
//           color3="#1e3a8a" 
//           timeSpeed={0.1}
//           zoom={1.0}
//         />
//         <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
//       </div>

//       {/* CANVAS LAYER */}
//       <canvas
//         ref={canvasRef}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         className={`absolute inset-0 z-10 touch-none ${tool === 'text' ? 'cursor-text' : tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
//       />

//       {/* HIDDEN TEXT INPUT OVERLAY */}
//       <textarea
//         ref={textAreaRef}
//         onBlur={handleTextBlur}
//         className={`
//           fixed z-20 bg-transparent border-2 border-dashed border-cyan-500/50 
//           outline-none resize-none overflow-hidden text-white font-sans
//           ${action === 'typing' ? 'block' : 'hidden'}
//         `}
//         style={{ minWidth: '100px', minHeight: '50px' }}
//       />

//       {/* HIDDEN FILE INPUT */}
//       <input 
//         type="file" 
//         ref={fileInputRef} 
//         onChange={handleImageUpload} 
//         accept="image/*" 
//         className="hidden" 
//       />

//       {/* FLOATING TOOLBAR */}
//       <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
//         <div className="flex gap-1 pr-4 border-r border-white/10">
//           <ToolButton t="pencil" icon={Pencil} active={tool === 'pencil'} />
//           <ToolButton t="rect" icon={Square} active={tool === 'rect'} />
//           <ToolButton t="circle" icon={Circle} active={tool === 'circle'} />
//           <ToolButton t="text" icon={Type} active={tool === 'text'} />
//           <button 
//             onClick={() => fileInputRef.current.click()}
//             className={`p-3 rounded-xl transition-all ${tool === 'image' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
//           >
//             <ImageIcon size={20} />
//           </button>
//         </div>
        
//         <div className="flex gap-1 pl-2">
//           <ToolButton t="eraser" icon={Eraser} active={tool === 'eraser'} />
//           <button onClick={handleUndo} className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
//             <Undo size={20} />
//           </button>
//           <button onClick={handleClear} className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
//             <Trash2 size={20} />
//           </button>
//         </div>
//       </div>

//       {/* PROPERTIES PANEL */}
//       <div className="fixed top-6 left-6 z-30 flex flex-col gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-in slide-in-from-left-8 fade-in duration-500">
//         <div className="space-y-3">
//           <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Stroke Color</label>
//           <div className="grid grid-cols-4 gap-2">
//             <ColorButton c="#ffffff" />
//             <ColorButton c="#94a3b8" />
//             <ColorButton c="#ef4444" />
//             <ColorButton c="#f97316" />
//             <ColorButton c="#eab308" />
//             <ColorButton c="#22c55e" />
//             <ColorButton c="#06b6d4" />
//             <ColorButton c="#3b82f6" />
//             <ColorButton c="#a855f7" />
//             <ColorButton c="#ec4899" />
//           </div>
//         </div>

//         <div className="h-px bg-white/10 w-full" />

//         <div className="space-y-3">
//           <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex justify-between">
//             <span>Stroke Width</span>
//             <span className="text-white">{lineWidth}px</span>
//           </label>
//           <input 
//             type="range" 
//             min="1" 
//             max="20" 
//             value={lineWidth} 
//             onChange={(e) => setLineWidth(parseInt(e.target.value))}
//             className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
//           />
//         </div>
//       </div>

//       {/* SAVE ACTION */}
//       <div className="fixed top-6 right-6 z-30">
//         <button 
//           onClick={handleSave}
//           className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
//         >
//           <Download size={18} /> Export
//         </button>
//       </div>

//       {/* FOOTER HINT */}
//       <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 text-xs text-slate-500 pointer-events-none">
//         {tool === 'eraser' ? 'Click objects to erase them' : tool === 'text' ? 'Click anywhere to type' : 'Drag to draw'}
//       </div>

//     </div>
//   );
// }



// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Pencil, 
//   Square, 
//   Circle, 
//   Type, 
//   Image as ImageIcon, 
//   Eraser, 
//   Undo, 
//   Trash2, 
//   Download, 
//   MousePointer2,
//   Minus,
//   Move,
//   ZoomIn,
//   ZoomOut,
//   Sun,
//   Moon,
//   Hand
// } from 'lucide-react';
// import Grainient from '../components/Grainient.jsx';

// // --- HELPER FUNCTIONS ---

// // Transform screen coordinates to world coordinates
// const getMousePos = (evt, pan, scale) => {
//   return {
//     x: (evt.clientX - pan.x) / scale,
//     y: (evt.clientY - pan.y) / scale
//   };
// };

// // Check if point is near a line segment (for eraser/selection)
// const distanceToSegment = (p, v, w) => {
//   const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
//   if (l2 === 0) return (p.x - v.x) ** 2 + (p.y - v.y) ** 2;
//   let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
//   t = Math.max(0, Math.min(1, t));
//   return (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2;
// };

// // Hit test function
// const isHit = (el, pos) => {
//   const threshold = 100; // squared distance for lines
//   if (el.type === 'rect' || el.type === 'image') {
//     let rx = el.x, ry = el.y, rw = el.width, rh = el.height;
//     if (rw < 0) { rx += rw; rw = Math.abs(rw); }
//     if (rh < 0) { ry += rh; rh = Math.abs(rh); }
//     return pos.x >= rx && pos.x <= rx + rw && pos.y >= ry && pos.y <= ry + rh;
//   }
//   if (el.type === 'circle') {
//     const r = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//     const dist = (pos.x - el.x) ** 2 + (pos.y - el.y) ** 2;
//     return dist <= r ** 2;
//   }
//   if (el.type === 'text') {
//     // Rough estimation for text hit box
//     const width = el.text.length * (el.fontSize || 24) * 0.6;
//     const height = (el.fontSize || 24);
//     return pos.x >= el.x && pos.x <= el.x + width && pos.y >= el.y - height && pos.y <= el.y + 10;
//   }
//   if (el.type === 'pencil') {
//     for (let i = 0; i < el.points.length - 1; i++) {
//       if (distanceToSegment(pos, el.points[i], el.points[i + 1]) < threshold) return true;
//     }
//   }
//   return false;
// };

// // Custom Notification Component
// const GlassToast = ({ message, visible, type = 'info' }) => {
//   if (!visible) return null;
//   return (
//     <div className={`
//       fixed top-24 left-1/2 -translate-x-1/2 z-50
//       px-6 py-3 rounded-full
//       bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
//       text-white font-sans text-sm font-medium
//       animate-in fade-in slide-in-from-top-4 duration-300
//       flex items-center gap-3
//     `}>
//       <div className={`w-2 h-2 rounded-full ${type === 'error' ? 'bg-red-400' : 'bg-cyan-400'} animate-pulse`} />
//       {message}
//     </div>
//   );
// };

// // --- COMPONENT ---

// export default function Whiteboard() {
//   // --- STATE ---
//   const [elements, setElements] = useState([]);
//   const [action, setAction] = useState('none'); // none, drawing, typing, erasing, moving, panning
//   const [tool, setTool] = useState('pencil'); // pencil, rect, circle, text, image, eraser, move, pan
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [color, setColor] = useState('#ffffff');
//   const [lineWidth, setLineWidth] = useState(3);
  
//   // Viewport State
//   const [scale, setScale] = useState(1);
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
//   // Theme & UI State
//   const [theme, setTheme] = useState('light');
//   const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

//   // Refs
//   const canvasRef = useRef(null);
//   const textAreaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // --- ACTIONS ---

//   const showToast = (message, type = 'info') => {
//     setToast({ visible: true, message, type });
//     setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     // If drawing color was default white/black, switch it for convenience
//     if (color === '#ffffff' && newTheme === 'light') setColor('#000000');
//     if (color === '#000000' && newTheme === 'dark') setColor('#ffffff');
//   };

//   const handleZoom = (delta) => {
//     setScale(prev => Math.min(Math.max(prev + delta, 0.1), 5));
//   };

//   // --- CANVAS RENDERING ---

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // Handle High DPI
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = window.innerWidth * dpr;
//     canvas.height = window.innerHeight * dpr;
//     canvas.style.width = `${window.innerWidth}px`;
//     canvas.style.height = `${window.innerHeight}px`;
    
//     // Clear and Set Transform
//     ctx.scale(dpr, dpr);
//     ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
//     ctx.save();
//     ctx.translate(pan.x, pan.y);
//     ctx.scale(scale, scale);

//     // Draw Elements
//     elements.forEach(el => {
//       ctx.strokeStyle = el.color;
//       ctx.lineWidth = el.lineWidth;
//       ctx.fillStyle = el.color;
//       ctx.font = `${el.fontSize || 24}px 'Space Grotesk', sans-serif`;
      
//       if (el.type === 'pencil') {
//         if (el.points.length < 2) return;
//         ctx.beginPath();
//         ctx.moveTo(el.points[0].x, el.points[0].y);
//         for (let i = 1; i < el.points.length; i++) {
//           ctx.lineTo(el.points[i].x, el.points[i].y);
//         }
//         ctx.stroke();
//       } 
//       else if (el.type === 'rect') {
//         ctx.strokeRect(el.x, el.y, el.width, el.height);
//       } 
//       else if (el.type === 'circle') {
//         ctx.beginPath();
//         const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//         ctx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
//         ctx.stroke();
//       }
//       else if (el.type === 'text') {
//         ctx.fillText(el.text, el.x, el.y + 24); 
//       }
//       else if (el.type === 'image' && el.imgObj) {
//         ctx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
//       }
//     });

//     // Draw Selection Box if moving
//     if (selectedElement && tool === 'move') {
//       const el = selectedElement;
//       ctx.strokeStyle = '#06b6d4';
//       ctx.lineWidth = 1 / scale;
//       ctx.setLineDash([5, 5]);
      
//       let bx = el.x, by = el.y, bw = 0, bh = 0;
      
//       if (el.type === 'pencil') {
//         // Find bounds of pencil path
//         const xs = el.points.map(p => p.x);
//         const ys = el.points.map(p => p.y);
//         bx = Math.min(...xs); by = Math.min(...ys);
//         bw = Math.max(...xs) - bx; bh = Math.max(...ys) - by;
//       } else if (el.type === 'circle') {
//         const r = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//         bx = el.x - r; by = el.y - r; bw = r * 2; bh = r * 2;
//       } else if (el.type === 'text') {
//         bw = el.text.length * (el.fontSize || 24) * 0.6;
//         bh = (el.fontSize || 24);
//         by = el.y; // Text baseline diff
//       } else {
//         bw = el.width; bh = el.height;
//       }
      
//       // Simple rect around selection
//       ctx.strokeRect(bx - 5, by - 5, bw + 10, bh + 10);
//       ctx.setLineDash([]);
//     }

//     ctx.restore();

//   }, [elements, pan, scale, selectedElement, tool]);

//   // Handle Resize
//   useEffect(() => {
//     const handleResize = () => setElements(prev => [...prev]); // Trigger re-render
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // --- MOUSE HANDLERS ---

//   const handleMouseDown = (e) => {
//     if (action === 'typing') return;
    
//     // Panning logic (Middle click or Pan tool)
//     if (tool === 'pan' || e.button === 1) {
//       setAction('panning');
//       setDragOffset({ x: e.clientX, y: e.clientY });
//       return;
//     }

//     const pos = getMousePos(e, pan, scale);

//     // Text Tool
//     if (tool === 'text') {
//       setAction('typing');
//       const id = Date.now();
//       const newEl = { id, type: 'text', x: pos.x, y: pos.y, text: '', color, fontSize: 24 / scale };
//       setElements(prev => [...prev, newEl]);
//       setSelectedElement(newEl);
//       setTimeout(() => {
//         if(textAreaRef.current) {
//           textAreaRef.current.value = "";
//           textAreaRef.current.focus();
//           // Position relative to screen for textarea
//           textAreaRef.current.style.left = `${e.clientX}px`;
//           textAreaRef.current.style.top = `${e.clientY}px`;
//           textAreaRef.current.style.color = color;
//           textAreaRef.current.style.fontSize = `${24 * scale}px`;
//         }
//       }, 0);
//       return;
//     }

//     // Move Tool
//     if (tool === 'move') {
//       const found = elements.slice().reverse().find(el => isHit(el, pos));
//       if (found) {
//         setAction('moving');
//         setSelectedElement(found);
//         setDragOffset({ x: pos.x, y: pos.y }); // Store world start pos
//       } else {
//         setSelectedElement(null);
//       }
//       return;
//     }

//     // Eraser Tool
//     if (tool === 'eraser') {
//       setAction('erasing');
//       deleteElementAt(pos);
//       return;
//     }

//     // Drawing Tools
//     setAction('drawing');
//     const id = Date.now();
//     let newEl;

//     if (tool === 'pencil') {
//       newEl = { id, type: 'pencil', points: [pos], color, lineWidth: lineWidth / scale };
//     } else if (tool === 'rect' || tool === 'circle') {
//       newEl = { id, type: tool, x: pos.x, y: pos.y, width: 0, height: 0, color, lineWidth: lineWidth / scale };
//     }

//     if (newEl) {
//       setElements(prev => [...prev, newEl]);
//       setSelectedElement(newEl);
//     }
//   };

//   const handleMouseMove = (e) => {
//     // Panning
//     if (action === 'panning') {
//       const dx = e.clientX - dragOffset.x;
//       const dy = e.clientY - dragOffset.y;
//       setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
//       setDragOffset({ x: e.clientX, y: e.clientY });
//       return;
//     }

//     const pos = getMousePos(e, pan, scale);

//     if (action === 'erasing') {
//       deleteElementAt(pos);
//       return;
//     }

//     if (action === 'moving' && selectedElement) {
//       const dx = pos.x - dragOffset.x;
//       const dy = pos.y - dragOffset.y;
      
//       setElements(prev => prev.map(el => {
//         if (el.id === selectedElement.id) {
//           if (el.type === 'pencil') {
//             return { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
//           } else {
//             return { ...el, x: el.x + dx, y: el.y + dy };
//           }
//         }
//         return el;
//       }));
//       setDragOffset({ x: pos.x, y: pos.y }); // Reset for next delta
//       return;
//     }

//     if (action === 'drawing' && selectedElement) {
//       setElements(prev => prev.map(el => {
//         if (el.id === selectedElement.id) {
//           if (tool === 'pencil') {
//             return { ...el, points: [...el.points, pos] };
//           } else if (tool === 'rect' || tool === 'circle') {
//             return { ...el, width: pos.x - el.x, height: pos.y - el.y };
//           }
//         }
//         return el;
//       }));
//     }
//   };

//   const handleMouseUp = () => {
//     if (action !== 'typing') setAction('none');
//   };

//   const deleteElementAt = (pos) => {
//     setElements(prev => prev.filter(el => !isHit(el, pos)));
//   };

//   // --- UTILS ---

//   const handleTextBlur = () => {
//     if (selectedElement && selectedElement.type === 'text') {
//       const text = textAreaRef.current.value;
//       if (text.trim() === '') {
//         setElements(prev => prev.filter(el => el.id !== selectedElement.id));
//       } else {
//         setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, text } : el));
//       }
//     }
//     setAction('none');
//     setSelectedElement(null);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (evt) => {
//         const img = new Image();
//         img.onload = () => {
//           const maxDim = 300 / scale;
//           let w = img.width;
//           let h = img.height;
//           if (w > maxDim || h > maxDim) {
//             const ratio = w / h;
//             if (w > h) { w = maxDim; h = maxDim / ratio; }
//             else { h = maxDim; w = maxDim * ratio; }
//           }
          
//           // Center view logic
//           const centerPos = getMousePos({ clientX: window.innerWidth/2, clientY: window.innerHeight/2 }, pan, scale);

//           const newEl = { 
//             id: Date.now(), 
//             type: 'image', 
//             x: centerPos.x - w/2, 
//             y: centerPos.y - h/2, 
//             width: w, 
//             height: h, 
//             imgObj: img 
//           };
//           setElements(prev => [...prev, newEl]);
//           showToast('Image added successfully');
//         };
//         img.src = evt.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     // Create a temporary canvas to render the final image with background
//     const tempCanvas = document.createElement('canvas');
//     const dpr = window.devicePixelRatio || 1;
//     // We export the view as it is seen, or the whole bounds? Let's export current view for simplicity
//     tempCanvas.width = window.innerWidth * dpr;
//     tempCanvas.height = window.innerHeight * dpr;
//     const tCtx = tempCanvas.getContext('2d');
    
//     tCtx.scale(dpr, dpr);
    
//     // Fill background
//     tCtx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc';
//     tCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
//     tCtx.translate(pan.x, pan.y);
//     tCtx.scale(scale, scale);

//     // Draw elements on temp canvas
//     elements.forEach(el => {
//       tCtx.strokeStyle = el.color;
//       tCtx.lineWidth = el.lineWidth;
//       tCtx.fillStyle = el.color;
//       tCtx.font = `${el.fontSize || 24}px 'Space Grotesk', sans-serif`;
      
//       if (el.type === 'pencil') {
//         if (el.points.length < 2) return;
//         tCtx.beginPath();
//         tCtx.moveTo(el.points[0].x, el.points[0].y);
//         for (let i = 1; i < el.points.length; i++) {
//           tCtx.lineTo(el.points[i].x, el.points[i].y);
//         }
//         tCtx.stroke();
//       } else if (el.type === 'rect') {
//         tCtx.strokeRect(el.x, el.y, el.width, el.height);
//       } else if (el.type === 'circle') {
//         tCtx.beginPath();
//         const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//         tCtx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
//         tCtx.stroke();
//       } else if (el.type === 'text') {
//         tCtx.fillText(el.text, el.x, el.y + 24);
//       } else if (el.type === 'image' && el.imgObj) {
//         tCtx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
//       }
//     });

//     const link = document.createElement('a');
//     link.download = `whiteboard-${Date.now()}.png`;
//     link.href = tempCanvas.toDataURL('image/png');
//     link.click();
//     showToast('Whiteboard exported as PNG', 'info');
//   };

//   const handleClear = () => {
//     if(window.confirm('Clear entire whiteboard?')) {
//       setElements([]);
//       showToast('Canvas cleared', 'info');
//     }
//   };

//   // --- COMPONENTS ---

//   const ToolButton = ({ t, icon: Icon, active }) => (
//     <button 
//       onClick={() => setTool(t)}
//       title={t}
//       className={`p-3 rounded-xl transition-all ${active ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
//     >
//       <Icon size={20} />
//     </button>
//   );

//   const ColorButton = ({ c }) => (
//     <button 
//       onClick={() => setColor(c)}
//       className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
//       style={{ backgroundColor: c }}
//     />
//   );

//   return (
//     <div className={`relative w-full h-screen overflow-hidden font-sans selection:bg-cyan-500/30 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 z-0 transition-colors duration-700">
//         <Grainient 
//           color1={theme === 'dark' ? '#121212' : '#f0fdf4'} 
//           color2={theme === 'dark' ? '#121212' : '#6ee7b7'} 
//           color3={theme === 'dark' ? '#121212' : '#2dd4bf'} 
//           timeSpeed={0.1}
//           zoom={1.0}
//         />
//         <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-black/20' : 'bg-white/40'}`}></div>
//       </div>

//       {/* TOAST NOTIFICATION */}
//       <GlassToast message={toast.message} visible={toast.visible} type={toast.type} />

//       {/* CANVAS LAYER */}
//       <canvas
//         ref={canvasRef}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onWheel={(e) => {
//           if (e.ctrlKey) {
//             e.preventDefault();
//             handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
//           }
//         }}
//         className={`absolute inset-0 z-10 touch-none ${
//           tool === 'text' ? 'cursor-text' : 
//           tool === 'eraser' ? 'cursor-cell' : 
//           tool === 'move' ? (action === 'moving' ? 'cursor-grabbing' : 'cursor-grab') :
//           tool === 'pan' ? (action === 'panning' ? 'cursor-grabbing' : 'cursor-grab') :
//           'cursor-crosshair'
//         }`}
//       />

//       {/* HIDDEN TEXT INPUT */}
//       <textarea
//         ref={textAreaRef}
//         onBlur={handleTextBlur}
//         className={`
//           fixed z-20 bg-transparent border-2 border-dashed border-cyan-500/50 
//           outline-none resize-none overflow-hidden font-sans font-bold
//           ${action === 'typing' ? 'block' : 'hidden'}
//         `}
//         style={{ minWidth: '100px', minHeight: '50px' }}
//       />

//       <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

//       {/* --- UI CONTROLS --- */}

//       {/* TOP BAR: TOOLS */}
//       <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
//         <div className="flex gap-1 pr-4 border-r border-white/10">
//           <ToolButton t="select" icon={MousePointer2} active={tool === 'select'} /> {/* Placeholder for later */}
//           <ToolButton t="move" icon={Move} active={tool === 'move'} />
//           <ToolButton t="pan" icon={Hand} active={tool === 'pan'} />
//         </div>
//         <div className="flex gap-1 px-4 border-r border-white/10">
//           <ToolButton t="pencil" icon={Pencil} active={tool === 'pencil'} />
//           <ToolButton t="rect" icon={Square} active={tool === 'rect'} />
//           <ToolButton t="circle" icon={Circle} active={tool === 'circle'} />
//           <ToolButton t="text" icon={Type} active={tool === 'text'} />
//           <button 
//             onClick={() => fileInputRef.current.click()}
//             className={`p-3 rounded-xl transition-all ${tool === 'image' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
//           >
//             <ImageIcon size={20} />
//           </button>
//         </div>
//         <div className="flex gap-1 pl-2">
//           <ToolButton t="eraser" icon={Eraser} active={tool === 'eraser'} />
//           <button onClick={() => { setElements(prev => prev.slice(0, -1)); showToast('Undo') }} className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
//             <Undo size={20} />
//           </button>
//           <button onClick={handleClear} className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
//             <Trash2 size={20} />
//           </button>
//         </div>
//       </div>

//       {/* LEFT BAR: PROPERTIES */}
//       <div className="fixed top-24 left-6 z-30 flex flex-col gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-in slide-in-from-left-8 fade-in duration-500 w-48">
//         {/* Dark/Light Toggle */}
//         <button 
//           onClick={toggleTheme}
//           className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"
//         >
//           <span>{theme} Mode</span>
//           {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
//         </button>

//         <div className="space-y-3">
//           <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Stroke Color</label>
//           <div className="grid grid-cols-4 gap-2">
//             {[
//               '#ffffff', '#000000', '#94a3b8', '#475569', 
//               '#ef4444', '#f97316', '#eab308', '#22c55e', 
//               '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'
//             ].map(c => (
//               <ColorButton key={c} c={c} />
//             ))}
//           </div>
//         </div>

//         <div className="h-px bg-white/10 w-full" />

//         <div className="space-y-3">
//           <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex justify-between">
//             <span>Stroke Width</span>
//             <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{lineWidth}px</span>
//           </label>
//           <input 
//             type="range" 
//             min="1" 
//             max="20" 
//             value={lineWidth} 
//             onChange={(e) => setLineWidth(parseInt(e.target.value))}
//             className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
//           />
//         </div>
//       </div>

//       {/* RIGHT BAR: ZOOM & ACTIONS */}
//       <div className="fixed bottom-6 right-6 z-30 flex gap-4 items-end">
//         <div className="flex flex-col gap-2 p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
//           <button onClick={() => handleZoom(0.1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><ZoomIn size={20} /></button>
//           <div className="text-center text-[10px] font-mono text-slate-500">{Math.round(scale * 100)}%</div>
//           <button onClick={() => handleZoom(-0.1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><ZoomOut size={20} /></button>
//         </div>

//         <button 
//           onClick={handleSave}
//           className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
//         >
//           <Download size={18} /> Export Board
//         </button>
//       </div>

//       {/* FOOTER HINT */}
//       <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 text-xs text-slate-500 pointer-events-none bg-black/20 backdrop-blur px-4 py-1 rounded-full">
//         {tool === 'move' ? 'Drag elements to move' : tool === 'pan' ? 'Drag canvas to pan' : tool === 'eraser' ? 'Click or drag to erase' : 'Drag to draw'}
//       </div>

//     </div>
//   );
// }

















//git touch active
















// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Pencil, 
//   Square, 
//   Circle, 
//   Type, 
//   Image as ImageIcon, 
//   Eraser, 
//   Undo, 
//   Trash2, 
//   Download, 
//   MousePointer2,
//   Move,
//   ZoomIn,
//   ZoomOut,
//   Sun,
//   Moon,
//   Hand
// } from 'lucide-react';
// import Grainient from '../components/Grainient.jsx';

// // --- HELPER FUNCTIONS ---

// // Transform screen coordinates to world coordinates (Updated for Touch)
// const getMousePos = (evt, pan, scale) => {
//   const clientX = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientX : evt.clientX;
//   const clientY = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientY : evt.clientY;

//   return {
//     x: (clientX - pan.x) / scale,
//     y: (clientY - pan.y) / scale
//   };
// };

// // Check if point is near a line segment (for eraser/selection)
// const distanceToSegment = (p, v, w) => {
//   const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
//   if (l2 === 0) return (p.x - v.x) ** 2 + (p.y - v.y) ** 2;
//   let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
//   t = Math.max(0, Math.min(1, t));
//   return (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2;
// };

// // Hit test function
// const isHit = (el, pos) => {
//   const threshold = 100; // squared distance for lines
//   if (el.type === 'rect' || el.type === 'image') {
//     let rx = el.x, ry = el.y, rw = el.width, rh = el.height;
//     if (rw < 0) { rx += rw; rw = Math.abs(rw); }
//     if (rh < 0) { ry += rh; rh = Math.abs(rh); }
//     return pos.x >= rx && pos.x <= rx + rw && pos.y >= ry && pos.y <= ry + rh;
//   }
//   if (el.type === 'circle') {
//     const r = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//     const dist = (pos.x - el.x) ** 2 + (pos.y - el.y) ** 2;
//     return dist <= r ** 2;
//   }
//   if (el.type === 'text') {
//     // Rough estimation for text hit box
//     const width = el.text.length * (el.fontSize || 24) * 0.6;
//     const height = (el.fontSize || 24);
//     return pos.x >= el.x && pos.x <= el.x + width && pos.y >= el.y - height && pos.y <= el.y + 10;
//   }
//   if (el.type === 'pencil') {
//     for (let i = 0; i < el.points.length - 1; i++) {
//       if (distanceToSegment(pos, el.points[i], el.points[i + 1]) < threshold) return true;
//     }
//   }
//   return false;
// };

// // Custom Notification Component
// const GlassToast = ({ message, visible, type = 'info' }) => {
//   if (!visible) return null;
//   return (
//     <div className={`
//       fixed top-24 left-1/2 -translate-x-1/2 z-50
//       px-6 py-3 rounded-full
//       bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
//       text-white font-sans text-sm font-medium
//       animate-in fade-in slide-in-from-top-4 duration-300
//       flex items-center gap-3
//     `}>
//       <div className={`w-2 h-2 rounded-full ${type === 'error' ? 'bg-red-400' : 'bg-cyan-400'} animate-pulse`} />
//       {message}
//     </div>
//   );
// };

// // --- COMPONENT ---

// export default function Whiteboard() {
//   // --- STATE ---
//   const [elements, setElements] = useState([]);
//   const [action, setAction] = useState('none'); // none, drawing, typing, erasing, moving, panning
//   const [tool, setTool] = useState('pencil'); // pencil, rect, circle, text, image, eraser, move, pan
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [color, setColor] = useState('#ffffff');
//   const [lineWidth, setLineWidth] = useState(3);
  
//   // Viewport State
//   const [scale, setScale] = useState(1);
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
//   // Theme & UI State
//   const [theme, setTheme] = useState('light');
//   const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

//   // Refs
//   const canvasRef = useRef(null);
//   const textAreaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // --- ACTIONS ---

//   const showToast = (message, type = 'info') => {
//     setToast({ visible: true, message, type });
//     setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     if (color === '#ffffff' && newTheme === 'light') setColor('#000000');
//     if (color === '#000000' && newTheme === 'dark') setColor('#ffffff');
//   };

//   const handleZoom = (delta) => {
//     setScale(prev => Math.min(Math.max(prev + delta, 0.1), 5));
//   };

//   // --- CANVAS RENDERING ---

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // Handle High DPI
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = window.innerWidth * dpr;
//     canvas.height = window.innerHeight * dpr;
//     canvas.style.width = `${window.innerWidth}px`;
//     canvas.style.height = `${window.innerHeight}px`;
    
//     // Clear and Set Transform
//     ctx.scale(dpr, dpr);
//     ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
//     ctx.save();
//     ctx.translate(pan.x, pan.y);
//     ctx.scale(scale, scale);

//     // Draw Elements
//     elements.forEach(el => {
//       ctx.strokeStyle = el.color;
//       ctx.lineWidth = el.lineWidth;
//       ctx.fillStyle = el.color;
//       ctx.font = `${el.fontSize || 24}px 'Space Grotesk', sans-serif`;
      
//       if (el.type === 'pencil') {
//         if (el.points.length < 2) return;
//         ctx.beginPath();
//         ctx.moveTo(el.points[0].x, el.points[0].y);
//         for (let i = 1; i < el.points.length; i++) {
//           ctx.lineTo(el.points[i].x, el.points[i].y);
//         }
//         ctx.stroke();
//       } 
//       else if (el.type === 'rect') {
//         ctx.strokeRect(el.x, el.y, el.width, el.height);
//       } 
//       else if (el.type === 'circle') {
//         ctx.beginPath();
//         const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//         ctx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
//         ctx.stroke();
//       }
//       else if (el.type === 'text') {
//         ctx.fillText(el.text, el.x, el.y + 24); 
//       }
//       else if (el.type === 'image' && el.imgObj) {
//         ctx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
//       }
//     });

//     // Draw Selection Box if moving
//     if (selectedElement && tool === 'move') {
//       const el = selectedElement;
//       ctx.strokeStyle = '#06b6d4';
//       ctx.lineWidth = 1 / scale;
//       ctx.setLineDash([5, 5]);
      
//       let bx = el.x, by = el.y, bw = 0, bh = 0;
      
//       if (el.type === 'pencil') {
//         const xs = el.points.map(p => p.x);
//         const ys = el.points.map(p => p.y);
//         bx = Math.min(...xs); by = Math.min(...ys);
//         bw = Math.max(...xs) - bx; bh = Math.max(...ys) - by;
//       } else if (el.type === 'circle') {
//         const r = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//         bx = el.x - r; by = el.y - r; bw = r * 2; bh = r * 2;
//       } else if (el.type === 'text') {
//         bw = el.text.length * (el.fontSize || 24) * 0.6;
//         bh = (el.fontSize || 24);
//         by = el.y; 
//       } else {
//         bw = el.width; bh = el.height;
//       }
      
//       ctx.strokeRect(bx - 5, by - 5, bw + 10, bh + 10);
//       ctx.setLineDash([]);
//     }

//     ctx.restore();

//   }, [elements, pan, scale, selectedElement, tool]);

//   // Handle Resize
//   useEffect(() => {
//     const handleResize = () => setElements(prev => [...prev]); 
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // --- MOUSE / TOUCH HANDLERS ---

//   const handleMouseDown = (e) => {
//     if (action === 'typing') return;
    
//     // Panning logic (Middle click or Pan tool)
//     if (tool === 'pan' || (e.button !== undefined && e.button === 1)) {
//       setAction('panning');
//       const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
//       setDragOffset({ x: clientX, y: clientY });
//       return;
//     }

//     const pos = getMousePos(e, pan, scale);

//     // Text Tool
//     if (tool === 'text') {
//       setAction('typing');
//       const id = Date.now();
//       const newEl = { id, type: 'text', x: pos.x, y: pos.y, text: '', color, fontSize: 24 / scale };
//       setElements(prev => [...prev, newEl]);
//       setSelectedElement(newEl);
//       setTimeout(() => {
//         if(textAreaRef.current) {
//           textAreaRef.current.value = "";
//           textAreaRef.current.focus();
//           const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
//           const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
//           textAreaRef.current.style.left = `${clientX}px`;
//           textAreaRef.current.style.top = `${clientY}px`;
//           textAreaRef.current.style.color = color;
//           textAreaRef.current.style.fontSize = `${24 * scale}px`;
//         }
//       }, 0);
//       return;
//     }

//     // Move Tool
//     if (tool === 'move') {
//       const found = elements.slice().reverse().find(el => isHit(el, pos));
//       if (found) {
//         setAction('moving');
//         setSelectedElement(found);
//         setDragOffset({ x: pos.x, y: pos.y }); 
//       } else {
//         setSelectedElement(null);
//       }
//       return;
//     }

//     // Eraser Tool
//     if (tool === 'eraser') {
//       setAction('erasing');
//       deleteElementAt(pos);
//       return;
//     }

//     // Drawing Tools
//     setAction('drawing');
//     const id = Date.now();
//     let newEl;

//     if (tool === 'pencil') {
//       newEl = { id, type: 'pencil', points: [pos], color, lineWidth: lineWidth / scale };
//     } else if (tool === 'rect' || tool === 'circle') {
//       newEl = { id, type: tool, x: pos.x, y: pos.y, width: 0, height: 0, color, lineWidth: lineWidth / scale };
//     }

//     if (newEl) {
//       setElements(prev => [...prev, newEl]);
//       setSelectedElement(newEl);
//     }
//   };

//   const handleMouseMove = (e) => {
//     // Panning
//     if (action === 'panning') {
//       const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
//       const dx = clientX - dragOffset.x;
//       const dy = clientY - dragOffset.y;
      
//       setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
//       setDragOffset({ x: clientX, y: clientY });
//       return;
//     }

//     if (action === 'none' || !selectedElement && action !== 'erasing') return;

//     const pos = getMousePos(e, pan, scale);

//     if (action === 'erasing') {
//       deleteElementAt(pos);
//       return;
//     }

//     if (action === 'moving' && selectedElement) {
//       const dx = pos.x - dragOffset.x;
//       const dy = pos.y - dragOffset.y;
      
//       setElements(prev => prev.map(el => {
//         if (el.id === selectedElement.id) {
//           if (el.type === 'pencil') {
//             return { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
//           } else {
//             return { ...el, x: el.x + dx, y: el.y + dy };
//           }
//         }
//         return el;
//       }));
//       setDragOffset({ x: pos.x, y: pos.y }); 
//       return;
//     }

//     if (action === 'drawing' && selectedElement) {
//       setElements(prev => prev.map(el => {
//         if (el.id === selectedElement.id) {
//           if (tool === 'pencil') {
//             return { ...el, points: [...el.points, pos] };
//           } else if (tool === 'rect' || tool === 'circle') {
//             return { ...el, width: pos.x - el.x, height: pos.y - el.y };
//           }
//         }
//         return el;
//       }));
//     }
//   };

//   const handleMouseUp = () => {
//     if (action !== 'typing') setAction('none');
//   };

//   const deleteElementAt = (pos) => {
//     setElements(prev => prev.filter(el => !isHit(el, pos)));
//   };

//   // --- UTILS ---

//   const handleTextBlur = () => {
//     if (selectedElement && selectedElement.type === 'text') {
//       const text = textAreaRef.current.value;
//       if (text.trim() === '') {
//         setElements(prev => prev.filter(el => el.id !== selectedElement.id));
//       } else {
//         setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, text } : el));
//       }
//     }
//     setAction('none');
//     setSelectedElement(null);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (evt) => {
//         const img = new Image();
//         img.onload = () => {
//           const maxDim = 300 / scale;
//           let w = img.width;
//           let h = img.height;
//           if (w > maxDim || h > maxDim) {
//             const ratio = w / h;
//             if (w > h) { w = maxDim; h = maxDim / ratio; }
//             else { h = maxDim; w = maxDim * ratio; }
//           }
          
//           const centerPos = getMousePos({ 
//             clientX: window.innerWidth/2, 
//             clientY: window.innerHeight/2 
//           }, pan, scale);

//           const newEl = { 
//             id: Date.now(), 
//             type: 'image', 
//             x: centerPos.x - w/2, 
//             y: centerPos.y - h/2, 
//             width: w, 
//             height: h, 
//             imgObj: img 
//           };
//           setElements(prev => [...prev, newEl]);
//           showToast('Image added successfully');
//         };
//         img.src = evt.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     const tempCanvas = document.createElement('canvas');
//     const dpr = window.devicePixelRatio || 1;
//     tempCanvas.width = window.innerWidth * dpr;
//     tempCanvas.height = window.innerHeight * dpr;
//     const tCtx = tempCanvas.getContext('2d');
    
//     tCtx.scale(dpr, dpr);
    
//     tCtx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc';
//     tCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
//     tCtx.translate(pan.x, pan.y);
//     tCtx.scale(scale, scale);

//     elements.forEach(el => {
//       tCtx.strokeStyle = el.color;
//       tCtx.lineWidth = el.lineWidth;
//       tCtx.fillStyle = el.color;
//       tCtx.font = `${el.fontSize || 24}px 'Space Grotesk', sans-serif`;
      
//       if (el.type === 'pencil') {
//         if (el.points.length < 2) return;
//         tCtx.beginPath();
//         tCtx.moveTo(el.points[0].x, el.points[0].y);
//         for (let i = 1; i < el.points.length; i++) {
//           tCtx.lineTo(el.points[i].x, el.points[i].y);
//         }
//         tCtx.stroke();
//       } else if (el.type === 'rect') {
//         tCtx.strokeRect(el.x, el.y, el.width, el.height);
//       } else if (el.type === 'circle') {
//         tCtx.beginPath();
//         const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
//         tCtx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
//         tCtx.stroke();
//       } else if (el.type === 'text') {
//         tCtx.fillText(el.text, el.x, el.y + 24);
//       } else if (el.type === 'image' && el.imgObj) {
//         tCtx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
//       }
//     });

//     const link = document.createElement('a');
//     link.download = `whiteboard-${Date.now()}.png`;
//     link.href = tempCanvas.toDataURL('image/png');
//     link.click();
//     showToast('Whiteboard exported as PNG', 'info');
//   };

//   const handleClear = () => {
//     if(window.confirm('Clear entire whiteboard?')) {
//       setElements([]);
//       showToast('Canvas cleared', 'info');
//     }
//   };

//   // --- COMPONENTS ---

//   const ToolButton = ({ t, icon: Icon, active }) => (
//     <button 
//       onClick={() => setTool(t)}
//       title={t}
//       className={`p-3 rounded-xl transition-all ${active ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
//     >
//       <Icon size={20} />
//     </button>
//   );

//   const ColorButton = ({ c }) => (
//     <button 
//       onClick={() => setColor(c)}
//       className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
//       style={{ backgroundColor: c }}
//     />
//   );

//   return (
//     <div className={`relative w-full h-screen overflow-hidden font-sans selection:bg-cyan-500/30 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 z-0 transition-colors duration-700">
//         <Grainient 
//           color1={theme === 'dark' ? '#121212' : '#f0fdf4'} 
//           color2={theme === 'dark' ? '#121212' : '#6ee7b7'} 
//           color3={theme === 'dark' ? '#121212' : '#2dd4bf'} 
//           timeSpeed={0.1}
//           zoom={1.0}
//         />
//         <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-black/20' : 'bg-white/40'}`}></div>
//       </div>

//       {/* TOAST NOTIFICATION */}
//       <GlassToast message={toast.message} visible={toast.visible} type={toast.type} />

//       {/* CANVAS LAYER */}
//       <canvas
//         ref={canvasRef}
        
//         // Mouse Listeners
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
        
//         // Touch Listeners
//         onTouchStart={handleMouseDown}
//         onTouchMove={handleMouseMove}
//         onTouchEnd={handleMouseUp}
        
//         onWheel={(e) => {
//           if (e.ctrlKey) {
//             e.preventDefault();
//             handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
//           }
//         }}
        
//         className={`absolute inset-0 z-10 touch-none ${
//           tool === 'text' ? 'cursor-text' : 
//           tool === 'eraser' ? 'cursor-cell' : 
//           tool === 'move' ? (action === 'moving' ? 'cursor-grabbing' : 'cursor-grab') :
//           tool === 'pan' ? (action === 'panning' ? 'cursor-grabbing' : 'cursor-grab') :
//           'cursor-crosshair'
//         }`}
//       />

//       {/* HIDDEN TEXT INPUT */}
//       <textarea
//         ref={textAreaRef}
//         onBlur={handleTextBlur}
//         className={`
//           fixed z-20 bg-transparent border-2 border-dashed border-cyan-500/50 
//           outline-none resize-none overflow-hidden font-sans font-bold
//           ${action === 'typing' ? 'block' : 'hidden'}
//         `}
//         style={{ minWidth: '100px', minHeight: '50px' }}
//       />

//       <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

//       {/* --- UI CONTROLS --- */}

//       {/* TOP BAR: TOOLS */}
//       <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
//         <div className="flex gap-1 pr-4 border-r border-white/10">
//           <ToolButton t="select" icon={MousePointer2} active={tool === 'select'} />
//           <ToolButton t="move" icon={Move} active={tool === 'move'} />
//           <ToolButton t="pan" icon={Hand} active={tool === 'pan'} />
//         </div>
//         <div className="flex gap-1 px-4 border-r border-white/10">
//           <ToolButton t="pencil" icon={Pencil} active={tool === 'pencil'} />
//           <ToolButton t="rect" icon={Square} active={tool === 'rect'} />
//           <ToolButton t="circle" icon={Circle} active={tool === 'circle'} />
//           <ToolButton t="text" icon={Type} active={tool === 'text'} />
//           <button 
//             onClick={() => fileInputRef.current.click()}
//             className={`p-3 rounded-xl transition-all ${tool === 'image' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
//           >
//             <ImageIcon size={20} />
//           </button>
//         </div>
//         <div className="flex gap-1 pl-2">
//           <ToolButton t="eraser" icon={Eraser} active={tool === 'eraser'} />
//           <button onClick={() => { setElements(prev => prev.slice(0, -1)); showToast('Undo') }} className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
//             <Undo size={20} />
//           </button>
//           <button onClick={handleClear} className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
//             <Trash2 size={20} />
//           </button>
//         </div>
//       </div>

//       {/* LEFT BAR: PROPERTIES */}
//       <div className="fixed top-24 left-6 z-30 flex flex-col gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-in slide-in-from-left-8 fade-in duration-500 w-48">
//         <button 
//           onClick={toggleTheme}
//           className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"
//         >
//           <span>{theme} Mode</span>
//           {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
//         </button>

//         <div className="space-y-3">
//           <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Stroke Color</label>
//           <div className="grid grid-cols-4 gap-2">
//             {[
//               '#ffffff', '#000000', '#94a3b8', '#475569', 
//               '#ef4444', '#f97316', '#eab308', '#22c55e', 
//               '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'
//             ].map(c => (
//               <ColorButton key={c} c={c} />
//             ))}
//           </div>
//         </div>

//         <div className="h-px bg-white/10 w-full" />

//         <div className="space-y-3">
//           <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex justify-between">
//             <span>Stroke Width</span>
//             <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{lineWidth}px</span>
//           </label>
//           <input 
//             type="range" 
//             min="1" 
//             max="20" 
//             value={lineWidth} 
//             onChange={(e) => setLineWidth(parseInt(e.target.value))}
//             className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
//           />
//         </div>
//       </div>
//       {/* RIGHT BAR: ZOOM & ACTIONS */}
//       <div className="fixed bottom-6 right-6 z-30 flex gap-4 items-end">
//         <div className="flex flex-col gap-2 p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
//           <button onClick={() => handleZoom(0.1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><ZoomIn size={20} /></button>
//           <div className="text-center text-[10px] font-mono text-slate-500">{Math.round(scale * 100)}%</div>
//           <button onClick={() => handleZoom(-0.1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><ZoomOut size={20} /></button>
//         </div>

//         <button 
//           onClick={handleSave}
//           className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
//         >
//           <Download size={18} /> Export Board
//         </button>
//       </div>

//       {/* FOOTER HINT */}
//       <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 text-xs text-slate-500 pointer-events-none bg-black/20 backdrop-blur px-4 py-1 rounded-full">
//         {tool === 'move' ? 'Drag elements to move' : tool === 'pan' ? 'Drag canvas to pan' : tool === 'eraser' ? 'Click or drag to erase' : 'Drag to draw'}
//       </div>

//     </div>
//   );
// }















// git claude












import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  Pencil,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Eraser,
  Undo,
  Trash2,
  Download,
  MousePointer2,
  Move,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Hand,
  X,
  Check,
  Pipette
} from 'lucide-react';
import Grainient from '../components/Grainient.jsx';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const HIT_THRESHOLD_SQ = 100;   // 10px real distance, stored as squared value
const DEFAULT_FONT_SIZE = 24;   // canonical world-space font size
const MAX_IMAGE_DIM = 300;      // max pixel dimension for uploaded images (at scale 1)
const SELECTION_PADDING = 5;    // px padding around selection bounding box
const ZOOM_DELTA = 0.1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 8;

const PRESET_COLORS = [
  '#ffffff', '#000000', '#94a3b8', '#475569',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#a855f7', '#ec4899',
];

// ─────────────────────────────────────────────
// PURE UTILITIES
// ─────────────────────────────────────────────

/** Normalize both mouse and touch events to { clientX, clientY } */
const normalizeEvent = (e) => ({
  clientX: e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX,
  clientY: e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY,
});

/** Convert screen coordinates → world coordinates */
const screenToWorld = ({ clientX, clientY }, pan, scale) => ({
  x: (clientX - pan.x) / scale,
  y: (clientY - pan.y) / scale,
});

/** Squared distance from point p to segment vw */
const distToSegmentSq = (p, v, w) => {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return (p.x - v.x) ** 2 + (p.y - v.y) ** 2;
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2;
};

/** Hit-test a world-space element against a world-space point */
const isHit = (el, pos) => {
  if (el.type === 'rect' || el.type === 'image') {
    let { x, y, width: w, height: h } = el;
    if (w < 0) { x += w; w = Math.abs(w); }
    if (h < 0) { y += h; h = Math.abs(h); }
    return pos.x >= x && pos.x <= x + w && pos.y >= y && pos.y <= y + h;
  }
  if (el.type === 'circle') {
    const r = Math.sqrt(el.width ** 2 + el.height ** 2);
    return (pos.x - el.x) ** 2 + (pos.y - el.y) ** 2 <= r ** 2;
  }
  if (el.type === 'text') {
    const tw = el.text.length * DEFAULT_FONT_SIZE * 0.6;
    return pos.x >= el.x && pos.x <= el.x + tw &&
           pos.y >= el.y && pos.y <= el.y + DEFAULT_FONT_SIZE;
  }
  if (el.type === 'pencil') {
    for (let i = 0; i < el.points.length - 1; i++) {
      if (distToSegmentSq(pos, el.points[i], el.points[i + 1]) < HIT_THRESHOLD_SQ) return true;
    }
  }
  return false;
};

/** Bounding box for any element type */
const getBBox = (el) => {
  if (el.type === 'pencil') {
    const xs = el.points.map(p => p.x);
    const ys = el.points.map(p => p.y);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  }
  if (el.type === 'circle') {
    const r = Math.sqrt(el.width ** 2 + el.height ** 2);
    return { x: el.x - r, y: el.y - r, w: r * 2, h: r * 2 };
  }
  if (el.type === 'text') {
    return { x: el.x, y: el.y, w: el.text.length * DEFAULT_FONT_SIZE * 0.6, h: DEFAULT_FONT_SIZE };
  }
  return { x: el.x, y: el.y, w: el.width, h: el.height };
};

/** Draw all elements onto a given 2D context (already transformed) */
const drawElements = (ctx, elements) => {
  elements.forEach(el => {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = el.lineWidth;
    ctx.fillStyle = el.color;
    ctx.font = `bold ${DEFAULT_FONT_SIZE}px 'DM Mono', monospace`;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (el.type === 'pencil') {
      if (el.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) ctx.lineTo(el.points[i].x, el.points[i].y);
      ctx.stroke();
    } else if (el.type === 'rect') {
      ctx.strokeRect(el.x, el.y, el.width, el.height);
    } else if (el.type === 'circle') {
      const radius = Math.sqrt(el.width ** 2 + el.height ** 2);
      ctx.beginPath();
      ctx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (el.type === 'text') {
      ctx.fillText(el.text, el.x, el.y + DEFAULT_FONT_SIZE);
    } else if (el.type === 'image' && el.imgObj) {
      ctx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
    }
  });
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS (defined outside parent to prevent remounting)
// ─────────────────────────────────────────────

const GlassToast = React.memo(({ message, visible, type = 'info' }) => {
  if (!visible) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white font-sans text-sm font-medium flex items-center gap-3"
      style={{ animation: 'fadeSlideIn 0.3s ease' }}>
      <div className={`w-2 h-2 rounded-full ${type === 'error' ? 'bg-red-400' : 'bg-emerald-400'} animate-pulse`} />
      {message}
    </div>
  );
});

const ToolButton = React.memo(({ tool: t, icon: Icon, label, activeTool, onClick, isDark = true }) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-2.5 rounded-xl transition-all duration-150 ${activeTool === t
      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
      : isDark
        ? 'text-slate-400 hover:text-white hover:bg-white/10'
        : 'text-slate-500 hover:text-slate-900 hover:bg-black/10'
    }`}
  >
    <Icon size={18} />
  </button>
));

const ColorSwatch = React.memo(({ c, active, onClick }) => (
  <button
    onClick={onClick}
    title={c}
    className={`w-5 h-5 rounded-full border-2 transition-all ${active ? 'border-white scale-125 shadow-lg' : 'border-transparent hover:scale-110'}`}
    style={{ backgroundColor: c }}
  />
));

const ClearConfirmModal = React.memo(({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 w-72">
      <p className="text-white font-semibold text-sm">Clear the entire whiteboard?</p>
      <p className="text-slate-400 text-xs">This cannot be undone (except with Undo).</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel}
          className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 text-sm transition-all flex items-center gap-1.5">
          <X size={14} /> Cancel
        </button>
        <button onClick={onConfirm}
          className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-all flex items-center gap-1.5">
          <Trash2 size={14} /> Clear
        </button>
      </div>
    </div>
  </div>
));

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function Whiteboard() {
  // ── Core State ──
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);        // undo stack — each entry is an elements snapshot
  const [action, setAction] = useState('none');      // none | drawing | typing | erasing | moving | panning
  const [tool, setTool] = useState('pencil');        // pencil | rect | circle | text | image | eraser | select | move | pan
  const [selectedId, setSelectedId] = useState(null);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);

  // ── Viewport ──
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // ── UI ──
  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [showClearModal, setShowClearModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // ── Refs (mutable, don't trigger re-renders) ──
  const canvasRef = useRef(null);
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const rafRef = useRef(null);
  const dragRef = useRef({ x: 0, y: 0 });           // drag/pan anchor (avoids state batching issues)
  const activeIdRef = useRef(null);                   // currently-drawing element id

  // ── Derived ──
  const selectedElement = elements.find(e => e.id === selectedId) ?? null;

  // ─────────────────────────────────────────
  // TOAST
  // ─────────────────────────────────────────
  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2800);
  }, []);

  // ─────────────────────────────────────────
  // HISTORY / UNDO
  // ─────────────────────────────────────────

  /** Call before any destructive mutation to push current state onto undo stack */
  const pushHistory = useCallback((currentElements) => {
    setHistory(prev => [...prev.slice(-49), currentElements]); // keep last 50 states
  }, []);

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) { showToast('Nothing to undo', 'error'); return prev; }
      const snapshot = prev[prev.length - 1];
      setElements(snapshot);
      showToast('Undo');
      return prev.slice(0, -1);
    });
  }, [showToast]);

  // ─────────────────────────────────────────
  // CANVAS RENDERING (extracted, single source of truth)
  // ─────────────────────────────────────────

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Sync canvas size if stale (handles resize & DPR changes)
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Draw all elements using the shared utility
    drawElements(ctx, elements);

    // Draw selection highlight
    if (selectedElement && (tool === 'move' || tool === 'select')) {
      const bb = getBBox(selectedElement);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5 / scale;
      ctx.setLineDash([5 / scale, 4 / scale]);
      ctx.strokeRect(
        bb.x - SELECTION_PADDING / scale,
        bb.y - SELECTION_PADDING / scale,
        bb.w + (SELECTION_PADDING * 2) / scale,
        bb.h + (SELECTION_PADDING * 2) / scale
      );
      ctx.setLineDash([]);

      // Corner handles
      const hs = 6 / scale;
      const corners = [
        [bb.x - SELECTION_PADDING / scale, bb.y - SELECTION_PADDING / scale],
        [bb.x + bb.w + SELECTION_PADDING / scale, bb.y - SELECTION_PADDING / scale],
        [bb.x - SELECTION_PADDING / scale, bb.y + bb.h + SELECTION_PADDING / scale],
        [bb.x + bb.w + SELECTION_PADDING / scale, bb.y + bb.h + SELECTION_PADDING / scale],
      ];
      ctx.fillStyle = '#10b981';
      corners.forEach(([cx, cy]) => {
        ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      });
    }

    ctx.restore();
  }, [elements, pan, scale, selectedElement, tool]);

  // Schedule render via RAF to cap at display refresh rate
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [render]);

  // ─────────────────────────────────────────
  // RESIZE & DPR HANDLING
  // ─────────────────────────────────────────

  useLayoutEffect(() => {
    const onResize = () => {
      // Just trigger a render cycle — the render fn syncs canvas dimensions itself
      setElements(prev => prev); // minimal state poke to re-run render
    };

    window.addEventListener('resize', onResize);

    // Observe DPR changes (user drags window between monitors)
    let mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mql.addEventListener('change', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      mql.removeEventListener('change', onResize);
    };
  }, []);

  // Focus textarea when typing starts
  useEffect(() => {
    if (action === 'typing' && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [action]);

  // ─────────────────────────────────────────
  // ZOOM
  // ─────────────────────────────────────────

  const handleZoom = useCallback((delta, focalX, focalY) => {
    const cx = focalX ?? window.innerWidth / 2;
    const cy = focalY ?? window.innerHeight / 2;

    setScale(prevScale => {
      const next = Math.min(Math.max(prevScale + delta, MIN_SCALE), MAX_SCALE);
      // Zoom toward focal point
      setPan(prevPan => ({
        x: cx - (cx - prevPan.x) * (next / prevScale),
        y: cy - (cy - prevPan.y) * (next / prevScale),
      }));
      return next;
    });
  }, []);

  // ─────────────────────────────────────────
  // EVENT HANDLERS
  // ─────────────────────────────────────────

  const handleMouseDown = useCallback((e) => {
    if (action === 'typing') return;
    e.preventDefault();

    const { clientX, clientY } = normalizeEvent(e);

    // ── Panning ──
    if (tool === 'pan' || e.button === 1) {
      setAction('panning');
      dragRef.current = { x: clientX, y: clientY };
      return;
    }

    const pos = screenToWorld({ clientX, clientY }, pan, scale);

    // ── Text Tool ──
    if (tool === 'text') {
      pushHistory(elements);
      const id = Date.now();
      const newEl = {
        id,
        type: 'text',
        x: pos.x,
        y: pos.y,
        text: '',
        color,
        lineWidth,
      };
      setElements(prev => [...prev, newEl]);
      setSelectedId(id);
      activeIdRef.current = id;

      // Position textarea at screen coordinates accounting for pan/scale
      if (textAreaRef.current) {
        textAreaRef.current.value = '';
        textAreaRef.current.style.left = `${clientX}px`;
        textAreaRef.current.style.top = `${clientY}px`;
        textAreaRef.current.style.color = color;
        textAreaRef.current.style.fontSize = `${DEFAULT_FONT_SIZE * scale}px`;
      }
      setAction('typing');
      return;
    }

    // ── Select Tool ──
    if (tool === 'select') {
      const found = [...elements].reverse().find(el => isHit(el, pos));
      setSelectedId(found ? found.id : null);
      return;
    }

    // ── Move Tool ──
    if (tool === 'move') {
      const found = [...elements].reverse().find(el => isHit(el, pos));
      if (found) {
        pushHistory(elements);
        setAction('moving');
        setSelectedId(found.id);
        dragRef.current = { x: pos.x, y: pos.y };
      } else {
        setSelectedId(null);
      }
      return;
    }

    // ── Eraser ──
    if (tool === 'eraser') {
      pushHistory(elements);
      setAction('erasing');
      setElements(prev => prev.filter(el => !isHit(el, pos)));
      return;
    }

    // ── Drawing Tools ──
    pushHistory(elements);
    setAction('drawing');
    const id = Date.now();
    activeIdRef.current = id;
    let newEl;

    if (tool === 'pencil') {
      newEl = { id, type: 'pencil', points: [pos], color, lineWidth: lineWidth / scale };
    } else if (tool === 'rect' || tool === 'circle') {
      newEl = { id, type: tool, x: pos.x, y: pos.y, width: 0, height: 0, color, lineWidth: lineWidth / scale };
    }

    if (newEl) setElements(prev => [...prev, newEl]);
  }, [action, tool, pan, scale, elements, color, lineWidth, pushHistory]);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = normalizeEvent(e);

    if (action === 'panning') {
      const dx = clientX - dragRef.current.x;
      const dy = clientY - dragRef.current.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      dragRef.current = { x: clientX, y: clientY };
      return;
    }

    if (action === 'none' || action === 'typing') return;

    const pos = screenToWorld({ clientX, clientY }, pan, scale);

    if (action === 'erasing') {
      setElements(prev => prev.filter(el => !isHit(el, pos)));
      return;
    }

    if (action === 'moving') {
      const dx = pos.x - dragRef.current.x;
      const dy = pos.y - dragRef.current.y;
      setElements(prev => prev.map(el => {
        if (el.id !== selectedId) return el;
        if (el.type === 'pencil') {
          return { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy }) ) };
        }
        return { ...el, x: el.x + dx, y: el.y + dy };
      }));
      dragRef.current = { x: pos.x, y: pos.y };
      return;
    }

    if (action === 'drawing') {
      const id = activeIdRef.current;
      setElements(prev => prev.map(el => {
        if (el.id !== id) return el;
        if (tool === 'pencil') return { ...el, points: [...el.points, pos] };
        if (tool === 'rect' || tool === 'circle') return { ...el, width: pos.x - el.x, height: pos.y - el.y };
        return el;
      }));
    }
  }, [action, pan, scale, selectedId, tool]);

  const handleMouseUp = useCallback(() => {
    if (action !== 'typing') setAction('none');
  }, [action]);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      handleZoom(e.deltaY > 0 ? -ZOOM_DELTA : ZOOM_DELTA, e.clientX, e.clientY);
    } else {
      setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  }, [handleZoom]);

  // ─────────────────────────────────────────
  // TEXT COMMIT
  // ─────────────────────────────────────────

  const handleTextBlur = useCallback(() => {
    const id = activeIdRef.current;
    if (!textAreaRef.current || !id) { setAction('none'); return; }
    const text = textAreaRef.current.value;
    if (text.trim() === '') {
      setElements(prev => prev.filter(el => el.id !== id));
    } else {
      setElements(prev => prev.map(el => el.id === id ? { ...el, text } : el));
    }
    activeIdRef.current = null;
    setSelectedId(null);
    setAction('none');
  }, []);

  // ─────────────────────────────────────────
  // IMAGE UPLOAD
  // ─────────────────────────────────────────

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';   // allow re-uploading the same file

    const reader = new FileReader();
    reader.onload = (evt) => {
      const src = evt.target.result;
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        const maxDim = MAX_IMAGE_DIM / scale;
        if (w > maxDim || h > maxDim) {
          const ratio = w / h;
          if (w > h) { w = maxDim; h = maxDim / ratio; }
          else       { h = maxDim; w = maxDim * ratio; }
        }
        const center = screenToWorld(
          { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 },
          pan, scale
        );
        pushHistory(elements);
        setElements(prev => [...prev, {
          id: Date.now(),
          type: 'image',
          x: center.x - w / 2,
          y: center.y - h / 2,
          width: w,
          height: h,
          imgSrc: src,   // serializable source
          imgObj: img,   // cached decoded image
        }]);
        showToast('Image added');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [scale, pan, elements, pushHistory, showToast]);

  // ─────────────────────────────────────────
  // EXPORT
  // ─────────────────────────────────────────

  const handleSave = useCallback(() => {
    const dpr = window.devicePixelRatio || 1;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width  = window.innerWidth  * dpr;
    tempCanvas.height = window.innerHeight * dpr;
    const tCtx = tempCanvas.getContext('2d');

    tCtx.scale(dpr, dpr);
    tCtx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc';
    tCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    tCtx.translate(pan.x, pan.y);
    tCtx.scale(scale, scale);

    drawElements(tCtx, elements);

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
    showToast('Exported as PNG');
  }, [elements, pan, scale, theme, showToast]);

  // ─────────────────────────────────────────
  // CLEAR
  // ─────────────────────────────────────────

  const handleClearConfirm = useCallback(() => {
    pushHistory(elements);
    setElements([]);
    setSelectedId(null);
    setShowClearModal(false);
    showToast('Canvas cleared');
  }, [elements, pushHistory, showToast]);

  // ─────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setColor(c => {
        if (c === '#ffffff' && next === 'light') return '#000000';
        if (c === '#000000' && next === 'dark')  return '#ffffff';
        return c;
      });
      return next;
    });
  }, []);

  // ─────────────────────────────────────────
  // KEYBOARD SHORTCUTS
  // ─────────────────────────────────────────

  useEffect(() => {
    const onKey = (e) => {
      if (action === 'typing') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo(); }
      if (e.key === 'Escape') { setSelectedId(null); setAction('none'); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          pushHistory(elements);
          setElements(prev => prev.filter(el => el.id !== selectedId));
          setSelectedId(null);
        }
      }
      // Tool hotkeys
      const keys = { p: 'pencil', r: 'rect', c: 'circle', t: 'text', e: 'eraser', m: 'move', s: 'select', h: 'pan' };
      if (keys[e.key] && !e.ctrlKey && !e.metaKey) setTool(keys[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [action, handleUndo, selectedId, elements, pushHistory]);

  // ─────────────────────────────────────────
  // CURSOR
  // ─────────────────────────────────────────

  const cursor =
    tool === 'text'   ? 'cursor-text' :
    tool === 'eraser' ? 'cursor-cell' :
    tool === 'move'   ? (action === 'moving'   ? 'cursor-grabbing' : 'cursor-grab') :
    tool === 'pan'    ? (action === 'panning'  ? 'cursor-grabbing' : 'cursor-grab') :
    tool === 'select' ? 'cursor-default' :
    'cursor-crosshair';

  // ─────────────────────────────────────────
  // TEXTAREA WORLD→SCREEN POSITION
  // ─────────────────────────────────────────

  const getTextareaScreenPos = () => {
    if (!selectedElement || selectedElement.type !== 'text') return {};
    return {
      left: `${selectedElement.x * scale + pan.x}px`,
      top:  `${selectedElement.y * scale + pan.y}px`,
    };
  };

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────

  const isDark = theme === 'dark';

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateX(-50%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
      `}</style>

      {/* ── Grainient Background ── */}
      <div className="absolute inset-0 z-0 transition-colors duration-700">
        <Grainient
          color1={isDark ? '#0a0a0f' : '#f0fdf4'}
          color2={isDark ? '#0d1f1a' : '#6ee7b7'}
          color3={isDark ? '#071a14' : '#2dd4bf'}
          timeSpeed={0.08}
          zoom={1.0}
        />
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-black/30' : 'bg-white/30'}`} />
      </div>

      {/* ── Toast ── */}
      <GlassToast message={toast.message} visible={toast.visible} type={toast.type} />

      {/* ── Clear Modal ── */}
      {showClearModal && (
        <ClearConfirmModal
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClearModal(false)}
        />
      )}

      {/* ── Canvas ── */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        className={`absolute inset-0 z-10 touch-none ${cursor}`}
      />

      {/* ── Hidden Textarea for Text Tool ── */}
      <textarea
        ref={textAreaRef}
        onBlur={handleTextBlur}
        className={`fixed z-20 bg-transparent border-b-2 border-dashed border-emerald-400/60 outline-none resize-none overflow-hidden min-w-[80px] min-h-[40px] ${action === 'typing' ? 'block' : 'hidden'}`}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 'bold',
          color,
          fontSize: `${DEFAULT_FONT_SIZE * scale}px`,
          ...getTextareaScreenPos(),
        }}
      />

      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* ─────────────────────────────────────
          TOP TOOLBAR
      ───────────────────────────────────── */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1.5 rounded-2xl backdrop-blur-2xl border shadow-2xl ${isDark ? 'bg-black/50 border-white/10' : 'bg-white/95 border-black/10 shadow-black/10'}`}>
        {/* Nav tools */}
        <div className={`flex gap-0.5 pr-3 border-r ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          {[
            { t: 'select', icon: MousePointer2, label: 'Select (S)' },
            { t: 'move',   icon: Move,          label: 'Move (M)' },
            { t: 'pan',    icon: Hand,           label: 'Pan (H)' },
          ].map(({ t, icon, label }) => (
            <ToolButton key={t} tool={t} icon={icon} label={label} activeTool={tool} onClick={() => setTool(t)} isDark={isDark} />
          ))}
        </div>

        {/* Drawing tools */}
        <div className={`flex gap-0.5 px-3 border-r ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          {[
            { t: 'pencil', icon: Pencil, label: 'Pencil (P)' },
            { t: 'rect',   icon: Square, label: 'Rectangle (R)' },
            { t: 'circle', icon: Circle, label: 'Circle (C)' },
            { t: 'text',   icon: Type,   label: 'Text (T)' },
          ].map(({ t, icon, label }) => (
            <ToolButton key={t} tool={t} icon={icon} label={label} activeTool={tool} onClick={() => setTool(t)} isDark={isDark} />
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Insert Image"
            className={`p-2.5 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-black/10'}`}
          >
            <ImageIcon size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-0.5 pl-1">
          <ToolButton tool="eraser" icon={Eraser} label="Eraser (E)" activeTool={tool} onClick={() => setTool('eraser')} isDark={isDark} />
          <button onClick={handleUndo} title="Undo (Ctrl+Z)"
            className={`p-2.5 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-black/10'}`}>
            <Undo size={18} />
          </button>
          <button onClick={() => setShowClearModal(true)} title="Clear canvas"
            className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────
          LEFT PANEL: PROPERTIES
      ───────────────────────────────────── */}
      <div className={`fixed top-24 left-5 z-30 flex flex-col gap-4 p-4 rounded-2xl backdrop-blur-2xl border shadow-2xl w-44 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-black/10'}`}>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-black/5 hover:bg-black/10 text-slate-600'}`}>
          <span>{isDark ? 'Dark' : 'Light'}</span>
          {isDark ? <Moon size={13} /> : <Sun size={13} />}
        </button>

        {/* Color Presets */}
        <div className="space-y-2">
          <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Color</span>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_COLORS.map(c => (
              <ColorSwatch key={c} c={c} active={color === c} onClick={() => setColor(c)} />
            ))}
          </div>
          {/* Custom color picker */}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded-full border border-white/20 overflow-hidden relative cursor-pointer">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Custom color"
              />
              <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
            </div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{color}</span>
          </div>
        </div>

        <div className={`h-px ${isDark ? 'bg-white/8' : 'bg-black/8'}`} />

        {/* Stroke Width */}
        <div className="space-y-2">
          <div className={`flex justify-between text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Width</span>
            <span className={isDark ? 'text-white' : 'text-slate-800'}>{lineWidth}px</span>
          </div>
          <input
            type="range" min="1" max="20" value={lineWidth}
            onChange={e => setLineWidth(parseInt(e.target.value))}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />
        </div>

        {/* Selected element info */}
        {selectedElement && (
          <>
            <div className={`h-px ${isDark ? 'bg-white/8' : 'bg-black/8'}`} />
            <div className={`text-[10px] uppercase tracking-widest font-bold space-y-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <div>Selected</div>
              <div className={`capitalize font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{selectedElement.type}</div>
              <button
                onClick={() => { pushHistory(elements); setElements(prev => prev.filter(el => el.id !== selectedId)); setSelectedId(null); }}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors mt-1"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────
          RIGHT PANEL: ZOOM + EXPORT
      ───────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-30 flex gap-3 items-end">
        {/* Zoom controls */}
        <div className={`flex flex-col items-center gap-1 p-1.5 rounded-xl backdrop-blur-2xl border shadow-xl ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-black/10'}`}>
          <button onClick={() => handleZoom(ZOOM_DELTA)} title="Zoom In"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <ZoomIn size={16} />
          </button>
          <div
            className={`text-[10px] font-mono cursor-pointer ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
            onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
            title="Reset view"
          >
            {Math.round(scale * 100)}%
          </div>
          <button onClick={() => handleZoom(-ZOOM_DELTA)} title="Zoom Out"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <ZoomOut size={16} />
          </button>
        </div>

        {/* Export */}
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95">
          <Download size={16} /> Export PNG
        </button>
      </div>

      {/* ─────────────────────────────────────
          FOOTER HINT
      ───────────────────────────────────── */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className={`text-[11px] px-4 py-1.5 rounded-full backdrop-blur border ${isDark ? 'text-slate-500 bg-black/20 border-white/5' : 'text-slate-400 bg-white/40 border-black/5'}`}>
          {tool === 'select' ? 'Click to select · Delete key removes selection' :
           tool === 'move'   ? 'Drag elements to reposition · Delete removes' :
           tool === 'pan'    ? 'Drag to pan · Scroll to pan · Ctrl+Scroll to zoom' :
           tool === 'eraser' ? 'Click or drag to erase elements' :
           tool === 'text'   ? 'Click to place text · Blur to commit' :
           'Drag to draw · Ctrl+Z undo · P R C T E M S H hotkeys'}
        </div>
      </div>
    </div>
  );
}