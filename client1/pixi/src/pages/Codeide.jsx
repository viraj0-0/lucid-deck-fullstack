import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import {
  Play,
  Terminal as TerminalIcon,
  Trash2,
  Cpu,
  Loader2,
  Sparkles,
  Bug,
  FileText,
  Activity,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  Code2,
  Zap,
  Download,
  User,
  Hash,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  History,
  Clock,
  X,
  RotateCcw,
  Globe,
  Layout, // Added icons for Web Mode
} from "lucide-react";
import { useNavigate } from "react-router-dom";
/* --- SYNTAX HIGHLIGHTING LOGIC --- */
const syntaxPatterns = {
  python: [
    { type: "comment", regex: /#.*/g },
    {
      type: "string",
      regex: /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g,
    },
    {
      type: "keyword",
      regex:
        /\b(def|class|if|elif|else|while|for|try|except|import|from|return|print|in|and|or|not|as|pass|break|continue|None|True|False|with|lambda|global|nonlocal|raise|yield|async|await)\b/g,
    },
    { type: "function", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g },
    { type: "number", regex: /\b\d+(\.\d+)?\b/g },
    { type: "boolean", regex: /\b(True|False)\b/g },
  ],
  javascript: [
    { type: "comment", regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g },
    { type: "string", regex: /(`[\s\S]*?`|"[^"]*"|'[^']*')/g },
    {
      type: "keyword",
      regex:
        /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|import|export|default|try|catch|finally|class|extends|new|this|super|async|await|typeof|void|null|undefined|true|false)\b/g,
    },
    { type: "function", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g },
    { type: "number", regex: /\b\d+(\.\d+)?\b/g },
  ],
  html: [
    { type: "comment", regex: /<!--[\s\S]*?-->/g },
    { type: "string", regex: /"[^"]*"|'[^']*'/g },
    { type: "tag", regex: /<\/?[a-z][a-z0-9-]*\b[^>]*>/gi }, // HTML Tags
    {
      type: "keyword",
      regex:
        /\b(DOCTYPE|html|head|body|div|span|h1|h2|h3|p|a|ul|ol|li|script|style|link|meta)\b/gi,
    },
  ],
  cpp: [
    { type: "comment", regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g },
    { type: "string", regex: /"[^"]*"/g },
    {
      type: "keyword",
      regex:
        /\b(int|float|double|char|void|bool|if|else|for|while|do|switch|case|break|continue|return|class|struct|public|private|protected|static|const|virtual|override|namespace|using|include|true|false|nullptr|new|delete|cout|cin|endl|std)\b/g,
    },
    { type: "function", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g },
    { type: "number", regex: /\b\d+(\.\d+)?\b/g },
  ],
  c: [
    { type: "comment", regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g },
    { type: "string", regex: /"[^"]*"/g },
    {
      type: "keyword",
      regex:
        /\b(int|float|double|char|void|if|else|for|while|do|switch|case|break|continue|return|struct|static|const|sizeof|include|printf|scanf)\b/g,
    },
    { type: "function", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g },
    { type: "number", regex: /\b\d+(\.\d+)?\b/g },
  ],
  java: [
    { type: "comment", regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g },
    { type: "string", regex: /"[^"]*"/g },
    {
      type: "keyword",
      regex:
        /\b(public|private|protected|class|interface|enum|extends|implements|static|final|void|int|double|boolean|char|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|throws|new|this|super|import|package|true|false|null)\b/g,
    },
    { type: "function", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g },
    { type: "number", regex: /\b\d+(\.\d+)?\b/g },
  ],
};

const highlightSyntax = (code, language, isDark) => {
  if (!code) return [];
  const patterns = syntaxPatterns[language] || syntaxPatterns.python;

  let tokens = [];
  let remaining = code;

  while (remaining.length > 0) {
    let bestMatch = null;
    let bestType = null;
    let minIndex = remaining.length;

    for (const { type, regex } of patterns) {
      regex.lastIndex = 0; // Reset regex
      const match = regex.exec(remaining);
      if (match && match.index < minIndex) {
        minIndex = match.index;
        bestMatch = match[0];
        bestType = type;
      }
    }

    if (bestMatch && minIndex === 0) {
      tokens.push({ type: bestType, content: bestMatch });
      remaining = remaining.slice(bestMatch.length);
    } else if (bestMatch) {
      tokens.push({ type: "text", content: remaining.slice(0, minIndex) });
      tokens.push({ type: bestType, content: bestMatch });
      remaining = remaining.slice(minIndex + bestMatch.length);
    } else {
      tokens.push({ type: "text", content: remaining });
      remaining = "";
    }
  }
  return tokens;
};

/* --- GEMINI AI CONFIGURATION --- */
const COMPILER_SYSTEM_PROMPT = `
You are a STRICT Code Execution Simulator & Compiler.
Your goal is to simulate a standard compiler/interpreter (like gcc, python, node, javac) with high fidelity.

CRITICAL RULES:
1. VALIDATION FIRST: Before running, analyze the code for syntax errors, missing semicolons (in C++/Java), indentation errors (Python), or undefined variables.
2. STRICT ERRORS: If ANY error exists, output ONLY the standard error message for that language.
   - Example (Python): "IndentationError: expected an indented block"
   - Example (C++): "error: expected ';' before 'return'"
   - Example (JS): "ReferenceError: x is not defined"
   - DO NOT fix the code. DO NOT explain how to fix it. DO NOT run it if it has syntax errors.
3. NO CONVERSATION: Do not say "Here is the output" or "I found an error". Just output the raw result or raw error.
4. INPUT HANDLING: If the code uses input functions (input(), scanf, cin):
   - Output the prompt text (if any).
   - Output token: <|WAIT_FOR_INPUT|>
   - STOP immediately.
5. CONTINUATION: If you receive user input in the next turn, treat it as stdin and continue execution.
`;

const ASSISTANT_SYSTEM_PROMPT = `
You are an intelligent Coding Assistant integrated into an IDE.
Your goal is to help the user understand, debug, and optimize their code.
- Be concise and helpful.
- Use Markdown for formatting (bold, code blocks).
- When asked to fix code, explain the bug briefly, then provide the corrected code block.
- When asked to document code, provide the code with added comments/docstrings.
- When asked for a quiz, generate a relevant multiple choice question.
`;

const EXAMPLE_PROGRAMS = {
  python_hello: {
    label: "Python: Hello World",
    lang: "python",
    code: `print("Hello World")\nname = input("What is your name? ")\nprint(f"Nice to meet you, {name}!")`,
  },
  html_website: {
    label: "HTML: Simple Website",
    lang: "html",
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #f0f4f8; text-align: center; padding: 50px; }
    .card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block; }
    h1 { color: #4f46e5; margin-bottom: 0.5rem; }
    p { color: #64748b; }
    button { 
      padding: 10px 20px; background: #4f46e5; color: white; 
      border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; margin-top: 1rem;
      transition: background 0.2s;
    }
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello from Code IDE!</h1>
    <p>Edit the HTML and CSS to see changes instantly.</p>
    <button onclick="changeText()">Click Me</button>
  </div>

  <script>
    function changeText() {
      const h1 = document.querySelector('h1');
      h1.innerText = "You clicked the button!";
      h1.style.color = "#ec4899";
    }
  </script>
</body>
</html>`,
  },
  c_hello: {
    label: "C: Hello World",
    lang: "c",
    code: `#include <stdio.h>\n\nint main() {\n  char name[50];\n  printf("Hello World\\n");\n  printf("Enter your name: ");\n  scanf("%s", name);\n  printf("Nice to meet you, %s!\\n", name);\n  return 0;\n}`,
  },
  python_calc: {
    label: "Python: Calculator",
    lang: "python",
    code: `def add(x, y):\n    return x + y\n\nprint("Simple Calculator")\ntry:\n    num1 = float(input("Enter first number: "))\n    num2 = float(input("Enter second number: "))\n    print(f"Result: {num1} + {num2} = {add(num1, num2)}")\nexcept ValueError:\n    print("Error: Invalid number input")`,
  },
  cpp_loop: {
    label: "C++: For Loop",
    lang: "cpp",
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cout << "Enter the number of times to print: ";\n    cin >> n;\n    \n    for(int i = 0; i < n; i++) {\n        cout << "Iteration " << i+1 << endl;\n    }\n    return 0;\n}`,
  },
  js_array: {
    label: "JavaScript: Array Filter",
    lang: "javascript",
    code: `const numbers = [1, 2, 3, 4, 5, 6];\nconsole.log("Original:", numbers);\n\n// Filter even numbers\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log("Evens:", evens);\n\n// Intentional Error Example (uncomment to test strictness):\n// console.log(undefinedVariable);`,
  },
  java_class: {
    label: "Java: Simple Class",
    lang: "java",
    code: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print("Enter your favorite color: ");\n        String color = scanner.nextLine();\n        System.out.println("Your favorite color is " + color);\n    }\n}`,
  },
};

const Codeide = () => {
  // --- STATE ---
  const [selectedExample, setSelectedExample] = useState("python_hello");
  const [code, setCode] = useState(EXAMPLE_PROGRAMS["python_hello"].code);
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const navigate = useNavigate();
  // New Features State
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'
  const [fontSize, setFontSize] = useState(14);
  const [history, setHistory] = useState([]); // [{id, timestamp, code, output, status}]
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const runningCodeRef = useRef(""); // To store code at moment of execution

  // Terminal State
  const [terminalLines, setTerminalLines] = useState([
    { type: "system", content: "Strict Compiler Mode Ready..." },
  ]);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [userInput, setUserInput] = useState("");

  // AI Assistant & Preview State
  const [activeTab, setActiveTab] = useState("terminal"); // 'terminal' | 'assistant' | 'preview'
  const [assistantOutput, setAssistantOutput] = useState(
    "Select an AI tool above to analyze your code.",
  );
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [debouncedCode, setDebouncedCode] = useState(code); // For HTML Preview

  // General State
  const [isRunning, setIsRunning] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Refs
  const terminalEndRef = useRef(null);
  const textAreaRef = useRef(null);
  const highlightRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const isDark = theme === "dark";
  const currentLang = EXAMPLE_PROGRAMS[selectedExample].lang;
  const isWebMode = currentLang === "html";

  // --- THEME & STYLE HELPERS ---
  const styles = {
    bg: isDark ? "bg-[#050511]" : "bg-[#f0f4f8]",
    text: isDark ? "text-slate-200" : "text-slate-700",
    container: isDark
      ? "bg-black/40 border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
      : "bg-white/80 border-slate-300 shadow-xl",
    sidebar: isDark
      ? "bg-black/40 border-white/5"
      : "bg-white/50 border-slate-200",
    inputBg: isDark
      ? "bg-white/5 border-white/10 focus-within:border-indigo-500/50"
      : "bg-white border-slate-300 focus-within:border-indigo-500",
    terminalBg: isDark ? "bg-[#050510]" : "bg-[#1e1e2e]", // Terminal always dark-ish for contrast
    lineNums: isDark ? "text-slate-600" : "text-slate-400",
    caret: isDark ? "caret-white" : "caret-black",
    highlight: isDark
      ? "selection:bg-indigo-500/30"
      : "selection:bg-indigo-200",
    modal: isDark
      ? "bg-[#0c0c16]/90 border-white/10 text-slate-200"
      : "bg-white/95 border-slate-200 text-slate-800",
  };

  useEffect(() => {
    if (activeTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines, isWaitingForInput, activeTab]);

  // Debounce Code for Live Preview
  useEffect(() => {
    if (!isWebMode) return;
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 600); // Update preview 600ms after typing stops
    return () => clearTimeout(timer);
  }, [code, isWebMode]);

  // Auto-switch to Preview tab in Web Mode
  useEffect(() => {
    if (isWebMode) {
      setActiveTab("preview");
    } else if (activeTab === "preview") {
      setActiveTab("terminal");
    }
  }, [isWebMode]);

  const handleScroll = () => {
    if (textAreaRef.current) {
      const { scrollTop } = textAreaRef.current;
      if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollTop;
      if (highlightRef.current) highlightRef.current.scrollTop = scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textAreaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const insert = "  ";
      setCode(
        (prev) => prev.substring(0, start) + insert + prev.substring(end),
      );
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + insert.length;
      });
    }
  };

  // --- IDENTITY HANDLERS (UPDATED) ---
  const handleNameChange = (e) => {
    setStudentName(e.target.value);
    setCode(""); // Clear code when name changes
  };

  const handleRollNoChange = (e) => {
    setRollNo(e.target.value);
    setCode(""); // Clear code when roll number changes
  };

  const stripAnsi = (text = "") => {
    return String(text).replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");
  };

  // --- API HANDLER ---
  const callGemini = async (messages, history, mode = "compiler") => {
    setIsAssistantLoading(mode !== "compiler");
    setIsRunning(mode === "compiler");

    const systemPrompt =
      mode === "compiler" ? COMPILER_SYSTEM_PROMPT : ASSISTANT_SYSTEM_PROMPT;
    const temp = mode === "compiler" ? 0.0 : 0.7;

    try {
      // FIX: Use import.meta.env for Vite. Fallback to localhost for local dev if no .env is found.
      const backend = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const url = `${backend.replace(/\/$/, "")}/api/gemini`;

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          systemInstruction: systemPrompt,
          generationConfig: { temperature: temp, maxOutputTokens: 2048 },
          mode,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => resp.statusText);
        throw new Error(`API Proxy Error: ${resp.status} ${text}`);
      }

      const data = await resp.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const sanitized = stripAnsi(raw);

      if (mode === "compiler") {
        handleCompilerResponse(sanitized, history, messages);
      } else {
        setAssistantOutput(sanitized);
      }
    } catch (error) {
      const errorMsg = `Execution Error: ${error.message}`;
      if (mode === "compiler") {
        setTerminalLines((prev) => [
          ...prev,
          { type: "error", content: errorMsg },
        ]);
        // Add to history as error
        addToHistory(runningCodeRef.current, errorMsg, "Error");
      } else {
        setAssistantOutput(errorMsg);
      }
    } finally {
      setIsRunning(false);
      setIsAssistantLoading(false);
    }
  };

  const handleCompilerResponse = (rawText, oldHistory, sentMessages) => {
    const inputToken = "<|WAIT_FOR_INPUT|>";

    if (rawText.includes(inputToken)) {
      const [preInputText] = rawText.split(inputToken);
      if (preInputText)
        setTerminalLines((prev) => [
          ...prev,
          { type: "output", content: preInputText },
        ]);

      setChatHistory([
        ...sentMessages,
        { role: "model", parts: [{ text: rawText }] },
      ]);
      setIsWaitingForInput(true);
      setIsRunning(false);
    } else {
      const isError = /Error:|Exception|Traceback|error:|undefined/.test(
        rawText,
      );
      if (rawText) {
        setTerminalLines((prev) => [
          ...prev,
          { type: isError ? "error" : "output", content: rawText },
        ]);
      }
      setChatHistory([
        ...sentMessages,
        { role: "model", parts: [{ text: rawText }] },
      ]);
      setIsRunning(false);
      setIsWaitingForInput(false);

      // Save to History on completion
      addToHistory(
        runningCodeRef.current,
        rawText,
        isError ? "Error" : "Success",
      );
    }
  };

  const addToHistory = (codeSnap, outputSnap, status) => {
    setHistory((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        code: codeSnap,
        output:
          outputSnap.substring(0, 100) + (outputSnap.length > 100 ? "..." : ""),
        status,
      },
      ...prev,
    ]);
  };

  // --- ACTIONS ---
  const handleRun = () => {
    if (isWebMode) {
      // In Web Mode, "Run" just refreshes the preview immediately
      setDebouncedCode(code);
      return;
    }

    setActiveTab("terminal");
    setIsRunning(true);
    setTerminalLines([{ type: "system", content: "Compiling & Running..." }]);
    setChatHistory([]);
    setIsWaitingForInput(false);

    // Save code snapshot
    runningCodeRef.current = code;

    const initialMessage = [
      {
        role: "user",
        parts: [{ text: `Execute this code:\n\`\`\`\n${code}\n\`\`\`\n` }],
      },
    ];
    callGemini(initialMessage, [], "compiler");
  };

  const restoreFromHistory = (entry) => {
    setCode(entry.code);
    setShowHistoryModal(false);
    setTerminalLines([
      { type: "system", content: `Restored code from ${entry.timestamp}` },
    ]);
  };

  const handleAssistantAction = (actionType) => {
    setActiveTab("assistant");
    setIsAssistantLoading(true);
    setAssistantOutput("");

    let prompt = "";
    switch (actionType) {
      case "explain":
        prompt = `Explain the following code step-by-step in simple terms:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "fix":
        prompt = `Analyze the following code for logical and syntax errors. If found, explain them and provide the corrected code:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "docs":
        prompt = `Add comprehensive comments and docstrings to the following code. Return the full code block with comments:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "complexity":
        prompt = `Analyze the Time and Space complexity of this code. Explain why:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "review":
        prompt = `Perform a strict Code Review on this snippet. Focus on code style, best practices, variable naming, and readability. Suggest refactoring if necessary:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "tests":
        prompt = `Generate a set of Unit Tests for this code. Use the standard testing framework for the language (e.g., pytest for Python, Jest for JS, GTest for C++). Provide the test code in a code block:\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "quiz":
        prompt = `Create a single multiple-choice question (with 4 options) to test my understanding of this specific code snippet. Provide the question, the options, and then the hidden answer/explanation at the very bottom:\n\`\`\`\n${code}\n\`\`\``;
        break;
      default:
        prompt = `Analyze this code:\n\`\`\`\n${code}\n\`\`\``;
    }

    const message = [{ role: "user", parts: [{ text: prompt }] }];
    callGemini(message, [], "assistant");
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!userInput) return;

    setTerminalLines((prev) => [
      ...prev,
      { type: "input", content: userInput },
    ]);
    const newMessages = [
      ...chatHistory,
      { role: "user", parts: [{ text: userInput }] },
    ];

    setIsWaitingForInput(false);
    setIsRunning(true);
    setUserInput("");
    callGemini(newMessages, chatHistory, "compiler");
  };

  const handleClearTerminal = () => {
    setTerminalLines([{ type: "system", content: "Terminal cleared." }]);
    setIsWaitingForInput(false);
    setIsRunning(false);
  };

  const loadExample = (key) => {
    setSelectedExample(key);
    setCode(EXAMPLE_PROGRAMS[key].code);
    setTerminalLines([
      {
        type: "system",
        content: `Loaded example: ${EXAMPLE_PROGRAMS[key].label}`,
      },
    ]);
    setIsWaitingForInput(false);
    setIsRunning(false);
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Code IDE Export</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #333; position: relative; }
            h1 { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .meta { color: #666; margin-bottom: 30px; font-size: 0.9em; background: #f4f4f4; padding: 15px; border-radius: 8px; }
            .section { margin-bottom: 40px; }
            .section-title { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; background: #eee; padding: 5px 10px; border-left: 4px solid #333; }
            pre { background: #f8f8f8; border: 1px solid #ddd; padding: 15px; border-radius: 4px; white-space: pre-wrap; overflow-x: auto; }
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 10em;
                color: rgba(0, 0, 0, 0.05);
                z-index: 2;
                white-space: nowrap;
                pointer-events: none;
                font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="watermark">CODE IDE</div>
          <h1>Code IDE Export</h1>
          <div class="meta">
            <strong>Student Name:</strong> ${studentName || "Not Provided"}<br/>
            <strong>Roll Number:</strong> ${rollNo || "Not Provided"}<br/>
            <strong>Language:</strong> ${EXAMPLE_PROGRAMS[selectedExample].lang.toUpperCase()}<br/>
            <strong>Date:</strong> ${new Date().toLocaleString()}
          </div>

          <div class="section">
            <div class="section-title">Source Code</div>
            <pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          </div>

          <div class="section">
            <div class="section-title">Terminal Output</div>
            <pre>${terminalLines
              .map((line) => {
                if (line.type === "input") return `> ${line.content}`;
                if (line.type === "system") return `[SYSTEM] ${line.content}`;
                if (line.type === "error") return `[ERROR] ${line.content}`;
                return line.content;
              })
              .join("\n")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</pre>
          </div>
          
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // --- RENDER HELPERS ---
  const renderHighlightedCode = useMemo(() => {
    const lang = EXAMPLE_PROGRAMS[selectedExample].lang;
    const tokens = highlightSyntax(code, lang);

    return tokens.map((token, index) => {
      let colorClass = isDark ? "text-slate-200" : "text-slate-700";
      if (isDark) {
        switch (token.type) {
          case "keyword":
            colorClass = "text-pink-400 font-bold";
            break;
          case "string":
            colorClass = "text-emerald-300";
            break;
          case "comment":
            colorClass = "text-slate-500 italic";
            break;
          case "function":
            colorClass = "text-blue-300";
            break;
          case "number":
            colorClass = "text-orange-300";
            break;
          case "boolean":
            colorClass = "text-purple-400";
            break;
          case "tag":
            colorClass = "text-blue-400 font-semibold";
            break; // New for HTML
        }
      } else {
        // Light Mode Syntax Colors
        switch (token.type) {
          case "keyword":
            colorClass = "text-purple-700 font-bold";
            break;
          case "string":
            colorClass = "text-green-700";
            break;
          case "comment":
            colorClass = "text-slate-400 italic";
            break;
          case "function":
            colorClass = "text-blue-600";
            break;
          case "number":
            colorClass = "text-orange-600";
            break;
          case "boolean":
            colorClass = "text-red-600";
            break;
          case "tag":
            colorClass = "text-blue-700 font-semibold";
            break; // New for HTML
        }
      }
      return (
        <span key={index} className={colorClass}>
          {token.content}
        </span>
      );
    });
  }, [code, selectedExample, isDark]);

  return (
    <div
      className={`flex items-center justify-center h-screen w-full ${styles.bg} overflow-hidden p-2 md:p-6 font-sans transition-colors duration-500`}
    >
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        {isDark && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        )}
      </div>

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className={`w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${styles.modal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <History size={20} /> Execution History
              </h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 hover:bg-black/10 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="text-center opacity-50 py-10">
                  No execution history yet.
                </div>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-lg border flex flex-col gap-2 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {entry.timestamp}
                      </span>
                      <span
                        className={
                          entry.status === "Error"
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        {entry.status}
                      </span>
                    </div>
                    <div className="font-mono text-xs opacity-80 truncate">
                      {entry.output}
                    </div>
                    <button
                      onClick={() => restoreFromHistory(entry)}
                      className="self-end text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <RotateCcw size={12} /> Restore Code
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER FRAME */}
      <div
        className={`relative z-10 flex w-full max-w-[1600px] h-full max-h-[1000px] backdrop-blur-2xl rounded-[30px] border overflow-hidden ring-1 ring-white/5 transition-colors duration-500 ${styles.container}`}
      >
        {/* SIDEBAR NAVIGATION */}
        <div
          className={`w-20 border-r flex flex-col items-center py-8 gap-6 ${styles.sidebar}`}
        >
          <div
            onClick={() => navigate("/")}
            className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-110 transition-transform duration-300 cursor-pointer group"
          >
            <Cpu
              size={24}
              className="text-white group-hover:rotate-90 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 flex flex-col gap-6 w-full items-center">
            {/* Run Button - Prominent */}
            <button
              onClick={handleRun}
              disabled={isRunning || isWaitingForInput}
              className={`relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                isRunning
                  ? "bg-slate-800 cursor-wait"
                  : isWebMode
                    ? "bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 shadow-lg shadow-blue-500/20" // Blue play button for Web Mode
                    : "bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-95"
              }`}
            >
              {isRunning ? (
                <Loader2 size={20} className="text-white/50 animate-spin" />
              ) : (
                <Play size={20} className="text-white fill-current ml-1" />
              )}

              {/* Tooltip */}
              <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-50">
                {isWebMode ? "Refresh Preview" : "Run Code"}
              </div>
            </button>

            <div
              className={`h-px w-8 ${isDark ? "bg-white/10" : "bg-slate-300"}`}
            ></div>

            {/* Theme Switcher */}
            <button
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-200 text-slate-600 hover:text-slate-900"}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* History Button */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-200 text-slate-600 hover:text-slate-900"}`}
              title="Execution History"
            >
              <History size={20} />
            </button>

            {/* Example Loader Trigger */}
            <div className="relative group">
              <button
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-200 text-slate-600 hover:text-slate-900"}`}
              >
                <Code2 size={20} />
              </button>
              {/* Floating Menu */}
              <div
                className={`absolute top-0 left-12 w-64 border rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto transform origin-left scale-95 group-hover:scale-100 shadow-2xl z-50 ${isDark ? "bg-[#0a0a16] border-white/10" : "bg-white border-slate-200"}`}
              >
                <div className="text-xs font-bold text-slate-500 uppercase px-3 py-2">
                  Load Example
                </div>
                {Object.entries(EXAMPLE_PROGRAMS).map(([key, ex]) => (
                  <div
                    key={key}
                    onClick={() => loadExample(key)}
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${selectedExample === key ? "bg-indigo-500/20 text-indigo-500" : isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    {ex.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono opacity-20 rotate-180 writing-vertical-lr tracking-widest text-current">
            CODE POWERED
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* EDITOR SECTION */}
          <div className="flex-1 flex flex-col min-w-0 bg-transparent relative group/editor">
            {/* STUDENT INFO BAR */}
            <div
              className={`flex items-center gap-4 p-3 border-b backdrop-blur-md z-40 transition-colors ${isDark ? "bg-black/40 border-white/10" : "bg-white/50 border-slate-200"}`}
            >
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-colors ${styles.inputBg}`}
              >
                <User size={14} className="text-indigo-400" />
                <input
                  type="text"
                  value={studentName}
                  onChange={handleNameChange}
                  className={`bg-transparent border-none text-xs focus:outline-none w-32 placeholder:text-slate-500 ${styles.text}`}
                  placeholder="Student Name"
                />
              </div>
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-colors ${styles.inputBg}`}
              >
                <Hash size={14} className="text-emerald-400" />
                <input
                  type="text"
                  value={rollNo}
                  onChange={handleRollNoChange}
                  className={`bg-transparent border-none text-xs focus:outline-none w-24 placeholder:text-slate-500 ${styles.text}`}
                  placeholder="Roll No."
                />
              </div>
              <div className="flex-1"></div>
              {/* Web Mode Indicator */}
              {isWebMode && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/30 mr-2 animate-pulse">
                  <Globe size={14} /> Live Preview
                </div>
              )}
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-500 rounded-lg text-xs font-bold transition-all border border-indigo-500/30"
              >
                <Download size={14} /> PDF
              </button>
            </div>

            {/* FLOATING TOOLBAR */}
            <div
              className={`absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1.5 backdrop-blur-xl border rounded-full shadow-2xl scale-90 md:scale-100 opacity-50 hover:opacity-100 transition-all ${isDark ? "bg-black/60 border-white/10" : "bg-white/80 border-slate-200"}`}
            >
              {[
                {
                  id: "explain",
                  icon: Sparkles,
                  color: "text-amber-400",
                  label: "Explain",
                },
                {
                  id: "fix",
                  icon: Bug,
                  color: "text-rose-400",
                  label: "Debug",
                },
                {
                  id: "docs",
                  icon: FileText,
                  color: "text-blue-400",
                  label: "Docs",
                },
                {
                  id: "complexity",
                  icon: Activity,
                  color: "text-emerald-400",
                  label: "Analysis",
                },
                {
                  id: "review",
                  icon: ShieldCheck,
                  color: "text-purple-400",
                  label: "Review",
                },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleAssistantAction(tool.id)}
                  className={`p-2.5 rounded-full transition-all active:scale-90 group relative ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                >
                  <tool.icon size={18} className={tool.color} />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black/80 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tool.label}
                  </span>
                </button>
              ))}
              <div
                className={`w-px h-4 mx-1 ${isDark ? "bg-white/20" : "bg-slate-300"}`}
              ></div>
              <button
                onClick={() => handleAssistantAction("quiz")}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-transform active:scale-95"
              >
                <GraduationCap size={14} /> Quiz Me
              </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex relative mt-0 bg-transparent overflow-hidden">
              {/* Line Numbers */}
              <div
                ref={lineNumbersRef}
                className={`w-16 pt-16 pb-6 pr-4 pl-0 text-right font-mono text-sm select-none bg-transparent overflow-hidden ${styles.lineNums}`}
                style={{ lineHeight: "1.6", fontSize: `${fontSize}px` }}
              >
                {code.split("\n").map((_, i) => (
                  <div key={i} className="opacity-50">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Editor Container */}
              <div className="flex-1 relative h-full">
                {/* 1. Syntax Highlighter (Background) */}
                <pre
                  ref={highlightRef}
                  className="absolute inset-0 pt-16 pb-6 px-4 m-0 font-mono bg-transparent whitespace-pre overflow-hidden pointer-events-none z-0"
                  style={{ lineHeight: "1.6", fontSize: `${fontSize}px` }}
                  aria-hidden="true"
                >
                  {renderHighlightedCode}
                  <br />
                </pre>

                {/* 2. Textarea (Foreground - Transparent Text) */}
                <textarea
                  ref={textAreaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={handleScroll}
                  onKeyDown={handleKeyDown}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`absolute inset-0 w-full h-full bg-transparent font-mono pt-16 pb-6 px-4 resize-none focus:outline-none leading-relaxed whitespace-pre z-10 text-transparent ${styles.caret} ${styles.highlight}`}
                  spellCheck="false"
                  style={{
                    lineHeight: "1.6",
                    color: "transparent",
                    fontSize: `${fontSize}px`,
                  }}
                />
              </div>
            </div>

            {/* Footer Status with Font Controls */}
            <div
              className={`h-8 border-t flex items-center px-6 text-xs font-mono transition-colors ${isDark ? "bg-black/20 border-white/5 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-600"}`}
            >
              <span className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isRunning ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}
                ></div>{" "}
                {isRunning ? "Compiling..." : "Ready"}
              </span>
              <span className="mx-4 opacity-20">|</span>
              <span>
                {EXAMPLE_PROGRAMS[selectedExample].lang.toUpperCase()}
              </span>

              {/* Font Size Controls */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setFontSize((p) => Math.max(10, p - 1))}
                  className={`p-0.5 rounded hover:bg-current/10 transition-colors`}
                >
                  <ZoomOut size={12} />
                </button>
                <span>{fontSize}px</span>
                <button
                  onClick={() => setFontSize((p) => Math.min(24, p + 1))}
                  className={`p-0.5 rounded hover:bg-current/10 transition-colors`}
                >
                  <ZoomIn size={12} />
                </button>
              </div>

              <div className="flex-1"></div>
              <span>
                Ln{" "}
                {
                  code
                    .substring(0, textAreaRef.current?.selectionStart)
                    .split("\n").length
                }
                , Col{" "}
                {textAreaRef.current?.selectionStart -
                  code.lastIndexOf(
                    "\n",
                    textAreaRef.current?.selectionStart - 1,
                  )}
              </span>
            </div>
          </div>

          {/* RIGHT PANEL (TERMINAL / ASSISTANT / PREVIEW) */}
          <div
            className={`w-full md:w-[450px] border-l flex flex-col backdrop-blur-md transition-colors ${isDark ? "bg-[#0c0c16]/50 border-white/5" : "bg-white/40 border-slate-200"}`}
          >
            {/* Tabs */}
            <div className="flex p-4 gap-3">
              {!isWebMode && (
                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                    activeTab === "terminal"
                      ? isDark
                        ? "bg-slate-800 text-emerald-400 shadow-lg shadow-black/20 ring-1 ring-white/5"
                        : "bg-white text-emerald-600 shadow-md ring-1 ring-slate-200"
                      : "bg-transparent text-slate-500 hover:bg-current/5"
                  }`}
                >
                  <TerminalIcon size={14} /> Console
                </button>
              )}

              {isWebMode && (
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                    activeTab === "preview"
                      ? isDark
                        ? "bg-blue-900/40 text-blue-400 shadow-lg shadow-black/20 ring-1 ring-white/5"
                        : "bg-white text-blue-600 shadow-md ring-1 ring-slate-200"
                      : "bg-transparent text-slate-500 hover:bg-current/5"
                  }`}
                >
                  <Layout size={14} /> Preview
                </button>
              )}

              <button
                onClick={() => setActiveTab("assistant")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "assistant"
                    ? isDark
                      ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-indigo-300 shadow-lg ring-1 ring-indigo-500/30"
                      : "bg-white text-indigo-600 shadow-md ring-1 ring-indigo-200"
                    : "bg-transparent text-slate-500 hover:bg-current/5"
                }`}
              >
                <Zap size={14} /> AI Assistant
              </button>
            </div>

            {/* Content Container */}
            <div
              className={`flex-1 overflow-hidden relative mx-4 mb-4 rounded-2xl border shadow-inner ${isDark ? "bg-[#050510] border-white/10" : "bg-[#1e1e2e] border-slate-300"}`}
            >
              {/* TERMINAL VIEW */}
              {activeTab === "terminal" && !isWebMode && (
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex justify-end p-2 absolute top-0 right-0 z-10">
                    <button
                      onClick={handleClearTerminal}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 hover:bg-white/10 rounded-lg"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div
                    className="flex-1 p-5 font-mono text-sm overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                    onClick={() =>
                      document.getElementById("terminal-input")?.focus()
                    }
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {terminalLines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`${
                          line.type === "error"
                            ? "text-rose-400 bg-rose-900/10 border-l-2 border-rose-500 pl-2"
                            : line.type === "system"
                              ? "text-slate-500 italic"
                              : line.type === "input"
                                ? "text-cyan-300"
                                : "text-slate-300"
                        } break-words`}
                      >
                        {line.type === "input" && (
                          <span className="text-cyan-500 mr-2">❯</span>
                        )}
                        {line.content}
                      </div>
                    ))}

                    {isWaitingForInput && (
                      <form
                        onSubmit={handleInputSubmit}
                        className="flex items-center mt-2 group"
                      >
                        <span className="text-emerald-500 mr-2 animate-pulse">
                          ❯
                        </span>
                        <input
                          id="terminal-input"
                          autoFocus
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          className="flex-1 bg-transparent border-none text-white focus:outline-none font-medium caret-emerald-500"
                          autoComplete="off"
                        />
                      </form>
                    )}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              )}
              {/* PREVIEW VIEW */}
              {activeTab === "preview" && isWebMode && (
                <div className="absolute inset-0 bg-white">
                  <iframe
                    title="Live Preview"
                    srcDoc={debouncedCode}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-modals"
                  />
                </div>
              )}
              {/* ASSISTANT VIEW */}

                    {activeTab === 'assistant' && (
                         <div className={`absolute inset-0 flex flex-col p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900/50 ${isDark ? 'bg-[#050510]' : 'bg-[#f8fafc]'}`}>
                            {isAssistantLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
                                    <Loader2 className="animate-spin text-indigo-400" size={32} />
                                    <p className="text-xs text-indigo-400 tracking-widest uppercase animate-pulse">Consulting Ai...</p>
                                </div>
                            ) : assistantOutput ? (
                                <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert text-slate-300' : 'text-slate-700'}`}>
                                    
                                    {/* --- REPLACE THIS PART --- */}
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]} 
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            code({node, inline, className, children, ...props}) {
                                                return !inline ? (
                                                    <pre className={`p-4 rounded-lg overflow-x-auto ${isDark ? 'bg-[#1e1e2e]' : 'bg-slate-100'} mt-2 mb-4 border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                ) : (
                                                    <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-[#1e1e2e] text-indigo-300' : 'bg-slate-200 text-indigo-700'}`} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {assistantOutput}
                                    </ReactMarkdown>
                                    {/* --- END REPLACEMENT --- */}

                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                                    <MessageSquare size={40} className="opacity-20" />
                                    <p className="text-sm">Select a tool to analyze your code.</p>
                                </div>
                            )}
                        </div>
                    )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//hello
export default Codeide;
