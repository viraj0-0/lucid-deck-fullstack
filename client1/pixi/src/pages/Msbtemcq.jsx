
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Award, ChevronRight, RefreshCw, Layers, Brain, Zap, Globe, Leaf, Flag, AlertCircle, User, Hash, FileText, XCircle, LogOut } from 'lucide-react';

// --- IMPORTS ---
// Assuming these files exist in your project structure
import manData from '../mcq/man.json';
import beeData from '../mcq/bee.json';
import etiData from '../mcq/eti.json';
import bscData from '../mcq/bsc.json';
import eesData from '../mcq/ees.json';

const SUBJECTS_LIST = [
  { id: 'man', code: '315301', name: 'Management', short: 'MAN', icon: Layers, color: 'from-blue-400 to-purple-500' },
  { id: 'bee', code: '22310', name: 'Basic Electrical & Electronics', short: 'BEE', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'eti', code: '22518', name: 'Emerging Trends in IT', short: 'ETI', icon: Globe, color: 'from-emerald-400 to-cyan-500' },
  { id: 'bsc', code: '22102', name: 'Basic Science', short: 'BSC', icon: Brain, color: 'from-pink-400 to-rose-500' },
  { id: 'ees', code: '22447', name: 'Environmental Studies', short: 'EES', icon: Leaf, color: 'from-green-400 to-teal-500' },
];

const DATA_MAP = {
  'man': manData,
  'bee': beeData,
  'eti': etiData,
  'bsc': bscData,
  'ees': eesData
};

// --- HELPER FUNCTIONS ---

