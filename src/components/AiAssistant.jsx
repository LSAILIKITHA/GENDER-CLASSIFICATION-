import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, Cpu } from 'lucide-react';

export default function AiAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your AI Name Intelligence Assistant. Ask me anything about name associations, etymology, variants, or comparisons!'
    }
  ]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    const userMsg = { sender: 'user', text: clean };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      // Analyze input name in query
      const match = clean.match(/about\s+([a-zA-Z]+)|similar\s+to\s+([a-zA-Z]+)|compare\s+([a-zA-Z]+)\s+and\s+([a-zA-Z]+)|([a-zA-Z]+)/i);
      let targetName = 'Aditya';
      if (match) {
        targetName = match[1] || match[2] || match[3] || match[5] || 'Aditya';
      }

      const res = await fetch('/api/v1/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: targetName }),
      });
      const data = await res.json();

      let replyText = "";
      if (data.success) {
        replyText = `Analysis for **${data.name}**:\n• **Gender Association**: ${data.associated_gender} (${data.confidence_score}% confidence)\n• **Reliability**: ${data.reliability?.level?.toUpperCase()} (${Math.round((data.reliability?.score || 0.9) * 100)}%)\n• **Model Agreement**: ${data.model_agreement}%\n• **Origin**: ${data.origin?.region} (${data.origin?.language})\n• **Meaning**: ${data.meaning?.text}\n• **Explanation**: ${data.explanation?.simple_factors?.[0] || 'Strong match'}`;
      } else {
        replyText = "Could not fetch details for that name.";
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: replyText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'assistant', text: 'Error communicating with Name Intelligence engine.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Interactive Intelligence Assistant
        </h2>
        <p className="text-[#8B949E] text-sm max-w-lg mx-auto">
          Ask questions about name meanings, predictions, variants, and etymology. Driven directly by ML model outputs.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 flex flex-col h-[500px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${m.sender === 'user' ? 'bg-[#C7ED3D] text-[#0D1117]' : 'bg-[#21262D] text-[#C7ED3D] border border-[#30363D]'}`}>
                {m.sender === 'user' ? <User className="w-4 h-4 text-[#0D1117]" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-xl text-sm max-w-md leading-relaxed whitespace-pre-line ${m.sender === 'user' ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/40' : 'bg-[#0D1117] border border-[#30363D] text-[#F0F6FC]'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#8B949E] p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C7ED3D]" />
              <span>Querying ensemble models...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-[#30363D] flex items-center space-x-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask e.g. 'Tell me about Aditya' or 'Compare Aditya and Arjun'..."
            className="flex-1 bg-[#0D1117] border border-[#30363D] px-4 py-3 rounded-xl text-[#F0F6FC] text-sm focus:outline-none focus:border-[#C7ED3D]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm flex items-center space-x-2 transition"
          >
            <Send className="w-4 h-4 text-[#0D1117]" />
          </button>
        </form>
      </div>
    </div>
  );
}
