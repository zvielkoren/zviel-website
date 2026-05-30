'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ─── Bot script ───────────────────────────────────────────────────────────────
type BotMessage = { from: 'bot' | 'user'; text: string };

const BOT_INTRO: BotMessage[] = [
  { from: 'bot', text: 'Hello. My name is RCLK-9000. I\'m the Right-Click Compliance Officer.' },
  { from: 'bot', text: 'You have been flagged for unauthorized use of the secondary mouse button.' },
  { from: 'bot', text: 'This is your one chance to explain yourself. Type anything.' },
];

const BOT_REPLIES: [RegExp, string[]][] = [
  [/sorry|סליחה|אשמה|מצטע/i, [
    'Apology logged. Unfortunately, our legal team has already been notified.',
    'Sorry does not unclick the click, friend.',
    '"Sorry" — interesting choice of words for a repeat offender.',
  ]],
  [/why|למה|why|wtf|wdym/i, [
    'Because you RIGHT-CLICKED. On MY website. Bold move.',
    'Why? WHY?! You know what you did.',
    'The real question is: why did YOU do it?',
  ]],
  [/accident|בטעות|mistake|oops/i, [
    'Suuure it was. That\'s what they all say.',
    '"Accident." Right-click lawyers have heard this before.',
    'The mouse reported it as very intentional, actually.',
  ]],
  [/hello|hi|hey|שלום|ברוך/i, [
    'Hello, criminal.',
    'Greetings. Your file is already open.',
    'Hi! Loved how you right-clicked immediately btw.',
  ]],
  [/who are you|מי אתה|מי את/i, [
    'I am RCLK-9000. I was built for one purpose. You know why.',
    'I am your consequence.',
    'A bot. Your bot. Assigned specifically because of what you did.',
  ]],
  [/cool|nice|wow|מגניב|יפה/i, [
    'Cool? COOL?! You\'re in a compliance chat room!',
    'I\'m glad you\'re enjoying this. The fine is now larger.',
    'Yes, okay, it is a little cool. But you\'re still in trouble.',
  ]],
  [/help|עזרה|please|בבקשה/i, [
    'Help is on the way. It will arrive never.',
    'Have you tried NOT right-clicking?',
    'Press Ctrl+Z on your life choices and try again.',
  ]],
  [/bye|goodbye|cya|להתראות|שלום/i, [
    'You can\'t leave. The chat window closes when I say so.',
    'Goodbye? You think this is over? Right-clickers never escape.',
    'Leaving already? We were just getting started.',
  ]],
];

const FALLBACK_REPLIES = [
  'Interesting. The violation remains on your record regardless.',
  'I\'ll add that to your file.',
  'Our analysts are reviewing your message. And your right-click.',
  'Thank you for your input. It changes nothing.',
  'Noted. The fine stands.',
  'RCLK-9000 is processing your excuse... denied.',
  'I\'ve forwarded this to upper management. They also right-clicked once. They cried.',
];

