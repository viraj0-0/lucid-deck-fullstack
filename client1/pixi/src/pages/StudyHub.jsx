import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Upload, Mic, Share2, Library, BookOpen, 
  Play, Pause, ChevronRight, ChevronDown, 
  RotateCcw, FileText, CheckCircle2, Loader2,
  AlertCircle, Volume2, Sparkles, PlusCircle,
  X, Search, MessageSquare, Info
} from 'lucide-react';

// --- Global Configuration ---
const apiKey = "AIzaSyCxwU0YFZtYBCk4SSdxootC-pKorVJmWjc"; 

// --- Utility: PCM to WAV Conversion (for Gemini TTS) ---
const pcmToWav = (pcmData, sampleRate = 24000) => {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + pcmData.length * 2, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(16, 16, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); 
  view.setUint16(32, 2, true); 
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, pcmData.length * 2, true);
  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(44 + i * 2, pcmData[i], true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
};

// --- Components ---

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl transition-all ${className}`}>
    {children}
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick, active, loading }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all border text-sm font-medium
      ${active 
        ? 'bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
  >
    {loading ? <Loader2 className="animate-spin text-blue-400" size={18} /> : <Icon size={18} className={active ? 'text-blue-400' : 'text-slate-400'} />}
    <span>{label}</span>
  </button>
);

const FlashcardDeck = ({ cards, onGenerateMore, isGeneratingMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const isLastCard = currentIndex === cards.length - 1;
  const card = cards[currentIndex];

  return (
    <div className="flex flex-col items-center gap-10 py-12">
      <div 
        className="relative w-full max-w-lg h-72 perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 backface-hidden flex items-center justify-center p-10 bg-[#1e2230] border border-white/10 rounded-3xl text-center shadow-2xl">
            <p className="text-xl font-semibold leading-relaxed text-slate-100">{card.question}</p>
            <div className="absolute bottom-6 flex items-center gap-2 opacity-30 text-[10px] uppercase tracking-widest font-bold">
               <RotateCcw size={10} /> Tap to flip
            </div>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-10 bg-blue-600/20 border border-blue-500/30 rounded-3xl text-center shadow-2xl">
            <p className="text-lg leading-relaxed text-blue-100">{card.answer}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-8">
          <button 
            disabled={currentIndex === 0}
            onClick={() => { setCurrentIndex(i => i - 1); setIsFlipped(false); }}
            className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-20 transition-all hover:scale-110"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <span className="text-lg font-mono font-bold text-blue-400">{currentIndex + 1} <span className="text-slate-600 mx-1">/</span> {cards.length}</span>
          <button 
            disabled={currentIndex === cards.length - 1}
            onClick={() => { setCurrentIndex(i => i + 1); setIsFlipped(false); }}
            className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-20 transition-all hover:scale-110"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {isLastCard && (
          <button 
            onClick={onGenerateMore}
            disabled={isGeneratingMore}
            className="group flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {isGeneratingMore ? <Loader2 className="animate-spin" size={16} /> : <PlusCircle size={16} />}
            Generate New Cards
          </button>
        )}
      </div>
    </div>
  );
};

// --- Refactored: NotebookLM Style Tree Mind Map ---
const MindMapNode = ({ node, isRoot = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex items-start">
      <div className="relative flex flex-col items-start">
        {/* The Node Content */}
        <div 
          className={`flex items-center gap-3 py-2.5 px-4 rounded-xl border transition-all 
            ${isRoot 
              ? 'bg-blue-600 border-blue-400 text-white shadow-lg z-20 font-bold' 
              : 'bg-[#1a1d28] border-white/10 text-slate-300 hover:border-blue-400/50 z-10'
            }`}
        >
          {hasChildren && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-0.5 hover:bg-white/10 rounded transition-colors"
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          <span className="text-sm whitespace-nowrap">{node.name}</span>
        </div>

        {/* Children Rendered to the Right */}
        {isOpen && hasChildren && (
          <div className="flex flex-col gap-3 mt-4 ml-10 relative">
            {/* SVG Connector Lines */}
            <div className="absolute top-0 left-[-20px] bottom-0 w-px bg-white/10" />
            
            {node.children.map((child, i) => (
              <div key={i} className="relative pl-5">
                {/* Horizontal line to node */}
                <div className="absolute top-[18px] left-[-20px] w-5 h-px bg-white/10" />
                <MindMapNode node={child} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AudioTextSummaryPlayer = ({ audioUrl, transcript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-10 bg-white/5 p-6 rounded-3xl border border-white/10">
        <div className="relative group">
           <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-2xl transition-all duration-700 ${isPlaying ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />
           <button 
            onClick={togglePlay}
            className="relative w-16 h-16 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-500 transition-all shadow-xl z-10"
          >
            {isPlaying ? <Pause fill="white" size={24} /> : <Play fill="white" size={24} className="ml-1" />}
          </button>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">Briefing Summary</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-500 transition-all duration-300 ${isPlaying ? 'w-2/3 animate-pulse' : 'w-0'}`} />
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">AI Synthesis</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText size={14} /> Comprehensive Transcript
            </h4>
            <div className="p-6 bg-[#1a1d28] border border-white/5 rounded-3xl min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line italic opacity-90">
                {transcript}
                </p>
            </div>
        </div>
        
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Key Takeaways</h4>
            {['Core Methodology', 'Practical Results', 'Future Implications'].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs text-slate-300">{item}</span>
                </div>
            ))}
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [sources, setSources] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence
  const [savedResults, setSavedResults] = useState({
    voice: null,
    mindmap: null,
    flashcard: null
  });

  const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
      }
    }
  };

  const handleAIAction = async (mode, append = false) => {
    if (savedResults[mode] && !append) {
      setActiveTab(mode);
      return;
    }

    if (sources.length === 0) {
      setError("Add a source to start the analysis.");
      return;
    }

    setLoading(true);
    setActiveTab(mode);
    setError(null);

    // Combine all extracted text from sources
    const context = sources.map(s => `[SOURCE: ${s.name}]\n${s.content || "Text data extracted from binary source."}`).join('\n\n');

    const prompts = {
      voice: "Act as a professional study companion like NotebookLM. Analyze the provided text and write a sophisticated briefing summary. Focus on logic, evidence, and core findings. (Approx 150 words).",
      mindmap: "Create a hierarchical knowledge graph for the material in JSON. Return a single root object with 'name' and 'children' keys. Each child should also have 'children' up to 3 levels. Return ONLY valid JSON.",
      flashcard: append 
        ? `Based on the material, generate 5 MORE advanced flashcards. Focus on nuances and edge cases. JSON format: [{question, answer}].`
        : `Generate 6 high-quality active recall flashcards based on the material. JSON format: [{question, answer}].`
    };

    const textModel = "gemini-2.5-flash-preview-09-2025";
    const ttsModel = "gemini-2.5-flash-preview-tts";

    try {
      const textUrl = `https://generativelanguage.googleapis.com/v1beta/models/${textModel}:generateContent?key=${apiKey}`;
      const textPayload = {
        contents: [{ 
          parts: [{ text: `Study Material Context:\n${context}\n\nTask: ${prompts[mode]}` }] 
        }],
        generationConfig: { 
          temperature: 0.7, 
          responseMimeType: mode === 'voice' ? "text/plain" : "application/json" 
        }
      };

      const textData = await fetchWithRetry(textUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textPayload)
      });

      const rawText = textData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (mode === 'voice') {
        const ttsUrl = `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`;
        const ttsPayload = {
          contents: [{ parts: [{ text: `Say warmly: Your study briefing is ready. ${rawText}` }] }],
          generationConfig: { 
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
          }
        };

        const ttsData = await fetchWithRetry(ttsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ttsPayload)
        });

        const pcmBase64 = ttsData.candidates[0].content.parts[0].inlineData.data;
        const mimeType = ttsData.candidates[0].content.parts[0].inlineData.mimeType;
        const sampleRate = parseInt(mimeType.split('rate=')[1]) || 24000;

        const pcmBinary = atob(pcmBase64);
        const pcmArray = new Int16Array(pcmBinary.length / 2);
        for (let i = 0; i < pcmArray.length; i++) {
          pcmArray[i] = (pcmBinary.charCodeAt(i * 2) | (pcmBinary.charCodeAt(i * 2 + 1) << 8));
        }

        const audioBlob = pcmToWav(pcmArray, sampleRate);
        const audioUrl = URL.createObjectURL(audioBlob);

        setSavedResults(prev => ({ 
          ...prev, 
          voice: { audioUrl, transcript: rawText } 
        }));
      } else {
        const jsonMatch = rawText.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
        
        if (append && mode === 'flashcard') {
          setSavedResults(prev => ({
            ...prev,
            flashcard: [...(prev.flashcard || []), ...parsedData]
          }));
        } else {
          setSavedResults(prev => ({ ...prev, [mode]: parsedData }));
        }
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      setError(`AI Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Simulate extraction for binary files (PDF/PPT) and actual read for text
      const content = file.type.includes('text') || file.name.endsWith('.md') 
        ? event.target.result 
        : `[SIMULATED EXTRACTION: Content from ${file.name}]`;
      
      setSources([...sources, { 
        id: Date.now(), 
        name: file.name, 
        type: file.type || file.name.split('.').pop(),
        content: content
      }]);
    };

    if (file.type.includes('text') || file.name.endsWith('.md')) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
    setError(null);
  };

  const activeResult = savedResults[activeTab];

  return (
    <div className="flex h-screen bg-[#0f111a] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* NotebookLM Style Sidebar */}
      <aside className={`flex flex-col border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <BookOpen size={18} />
                </div>
                <h1 className="text-lg font-bold tracking-tight">Liquid Notebook</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={18} />
            </button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    Sources
                    <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">{sources.length}</span>
                </h2>
                
                <label className="group block cursor-pointer border border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/50 hover:bg-white/5 transition-all">
                    <input type="file" className="hidden" onChange={onFileUpload} />
                    <Upload className="mx-auto mb-2 text-slate-500 group-hover:text-blue-400" size={20} />
                    <p className="text-[11px] text-slate-500 font-medium">Click to upload</p>
                </label>

                <div className="space-y-2">
                    {sources.map(src => (
                        <div key={src.id} className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.07] transition-all">
                            <FileText size={14} className="text-blue-400 shrink-0" />
                            <span className="text-xs font-medium truncate flex-1">{src.name}</span>
                            <button onClick={() => setSources(sources.filter(s => s.id !== src.id))} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto border-t border-white/5 pt-6">
                <div className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                    <Info size={16} className="text-blue-400 shrink-0" />
                    <p className="text-[10px] leading-relaxed text-blue-300">AI analyses are performed locally on the context of your uploaded documents.</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0f111a]/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
                {!isSidebarOpen && (
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                    <Search size={14} className="text-slate-500" />
                    <input type="text" placeholder="Ask your document..." className="bg-transparent border-none text-xs focus:outline-none w-48 text-slate-400" />
                </div>
            </div>

            <div className="flex gap-2">
                <ActionButton icon={Mic} label="Summary" onClick={() => handleAIAction('voice')} active={activeTab === 'voice'} loading={loading && activeTab === 'voice'} />
                <ActionButton icon={Share2} label="Mind Map" onClick={() => handleAIAction('mindmap')} active={activeTab === 'mindmap'} loading={loading && activeTab === 'mindmap'} />
                <ActionButton icon={Library} label="Flashcards" onClick={() => handleAIAction('flashcard')} active={activeTab === 'flashcard'} loading={loading && activeTab === 'flashcard'} />
            </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative p-8">
            <div className="max-w-6xl mx-auto h-full">
                {!activeResult && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10 relative group">
                        <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <Sparkles size={40} className="text-blue-500 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500">
                        Deep Dive into Knowledge
                    </h2>
                    <p className="text-slate-500 max-w-md text-sm leading-relaxed mb-8">
                        Upload your study materials in the sidebar. I'll analyze every detail to create interactive trees, briefings, and recall decks.
                    </p>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-400">PDF</div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-400">DOCX</div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-400">TXT</div>
                    </div>
                </div>
                )}

                {error && (
                <div className="h-full flex flex-col items-center justify-center">
                    <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center max-w-sm">
                        <AlertCircle size={40} className="mx-auto text-rose-500 mb-4" />
                        <h3 className="font-bold text-rose-200 mb-2">Analysis Interrupted</h3>
                        <p className="text-xs text-rose-400/80 leading-relaxed mb-6">{error}</p>
                        <button onClick={() => setError(null)} className="px-6 py-2 bg-rose-500 text-white rounded-full text-xs font-bold transition-all hover:bg-rose-400">Dismiss</button>
                    </div>
                </div>
                )}

                {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f111a]/80 backdrop-blur-sm z-50">
                    <div className="relative mb-10">
                        <div className="w-24 h-24 border-[3px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full blur-2xl animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-black text-white tracking-widest uppercase animate-pulse">Analyzing Context</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] mt-3">Synthesizing document data...</p>
                    </div>
                </div>
                )}

                {activeResult && !loading && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === 'flashcard' && (
                        <FlashcardDeck 
                            cards={activeResult} 
                            onGenerateMore={() => handleAIAction('flashcard', true)} 
                            isGeneratingMore={loading}
                        />
                    )}
                    {activeTab === 'mindmap' && (
                        <div className="py-12 flex justify-center overflow-x-auto min-h-[600px]">
                            <MindMapNode node={activeResult} isRoot={true} />
                        </div>
                    )}
                    {activeTab === 'voice' && <AudioTextSummaryPlayer audioUrl={activeResult.audioUrl} transcript={activeResult.transcript} />}
                </div>
                )}
            </div>
        </div>

        {/* Floating AI Chat Bar (NotebookLM style) */}
        <div className="p-6 bg-[#0f111a] border-t border-white/5 sticky bottom-0 z-30">
            <div className="max-w-4xl mx-auto relative group">
                <input 
                    type="text" 
                    placeholder="Ask a question about your sources..." 
                    className="w-full bg-[#1a1d28] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-blue-500/50 transition-all shadow-lg"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all">
                    <MessageSquare size={18} />
                </button>
            </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}} />
    </div>
  );
}