const shuffleArray = (array) => {
  if (!array) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- COMPONENTS ---

const Background = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-slate-900 pointer-events-none print:hidden">
    {/* Animated Blobs */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
  </div>
);

const GlassCard = ({ children, className = "", hoverEffect = false, onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-2xl shadow-xl
      transition-all duration-300
      print:bg-white print:border-slate-300 print:shadow-none print:overflow-visible
      ${hoverEffect ? 'hover:bg-white/10 hover:scale-[1.02] hover:border-white/20 cursor-pointer active:scale-95' : ''}
      ${className}
    `}
  >
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none print:hidden" />
    {children}
  </div>
);

const SubjectCard = ({ subject, onSelect }) => (
  <GlassCard hoverEffect onClick={() => onSelect(subject)} className="p-6 flex flex-col items-center text-center gap-4 group">
    <div className={`p-4 rounded-full bg-gradient-to-br ${subject.color} shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all`}>
      <subject.icon size={32} className="text-white" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-white tracking-tight">{subject.short}</h3>
      <p className="text-sm text-slate-400 mt-1 line-clamp-1">{subject.name}</p>
      <p className="text-xs text-slate-500 mt-0.5 font-mono">{subject.code}</p>
    </div>
  </GlassCard>
);

const ModeCard = ({ title, subtitle, count, onClick, colorClass }) => (
  <GlassCard hoverEffect onClick={onClick} className="p-6 flex flex-row items-center justify-between group">
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
        {title}
      </h3>
      <p className="text-sm text-slate-400">{subtitle}</p>
      <div className="flex items-center gap-2 mt-3">
        <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/10 text-white border border-white/10">
          {count} Questions
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/10 text-white border border-white/10">
          1 Mark Each
        </span>
      </div>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${colorClass} opacity-80 group-hover:opacity-100 transition-all shadow-lg`}>
      <ChevronRight className="text-white" />
    </div>
  </GlassCard>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState('subjects'); // subjects, modes, details, quiz, result
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [examMode, setExamMode] = useState(null); // unit1, unit2, final
  
  // User Details State
  const [userName, setUserName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [skipped, setSkipped] = useState({}); // { questionId: true }
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // --- LOGIC HANDLERS ---

  // *** KEYBOARD NAVIGATION (ENTER KEY) ***
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only active if we are in quiz view
      if (view === 'quiz') {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent unexpected form submissions
          
          // Only move next if it is NOT the last question
          // We avoid auto-submitting on Enter to prevent accidents
          if (currentQuestionIndex < questions.length - 1) {
             setCurrentQuestionIndex(prev => prev + 1);
          }
        }
      }
    };

    // Attach listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on unmount or when view/question changes
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [view, currentQuestionIndex, questions.length]);


  // *** TIMER LOGIC ***
  useEffect(() => {
    let timer = null;
    if (view === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when timer hits 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [view, timeLeft]);

  const handleSubjectSelect = (subject) => {
    const data = DATA_MAP[subject.id];

    if (data) {
      setSubjectData(data); 
      setSelectedSubject(subject);
      setView('modes');
    } else {
      console.error(`Data missing for ${subject.id}`);
      alert(`Data file not found for ${subject.name}. Check imports and JSON files.`);
    }
  };

  const handleModeSelect = (mode) => {
    if (!subjectData || !subjectData.units) {
      alert("Error: Subject data not loaded correctly.");
      return;
    }

    setExamMode(mode);
    
    // Prepare questions but don't start quiz yet
    let pool = [];
    const allUnits = subjectData.units;
    const splitIndex = Math.ceil(allUnits.length / 2); 

    if (mode === 'unit1') {
      const targetUnits = allUnits.slice(0, splitIndex);
      targetUnits.forEach(u => pool.push(...u.questions));
    } else if (mode === 'unit2') {
      const targetUnits = allUnits.slice(splitIndex);
      targetUnits.forEach(u => pool.push(...u.questions));
    } else {
      allUnits.forEach(u => pool.push(...u.questions));
    }

    if (pool.length === 0) {
      alert("No questions found for this section.");
      return;
    }

    const shuffled = shuffleArray(pool);
    const questionCount = mode === 'final' ? 70 : 30;
    const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setQuestions(selectedQuestions);
    setAnswers({});
    setSkipped({});
    setCurrentQuestionIndex(0);
    setScore(0);
    
    // *** SET REAL TIMER ***
    // Final Exam = 60 minutes (3600 seconds)
    // Unit Exams = 30 minutes (1800 seconds)
    if (mode === 'final') {
      setTimeLeft(60 * 60); 
    } else {
      setTimeLeft(30 * 60);
    }
    
    // Go to details input instead of quiz directly
    setView('details');
  };

  const handleStartExam = () => {
    if (!userName.trim() || !rollNumber.trim()) {
      alert("Please enter both Name and Roll Number to start the exam.");
      return;
    }
    setView('quiz');
  };

  const handleAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
    // If user answers, remove 'skipped' status if it exists
    if (skipped[questionId]) {
      const newSkipped = { ...skipped };
      delete newSkipped[questionId];
      setSkipped(newSkipped);
    }
  };

  const handleSkip = () => {
    const currentQ = questions[currentQuestionIndex];
    
    // Mark as skipped
    setSkipped(prev => ({
      ...prev,
      [currentQ.id]: true
    }));

    // Move to next question if not last
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.a) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setView('result');
  };

  const resetApp = () => {
    setView('subjects');
    setSelectedSubject(null);
    setSubjectData(null);
    setExamMode(null);
    setUserName('');
    setRollNumber('');
    setQuestions([]);
    setAnswers({});
    setSkipped({});
    setScore(0);
  };

  // --- VIEWS ---

  const renderSubjectSelection = () => (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 mb-4 drop-shadow-lg">
          MSBTE Exam Portal
        </h1>
        <p className="text-lg text-slate-400 font-light">Select a subject to begin your preparation</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {SUBJECTS_LIST.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} onSelect={handleSubjectSelect} />
        ))}
      </div>
      
      <div className="mt-16 text-center text-slate-600 text-sm font-mono">
        System Status: Online • v2.4.0 • Connected to MSBTE Node
      </div>
    </div>
  );

  const renderModeSelection = () => (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in zoom-in-95 duration-500">
      <button 
        onClick={() => setView('subjects')} 
        className="mb-8 text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        ← Back to Subjects
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-full bg-gradient-to-br ${selectedSubject.color}`}>
          <selectedSubject.icon className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">{selectedSubject.name}</h2>
          <p className="text-slate-400 font-mono text-sm">Course Code: {selectedSubject.code}</p>
        </div>
      </div>

      <div className="space-y-4">
        <ModeCard 
          title="Unit Test I" 
          subtitle="Chapters 1 - 3 (Basic Concepts)" 
          count={30} 
          onClick={() => handleModeSelect('unit1')}
          colorClass="from-blue-500 to-indigo-600"
        />
        <ModeCard 
          title="Unit Test II" 
          subtitle="Chapters 4 - 6 (Advanced Topics)" 
          count={30} 
          onClick={() => handleModeSelect('unit2')}
          colorClass="from-purple-500 to-pink-600"
        />
        <ModeCard 
          title="Final Exam" 
          subtitle="Full Syllabus Comprehensive" 
          count={70} 
          onClick={() => handleModeSelect('final')}
          colorClass="from-emerald-500 to-teal-600"
        />
      </div>
    </div>
  );

  const renderUserDetails = () => (
    <div className="min-h-screen flex items-center justify-center px-4 animate-in zoom-in-95 duration-500">
      <GlassCard className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <User className="text-blue-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Student Details</h2>
          <p className="text-slate-400 text-sm mt-2">Please enter your details to start the exam</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/40 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Roll Number</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/40 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartExam}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Start Exam
            </button>
            <button
              onClick={() => setView('modes')}
              className="w-full mt-3 py-3 rounded-xl bg-transparent text-slate-400 hover:text-white transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderQuiz = () => {
    if (!questions || questions.length === 0) return <div>Loading questions...</div>;

    const currentQ = questions[currentQuestionIndex];
    const isLast = currentQuestionIndex === questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-7xl mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedSubject.color}`}>
                <BookOpen size={20} className="text-white"/>
             </div>
             <div>
               <h3 className="text-white font-bold text-lg hidden md:block">{examMode === 'final' ? 'Final Exam' : examMode === 'unit1' ? 'Unit Test I' : 'Unit Test II'}</h3>
               <p className="text-xs text-slate-400 font-mono">{userName} ({rollNumber})</p>
             </div>
          </div>
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
             <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Answered</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Skipped</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/20"></div>Pending</div>
             </div>
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-4 py-2 bg-black/30 rounded-full border border-white/5">
                  <Clock size={16} className={`text-blue-400 ${timeLeft < 60 ? 'animate-pulse text-red-500' : ''}`} />
                  <span className={`font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
               </div>
               {/* END EXAM BUTTON */}
               <button 
                  onClick={() => {
                    if(window.confirm("Are you sure you want to end the exam prematurely?")) {
                      handleSubmit();
                    }
                  }}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full text-xs font-bold transition-all flex items-center gap-2"
               >
                 <LogOut size={14} /> End Exam
               </button>
             </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
            {/* Main Question Card Area - Takes 3 columns on large screens */}
            <div className="lg:col-span-3 flex flex-col overflow-hidden h-full">
                <GlassCard className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 rounded-md bg-white/10 text-slate-300 text-xs font-mono border border-white/5">
                            Question {currentQuestionIndex + 1} / {questions.length}
                        </span>
                        <div className="flex gap-2">
                            {skipped[currentQ.id] && (
                            <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold animate-in fade-in bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                                <AlertCircle size={14} /> Skipped
                            </span>
                            )}
                            {answers[currentQ.id] && (
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold animate-in fade-in bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                                <CheckCircle size={14} /> Answered
                            </span>
                            )}
                        </div>
                    </div>

                    <h2 className="text-xl md:text-3xl font-medium text-white mb-8 leading-snug">
                        {currentQ.q}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQ.o.map((option, idx) => {
                        const isSelected = answers[currentQ.id] === option;
                        return (
                            <button
                            key={idx}
                            onClick={() => handleAnswer(currentQ.id, option)}
                            className={`
                                group relative p-4 rounded-xl text-left border transition-all duration-200
                                ${isSelected 
                                ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                }
                            `}
                            >
                            <div className="flex items-center gap-4">
                                <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors
                                ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20 text-slate-400 group-hover:border-white/40'}
                                `}>
                                {String.fromCharCode(65 + idx)}
                                </div>
                                <span className={`text-lg ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                {option}
                                </span>
                            </div>
                            </button>
                        )
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="mt-auto pt-8 flex justify-between items-center border-t border-white/5">
                        <div className="flex gap-3">
                            <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="px-6 py-3 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors bg-white/5 hover:bg-white/10"
                            >
                            Previous
                            </button>
                            
                            {!answers[currentQ.id] && !skipped[currentQ.id] && (
                                <button
                                    onClick={handleSkip}
                                    className="px-4 py-3 rounded-xl text-yellow-400 hover:text-yellow-300 border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors flex items-center gap-2"
                                >
                                    <Flag size={18} /> <span className="hidden sm:inline">Skip</span>
                                </button>
                            )}
                        </div>
                        
                        {isLast ? (
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            Submit <Award size={18} />
                        </button>
                        ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                            {/* ADDED KEY HINT TEXT */}
                            Next <span className="text-[10px] font-normal text-slate-500 bg-slate-200 px-1 rounded ml-1 border border-slate-300">↵ Enter</span> <ChevronRight size={18} />
                        </button>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Right Side Question Tracker - Takes 1 column on large screens */}
            <div className="lg:col-span-1 flex flex-col h-full overflow-hidden">
                <GlassCard className="h-full p-4 flex flex-col">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Layers size={18} className="text-blue-400"/> Question Map
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {/* Added p-2 here to prevent clipping of scaled items with rings */}
                        <div className="grid grid-cols-5 gap-2 content-start p-2">
                            {questions.map((q, idx) => {
                                const isCurrent = currentQuestionIndex === idx;
                                const isAnswered = !!answers[q.id];
                                const isSkipped = !!skipped[q.id];
                                
                                let bgClass = "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10";
                                if (isAnswered) bgClass = "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]";
                                else if (isSkipped) bgClass = "bg-yellow-500 border-yellow-500 text-black font-bold shadow-[0_0_10px_rgba(234,179,8,0.4)]";
                                
                                if (isCurrent) bgClass += " ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 z-10";

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={`
                                            aspect-square rounded-full flex items-center justify-center text-xs font-mono transition-all duration-200 border
                                            ${bgClass}
                                        `}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Mini Legend for Mobile/Tablet context if header legend hidden */}
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Answered</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Skipped</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/20"></div> Current</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/5 border border-white/10"></div> Pending</div>
                    </div>
                </GlassCard>
            </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= 40; 
    const attempted = Object.keys(answers).length;
    const skippedCount = Object.keys(skipped).length;
    const wrong = attempted - score;

    return (
      <div className="min-h-screen p-4 md:p-8 overflow-y-auto print:p-0 print:bg-white print:h-auto">
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-700 print:space-y-4 print:w-full print:max-w-none">
          
          {/* Header Card */}
          <GlassCard className="p-8 relative overflow-hidden print:border-b-2 print:border-black print:rounded-none">
             {/* WATERMARK */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-5 print:opacity-10">
               <div className="text-slate-500 text-6xl md:text-9xl font-black -rotate-12 whitespace-nowrap select-none">
                 MSBTE OFFICIAL RECORD
               </div>
             </div>

             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                 <h1 className="text-3xl font-bold text-white mb-1 print:text-black">Exam Performance Report</h1>
                 <div className="text-slate-400 text-sm font-mono space-y-1 print:text-black">
                   <p>Student: <span className="text-white print:text-black font-bold">{userName}</span></p>
                   <p>Roll No: <span className="text-white print:text-black font-bold">{rollNumber}</span></p>
                   <p>Subject: {selectedSubject.name} ({selectedSubject.code})</p>
                   <p>Date: {new Date().toLocaleDateString()}</p>
                 </div>
               </div>
               <div className="flex flex-col items-center">
                  <div className={`text-5xl font-bold ${passed ? 'text-emerald-400 print:text-emerald-700' : 'text-red-400 print:text-red-700'} mb-1`}>
                    {percentage}%
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${passed ? 'bg-emerald-500/20 text-emerald-400 print:bg-emerald-100 print:text-emerald-800' : 'bg-red-500/20 text-red-400 print:bg-red-100 print:text-red-800'}`}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </span>
               </div>
             </div>
          </GlassCard>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
             <GlassCard className="p-4 flex flex-col items-center justify-center print:border print:border-slate-300">
               <span className="text-slate-400 text-xs uppercase tracking-wider mb-1 print:text-black">Total Questions</span>
               <span className="text-2xl font-bold text-white print:text-black">{total}</span>
             </GlassCard>
             <GlassCard className="p-4 flex flex-col items-center justify-center print:border print:border-slate-300">
               <span className="text-slate-400 text-xs uppercase tracking-wider mb-1 print:text-black">Attempted</span>
               <span className="text-2xl font-bold text-blue-400 print:text-blue-700">{attempted}</span>
             </GlassCard>
             <GlassCard className="p-4 flex flex-col items-center justify-center print:border print:border-slate-300">
               <span className="text-slate-400 text-xs uppercase tracking-wider mb-1 print:text-black">Correct</span>
               <span className="text-2xl font-bold text-emerald-400 print:text-emerald-700">{score}</span>
             </GlassCard>
             <GlassCard className="p-4 flex flex-col items-center justify-center print:border print:border-slate-300">
               <span className="text-slate-400 text-xs uppercase tracking-wider mb-1 print:text-black">Wrong</span>
               <span className="text-2xl font-bold text-red-400 print:text-red-700">{wrong}</span>
             </GlassCard>
          </div>

          {/* Detailed Question Analysis */}
          <GlassCard className="p-0 overflow-hidden print:border-none">
            <div className="p-4 border-b border-white/10 bg-white/5 print:bg-slate-100 print:border-slate-300">
              <h3 className="text-white font-bold flex items-center gap-2 print:text-black">
                <FileText size={18} /> Detailed Analysis
              </h3>
            </div>
            <div className="divide-y divide-white/5 print:divide-slate-200">
              {questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.a;
                const isSkipped = !userAnswer;

                return (
                  <div key={idx} className="p-6 hover:bg-white/5 transition-colors print:p-4 print:break-inside-avoid">
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold mt-1
                        ${isCorrect ? 'bg-emerald-500 text-white print:bg-emerald-100 print:text-emerald-800' : isSkipped ? 'bg-slate-600 text-slate-300 print:bg-slate-200 print:text-slate-800' : 'bg-red-500 text-white print:bg-red-100 print:text-red-800'}
                      `}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-3 print:text-black">{q.q}</p>
                        <div className="space-y-2">
                          {/* Show user answer if wrong or correct */}
                          {!isSkipped && (
                            <div className={`flex items-center gap-2 text-sm ${isCorrect ? 'text-emerald-400 print:text-emerald-700' : 'text-red-400 print:text-red-700'}`}>
                              {isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                              <span className="font-mono opacity-70 print:text-slate-600">Your Answer:</span>
                              <span className="font-bold">{userAnswer}</span>
                            </div>
                          )}
                          {/* Show correct answer if skipped or wrong */}
                          {(!isCorrect || isSkipped) && (
                            <div className="flex items-center gap-2 text-sm text-emerald-500/80 print:text-emerald-700">
                              <CheckCircle size={16}/> 
                              <span className="font-mono opacity-70 print:text-slate-600">Correct Answer:</span>
                              <span className="font-bold">{q.a}</span>
                            </div>
                          )}
                          {isSkipped && (
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 print:bg-slate-200 print:text-slate-800">Not Attempted</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <div className="flex justify-center gap-4 pt-4 pb-8 print:hidden">
              <button 
                onClick={() => window.print()}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
              >
                Print Report
              </button>
              <button 
                onClick={resetApp}
                className="px-8 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2"
              >
                Exit Exam
              </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-purple-500/30 selection:text-white print:bg-white">
      <Background />
      <div className="relative z-10">
        {view === 'subjects' && renderSubjectSelection()}
        {view === 'modes' && renderModeSelection()}
        {view === 'details' && renderUserDetails()}
        {view === 'quiz' && renderQuiz()}
        {view === 'result' && renderResult()}
      </div>
    </div>
  );
}