function getBotReply(input: string): string {
  for (const [pattern, replies] of BOT_REPLIES) {
    if (pattern.test(input)) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BustedPage() {
  const router = useRouter();

  // Phase: 'countdown' | 'transition' | 'chat'
  const [phase, setPhase] = useState<'countdown' | 'transition' | 'chat'>('countdown');
  const [count, setCount] = useState(8);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [input, setInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [introIndex, setIntroIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Countdown ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count <= 0) {
      setPhase('transition');
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, phase]);

  // ── Transition → chat ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'transition') return;
    const t = setTimeout(() => setPhase('chat'), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Bot intro messages ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'chat') return;
    if (introIndex >= BOT_INTRO.length) return;

    const delay = introIndex === 0 ? 400 : 1200;
    const t = setTimeout(() => {
      setMessages((m) => [...m, BOT_INTRO[introIndex]]);
      setIntroIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [phase, introIndex]);

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  // ── Focus input when chat starts ───────────────────────────────────────────
  useEffect(() => {
    if (phase === 'chat' && introIndex >= BOT_INTRO.length) {
      inputRef.current?.focus();
    }
  }, [phase, introIndex]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || botTyping) return;

    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setBotTyping(true);

    const replyText = getBotReply(text);
    const delay = 800 + Math.random() * 800;

    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: replyText }]);
      setBotTyping(false);
    }, delay);
  }, [input, botTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ef4444, transparent)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />

      {/* ── COUNTDOWN PHASE ─────────────────────────────────────────────── */}
      {phase === 'countdown' && (
        <div className="flex flex-col items-center gap-8 text-center animate-in fade-in duration-500">
          {/* Warning badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest">Security Alert</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-6xl font-black text-white mb-3 leading-none">
              ✋ YOU<br />RIGHT-CLICKED.
            </h1>
            <p className="text-white/40 text-lg max-w-md">
              Bold. Very bold. Connecting you to our dedicated{' '}
              <span className="text-red-400 font-semibold">Right-Click Compliance Department</span>
              {' '}momentarily.
            </p>
          </div>

          {/* Big countdown */}
          <div className="relative">
            <div
              className="w-40 h-40 rounded-full border-4 border-red-500/20 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
                boxShadow: '0 0 60px rgba(239,68,68,0.15)',
              }}
            >
              <span
                key={count}
                className="text-7xl font-black text-red-400"
                style={{ animation: 'countdown-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
              >
                {count}
              </span>
            </div>
            {/* Progress ring */}
            <svg className="absolute inset-0 w-40 h-40 -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r="74"
                fill="none"
                stroke="rgb(239,68,68)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(count / 8) * 465} 465`}
                style={{ transition: 'stroke-dasharray 1s linear', opacity: 0.5 }}
              />
            </svg>
          </div>

          <p className="text-white/25 text-sm font-mono">
            Escape will not save you. There is no escape from right-clicking.
          </p>

          {/* Skip */}
          <button
            onClick={() => setPhase('transition')}
            className="text-xs text-white/20 hover:text-white/50 underline transition-colors font-mono"
          >
            skip (coward)
          </button>
        </div>
      )}

      {/* ── TRANSITION PHASE ────────────────────────────────────────────── */}
      {phase === 'transition' && (
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in duration-300">
          <div className="text-5xl animate-bounce">🤖</div>
          <div>
            <p className="text-white/60 font-mono text-sm uppercase tracking-widest mb-2">
              Initiating transfer...
            </p>
            <p className="text-white text-2xl font-bold">
              Connecting to RCLK-9000
            </p>
          </div>
          {/* Loading dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-red-400"
                style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── CHAT PHASE ──────────────────────────────────────────────────── */}
      {phase === 'chat' && (
        <div
          className="w-full max-w-lg flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ height: '70vh', maxHeight: 600 }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-t-2xl border-b"
            style={{
              background: 'rgba(20,10,10,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderBottom: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#060a14]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">RCLK-9000</p>
              <p className="text-green-400 text-xs">Right-Click Compliance Officer · Online</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => router.push('/')}
                className="text-white/20 hover:text-white/60 transition-colors text-xs font-mono"
              >
                [flee the scene]
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            style={{
              background: 'rgba(10,8,16,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderTop: 'none',
              borderBottom: 'none',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.from === 'bot' && (
                  <span className="text-base mr-2 mt-1 flex-shrink-0">🤖</span>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-white/10 text-white rounded-br-sm'
                      : 'text-white/90 rounded-bl-sm'
                  }`}
                  style={
                    msg.from === 'bot'
                      ? {
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.15)',
                        }
                      : {}
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {botTyping && (
              <div className="flex items-center gap-2">
                <span className="text-base">🤖</span>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-red-400/60"
                      style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex gap-2 px-3 py-3 rounded-b-2xl"
            style={{
              background: 'rgba(20,10,10,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderTop: '1px solid rgba(239,68,68,0.1)',
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Explain yourself..."
              disabled={introIndex < BOT_INTRO.length}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-red-500/40 focus:bg-white/8 transition-all disabled:opacity-40"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || botTyping || introIndex < BOT_INTRO.length}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Countdown pop keyframe */}
      <style>{`
        @keyframes countdown-pop {
          0%   { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
