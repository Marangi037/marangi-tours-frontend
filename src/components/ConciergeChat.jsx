import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axiosInstance from '../services/axiosInstance';

const SUGGESTED_QUESTIONS = [
  '🌍 What should I pack for a safari in Kenya?',
  '📋 Do I need a visa for Tanzania?',
  '💎 What\'s included in the Premium package?',
  '🏖️ Best time to visit Thailand?',
  '❌ What\'s the cancellation policy?',
];

const FALLBACK_CONTACT_MSG = "I don't have specific information on that for our destinations — you can reach out via the contact page for details.";

export const ConciergeChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (questionText) => {
    const question = questionText || input.trim();
    if (!question || isLoading) return;

    setHasInteracted(true);
    setInput('');

    // Add user message
    const userMsg = { role: 'user', content: question, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await axiosInstance.post('/concierge/ask', { question });
      const { answer, sources, isFallback } = res.data;

      const assistantMsg = {
        role: 'assistant',
        content: answer,
        sources: sources || [],
        isFallback: isFallback || false,
        id: Date.now() + 1,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg = {
        role: 'assistant',
        content: error.response?.status === 429
          ? "You've sent too many questions in a short time. Please wait a moment and try again."
          : "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sources: [],
        isFallback: true,
        isError: true,
        id: Date.now() + 1,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (question) => {
    // Strip emoji prefix for a cleaner query
    const cleanQuestion = question.replace(/^[^\w]*/, '').trim();
    sendMessage(cleanQuestion);
  };

  const formatSourceName = (sourceFile) => {
    return sourceFile
      .replace(/^(destinations|visa|packing|packages)\//, '')
      .replace(/\.md$/, '')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        id="concierge-fab"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-colors"
        style={{
          background: isOpen
            ? 'rgba(15, 23, 42, 0.95)'
            : 'linear-gradient(135deg, #14b8a6, #0d9488)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(20,184,166,0.35)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close concierge chat' : 'Open concierge chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01" />
              <path d="M12 10h.01" />
              <path d="M16 10h.01" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Pulse ring (only when closed and no interaction yet) */}
        {!isOpen && !hasInteracted && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
          />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="concierge-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            style={{
              width: 'min(380px, calc(100vw - 3rem))',
              maxHeight: 'min(60vh, 520px)',
              background: 'rgba(8, 16, 31, 0.97)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4"
              style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(13,148,136,0.04))' }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">Travel Concierge</h3>
                <p className="text-[11px] text-teal-400/80">Powered by Marangi Tours</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: '200px' }}>
              {/* Welcome message */}
              {messages.length === 0 && !isLoading && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/5 p-4"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <p className="text-sm text-slate-300 leading-relaxed">
                      👋 Hi there! I'm your Marangi Tours travel concierge. Ask me about destinations, visa requirements, packing tips, or our packages.
                    </p>
                  </div>

                  {/* Suggested questions */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 px-1">Try asking</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSuggestionClick(q)}
                          className="rounded-lg border border-white/8 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-teal-500/30 hover:bg-teal-500/5 hover:text-teal-400 text-left"
                          style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-md text-white'
                        : msg.isFallback
                          ? 'rounded-bl-md border'
                          : 'rounded-bl-md border border-white/5'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }
                        : msg.isFallback
                          ? {
                              background: 'rgba(245, 158, 11, 0.06)',
                              borderColor: 'rgba(245, 158, 11, 0.15)',
                            }
                          : { background: 'rgba(255,255,255,0.04)' }
                    }
                  >
                    {/* Fallback icon */}
                    {msg.isFallback && !msg.isError && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80">Limited info</span>
                      </div>
                    )}

                    <p className={`whitespace-pre-wrap ${
                      msg.role === 'user' ? 'text-white' : msg.isFallback ? 'text-amber-200/90' : 'text-slate-200'
                    }`}>
                      {msg.content}
                    </p>

                    {/* Source tags */}
                    {msg.sources && msg.sources.length > 0 && !msg.isFallback && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-white/5 pt-2.5">
                        {msg.sources.map((source, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium text-teal-400"
                            style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)' }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            {formatSourceName(source)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md px-4 py-3 border border-white/5"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/8 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 transition-colors focus-within:border-teal-500/40"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <input
                  ref={inputRef}
                  id="concierge-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about destinations, visas, packages..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-slate-500 outline-none disabled:opacity-50"
                  maxLength={500}
                  autoComplete="off"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all disabled:opacity-30"
                  style={{
                    background: input.trim() && !isLoading
                      ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                      : 'transparent',
                  }}
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-slate-600">
                Answers are based on Marangi Tours information only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
