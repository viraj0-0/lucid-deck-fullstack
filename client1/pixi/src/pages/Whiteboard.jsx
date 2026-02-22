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



import React, { useState, useRef, useEffect } from 'react';
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
  Minus,
  Move,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Hand
} from 'lucide-react';
import Grainient from '../components/Grainient.jsx';

// --- HELPER FUNCTIONS ---

// Transform screen coordinates to world coordinates
const getMousePos = (evt, pan, scale) => {
  return {
    x: (evt.clientX - pan.x) / scale,
    y: (evt.clientY - pan.y) / scale
  };
};

// Check if point is near a line segment (for eraser/selection)
const distanceToSegment = (p, v, w) => {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return (p.x - v.x) ** 2 + (p.y - v.y) ** 2;
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2;
};

// Hit test function
const isHit = (el, pos) => {
  const threshold = 100; // squared distance for lines
  if (el.type === 'rect' || el.type === 'image') {
    let rx = el.x, ry = el.y, rw = el.width, rh = el.height;
    if (rw < 0) { rx += rw; rw = Math.abs(rw); }
    if (rh < 0) { ry += rh; rh = Math.abs(rh); }
    return pos.x >= rx && pos.x <= rx + rw && pos.y >= ry && pos.y <= ry + rh;
  }
  if (el.type === 'circle') {
    const r = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
    const dist = (pos.x - el.x) ** 2 + (pos.y - el.y) ** 2;
    return dist <= r ** 2;
  }
  if (el.type === 'text') {
    // Rough estimation for text hit box
    const width = el.text.length * (el.fontSize || 24) * 0.6;
    const height = (el.fontSize || 24);
    return pos.x >= el.x && pos.x <= el.x + width && pos.y >= el.y - height && pos.y <= el.y + 10;
  }
  if (el.type === 'pencil') {
    for (let i = 0; i < el.points.length - 1; i++) {
      if (distanceToSegment(pos, el.points[i], el.points[i + 1]) < threshold) return true;
    }
  }
  return false;
};

// Custom Notification Component
const GlassToast = ({ message, visible, type = 'info' }) => {
  if (!visible) return null;
  return (
    <div className={`
      fixed top-24 left-1/2 -translate-x-1/2 z-50
      px-6 py-3 rounded-full
      bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
      text-white font-sans text-sm font-medium
      animate-in fade-in slide-in-from-top-4 duration-300
      flex items-center gap-3
    `}>
      <div className={`w-2 h-2 rounded-full ${type === 'error' ? 'bg-red-400' : 'bg-cyan-400'} animate-pulse`} />
      {message}
    </div>
  );
};

// --- COMPONENT ---

