'use client';
import { useState } from 'react';
import { matchReply } from '@/data/chatbotReplies';
import { cn } from '@/lib/utils';

type Msg = { id: string; from: 'user' | 'bot'; text: string };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 'init', from: 'bot', text: '안녕하세요! Boanlinks 챗봇입니다. 무엇을 도와드릴까요?' },
  ]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: Math.random().toString(36).slice(2), from: 'user', text };
    const botMsg: Msg = {
      id: Math.random().toString(36).slice(2) + 'b',
      from: 'bot',
      text: matchReply(text),
    };
    setMsgs((m) => [...m, userMsg, botMsg]);
    setInput('');
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition-transform animate-p-glow"
        aria-label="챗봇 열기"
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm h-[28rem] rounded-2xl bg-white shadow-2xl border border-border flex flex-col animate-chat-in">
          <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-navy to-slate-850 rounded-t-2xl text-white">
            <p className="font-bold">Boanlinks 챗봇</p>
            <p className="text-xs text-white/70">궁금한 점을 물어보세요</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m) => (
              <div key={m.id} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line',
                    m.from === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-navy',
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-3 border-t border-border flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-full border border-border bg-slate-50 px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-full bg-primary text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={!input.trim()}
            >
              전송
            </button>
          </form>
        </div>
      )}
    </>
  );
}
