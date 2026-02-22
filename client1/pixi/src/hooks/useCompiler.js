import { useState, useRef, useCallback } from 'react';
import apiClient from '../services/geminiClient';
import { stripAnsi } from '../utils/stripAnsi';

export default function useCompiler() {
  const [isRunning, setIsRunning] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantOutput, setAssistantOutput] = useState('');
  const [lines, setLines] = useState([{ type: 'system', content: 'Ready.' }]);

  const chatRef = useRef([]);
  const abortRef = useRef(null);

  const appendLine = (l) => setLines((prev) => [...prev, l]);
  const clearTerminal = () => setLines([{ type: 'system', content: 'Terminal cleared.' }]);

  const runCode = useCallback(async (code) => {
    setIsRunning(true);
    setIsWaiting(false);
    setAssistantOutput('');
    setLines([{ type: 'system', content: 'Compiling & Running...' }]);

    try {
      // Cancel any previous request
      if (abortRef.current && typeof abortRef.current.abort === 'function') {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      const messages = [
        {
          role: 'user',
          parts: [
            {
              text: `Execute this code:\n\n\`\`\`\n${code}\n\`\`\``
            }
          ]
        }
      ];

      const resp = await apiClient.post('/api/gemini', {
        messages,
        mode: 'compiler',
        signal: abortRef.current.signal
      });

      const raw = resp?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const sanitized = stripAnsi(raw);

      if (sanitized.includes('<|WAIT_FOR_INPUT|>')) {
        const [pre] = sanitized.split('<|WAIT_FOR_INPUT|>');
        if (pre) appendLine({ type: 'output', content: pre });
        setIsWaiting(true);
        // Save conversation context so sendInput can continue
        chatRef.current = [...messages, { role: 'model', parts: [{ text: sanitized }] }];
      } else {
        const isError = /error:|Exception|Traceback|Error:/i.test(sanitized);
        appendLine({ type: isError ? 'error' : 'output', content: sanitized });
        chatRef.current = [...messages, { role: 'model', parts: [{ text: sanitized }] }];
      }
    } catch (err) {
      // If abort, you may optionally ignore or append a line — keep user informed
      if (err.name === 'AbortError') {
        appendLine({ type: 'system', content: 'Execution aborted.' });
      } else {
        appendLine({ type: 'error', content: `Execution Error: ${err.message}` });
      }
    } finally {
      setIsRunning(false);
    }
  }, []);

  const sendInput = useCallback(async (input) => {
    if (!chatRef.current || chatRef.current.length === 0) return;

    setIsWaiting(false);
    setIsRunning(true);
    appendLine({ type: 'input', content: input });

    try {
      const messages = [...chatRef.current, { role: 'user', parts: [{ text: input }] }];

      const resp = await apiClient.post('/api/gemini', {
        messages,
        mode: 'compiler'
      });

      const raw = resp?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const sanitized = stripAnsi(raw);

      if (sanitized.includes('<|WAIT_FOR_INPUT|>')) {
        const [pre] = sanitized.split('<|WAIT_FOR_INPUT|>');
        if (pre) appendLine({ type: 'output', content: pre });
        setIsWaiting(true);
        chatRef.current = [...messages, { role: 'model', parts: [{ text: sanitized }] }];
      } else {
        const isError = /error:|Exception|Traceback|Error:/i.test(sanitized);
        appendLine({ type: isError ? 'error' : 'output', content: sanitized });
        chatRef.current = messages;
      }
    } catch (err) {
      appendLine({ type: 'error', content: `Execution Error: ${err.message}` });
    } finally {
      setIsRunning(false);
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current && typeof abortRef.current.abort === 'function') {
      abortRef.current.abort();
    }
    setIsRunning(false);
    setIsWaiting(false);
    appendLine({ type: 'system', content: 'Cancelled.' });
  }, []);

  return {
    state: {
      isRunning,
      isWaiting,
      lines,
      assistantLoading,
      assistantOutput
    },
    runCode,
    sendInput,
    clearTerminal,
    cancel,
    // exposed helpers in case the caller needs them
    appendLine,
    setAssistantOutput,
    setAssistantLoading
  };
}