export default function Whiteboard() {
  // --- STATE ---
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState('none'); // none, drawing, typing, erasing, moving, panning
  const [tool, setTool] = useState('pencil'); // pencil, rect, circle, text, image, eraser, move, pan
  const [selectedElement, setSelectedElement] = useState(null);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  
  // Viewport State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Theme & UI State
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // Refs
  const canvasRef = useRef(null);
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- ACTIONS ---

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // If drawing color was default white/black, switch it for convenience
    if (color === '#ffffff' && newTheme === 'light') setColor('#000000');
    if (color === '#000000' && newTheme === 'dark') setColor('#ffffff');
  };

  const handleZoom = (delta) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.1), 5));
  };

  // --- CANVAS RENDERING ---

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Handle High DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    
    // Clear and Set Transform
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Draw Elements
    elements.forEach(el => {
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.lineWidth;
      ctx.fillStyle = el.color;
      ctx.font = `${el.fontSize || 24}px 'Space Grotesk', sans-serif`;
      
      if (el.type === 'pencil') {
        if (el.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      } 
      else if (el.type === 'rect') {
        ctx.strokeRect(el.x, el.y, el.width, el.height);
      } 
      else if (el.type === 'circle') {
        ctx.beginPath();
        const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
        ctx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
      else if (el.type === 'text') {
        ctx.fillText(el.text, el.x, el.y + 24); 
      }
      else if (el.type === 'image' && el.imgObj) {
        ctx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
      }
    });

    // Draw Selection Box if moving
    if (selectedElement && tool === 'move') {
      const el = selectedElement;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1 / scale;
      ctx.setLineDash([5, 5]);
      
      let bx = el.x, by = el.y, bw = 0, bh = 0;
      
      if (el.type === 'pencil') {
        // Find bounds of pencil path
        const xs = el.points.map(p => p.x);
        const ys = el.points.map(p => p.y);
        bx = Math.min(...xs); by = Math.min(...ys);
        bw = Math.max(...xs) - bx; bh = Math.max(...ys) - by;
      } else if (el.type === 'circle') {
        const r = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
        bx = el.x - r; by = el.y - r; bw = r * 2; bh = r * 2;
      } else if (el.type === 'text') {
        bw = el.text.length * (el.fontSize || 24) * 0.6;
        bh = (el.fontSize || 24);
        by = el.y; // Text baseline diff
      } else {
        bw = el.width; bh = el.height;
      }
      
      // Simple rect around selection
      ctx.strokeRect(bx - 5, by - 5, bw + 10, bh + 10);
      ctx.setLineDash([]);
    }

    ctx.restore();

  }, [elements, pan, scale, selectedElement, tool]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setElements(prev => [...prev]); // Trigger re-render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- MOUSE HANDLERS ---

  const handleMouseDown = (e) => {
    if (action === 'typing') return;
    
    // Panning logic (Middle click or Pan tool)
    if (tool === 'pan' || e.button === 1) {
      setAction('panning');
      setDragOffset({ x: e.clientX, y: e.clientY });
      return;
    }

    const pos = getMousePos(e, pan, scale);

    // Text Tool
    if (tool === 'text') {
      setAction('typing');
      const id = Date.now();
      const newEl = { id, type: 'text', x: pos.x, y: pos.y, text: '', color, fontSize: 24 / scale };
      setElements(prev => [...prev, newEl]);
      setSelectedElement(newEl);
      setTimeout(() => {
        if(textAreaRef.current) {
          textAreaRef.current.value = "";
          textAreaRef.current.focus();
          // Position relative to screen for textarea
          textAreaRef.current.style.left = `${e.clientX}px`;
          textAreaRef.current.style.top = `${e.clientY}px`;
          textAreaRef.current.style.color = color;
          textAreaRef.current.style.fontSize = `${24 * scale}px`;
        }
      }, 0);
      return;
    }

    // Move Tool
    if (tool === 'move') {
      const found = elements.slice().reverse().find(el => isHit(el, pos));
      if (found) {
        setAction('moving');
        setSelectedElement(found);
        setDragOffset({ x: pos.x, y: pos.y }); // Store world start pos
      } else {
        setSelectedElement(null);
      }
      return;
    }

    // Eraser Tool
    if (tool === 'eraser') {
      setAction('erasing');
      deleteElementAt(pos);
      return;
    }

    // Drawing Tools
    setAction('drawing');
    const id = Date.now();
    let newEl;

    if (tool === 'pencil') {
      newEl = { id, type: 'pencil', points: [pos], color, lineWidth: lineWidth / scale };
    } else if (tool === 'rect' || tool === 'circle') {
      newEl = { id, type: tool, x: pos.x, y: pos.y, width: 0, height: 0, color, lineWidth: lineWidth / scale };
    }

    if (newEl) {
      setElements(prev => [...prev, newEl]);
      setSelectedElement(newEl);
    }
  };

  const handleMouseMove = (e) => {
    // Panning
    if (action === 'panning') {
      const dx = e.clientX - dragOffset.x;
      const dy = e.clientY - dragOffset.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragOffset({ x: e.clientX, y: e.clientY });
      return;
    }

    const pos = getMousePos(e, pan, scale);

    if (action === 'erasing') {
      deleteElementAt(pos);
      return;
    }

    if (action === 'moving' && selectedElement) {
      const dx = pos.x - dragOffset.x;
      const dy = pos.y - dragOffset.y;
      
      setElements(prev => prev.map(el => {
        if (el.id === selectedElement.id) {
          if (el.type === 'pencil') {
            return { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
          } else {
            return { ...el, x: el.x + dx, y: el.y + dy };
          }
        }
        return el;
      }));
      setDragOffset({ x: pos.x, y: pos.y }); // Reset for next delta
      return;
    }

    if (action === 'drawing' && selectedElement) {
      setElements(prev => prev.map(el => {
        if (el.id === selectedElement.id) {
          if (tool === 'pencil') {
            return { ...el, points: [...el.points, pos] };
          } else if (tool === 'rect' || tool === 'circle') {
            return { ...el, width: pos.x - el.x, height: pos.y - el.y };
          }
        }
        return el;
      }));
    }
  };

  const handleMouseUp = () => {
    if (action !== 'typing') setAction('none');
  };

  const deleteElementAt = (pos) => {
    setElements(prev => prev.filter(el => !isHit(el, pos)));
  };

  // --- UTILS ---

  const handleTextBlur = () => {
    if (selectedElement && selectedElement.type === 'text') {
      const text = textAreaRef.current.value;
      if (text.trim() === '') {
        setElements(prev => prev.filter(el => el.id !== selectedElement.id));
      } else {
        setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, text } : el));
      }
    }
    setAction('none');
    setSelectedElement(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 300 / scale;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            const ratio = w / h;
            if (w > h) { w = maxDim; h = maxDim / ratio; }
            else { h = maxDim; w = maxDim * ratio; }
          }
          
          // Center view logic
          const centerPos = getMousePos({ clientX: window.innerWidth/2, clientY: window.innerHeight/2 }, pan, scale);

          const newEl = { 
            id: Date.now(), 
            type: 'image', 
            x: centerPos.x - w/2, 
            y: centerPos.y - h/2, 
            width: w, 
            height: h, 
            imgObj: img 
          };
          setElements(prev => [...prev, newEl]);
          showToast('Image added successfully');
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Create a temporary canvas to render the final image with background
    const tempCanvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    // We export the view as it is seen, or the whole bounds? Let's export current view for simplicity
    tempCanvas.width = window.innerWidth * dpr;
    tempCanvas.height = window.innerHeight * dpr;
    const tCtx = tempCanvas.getContext('2d');
    
    tCtx.scale(dpr, dpr);
    
    // Fill background
    tCtx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc';
    tCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    tCtx.translate(pan.x, pan.y);
    tCtx.scale(scale, scale);

    // Draw elements on temp canvas
    elements.forEach(el => {
      tCtx.strokeStyle = el.color;
      tCtx.lineWidth = el.lineWidth;
      tCtx.fillStyle = el.color;
      tCtx.font = `${el.fontSize || 24}px 'Space Grotesk', sans-serif`;
      
      if (el.type === 'pencil') {
        if (el.points.length < 2) return;
        tCtx.beginPath();
        tCtx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          tCtx.lineTo(el.points[i].x, el.points[i].y);
        }
        tCtx.stroke();
      } else if (el.type === 'rect') {
        tCtx.strokeRect(el.x, el.y, el.width, el.height);
      } else if (el.type === 'circle') {
        tCtx.beginPath();
        const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2));
        tCtx.arc(el.x, el.y, radius, 0, 2 * Math.PI);
        tCtx.stroke();
      } else if (el.type === 'text') {
        tCtx.fillText(el.text, el.x, el.y + 24);
      } else if (el.type === 'image' && el.imgObj) {
        tCtx.drawImage(el.imgObj, el.x, el.y, el.width, el.height);
      }
    });

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
    showToast('Whiteboard exported as PNG', 'info');
  };

  const handleClear = () => {
    if(window.confirm('Clear entire whiteboard?')) {
      setElements([]);
      showToast('Canvas cleared', 'info');
    }
  };

  // --- COMPONENTS ---

  const ToolButton = ({ t, icon: Icon, active }) => (
    <button 
      onClick={() => setTool(t)}
      title={t}
      className={`p-3 rounded-xl transition-all ${active ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
    >
      <Icon size={20} />
    </button>
  );

  const ColorButton = ({ c }) => (
    <button 
      onClick={() => setColor(c)}
      className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
      style={{ backgroundColor: c }}
    />
  );

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans selection:bg-cyan-500/30 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 transition-colors duration-700">
        <Grainient 
          color1={theme === 'dark' ? '#121212' : '#f0fdf4'} 
          color2={theme === 'dark' ? '#121212' : '#6ee7b7'} 
          color3={theme === 'dark' ? '#121212' : '#2dd4bf'} 
          timeSpeed={0.1}
          zoom={1.0}
        />
        <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-black/20' : 'bg-white/40'}`}></div>
      </div>

      {/* TOAST NOTIFICATION */}
      <GlassToast message={toast.message} visible={toast.visible} type={toast.type} />

      {/* CANVAS LAYER */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e) => {
          if (e.ctrlKey) {
            e.preventDefault();
            handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
          }
        }}
        className={`absolute inset-0 z-10 touch-none ${
          tool === 'text' ? 'cursor-text' : 
          tool === 'eraser' ? 'cursor-cell' : 
          tool === 'move' ? (action === 'moving' ? 'cursor-grabbing' : 'cursor-grab') :
          tool === 'pan' ? (action === 'panning' ? 'cursor-grabbing' : 'cursor-grab') :
          'cursor-crosshair'
        }`}
      />

      {/* HIDDEN TEXT INPUT */}
      <textarea
        ref={textAreaRef}
        onBlur={handleTextBlur}
        className={`
          fixed z-20 bg-transparent border-2 border-dashed border-cyan-500/50 
          outline-none resize-none overflow-hidden font-sans font-bold
          ${action === 'typing' ? 'block' : 'hidden'}
        `}
        style={{ minWidth: '100px', minHeight: '50px' }}
      />

      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* --- UI CONTROLS --- */}

      {/* TOP BAR: TOOLS */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex gap-1 pr-4 border-r border-white/10">
          <ToolButton t="select" icon={MousePointer2} active={tool === 'select'} /> {/* Placeholder for later */}
          <ToolButton t="move" icon={Move} active={tool === 'move'} />
          <ToolButton t="pan" icon={Hand} active={tool === 'pan'} />
        </div>
        <div className="flex gap-1 px-4 border-r border-white/10">
          <ToolButton t="pencil" icon={Pencil} active={tool === 'pencil'} />
          <ToolButton t="rect" icon={Square} active={tool === 'rect'} />
          <ToolButton t="circle" icon={Circle} active={tool === 'circle'} />
          <ToolButton t="text" icon={Type} active={tool === 'text'} />
          <button 
            onClick={() => fileInputRef.current.click()}
            className={`p-3 rounded-xl transition-all ${tool === 'image' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
          >
            <ImageIcon size={20} />
          </button>
        </div>
        <div className="flex gap-1 pl-2">
          <ToolButton t="eraser" icon={Eraser} active={tool === 'eraser'} />
          <button onClick={() => { setElements(prev => prev.slice(0, -1)); showToast('Undo') }} className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <Undo size={20} />
          </button>
          <button onClick={handleClear} className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* LEFT BAR: PROPERTIES */}
      <div className="fixed top-24 left-6 z-30 flex flex-col gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-in slide-in-from-left-8 fade-in duration-500 w-48">
        {/* Dark/Light Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"
        >
          <span>{theme} Mode</span>
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Stroke Color</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              '#ffffff', '#000000', '#94a3b8', '#475569', 
              '#ef4444', '#f97316', '#eab308', '#22c55e', 
              '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'
            ].map(c => (
              <ColorButton key={c} c={c} />
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex justify-between">
            <span>Stroke Width</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{lineWidth}px</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      {/* RIGHT BAR: ZOOM & ACTIONS */}
      <div className="fixed bottom-6 right-6 z-30 flex gap-4 items-end">
        <div className="flex flex-col gap-2 p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <button onClick={() => handleZoom(0.1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><ZoomIn size={20} /></button>
          <div className="text-center text-[10px] font-mono text-slate-500">{Math.round(scale * 100)}%</div>
          <button onClick={() => handleZoom(-0.1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><ZoomOut size={20} /></button>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <Download size={18} /> Export Board
        </button>
      </div>

      {/* FOOTER HINT */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 text-xs text-slate-500 pointer-events-none bg-black/20 backdrop-blur px-4 py-1 rounded-full">
        {tool === 'move' ? 'Drag elements to move' : tool === 'pan' ? 'Drag canvas to pan' : tool === 'eraser' ? 'Click or drag to erase' : 'Drag to draw'}
      </div>

    </div>
  );
}