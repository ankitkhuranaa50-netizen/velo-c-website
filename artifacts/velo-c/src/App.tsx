import React, { useState, useRef, useEffect } from 'react';
import { FaTelegram, FaYoutube, FaGithub, FaTimes, FaPaperPlane, FaRobot, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from './hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

// ─── Overlay types ────────────────────────────────────────────────────────────
type ActiveOverlay = 'explore' | 'profile' | 'contact' | 'about' | null;
type ExploreModal = 'redeem' | 'config' | 'apps' | 'ai' | 'payment' | 'suggestion' | null;

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  // Overlay & menu state
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: "Hey! 👋 I'm Velo AI. Ask me about gaming configs, editing tools, downloads, or anything Velo C!",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const marqueeText =
    '🎮 NVIDIA  |  ⚡ AMD  |  🖥️ MSI  |  🎨 Adobe  |  🎯 Epic Games  |  🎵 Spotify  |  🚀 Tesla  |  💻 ASUS  |  ';

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus chat input when opened
  useEffect(() => {
    if (isChatOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isChatOpen]);

  // Keep the page behind a full-screen overlay from scrolling. Escape closes
  // the current surface so keyboard users never get trapped in the UI.
  useEffect(() => {
    if (!activeOverlay) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveOverlay(null);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handler);
    };
  }, [activeOverlay]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openOverlay = (overlay: ActiveOverlay) => {
    setIsMenuOpen(false);
    setActiveOverlay(overlay);
  };

  const handleMenuLogin = async () => {
    setIsMenuOpen(false);
    await signInWithGoogle();
  };

  const handleMenuLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    if (activeOverlay === 'profile') setActiveOverlay(null);
  };

  const handleCardClick = (title: string) => {
    setToast(`${title} will be added soon. Explore More already has the latest drops.`);
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Chat request failed');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: data.reply ?? data.error ?? 'Something went wrong. Try again!',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: 'Oops! Could not reach Velo AI. Please try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden font-sans selection:bg-red-500 selection:text-white" style={{ background: '#0a0a0d' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR — fixed top bar with logo + 3-dot menu
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(12,12,15,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(239,68,68,0.25)',
          boxShadow: '0 1px 24px rgba(0,0,0,0.35)',
        }}
      >
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-7">
          <span
            className="font-extrabold text-xl tracking-tight select-none"
            style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Velo C
          </span>
          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => openOverlay('about')}
              className="text-sm font-semibold text-gray-300 hover:text-red-500 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => openOverlay('contact')}
              className="text-sm font-semibold text-gray-300 hover:text-red-500 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => openOverlay('profile')}
              className="text-sm font-semibold text-gray-300 hover:text-red-500 transition-colors"
            >
              Dashboard
            </button>
          </nav>
        </div>

        {/* Right side: user chip + 3-dot menu */}
        <div className="flex items-center gap-3" ref={menuRef}>

          {/* Logged-in user avatar chip */}
          {!loading && user && (
            <button
              onClick={() => openOverlay('profile')}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all hover:scale-105"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <img
                src={user.photoURL ?? ''}
                alt={user.displayName ?? 'User'}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-sm font-semibold text-gray-200 max-w-[90px] truncate hidden sm:block">
                {user.displayName?.split(' ')[0]}
              </span>
            </button>
          )}

          {/* 3-dot menu button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 select-none"
              style={{
                background: isMenuOpen ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: isMenuOpen ? '#fff' : '#e5e5e5',
                fontSize: '22px',
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: '-1px',
              }}
            >
              ⋮
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl overflow-hidden dropdown-in"
                style={{
                  background: 'rgba(20,20,23,0.97)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  boxShadow: '0 8px 40px rgba(239,68,68,0.12), 0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                {/* Auth items — changes based on login state */}
                {loading ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Loading...</div>
                ) : user ? (
                  <DropdownItem
                    icon={<FaSignOutAlt size={13} />}
                    label="Logout"
                    onClick={handleMenuLogout}
                  />
                ) : (
                  <>
                    <DropdownItem
                      icon={<GoogleIcon />}
                      label="Sign In"
                      onClick={handleMenuLogin}
                      accent
                    />
                    <DropdownItem
                      icon={<GoogleIcon />}
                      label="Sign Up"
                      onClick={handleMenuLogin}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERLAYS — Profile / Contact / About / Explore More
      ══════════════════════════════════════════════════════════════════════ */}
      {activeOverlay && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeOverlay === 'explore' ? 'Explore More' : activeOverlay} panel`}
          className="fixed inset-0 z-[60] flex flex-col overlay-in"
          style={{
            background: activeOverlay === 'explore' ? '#0a0a0f' : 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Back button */}
          <div
            className="flex items-center px-5 py-4"
            style={{
              borderBottom: activeOverlay === 'explore'
                ? '1px solid rgba(0,255,204,0.16)'
                : '1px solid rgba(0,240,255,0.15)',
              background: activeOverlay === 'explore' ? 'rgba(10,10,15,0.82)' : undefined,
            }}
          >
            <button
              onClick={() => setActiveOverlay(null)}
              className={`flex items-center gap-2 font-bold transition-colors ${
                activeOverlay === 'explore'
                  ? 'text-slate-300 hover:text-[#00ffcc]'
                  : 'text-gray-700 hover:text-[#00f0ff]'
              }`}
            >
              <span className="text-xl">←</span>
              <span>Back</span>
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto ${
            activeOverlay === 'explore'
              ? 'explore-content'
              : 'flex items-start justify-center px-6 py-12'
          }`}>

            {/* ── PROFILE OVERLAY ── */}
            {activeOverlay === 'profile' && (
              <div className="w-full max-w-sm">
                {user ? (
                  <div className="flex flex-col items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={user.photoURL ?? ''}
                        alt={user.displayName ?? 'User'}
                        className="w-28 h-28 rounded-full object-cover shadow-xl"
                        style={{ border: '3px solid #00f0ff', boxShadow: '0 0 30px rgba(0,240,255,0.35)' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? 'U')}&background=00f0ff&color=000&size=128`;
                        }}
                      />
                      <span
                        className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white"
                        title="Online"
                      />
                    </div>

                    {/* Name */}
                    <div className="text-center">
                      <h2 className="text-2xl font-extrabold text-gray-900">{user.displayName}</h2>
                      <p className="text-gray-500 mt-1 text-sm">{user.email}</p>
                    </div>

                    {/* Info card */}
                    <div
                      className="w-full rounded-2xl px-6 py-4 space-y-3"
                      style={{
                        background: 'rgba(0,240,255,0.05)',
                        border: '1px solid rgba(0,240,255,0.2)',
                      }}
                    >
                      <ProfileRow label="Name" value={user.displayName ?? '—'} />
                      <ProfileRow label="Email" value={user.email ?? '—'} />
                      <ProfileRow label="Member since" value={
                        user.metadata.creationTime
                          ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                          : '—'
                      } />
                    </div>

                    {/* Sign-out button */}
                    <button
                      onClick={handleMenuLogout}
                      className="w-full py-3.5 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg,#ff6b6b,#a78bfa)' }}
                    >
                      <FaSignOutAlt size={14} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  /* Not logged in — prompt to sign in */
                  <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                      style={{ background: 'rgba(0,240,255,0.1)', border: '2px dashed rgba(0,240,255,0.4)' }}>
                      🔒
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Not Signed In</h2>
                      <p className="text-gray-500">Sign in to view your profile and access exclusive content.</p>
                    </div>
                    <button
                      onClick={async () => { await signInWithGoogle(); }}
                      className="flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg,#00f0ff,#a78bfa)' }}
                    >
                      <GoogleIcon white /> Sign in with Google
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── EXPLORE OVERLAY ── */}
            {activeOverlay === 'explore' && (
              <ExploreMoreContent />
            )}

            {/* ── CONTACT OVERLAY ── */}
            {activeOverlay === 'contact' && (
              <div className="w-full max-w-lg">
                <PlaceholderSection
                  icon="📬"
                  title="Contact Us"
                  subtitle="Contact section coming soon"
                  description="We're building something great here. Drop us a message on our social channels in the meantime!"
                  accent="#00f0ff"
                />
              </div>
            )}

            {/* ── ABOUT OVERLAY ── */}
            {activeOverlay === 'about' && (
              <div className="w-full max-w-lg">
                <PlaceholderSection
                  icon="⚡"
                  title="About Velo C"
                  subtitle="About section coming soon"
                  description="Velo C is the ultimate destination for high-speed direct downloads — gaming configs, AI editing tools, video assets, and premium packs for creators worldwide."
                  accent="#a78bfa"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="velo-toast" role="status" aria-live="polite">
          <span aria-hidden="true">✦</span>
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">
            <FaTimes size={13} />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN PAGE CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <main>
        {/* ══════════════ DARK RED THEME BLOCK — HERO + SOCIAL + CARDS ══════════════ */}
        <div style={{ background: 'radial-gradient(ellipse at top, #1a0a0d 0%, #0a0a0d 55%, #0a0a0d 100%)' }}>

        {/* SECTION 1+2+3 — HERO (characters left/right, existing content centered) */}
        <section className="pt-28 pb-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(190px,1fr)_minmax(420px,1.4fr)_minmax(190px,1fr)] items-center gap-8 lg:gap-12">

            {/* LEFT — cyan gaming character */}
            <div className="hero-character hero-character-left order-1 flex justify-center md:justify-end self-end">
              <img
                src="/character-left.png"
                alt="Velo C gaming character"
                className="w-[min(72vw,300px)] md:w-full max-w-[330px] h-auto object-contain select-none"
                draggable={false}
              />
            </div>

            {/* CENTER — existing heading, paragraph, and button */}
            <div className="order-2 flex flex-col items-center text-center gap-7">
              <span className="uppercase tracking-[0.3em] text-xs md:text-sm font-bold text-red-500">
                Intelligence at Velocity
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-none">
                Velo{' '}
                <span
                  className="text-glow"
                  style={{
                    background: 'linear-gradient(135deg, #ff3b3b, #ff8a3d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  C
                </span>
              </h1>

              <p className="text-[1.05rem] md:text-lg text-gray-400 leading-relaxed max-w-lg font-medium">
                The ultimate destination for high-speed direct downloads — premium gaming configs,
                AI-powered editing tools, video assets, and exclusive packs for creators and gamers
                worldwide. Every file verified, optimized, zero hassle.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => openOverlay('explore')}
                  className="px-9 py-4 rounded-full font-extrabold text-white text-lg transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                    boxShadow: '0 0 25px rgba(239,68,68,0.45), 0 0 50px rgba(249,115,22,0.25)',
                  }}
                >
                  Explore Downloads
                </button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-white">250K+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-white">4.9★</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">User Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-white">120+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Premium Tools</div>
                </div>
              </div>
            </div>

            {/* RIGHT — purple creator character */}
            <div className="hero-character hero-character-right order-3 flex justify-center md:justify-start self-end">
              <img
                src="/character-right.png"
                alt="Velo C creator character"
                className="w-[min(72vw,300px)] md:w-full max-w-[330px] h-auto object-contain select-none"
                draggable={false}
              />
            </div>

          </div>
        </section>

        {/* SECTION 4 — SOCIAL ICONS */}
        <section className="flex justify-center items-center gap-10 pb-20">
          <a
            href="https://t.me/Thecrackedx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
          >
            <FaTelegram size={52} />
          </a>
          <a
            href="https://youtube.com/@thecrackedx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 transition-all duration-300 hover:scale-125 hover:text-red-500 hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
          >
            <FaYoutube size={52} />
          </a>
        </section>

        {/* SECTION 5 — CATEGORY CARDS */}
        <section className="px-6 pb-28 max-w-6xl mx-auto">
          <span className="block text-center uppercase tracking-[0.3em] text-xs md:text-sm font-bold text-red-500 mb-3">
            Categories
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-3">
            Premium Files &amp; Tools Hub
          </h2>
          <p className="text-center text-gray-400 mb-12">Select a category and get high-speed secure downloads.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryCard
              emoji="🎮"
              title="Gaming APKs & Mods"
              description="GFX tools, FPS configs, gaming setups and performance boosters."
              buttonLabel="Open Gaming Hub"
              onClick={() => handleCardClick('🎮 Gaming APKs & Mods')}
            />
            <CategoryCard
              emoji="🛠️"
              title="AI Editing Tools"
              description="Premium unlocked video and photo editing apps."
              buttonLabel="Open Editing Hub"
              onClick={() => handleCardClick('🛠️ AI Editing Tools')}
            />
            <CategoryCard
              emoji="🎬"
              title="Video Resources"
              description="High-quality video assets, sound effects and creator resources."
              buttonLabel="Open Video Hub"
              onClick={() => handleCardClick('🎬 Video Resources')}
            />
            <CategoryCard
              emoji="💎"
              title="Premium Packs"
              description="Exclusive premium packs and bundles for creators and gamers."
              buttonLabel="Open Premium Hub"
              onClick={() => handleCardClick('💎 Premium Packs')}
            />
          </div>
        </section>

        </div>
        {/* ══════════════ END DARK RED THEME BLOCK ══════════════ */}

        {/* SECTION 5.5 — ABOUT ME */}
        <section className="px-6 pb-0 max-w-5xl mx-auto" style={{ background: '#0a0a0d' }}>
          {/* top divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="mb-16" />

          <div
            className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 rounded-3xl px-8 py-12 md:px-14 md:py-14"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239,68,68,0.18)',
              boxShadow: '0 4px 40px rgba(239,68,68,0.06), 0 2px 20px rgba(0,0,0,0.2)',
            }}
          >
            {/* LEFT — Velo C YouTube channel logo */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div
                className="about-channel-logo relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1d, #0f0f11)',
                  border: '2.5px solid rgba(239,68,68,0.5)',
                  boxShadow: '0 0 0 7px rgba(239,68,68,0.06), 0 0 32px rgba(239,68,68,0.2)',
                }}
              >
                <img
                  src="/youtube-logo-blue.jpg"
                  alt="Velo C YouTube channel logo"
                  className="about-channel-logo-image absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                {/* polished dark glass overlay */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(239,68,68,0.1))',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -10px 24px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
              <span
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: '#9ca3af', letterSpacing: '0.08em' }}
              >
                Velo C YouTube Channel
              </span>
            </div>

            {/* RIGHT — about me text */}
            <div className="flex flex-col justify-center gap-5 text-center md:text-left">
              {/* accent label */}
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest w-fit mx-auto md:mx-0 px-3 py-1 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.12))',
                  border: '1px solid rgba(249,115,22,0.3)',
                  color: '#f97316',
                }}
              >
                About the Creator
              </span>

              <h2
                className="text-2xl md:text-3xl font-extrabold text-white leading-snug"
              >
                The Mind Behind{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Velo C
                </span>
              </h2>

              <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-lg">
                Passionate about building digital tools, gaming assets, and creator resources.
                Velo C is my vision to provide 100% working, high-speed downloads to the global
                creator community. Every file here is hand-picked, tested, and optimized for the
                best experience. Stay tuned for more — the best is yet to come.
              </p>

              {/* decorative stat chips */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-1">
                {[
                  { label: 'Gaming Configs', value: '100+' },
                  { label: 'Editing Tools', value: '50+' },
                  { label: 'Global Users', value: '10K+' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center px-5 py-2.5 rounded-2xl"
                    style={{
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.18)',
                    }}
                  >
                    <span className="text-lg font-extrabold text-white">{s.value}</span>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="mt-16" />
        </section>

        {/* SECTION 5.7 — ADVERTISEMENT BOX */}
        <section className="px-6 pb-0 max-w-5xl mx-auto" style={{ background: '#0a0a0d' }}>
          <div className="mt-0 mb-16">
            {/* 16:9 aspect-ratio wrapper */}
            <div className="relative w-full" style={{ paddingBottom: 'calc(9/16 * 100%)' }}>
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-3"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(18px)',
                  border: '1.5px dashed rgba(239,68,68,0.4)',
                  boxShadow: '0 0 32px rgba(239,68,68,0.08), 0 4px 30px rgba(0,0,0,0.2)',
                }}
              >
                {/* gradient overlay */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(239,68,68,0.06) 100%)',
                  }}
                />
                {/* content */}
                <span className="relative text-3xl md:text-5xl select-none">📢</span>
                <p
                  className="relative font-extrabold text-xl md:text-3xl tracking-tight text-gray-200 text-center px-4"
                >
                  Advertisement Space
                </p>
                <p
                  className="relative text-sm md:text-base font-medium text-center px-6 max-w-md"
                  style={{ color: '#6b7280' }}
                >
                  Your brand could be here.{' '}
                  <span
                    className="font-semibold"
                    style={{ color: '#00c8d4' }}
                  >
                    Contact us for partnerships.
                  </span>
                </p>
                {/* corner accent dots */}
                <span className="absolute top-4 left-4 w-2 h-2 rounded-full" style={{ background: 'rgba(0,240,255,0.4)' }} />
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full" style={{ background: 'rgba(249,115,22,0.4)' }} />
                <span className="absolute bottom-4 left-4 w-2 h-2 rounded-full" style={{ background: 'rgba(249,115,22,0.4)' }} />
                <span className="absolute bottom-4 right-4 w-2 h-2 rounded-full" style={{ background: 'rgba(239,68,68,0.4)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — TRUSTED COMPANIES MARQUEE */}
        <section className="w-full overflow-hidden py-16 border-y" style={{ background: '#0a0a0d', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h3 className="text-2xl font-bold text-center text-white mb-12">
            🏆 Trusted by Global Companies
          </h3>
          <div className="relative w-full flex whitespace-nowrap overflow-hidden mask-fade-edges">
            <div className="animate-marquee flex">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="text-xl font-bold text-gray-500 tracking-wider whitespace-pre px-4">
                  {marqueeText}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="w-full px-6 py-10 md:py-12"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: '#0a0a0d',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">

          {/* COL 1 — Copyright */}
          <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
            <span
              className="font-extrabold text-base tracking-tight"
              style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Velo C
            </span>
            <p className="text-xs leading-relaxed" style={{ color: '#5c6a7a' }}>
              © 2026 Velo C. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Built for creators & gamers worldwide.
            </p>
          </div>

          {/* COL 2 — Social icons */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Follow Us</p>
            <div className="flex items-center gap-5">
              <a
                href="https://youtube.com/@thecrackedx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="footer-social-icon"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://t.me/Thecrackedx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="footer-social-icon"
              >
                <FaTelegram size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="footer-social-icon"
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          {/* COL 3 — Quick links */}
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Quick Links</p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy',   href: '#' },
                { label: 'Contact',          href: '#' },
                { label: 'About',            href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-link text-xs"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING AI CHATBOT (bottom-right)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {isChatOpen && (
          <div
            className="mb-4 flex flex-col rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{
              width: 'min(340px, calc(100vw - 48px))',
              height: '480px',
              background: 'rgba(10, 10, 20, 0.92)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,240,255,0.35)',
              boxShadow: '0 0 40px rgba(0,240,255,0.15), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(167,139,250,0.2))',
                borderBottom: '1px solid rgba(0,240,255,0.2)',
              }}
            >
              <div className="flex items-center gap-2">
                <FaRobot className="text-[#00f0ff]" size={18} />
                <span className="font-bold text-white tracking-wide text-sm">Velo AI</span>
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" title="Online" />
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                <FaTimes size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} chat-message-in`}>
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1"
                      style={{ background: 'linear-gradient(135deg, #00f0ff, #a78bfa)' }}>
                      <FaRobot size={12} className="text-black" />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #00f0ff, #a78bfa)', color: '#000', fontWeight: 500, borderBottomRightRadius: '4px' }
                      : { background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius: '4px' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start chat-message-in">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2"
                    style={{ background: 'linear-gradient(135deg, #00f0ff, #a78bfa)' }}>
                    <FaRobot size={12} className="text-black" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 flex items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius: '4px' }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                    <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Velo AI..."
                disabled={isTyping}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,240,255,0.25)', color: '#f1f5f9' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0,240,255,0.15)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #00f0ff, #a78bfa)' }}
              >
                <FaPaperPlane size={14} className="text-black" />
              </button>
            </div>
          </div>
        )}

        {/* Floating toggle button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Toggle Velo AI Chat"
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: isChatOpen ? 'rgba(10,10,20,0.9)' : 'linear-gradient(135deg, #00f0ff, #a78bfa)',
            boxShadow: isChatOpen ? '0 0 20px rgba(167,139,250,0.4)' : '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)',
            border: isChatOpen ? '2px solid rgba(0,240,255,0.4)' : 'none',
          }}
        >
          {isChatOpen ? <FaTimes size={24} className="text-[#00f0ff]" /> : <FaRobot size={26} className="text-black" />}
        </button>
      </div>
    </div>
  );
}

// ─── Explore More structure ───────────────────────────────────────────────────
function ExploreMoreContent() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [modal, setModal] = useState<ExploreModal>(null);
  const [suggestion, setSuggestion] = useState('');
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  const slides = [
    {
      eyebrow: 'EXCLUSIVE DROP',
      title: 'Redeem Code',
      description: 'Tap to reveal your placeholder redeem code.',
      icon: '01',
      className: 'explore-slide-cyan',
      action: () => setModal('redeem' as ExploreModal),
    },
    {
      eyebrow: 'STAY CONNECTED',
      title: 'Latest Updates',
      description: 'Get new drops and announcements on Telegram.',
      icon: '02',
      className: 'explore-slide-purple',
      action: () => window.open('https://t.me/Thecrackedx', '_blank', 'noopener,noreferrer'),
    },
    {
      eyebrow: 'PRO EDITION',
      title: 'Pro Config',
      description: 'Open the placeholder details for the next config.',
      icon: '03',
      className: 'explore-slide-blue',
      action: () => setModal('config' as ExploreModal),
    },
  ];

  useEffect(() => {
    if (isSliderPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [isSliderPaused, slides.length]);

  useEffect(() => {
    if (!modal) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modal]);

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const scrollToTop = () => {
    document.querySelector('.explore-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="explore-shell">
      <div className="explore-container">
        <header className="explore-hero-heading" id="explore-top">
          <div className="explore-hero-topline">
            <span className="explore-kicker">VELO C / CREATOR HUB</span>
            <span className="explore-live-status"><i /> LIVE RESOURCE DESK</span>
          </div>
          <h1>Explore More<span>.</span></h1>
          <p>A focused library for better gaming setups, faster creator workflows, and useful digital resources.</p>
          <div className="explore-hero-stats" aria-label="Explore More highlights">
            <span><strong>30</strong> resources in the vault</span>
            <span><strong>03</strong> fresh drops</span>
            <span><strong>24/7</strong> access</span>
          </div>
        </header>

        {/* 1. Slider */}
        <section
          className="explore-section"
          aria-labelledby="explore-slider-heading"
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
          onFocusCapture={() => setIsSliderPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsSliderPaused(false);
            }
          }}
        >
          <div className="explore-section-heading">
            <div>
              <span className="explore-kicker">FEATURED</span>
              <h2 id="explore-slider-heading">Fresh from Velo C</h2>
            </div>
            <span className="explore-counter">{String(activeSlide + 1).padStart(2, '0')} / 03</span>
          </div>

          <div className="explore-slider">
            <button className="explore-arrow explore-arrow-left" onClick={previousSlide} aria-label="Previous slide">‹</button>
            <div className="explore-slider-viewport">
              <div
                className="explore-slider-track"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((slide) => (
                  <button
                    key={slide.title}
                    className={`explore-slide ${slide.className}`}
                    onClick={slide.action}
                    aria-label={`Open ${slide.title}`}
                  >
                    <span className="explore-slide-icon">{slide.icon}</span>
                    <span className="explore-slide-copy">
                      <span className="explore-slide-eyebrow">{slide.eyebrow}</span>
                      <strong>{slide.title}</strong>
                      <span>{slide.description}</span>
                    </span>
                    <span className="explore-slide-open">OPEN →</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="explore-arrow explore-arrow-right" onClick={nextSlide} aria-label="Next slide">›</button>
          </div>
          <div className="explore-dots" aria-label="Slider pagination">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                className={`explore-dot ${activeSlide === index ? 'is-active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to ${slide.title}`}
              />
            ))}
          </div>
        </section>

        {/* 2. Category buttons */}
        <section className="explore-section" aria-labelledby="explore-categories-heading">
          <div className="explore-section-heading">
            <div>
              <span className="explore-kicker">CURATED TOOLS</span>
              <h2 id="explore-categories-heading">Find your next resource</h2>
            </div>
          </div>
          <div className="explore-category-grid">
            <button className="explore-category-card explore-category-movies" onClick={() => setModal('apps')}>
              <span className="explore-category-index">01</span>
              <strong>Movies &amp; Web Series<br />Apps / Tools</strong>
              <small>5 placeholder picks</small>
            </button>
            <button className="explore-category-card explore-category-ai" onClick={() => setModal('ai')}>
              <strong>AI All Apps<br />&amp; Tools</strong>
              <small>5 placeholder picks</small>
              <span className="explore-category-index">02</span>
            </button>
          </div>
        </section>

        {/* 3. Hacks */}
        <section className="explore-section" aria-labelledby="hacks-heading">
          <div className="explore-section-heading explore-hacks-heading">
            <div>
              <span className="explore-kicker">MEMBER VAULT</span>
            <h2 id="hacks-heading">30 mobile-first income ideas</h2>
            </div>
            <span className="explore-lock-summary">02 FREE • 28 LOCKED</span>
          </div>

          <div className="explore-hacks-grid">
            {Array.from({ length: 30 }, (_, index) => {
              const isFree = index < 2;
              return (
                <article key={index} className={`explore-hack-card ${isFree ? 'is-free' : 'is-locked'}`}>
                  <div className="explore-hack-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="explore-hack-body">
                    <span className="explore-hack-status">{isFree ? 'FREE ACCESS' : 'LOCKED ACCESS'}</span>
                    <h3>{isFree ? `Free Hack ${index + 1}` : `Premium Hack ${index + 1}`}</h3>
                    <p>{isFree ? 'Your hack details will be added here.' : 'Unlock to reveal hack details.'}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <button className="explore-unlock-button" onClick={() => setModal('payment')}>
            UNLOCK ALL 30 HACKS — ₹19 ONLY
          </button>
        </section>

        {/* 4. Long-form updates and news */}
        <section className="explore-section explore-news-section" aria-labelledby="explore-news-heading">
          <div className="explore-section-heading">
            <div>
              <span className="explore-kicker">THE VELO C JOURNAL</span>
              <h2 id="explore-news-heading">What’s New in Gaming &amp; Creator Tools</h2>
            </div>
            <span className="explore-counter">LATEST NOTES</span>
          </div>

          <div className="explore-news-grid">
            <article className="explore-news-card explore-news-card-featured">
              <div className="explore-news-meta">
                <span>GAMING UPDATE</span>
                <span>01</span>
              </div>
              <h3>Smarter setups are changing the way mobile gamers play</h3>
              <p>
                Competitive mobile gaming is moving toward cleaner, more reliable setups. Players
                are paying closer attention to sensitivity, touch response, device temperature,
                network stability, and comfortable HUD layouts instead of chasing random settings.
                Velo C is building a focused library of practical resources so every gamer can
                understand what a configuration changes before using it.
              </p>
              <p>
                The next wave of gaming resources will be organized by device, game mode, and
                experience level. That means beginners can start with simple recommendations while
                experienced players can explore deeper control, aim, performance, and recording
                workflows without getting lost in complicated instructions.
              </p>
            </article>

            <article className="explore-news-card">
              <div className="explore-news-meta">
                <span>CREATOR DESK</span>
                <span>02</span>
              </div>
              <h3>Editing tools that save time, not quality</h3>
              <p>
                Short-form creators need fast tools, but speed should never mean sacrificing
                clarity or originality. We are collecting editing utilities, templates, audio
                resources, captions, transitions, and AI-assisted workflows that help turn a raw
                idea into a polished piece of content.
              </p>
              <p>
                Future Velo C updates will include simple guides for choosing the right tool,
                preparing files, exporting cleanly, and keeping a consistent visual identity
                across videos. More resources will be added as they are tested and organized.
              </p>
            </article>

            <article className="explore-news-card">
              <div className="explore-news-meta">
                <span>COMING NEXT</span>
                <span>03</span>
              </div>
              <h3>More useful drops, fewer random downloads</h3>
              <p>
                Velo C is being shaped as a curated hub rather than a noisy download list. New
                releases will focus on working resources, clear descriptions, safer file habits,
                and straightforward instructions. From gaming configs and web-series utilities to
                creator packs and productivity tools, every category will grow with a purpose.
              </p>
              <p>
                Keep checking this space for update notes, new app discoveries, community
                suggestions, and feature announcements. The goal is simple: give gamers and
                creators useful resources they can return to whenever they need a fresh start.
              </p>
            </article>
          </div>
        </section>

        {/* 5. Explore footer — the only READ MORE action */}
        <footer className="explore-footer">
          <div className="explore-footer-actions">
            <button type="button" className="explore-outline-button" onClick={() => setModal('suggestion')}>＋ Add</button>
          </div>
          <p>Velo C Creator Hub <span>•</span> More drops coming soon</p>
          <ExploreReadMore onClick={scrollToTop} />
        </footer>
      </div>

      {modal && (
        <ExploreModalFrame modal={modal} onClose={() => setModal(null)}>
          {modal === 'redeem' && (
            <ExplorePlaceholderModal icon="01" title="Redeem Code">
              <div className="explore-code-placeholder">YOUR-CODE-HERE</div>
              <p>Replace this placeholder with your redeem code and usage instructions.</p>
            </ExplorePlaceholderModal>
          )}
          {modal === 'config' && (
            <ExplorePlaceholderModal icon="03" title="Pro Config">
              <div className="explore-modal-placeholder">Pro config details will be added here.</div>
              <p>Use this space for version, supported games, download button, or setup notes.</p>
            </ExplorePlaceholderModal>
          )}
          {modal === 'apps' && (
            <ExploreListModal
              icon="04"
              title="Movies & Web Series Apps / Tools"
              items={['Movie App 01 — placeholder', 'Streaming Tool 02 — placeholder', 'Web Series App 03 — placeholder', 'Subtitle Tool 04 — placeholder', 'Media Utility 05 — placeholder']}
            />
          )}
          {modal === 'ai' && (
            <ExploreListModal
              icon="05"
              title="AI All Apps & Tools"
              items={['AI Tool 01 — placeholder', 'Creative Assistant 02 — placeholder', 'Image Tool 03 — placeholder', 'Video Tool 04 — placeholder', 'Productivity Tool 05 — placeholder']}
            />
          )}
          {modal === 'payment' && (
            <ExplorePlaceholderModal icon="06" title="Unlock All 30 Hacks">
              <div className="explore-payment-placeholder">
                <strong>₹19 Payment Placeholder</strong>
                <span>UPI ID: your-upi-id@placeholder</span>
                <span>QR code will be added here.</span>
              </div>
              <p>Add your real UPI details and QR code here later.</p>
            </ExplorePlaceholderModal>
          )}
          {modal === 'suggestion' && (
            <form
              className="explore-suggestion-form"
              onSubmit={(event) => { event.preventDefault(); setModal(null); }}
            >
              <span className="explore-modal-icon">＋</span>
              <h2>Suggest an Addition</h2>
              <p>Tell us what you want to see in Velo C.</p>
              <textarea
                value={suggestion}
                onChange={(event) => setSuggestion(event.target.value)}
                placeholder="Write your suggestion here..."
                rows={5}
                required
              />
              <button type="submit" className="explore-modal-primary">Submit Suggestion</button>
            </form>
          )}
        </ExploreModalFrame>
      )}
    </div>
  );
}

function ExploreReadMore({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="explore-read-more" onClick={onClick}>
      R E A D&nbsp;&nbsp;&nbsp;M O R E
    </button>
  );
}

function ExploreModalFrame({
  modal,
  onClose,
  children,
}: {
  modal: ExploreModal;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="explore-modal-backdrop" onClick={onClose}>
      <div className="explore-modal" role="dialog" aria-modal="true" aria-label={`${modal} dialog`} onClick={(event) => event.stopPropagation()}>
        <button type="button" className="explore-modal-close" onClick={onClose} aria-label="Close modal">×</button>
        {children}
      </div>
    </div>
  );
}

function ExplorePlaceholderModal({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="explore-placeholder-modal">
      <span className="explore-modal-icon">{icon}</span>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function ExploreListModal({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="explore-list-modal">
      <span className="explore-modal-icon">{icon}</span>
      <h2>{title}</h2>
      <div className="explore-list">
        {items.map((item, index) => (
          <div className="explore-list-item" key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Small reusable components ────────────────────────────────────────────────

function DropdownItem({
  icon,
  label,
  onClick,
  accent = false,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-left transition-all hover:bg-[rgba(0,240,255,0.08)] active:bg-[rgba(0,240,255,0.15)]"
      style={{ color: accent ? '#00b8cc' : '#374151' }}
    >
      {icon && <span className="flex-shrink-0 opacity-70">{icon}</span>}
      {label}
    </button>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-700 text-right truncate max-w-[180px]">{value}</span>
    </div>
  );
}

function PlaceholderSection({
  icon, title, subtitle, description, accent,
}: {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg"
        style={{ background: `rgba(${accent === '#00f0ff' ? '0,240,255' : '167,139,250'},0.1)`, border: `2px solid ${accent}30` }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{title}</h2>
        <p className="font-semibold mb-3" style={{ color: accent }}>{subtitle}</p>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">{description}</p>
      </div>
      {/* Placeholder block — user will replace with their own content */}
      <div
        className="w-full rounded-2xl p-6 mt-2"
        style={{ background: `rgba(${accent === '#00f0ff' ? '0,240,255' : '167,139,250'},0.05)`, border: `1px dashed ${accent}50` }}
      >
        <p className="text-gray-400 text-sm italic">
          ✏️ Replace this block with your own content
        </p>
      </div>
    </div>
  );
}

function CategoryCard({
  emoji,
  title,
  description,
  buttonLabel,
  onClick,
}: {
  emoji: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <div
      className="group w-full relative rounded-3xl p-7 flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-2"
      style={{
        background: 'linear-gradient(160deg, rgba(30,10,12,0.9), rgba(15,15,17,0.9))',
        border: '1px solid rgba(239,68,68,0.18)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
      >
        {emoji}
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed -mt-2">{description}</p>

      <div className="w-full mt-2">
        <button
          onClick={onClick}
          className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

/** Google "G" icon — small SVG */
function GoogleIcon({ white = false }: { white?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill={white ? '#fff' : '#4285F4'} d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill={white ? '#fff' : '#34A853'} d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill={white ? '#fff' : '#FBBC05'} d="M10.53 28.59c-.5-1.45-.79-3-.79-4.59s.29-3.14.79-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill={white ? '#fff' : '#EA4335'} d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    </svg>
  );
}
