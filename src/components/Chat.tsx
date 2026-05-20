"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface Source {
  source: string;
  text: string;
  similarity?: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "assistant",
    content: "Hello! I am your LangChain & MongoDB Documentation Assistant. Ask me a question, and I'll search the Vector Database for the answer!"
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMsg,
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get answer");
      }

      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages(prev => [...prev, newAssistantMessage]);

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `**Error:** ${error.message}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/50">
        <h1 className="text-lg font-semibold text-slate-200">Chat Interface</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg border border-blue-500">
                <Bot className="w-6 h-6 text-white" />
              </div>
            )}
            
            <div className={`
              flex flex-col gap-2 max-w-[80%]
              ${msg.role === 'user' ? 'items-end' : 'items-start'}
            `}>
              <div className={`
                p-4 rounded-2xl shadow-md
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                }
              `}>
                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <SourceDisclosure sources={msg.sources} />
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 shadow-lg border border-slate-600">
                <User className="w-6 h-6 text-slate-200" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 flex items-center gap-3 shadow-md">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-slate-400 text-sm">Searching MongoDB Vector Store...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all placeholder:text-slate-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function SourceDisclosure({ sources }: { sources: Source[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2 w-full max-w-[90%]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700"
      >
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        View Retrieved Documents ({sources.length})
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {sources.map((src, idx) => (
            <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
                <span className="font-semibold text-blue-400">{src.source}</span>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {src.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
