import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, X, MessageSquare, Trash2, ChevronDown, Minimize2 } from 'lucide-react';

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your NameLens AI Assistant. Ask me anything about name gender predictions, meanings, etymology, or comparisons!'
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e, customQuery) => {
    if (e) e.preventDefault();
    const clean = (customQuery || query).trim();
    if (!clean) return;

    const userMsg = { sender: 'user', text: clean };
    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setQuery('');
    setLoading(true);

    try {
      // Extract target name from query
      const match = clean.match(/about\s+([a-zA-Z]+)|similar\s+to\s+([a-zA-Z]+)|compare\s+([a-zA-Z]+)\s+and\s+([a-zA-Z]+)|([a-zA-Z]+)/i);
      let targetName = 'Aria';
      if (match) {
        targetName = match[1] || match[2] || match[3] || match[5] || 'Aria';
      }

      const res = await fetch('/api/v1/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: targetName }),
      });
      const data = await res.json();

      let replyText = "";
      if (data.success) {
        replyText = `Analysis for **${data.name}**:\n• **Gender**: ${data.associated_gender} (${data.confidence_score}% confidence)\n• **Reliability**: ${data.reliability?.level?.toUpperCase() || 'HIGH'} (${Math.round((data.reliability?.score || 0.95) * 100)}%)\n• **Model Agreement**: ${data.model_agreement || 98}%\n• **Origin**: ${data.origin?.region || 'Global'} (${data.origin?.language || 'Universal'})\n• **Meaning**: ${data.meaning?.text || 'Name pattern dataset entry'}`;
      } else {
        replyText = "Could not fetch details for that name.";
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: replyText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'assistant', text: 'Error connecting to Name Intelligence engine.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: 'Chat cleared! How can I assist you with name intelligence today?'
      }
    ]);
  };

  const quickPrompts = ['Tell me about Aditya', 'Is Taylor unisex?', 'Compare Alex and Aria'];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
        {/* Helper Tooltip Badge */}
        {!isOpen && (
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#161B22] border border-[#30363D] text-[#C7ED3D] text-xs font-mono font-semibold shadow-lg animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#C7ED3D]" />
            <span>AI Assistant</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Assistant"
          className="relative group p-4 rounded-full bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] shadow-2xl shadow-[#C7ED3D]/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-[#0D1117]/20"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7ED3D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#C7ED3D]"></span>
          </span>

          {isOpen ? (
            <X className="w-6 h-6 text-[#0D1117] transition-transform rotate-90" />
          ) : (
            <Bot className="w-6 h-6 text-[#0D1117] group-hover:rotate-12 transition-transform" />
          )}
        </button>
      </div>

      {/* Floating Chat Drawer Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[420px] h-[520px] max-h-[80vh] z-50 bg-[#161B22] border border-[#30363D] shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-fadeIn backdrop-blur-2xl">
          
          {/* Header */}
          <div className="p-4 bg-[#0D1117] border-b border-[#30363D] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-xl bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#C7ED3D] shadow-md">
                <Bot className="w-5 h-5 text-[#C7ED3D]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#3FB950] border-2 border-[#0D1117] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F0F6FC] font-['Outfit'] flex items-center space-x-1.5">
                  <span>NameLens AI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C7ED3D]" />
                </h3>
                <p className="text-[10px] text-[#3FB950] font-mono font-semibold">Online • ML Intelligence Engine</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="p-1.5 rounded-lg hover:bg-[#21262D] text-[#8B949E] hover:text-[#F85149] transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC] transition"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${m.sender === 'user' ? 'bg-[#C7ED3D] text-[#0D1117]' : 'bg-[#21262D] text-[#C7ED3D] border border-[#30363D]'}`}>
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5 text-[#0D1117]" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-3.5 rounded-xl leading-relaxed whitespace-pre-line max-w-[82%] ${m.sender === 'user' ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/40 shadow-md' : 'bg-[#0D1117] border border-[#30363D] text-[#F0F6FC] shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-[#8B949E] p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C7ED3D]" />
                <span>Processing name prediction...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 border-t border-[#30363D] bg-[#0D1117] flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-[#8B949E] font-semibold shrink-0">Try:</span>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={(e) => handleSend(e, prompt)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-[#161B22] hover:bg-[#21262D] text-[#8B949E] hover:text-[#C7ED3D] border border-[#30363D] hover:border-[#C7ED3D] transition whitespace-nowrap shrink-0 font-mono"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#30363D] bg-[#0D1117] flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about any name..."
              className="flex-1 bg-[#161B22] border border-[#30363D] px-3.5 py-2.5 rounded-xl text-[#F0F6FC] text-xs placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D] transition"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-2.5 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] shadow-md disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4 text-[#0D1117]" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
