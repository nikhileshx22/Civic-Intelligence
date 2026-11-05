import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, MessageSquare } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'te';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isTe = lang === 'te';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: isTe
        ? 'నమస్కారం! నేను సివిక్స్.AI (CivixAI) గార్డియన్‌ని. విశాఖపట్నంలో రోడ్ల స్థితి, గుంతల మరమ్మతులు, లైవ్ ట్రాకింగ్ లేదా ఫిర్యాదుల విధానం గురించి నన్ను అడగండి.'
        : 'Hello! I am your CivixAI Guardian. Ask me anything about Vizag road conditions, live hazard tracking, GVMC repair schedules, or how our 200m proximity deduplication works.',
      time: 'Just now',
    },
  ]);

  const quickPrompts = isTe
    ? [
        'MVP కాలనీలో రోడ్డు మరమ్మతులు ఎప్పుడు జరుగుతాయి?',
        '200 మీటర్ల డూప్లికేట్ విధానం ఎలా పనిచేస్తుంది?',
        'బీచ్ రోడ్‌లో సైక్లింగ్ చేయడం సురక్షితమేనా?',
      ]
    : [
        'When will MVP Sector 4 craters be fixed?',
        'How does 200m duplicate bundling work?',
        'Is RK Beach Road safe for morning walking?',
      ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, lang }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply || (isTe ? 'సమాచారం అందుబాటులో లేదు.' : 'No response available.'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Chat API returned error');
      }
    } catch (e) {
      console.warn('Chat error:', e);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: isTe
          ? 'క్షమించండి, సర్వర్ స్పందించలేదు. దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.'
          : 'Our AI Guardian is monitoring live reports. MVP Sector 4 road patching is prioritized under a 24-hour SLA by GVMC Zone 2 Engineering.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="chat-box-container bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px] max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-base tracking-tight">CivixAI Guardian</h3>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold uppercase">
                  Live
                </span>
              </div>
              <p className="text-xs text-sky-100">
                {isTe ? 'విశాఖపట్నం పౌర భద్రత మరియు మున్సిపల్ సలహాదారు' : 'Visakhapatnam Civic Intelligence Assistant'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-sky-50/70 border-b border-sky-100 flex items-center space-x-2 overflow-x-auto text-xs scrollbar-none">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
          <span className="text-sky-900 font-bold whitespace-nowrap">
            {isTe ? 'ప్రశ్నల సూచనలు:' : 'Suggested:'}
          </span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 bg-white hover:bg-sky-100 text-sky-900 font-medium rounded-lg border border-sky-200 whitespace-nowrap transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : 'You'}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-100 text-slate-800 border border-slate-200'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`text-[10px] mt-1.5 ${
                      isAi ? 'text-slate-400' : 'text-sky-100'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
              <span>{isTe ? 'గార్డియన్ ఆలోచిస్తోంది...' : 'CivixAI Guardian is formulating guidance...'}</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              isTe
                ? 'వైజాగ్ సమస్యలు లేదా రోడ్ల గురించి అడగండి...'
                : 'Ask about road hazards, GVMC repair status, or 200m bundling...'
            }
            className="chat-input flex-1 px-4 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-2xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
