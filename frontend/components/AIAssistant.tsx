
import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { askResearcher } from '../services/geminiService';
import { Button, Card, Input } from './ui';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    const res = await askResearcher(question);
    setAnswer(res);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300 border shadow-2xl">
          <div className="bg-slate-950 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-blue-400" />
              <span className="font-semibold text-sm">Research AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-800 p-1 rounded transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 min-h-[150px]">
            {answer ? (
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                {answer}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center mt-8">
                Ask me anything about my research or background!
              </p>
            )}
            {isLoading && (
              <div className="flex justify-center mt-4">
                <div className="animate-bounce p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                  <Bot size={16} className="text-blue-500" />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative">
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How does ScribbleDiff work?"
                className="pr-10 text-xs"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-slate-400 hover:scale-110 transition-transform"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg group relative"
        >
          <MessageSquare size={24} />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask the AI
          </span>
        </Button>
      )}
    </div>
  );
};

export default AIAssistant;
