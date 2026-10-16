import React, { useState, useRef, useEffect } from 'react';
import ParticleShowcase from './ParticleShowcase';
import { FaTelegram, FaYoutube, FaGithub, FaTimes, FaPaperPlane, FaRobot, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from './hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

// ─── Overlay types ────────────────────────────────────────────────────────────
type ActiveOverlay = 'explore' | 'profile' | 'contact' | null;
type ExploreModal = 'redeem' | 'config' | 'apps' | 'ai' | 'payment' | 'suggestion' | null;

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  // Overlay & menu state
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = () => {
    if (!contactMessage.trim()) {
      setToast('Please write your problem or feedback before sending.');
      return;
    }
    const subject = encodeURIComponent(`Velo C — Feedback/Problem from ${contactName || 'a visitor'}`);
    const body = encodeURIComponent(
      `Name: ${contactName || '—'}\nReply-to email: ${contactEmail || '—'}\n\nMessage:\n${contactMessage}`
    );
    window.location.href = `mailto:thecrackedxgaming@gmail.com?subject=${subject}&body=${body}`;
    setToast('Opening your email app — hit send to deliver your message!');
  };

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

  // Category Hub — the per-category page (Gaming APKs & Mods first, others follow later)
  type HubItem = {
    name: string;
    rating: string;
    downloadUrl?: string;
    description?: string;
    logo?: string;
  };
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedHubItem, setSelectedHubItem] = useState<HubItem | null>(null);

  const categoryData: Record<string, { title: string; items: HubItem[] }> = {
    gaming: {
      title: '🎮 Gaming APKs & Mods',
      items: [
        {
          name: "Cube Run",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/cube.run_17.apk",
          description: "Dodge, jump and slam through a neon 3-lane gauntlet. One-thumb 3D runner. Version 2.7, size 9.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/cube-run.png",
        },
        {
          name: "Chip Defense",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.chadenas.cpudefense_64.apk",
          description: "A tower defense game with a microprocessor theme Version 1.64, size 14.1 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/chip-defense.png",
        },
        {
          name: "Rechenzwerge",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.happybuers.rechenzettel_2058.apk",
          description: "Counting and math practice for preschool and elementary school. Version 0.1.58, size 9.1 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/rechenzwerge.png",
        },
        {
          name: "MOROway App",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.moroway.oc_100314.apk",
          description: "Play with the MORO model railroad… Version 10.3.14, size 12.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/moroway-app.png",
        },
        {
          name: "MoveAPiece: Offline Chess",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.schliweb.moveapiece_107002.apk",
          description: "Offline chess vs Stockfish or Maia, opening trainer, Pegasus & Chessnut boards Version 1.7.0, size 108.9 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/moveapiece-offline-chess.png",
        },
        {
          name: "Numbers & Letters",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/fr.pierre.chiffreslettres_134.apk",
          description: "Mental arithmetic and vocabulary game, no ads, no trackers Version 1.133, size 36.9 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/numbers-letters.png",
        },
        {
          name: "Oubliettes",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.all3f0r1.oubliettes_14.apk",
          description: "Dungeon logic puzzle: find the walls from the row and column counts Version 0.8, size 2.1 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/oubliettes.png",
        },
        {
          name: "Chogan",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.choganhq.chogan_20.apk",
          description: "Offline game collection: tower defence, sudoku, minesweeper, dots. Version 0.4.0, size 3.4 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/chogan.png",
        },
        {
          name: "TriPeaks NEUE",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.mimoguz.tripeaksneue_152.apk",
          description: "A simple Tri Peaks game. Version 0.9.63, size 18.7 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/tripeaks-neue.png",
        },
        {
          name: "Subster",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/app.subster_201.apk",
          description: "Music timeline party game that plays songs from your own Subsonic library Version 0.2.1, size 3.3 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/subster.png",
        },
        {
          name: "LetterBox",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/ch.cryptobit.letterbox_8.apk",
          description: "LetterBox is a simple kids game for learning letters Version 1.6.0, size 5.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/letterbox.png",
        },
        {
          name: "Flowit — Block Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.bytehamster.flowitgame_404.apk",
          description: "Fill all boxes with the color of their border Version 4.4, size 3.5 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/flowit-block-puzzle.png",
        },
        {
          name: "Square Chess",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.dataespresso.squarechess_14.apk",
          description: "Chess built for square screens, compact devices, e-ink and physical keyboards. Version 1.4.1, size 5.3 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/square-chess.png",
        },
        {
          name: "DragTree",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.flyboybyte.dragtree_172.apk",
          description: "NHRA Pro Tree reaction timer — accelerometer launch detection, no internet Version 1.7.4, size 31.8 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/dragtree.png",
        },
        {
          name: "Braincup - Brain Training",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.inspiredandroid.braincup_163.apk",
          description: "Train your focus, memory and math skills. Version 3.8.1, size 11.3 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/braincup-brain-training.png",
        },
        {
          name: "Quiet Grid: Logic Puzzles",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.quietgrid.app_39.apk",
          description: "Sudoku, Nonogram, Minesweeper, Word Search & more. No ads, fully offline. Version 1.9.0, size 8.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/quiet-grid-logic-puzzles.png",
        },
        {
          name: "Shattered Pixel Dungeon",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.shatteredpixel.shatteredpixeldungeon_922.apk",
          description: "A roguelike dungeon crawler RPG that's simple to get into but hard to master! Version 4.0.2, size 28.9 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/shattered-pixel-dungeon.png",
        },
        {
          name: "Arrow Escape: Infinite Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.arrowescape_132.apk",
          description: "Minimalist arrow puzzle game with infinite levels, zero ads, and total privacy Version 1.0.12, size 17.5 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/arrow-escape-infinite-puzzle.png",
        },
        {
          name: "Colorgram",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.colorgram_42.apk",
          description: "A free, open-source color logic puzzle game with no ads or tracking Version 1.0.3, size 8.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/colorgram.png",
        },
        {
          name: "Find Words: Word Search Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.findwords_22.apk",
          description: "Solve fun word search puzzles! Connect letters & challenge your brain Version 1.0.1, size 7.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/find-words-word-search-puzzle.png",
        },
        {
          name: "Hue Sort",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.huesort_42.apk",
          description: "A color sorting puzzle game. Swap tiles to reconstruct the hidden gradient. Version 1.0.3, size 7.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/hue-sort.png",
        },
        {
          name: "Ludo",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.ludo_22.apk",
          description: "Multiplayer Board Game Version 1.0.1, size 7.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ludo.png",
        },
        {
          name: "Match 3",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.match3_112.apk",
          description: "Minimal and open-source Match-3 puzzle game Version 1.0.10, size 8.2 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/match-3.png",
        },
        {
          name: "Nonogram",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.nonogram_82.apk",
          description: "A free, open-source picture logic puzzle game with no ads or tracking Version 1.0.7, size 8.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/nonogram.png",
        },
        {
          name: "Puzzle Games",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.puzzle_322.apk",
          description: "300+ minimalist brain games. Challenge your logic, memory & attention in game Version 2.0.4, size 12.2 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/puzzle-games.png",
        },
        {
          name: "Queens",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.queens_102.apk",
          description: "Challenging crown-placement logic puzzle. Infinite levels. No tracking & ads. Version 1.0.9, size 16.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/queens.png",
        },
        {
          name: "Screw Jam",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.screwjam_82.apk",
          description: "Unscrew plates, match colors with active toolboxes Version 1.0.7, size 8.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/screw-jam.png",
        },
        {
          name: "Unciv",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.unciv.app_1269.apk",
          description: "Open source 4X civilization-building game Version 4.22.8, size 26.3 MB. Open source (MPL-2.0). Direct download from F-Droid.",
          logo: "/unciv.png",
        },
        {
          name: "SudoQ",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.sudoq_65.apk",
          description: "Play many sudoku types, with many assistances, all offline. Version 3.3.3, size 2.8 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/sudoq.png",
        },
        {
          name: "TABI",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/dev.lorsupra.tabi_7.apk",
          description: "Learn Japanese from zero in about five minutes a day. Version 2.3.0, size 1.7 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/tabi.png",
        },
        {
          name: "Mindustry",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.anuke.mindustry_1115.apk",
          description: "An open-ended factory management game with RTS and tower defense elements Version 8-fdroid-160.7, size 74.6 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/mindustry.png",
        },
        {
          name: "Open Patience",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.d_rk.openpatience_122.apk",
          description: "Free, open-source Klondike & FreeCell solitaire — no ads, no tracking Version 1.1.2, size 19.8 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/open-patience.png",
        },
        {
          name: "Puzzle Press",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.munzzyy.puzzlepress_10004.apk",
          description: "Seven daily word and logic puzzles. Offline, no ads, no account. Version 1.0.4, size 1.2 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/puzzle-press.png",
        },
        {
          name: "Cat Hunt",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.xtratter.cathunt_8.apk",
          description: "A game for cats: mice, bugs, a fish, a butterfly and a laser dot to catch Version 1.7, size 77 KB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/cat-hunt.png",
        },
        {
          name: "Breakout 71",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/me.lecaro.breakout_29856652.apk",
          description: "Break colourful bricks, catch bouncing coins and select powerful upgrades ! Version 29856652, size 540 KB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/breakout-71.png",
        },
        {
          name: "Lichess",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.lichess.mobileV2_290103.apk",
          description: "The one open-source chess platform Version 0.29.1, size 69.6 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/lichess.png",
        },
        {
          name: "Open Sudoku",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.moire.opensudoku_20261008.apk",
          description: "Open Sudoku is an Open Source Sudoku game. Version 4.11.3, size 18.5 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/open-sudoku.png",
        },
        {
          name: "99Managers Futsal Edition",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org99managers.futsal_edition_19.apk",
          description: "A futsal management game with a 2D match engine and integrated editor. Version v0.9.2, size 46.2 MB. Open source (AGPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/99managers-futsal-edition.png",
        },
        {
          name: "TheXTech",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/ru.wohlsoft.thextech.fdroid_1070400.apk",
          description: "2D-platformer game engine Version 1.7.4, size 26.7 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/thextech.png",
        },
        {
          name: "Waste Works",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/studio.coldstream.waste_works_162.apk",
          description: "A casual recycling clicker: take trash apart, find valuables, equip your worker Version 0.2.0, size 24.1 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/waste-works.png",
        },
        {
          name: "Principia",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.bithack.principia_45.apk",
          description: "Physics-based sandbox building game Version 2026.09.19, size 28.7 MB. Open source (BSD-3-Clause). Direct download from F-Droid.",
          logo: "/principia.png",
        },
        {
          name: "CBG -- Clavierhaus BackGammon",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.clavierhaus.gnubg_103.apk",
          description: "The complete GNU Backgammon engine: play, coach, rollouts, career. Offline. Version 1.0.3, size 37.4 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/cbg-clavierhaus-backgammon.png",
        },
        {
          name: "Cards With Cats",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.dozingcatsoftware.cardswithcats_11.apk",
          description: "Play Hearts, Spades, and duplicate bridge with cat opponents and partners Version 1.5.0, size 65.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/cards-with-cats.png",
        },
        {
          name: "Egyptian Mouse Pounce",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.dozingcatsoftware.mouse_pounce_10.apk",
          description: "Play Egyptian Rat Screw against humans or cats. Version 1.6.0, size 59.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/egyptian-mouse-pounce.png",
        },
        {
          name: "Idle Fantasy",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.tristinbaker.idlefantasy_157000.apk",
          description: "Idle RPG: train skills, fight dungeons, craft gear. No ads, no accounts. Version 1.15.7, size 10.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/idle-fantasy.png",
        },
        {
          name: "Sudoku You",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.galaxyrio.sudokusolver_9.apk",
          description: "Offline Sudoku with logical hints, advanced notes and flexible import/export Version 3.0.1, size 4.4 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/sudoku-you.png",
        },
        {
          name: "Endless Sky",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.github.thewierdnut.endless_mobile_62.apk",
          description: "Android port of endless-sky space trading game. Version 0.11.3-62, size 88.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/endless-sky.png",
        },
        {
          name: "Desktop Mascot",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.ekinao.desktopmascot_1.apk",
          description: "A customizable animated mascot for your Android screen Version 1.0.0, size 1.1 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/desktop-mascot.png",
        },
        {
          name: "Andropolis",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.ds17f.andropolis_8.apk",
          description: "Classic city building: an open-source Android port of Micropolis (SimCity). Version 0.1.7, size 5.8 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/andropolis.png",
        },
        {
          name: "Social Deduction Game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.jens_3.socialdeductiongame_3.apk",
          description: "Offline game-master assistant for Werewolf, Mafia and social deduction games Version 1.0.1, size 10.8 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
        },
        {
          name: "Chess Puzzles",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/dk.cocode.chess_5020.apk",
          description: "Offline chess tactics from real Lichess puzzles. No account, ads, or tracking Version 0.5.20, size 1.3 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/chess-puzzles.png",
        },
        {
          name: "The Last Carrot",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.acidefluorhydrique.carrot_4.apk",
          description: "A cheerful tower defence game with no ads, no trackers and no permissions Version 1.1.2, size 2.6 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/the-last-carrot.png",
        },
        {
          name: "Regex Crossword",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.cuso4deposit.regexcrossword_3.apk",
          description: "Offline regex-crossword puzzles in hexagon and rectangle grids. Version 0.2.1, size 1.1 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/regex-crossword.png",
        },
        {
          name: "Dima Defense ⚔️",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.xolatgames.dima.defense_17.apk",
          description: "A simple Tower Defense game that was made in LibGDX Version 1.1.2, size 12.0 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/dima-defense.png",
        },
        {
          name: "Astro Loop",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.astroloop.game_5.apk",
          description: "Open-source roguelike shooter. Simple to play, no ads, no tracking, offline. Version 1.4, size 50.5 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/astro-loop.png",
        },
        {
          name: "BlockDrop: Block Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.blockdrop.game_652.apk",
          description: "Free and open source block-stacking puzzle game. Arrange falling shapes to clear Version 1.0.68, size 20.6 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/blockdrop-block-puzzle.png",
        },
        {
          name: "King Pong",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.kingalex.kingpong_7.apk",
          description: "Retro Pong campaign with multiplayer and a secret ending Version 1.1.3, size 362 KB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/king-pong.png",
        },
        {
          name: "Sudoku",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.likhithpraveenk.sudoku_62.apk",
          description: "A clean Sudoku app with logic-based difficulty and helpful assists Version 1.1.0, size 17.8 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/sudoku.png",
        },
        {
          name: "Block Blast",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.blockblast_42.apk",
          description: "A minimal, privacy-focused block puzzle game Version 1.0.3, size 7.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/block-blast.png",
        },
        {
          name: "Jigsaw Solitaire",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.jigsaw_32.apk",
          description: "A beautifully tactile, relaxing jigsaw puzzle game Version 1.0.2, size 13.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/jigsaw-solitaire.png",
        },
        {
          name: "Matrix Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.matrixpuzzle_32.apk",
          description: "A minimal, open-source matrix puzzle game also known as floor puzzle Version 1.0.2, size 7.9 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/matrix-puzzle.png",
        },
        {
          name: "Auvae — growing close",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.attarsherz.auvae_1.apk",
          description: "257 questions that bring people genuinely close. No account, no ads. Version 1.0.0, size 1.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/auvae-growing-close.png",
        },
        {
          name: "Minesweeper",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.johnathan.minesweeper_9.apk",
          description: "Beautiful Minesweeper. No ads, no trackers, no permissions. Version 1.8, size 959 KB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/minesweeper.png",
        },
        {
          name: "GCompris",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/net.gcompris.full_260201.apk",
          description: "Multi-Activity Educational game for children 2 to 10 Version 26.2, size 76.2 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/gcompris.png",
        },
        {
          name: "TreasureHunt",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/nodomain.neonbranch.treasurehunt_83.apk",
          description: "Be active, go treasure hunting! Version 0.7.2, size 27.7 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/treasurehunt.png",
        },
        {
          name: "Slitherlink: Logic Loop Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.slitherlink_12.apk",
          description: "Connect the dots to form a single continuous loop. Pure, relaxing logic puzzle. Version 1.0.0, size 7.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/slitherlink-logic-loop-puzzle.png",
        },
        {
          name: "Mental Math",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.helddertierwelt.mentalmath_28.apk",
          description: "Practice mental arithmetic solo or compete with friends. Version 28, size 5.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/mental-math.png",
        },
        {
          name: "Kakuro",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.kakuro_12.apk",
          description: "Solve Kakuro puzzles! The addictive blend of Sudoku and crossword sums. Version 1.0.0, size 7.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/kakuro.png",
        },
        {
          name: "Gridle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.billthefarmer.gridle_125.apk",
          description: "Word game Version 1.25, size 2.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/gridle.png",
        },
        {
          name: "Bubble Penetration",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.codeberg.scovillo.bubble_5.apk",
          description: "Fast arcade action: collect colors, chain combos, beat the highscore. Version 1.4, size 12.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/bubble-penetration.png",
        },
        {
          name: "freeminer",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.freeminer.freeminer_5170000.apk",
          description: "Voxel-based multiplayer game platform Version 5.17.0, size 132.5 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/freeminer.png",
        },
        {
          name: "Binary Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.binarypuzzle_22.apk",
          description: "A minimalist binary placement logic puzzle game. Version 1.0.1, size 7.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/binary-puzzle.png",
        },
        {
          name: "Learn Math",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.learnmath_42.apk",
          description: "A modern, fast, and tactile mental math training game Version 1.0.3, size 8.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/learn-math.png",
        },
        {
          name: "Battleship",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.cocode.battleship_1000013.apk",
          description: "Offline naval combat against an AI opponent, with no ads and no account Version 1.0.13, size 1.2 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/battleship.png",
        },
        {
          name: "Tangram",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.xmission.trevin.android.tangram_90001.apk",
          description: "Make or solve Tangram puzzles Version 0.9.0, size 3.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/tangram.png",
        },
        {
          name: "Fairy Mahjong",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.fairytrick.fairymahjong_5.apk",
          description: "Clear a layered garden board with a four-slot matching hand Version 0.1.4, size 69.6 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/fairy-mahjong.png",
        },
        {
          name: "Chess",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/jwtc.android.chess_298.apk",
          description: "Chess program and FICS client Version 10.6.0, size 3.4 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/chess.png",
        },
        {
          name: "The Battle for Wesnoth",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.wesnoth.Wesnoth_1192800002.apk",
          description: "A turn-based strategy game with a high fantasy theme Version 1.19.28, size 56.3 MB. Open source (GPL-2.0-or-later). Direct download from F-Droid.",
          logo: "/the-battle-for-wesnoth.png",
        },
        {
          name: "Ham Test",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.hazelhope.dubster.hamtest_122.apk",
          description: "Prepare for and pass all three US Amateur Radio license exams Version 1.2.2, size 9.5 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/ham-test.png",
        },
        {
          name: "PlayHex",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.playhex.twa_2026091900.apk",
          description: "Play Hex board game online Version 1.0.0.10, size 990 KB. Open source (AGPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/playhex.png",
        },
        {
          name: "Feudal Tactics",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.sesu8642.feudaltactics_20.apk",
          description: "Strategy game with countless unique and challenging levels. Version 1.5.5, size 9.4 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/feudal-tactics.png",
        },
        {
          name: "Shikaku",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.shikaku_12.apk",
          description: "A minimalist block logic puzzle game Version 1.0.0, size 7.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/shikaku.png",
        },
        {
          name: "Janken (Rock Paper Scissors)",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.attenomy.janken_1.apk",
          description: "Modern offline Rock Paper Scissors with private Pass & Play, Bot AI and RPSLS. Version 1.0.0, size 1.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/janken-rock-paper-scissors.png",
        },
        {
          name: "Accelerrace",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.asafonov.accelerace_12.apk",
          description: "Simple HTML5 racing game made just for fun. Version 0.12, size 890 KB. Open source (MIT). Direct download from F-Droid.",
          logo: "/accelerrace.png",
        },
        {
          name: "Mines3D",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/cos.premy.mines_16.apk",
          description: "Do you like challenges? Try two leveled mines. Version 1.7.1, size 1.9 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/mines3d.png",
        },
        {
          name: "Infra Arcana",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/camp.werewolf.infraarcana_23000009.apk",
          description: "Infra Arcana - a Lovecraftian horror roguelike Version 23.0.0.9, size 58.4 MB. Open source (AGPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/infra-arcana.png",
        },
        {
          name: "Andor's Trail",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.gpl.rpg.AndorsTrail_89.apk",
          description: "Quest-driven RPG Version 0.8.18, size 100.1 MB. Open source (GPL-2.0-only). Direct download from F-Droid.",
          logo: "/andor-s-trail.png",
        },
        {
          name: "Bubble Shooter",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.bubbleshooter_22.apk",
          description: "A modern 2D bubble shooter puzzle game Version 1.0.1, size 7.9 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/bubble-shooter.png",
        },
        {
          name: "Orion Master",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.tallydigital.oomdroid_5.apk",
          description: "Native 1oom port of Master of Orion (1993). Requires your own LBX files Version 1.0.4, size 8.1 MB. Open source (GPL-2.0-only). Direct download from F-Droid.",
          logo: "/orion-master.png",
        },
        {
          name: "Abstract Dots and Lines",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.towerillusion.abdal_1.apk",
          description: "Abstract Dots and Lines is a libre implementation of a pen-and-paper game. Version 1.0.0, size 33.1 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/abstract-dots-and-lines.png",
        },
        {
          name: "Freebloks",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.saschahlusiak.freebloks_184.apk",
          description: "Strategy board game similar to the famous board game Blokus Version 1.8.4, size 5.7 MB. Open source (GPL-2.0-only). Direct download from F-Droid.",
          logo: "/freebloks.png",
        },
        {
          name: "Forkyz",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/app.crossword.yourealwaysbe.forkyz_8600000.apk",
          description: "Crossword puzzles application, download and play. Version 86, size 10.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/forkyz.png",
        },
        {
          name: "Hue Spill",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.huespill_22.apk",
          description: "Fill the entire board with a single color. Version 1.0.1, size 7.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/hue-spill.png",
        },
        {
          name: "TacticMaster",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.tacticmaster_43.apk",
          description: "Chess tactic trainer based on https://database.lichess.org/#puzzles. Version 1.0.43, size 17.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/tacticmaster.png",
        },
        {
          name: "Easter Eggs",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.dede.android_eggs_81.apk",
          description: "Collections the Android release Easter Egg. Version 5.5.0, size 6.0 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/easter-eggs.png",
        },
        {
          name: "Einstein's Riddle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.einsteinriddle_52.apk",
          description: "Einstein's Riddle (also known as the Zebra Puzzle) Version 1.0.4, size 8.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/einstein-s-riddle.png",
        },
        {
          name: "Triple Match",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.triplematch_12.apk",
          description: "A minimal, open-source 3D tile-matching puzzle game. Version 1.0.0, size 7.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/triple-match.png",
        },
        {
          name: "werewolves_game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.davidchilin.werewolves_game_4.apk",
          description: "Multiplayer server for Mafia party game Werewolves. Plays in webbrowser on WiFi. Version 4, size 22.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/werewolves-game.png",
        },
        {
          name: "500 - Multiplayer card game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.rotundtapir.fivehundred_19.apk",
          description: "Play 500, the Australian trick-taking card game — bots or friends online. Version 0.6.5, size 15.6 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/500-multiplayer-card-game.png",
        },
        {
          name: "Guandan 掼蛋",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/page.codeberg.lanticy.guandan_7.apk",
          description: "Guandan card game for four players over local Wi-Fi. No server, no account. Version 1.2.2, size 1.5 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/guandan.png",
        },
        {
          name: "Gauguin",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.piepmeyer.gauguin_77.apk",
          description: "A Sudoku-like logic game Version 0.52.1, size 12.5 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/gauguin.png",
        },
        {
          name: "Brick Blast",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.mostafa.brickblast_10.apk",
          description: "Turn-based brick breaker: aim, shoot, bounce and clear the bricks. Version 1.6.0, size 2.9 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/brick-blast.png",
        },
        {
          name: "Boardgame Pal",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.schwarz.boardgamepal_3.apk",
          description: "Dice, score counter, starting-player draw & more – 100% free and ad-free! Version 1.2, size 12.2 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/boardgame-pal.png",
        },
        {
          name: "Luanti",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/net.minetest.minetest_5170000.apk",
          description: "Voxel-based multiplayer game platform Version 5.17.0, size 41.1 MB. Open source (LGPL-2.1-or-later). Direct download from F-Droid.",
          logo: "/luanti.png",
        },
        {
          name: "I Keep Having This Dream",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.fireflame.dream_101.apk",
          description: "Build a path of tiles to escape each cycle of a dangerous recurring dream Version 1.0.1, size 65.8 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/i-keep-having-this-dream.png",
        },
        {
          name: "Wortmühle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.huepping.wortmuehle_3.apk",
          description: "Daily German word puzzle — 9 letters, one pangram, fully offline Version 1.2, size 3.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/wortm-hle.png",
        },
        {
          name: "Doors of Doom",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.github.msx80.doorsofdoom_10.apk",
          description: "Adventure into the dungeon of infinite doors! Behind each, a monster awaits! Version 0.0.10, size 8.2 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/doors-of-doom.png",
        },
        {
          name: "VCMI",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/is.xyz.vcmi_17501.apk",
          description: "Engine recreation for Heroes of Might and Magic III Version 1.7.5, size 35.8 MB. Open source (GPL-2.0-or-later). Direct download from F-Droid.",
          logo: "/vcmi.png",
        },
        {
          name: "Brogue CE Android",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.broguece.game_1150123.apk",
          description: "Brogue CE Android - a classic dungeon crawling roguelike Version 1.15.1.23, size 12.6 MB. Open source (AGPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/brogue-ce-android.png",
        },
        {
          name: "Dooz",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.yamin8000.dooz_23.apk",
          description: "A Tic-Tac-Tao clone, a simple pen-and-paper game Version 1.0.23, size 1.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/dooz.png",
        },
        {
          name: "Ricochlime",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.adilhanney.ricochlime_1140002.apk",
          description: "Satisfying monster shooter Version 1.14.0, size 20.9 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/ricochlime.png",
        },
        {
          name: "Eve Game Tracker",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eve.game.tracker_2.apk",
          description: "Track card game results. Version 0.1.1, size 2.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/eve-game-tracker.png",
        },
        {
          name: "FaFa Runner",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.chenyifaer.fafarunner_397.apk",
          description: "Enjoy smooth gameplay, stunning graphics, and endless fun Version 3.2.2, size 34.6 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/fafa-runner.png",
        },
        {
          name: "Futoshiki",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.hexcorp.futoshiki_5.apk",
          description: "A clean, modern Futoshiki logic puzzle game Version 1.4, size 10.2 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/futoshiki.png",
        },
        {
          name: "Classic Tic Tac Toe",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.itsfrz.tictactoe_5.apk",
          description: "Fun with emoji naughts and crosses Version 1.0.5, size 16.9 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/classic-tic-tac-toe.png",
        },
        {
          name: "MA Alchemist",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vayunmathur.games.alchemist_20260804.apk",
          description: "Start with the four basic elements and create anything! Version v2.6.5, size 4.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ma-alchemist.png",
        },
        {
          name: "MA Pipes",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vayunmathur.games.pipes_20260804.apk",
          description: "A numberlink-style game Version v2.6.5, size 3.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ma-pipes.png",
        },
        {
          name: "MA Solitaire",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vayunmathur.games.solitaire_20260804.apk",
          description: "An open source solitaire game Version v2.6.5, size 3.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ma-solitaire.png",
        },
        {
          name: "Nian",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.wordgame.nian_11.apk",
          description: "Collection of word games in Swedish Version 1.6, size 4.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/nian.png",
        },
        {
          name: "AAAAXY",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.divverent.aaaaxy_107302394.apk",
          description: "A nonlinear 2D puzzle platformer taking place in impossible spaces. Version 1.7.239+20260804.4198.805e2a0b, size 44.5 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/aaaaxy.png",
        },
        {
          name: "MA Chess",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vayunmathur.games.chess_20260731.apk",
          description: "An open-source chess app. Version v2.6.4, size 92.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ma-chess.png",
        },
        {
          name: "MA Unblock Jam",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vayunmathur.games.unblockjam_20260731.apk",
          description: "A private and open source version of the classic board game \"Rush Hour\" Version v2.6.4, size 3.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ma-unblock-jam.png",
        },
        {
          name: "MA Word Maker",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vayunmathur.games.wordmaker_20260731.apk",
          description: "A fun word puzzle game, completely private and offline Version v2.6.4, size 9.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ma-word-maker.png",
        },
        {
          name: "Navy Fleet Battle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/net.tigr.navyfleetbattle_8.apk",
          description: "The classic Russian sea battle game, for one player or two Version 1.3.4, size 2.0 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/navy-fleet-battle.png",
        },
        {
          name: "Free Klondike",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.free.klondike_3.apk",
          description: "A unique solitaire game combining FreeCell and Klondike with strategic gameplay. Version 2.0.1, size 6.5 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/free-klondike.png",
        },
        {
          name: "PySolFC",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.lufebe16.pysolfc_102130601.apk",
          description: "PySolFC is a collection of solitaire card games Version 3.6.1, size 71.2 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/pysolfc.png",
        },
        {
          name: "2048 Open Fun Game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.andstatus.game2048_47.apk",
          description: "2048 game with AI, Replay, History and other fun features, Open Source, no ads Version 1.16.2, size 1.3 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/2048-open-fun-game.png",
        },
        {
          name: "Paper Loop 2",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/paper.loop2_32.apk",
          description: "Grow your turf and slice other sneks' tails — a free-movement territory game. Version 1.0.2, size 29.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/paper-loop-2.png",
        },
        {
          name: "Plutonic",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.game.plutonic_72.apk",
          description: "Suika physics-based planet shooter Version 1.1.1, size 26.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/plutonic.png",
        },
        {
          name: "CrossWords",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.eehouse.android.xw4_204.apk",
          description: "A Scrabble-like game Version 4.4.208, size 7.3 MB. Open source (GPL-2.0-only). Direct download from F-Droid.",
          logo: "/crosswords.png",
        },
        {
          name: "Battle for Burgers 🍔🍔🍔",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.xolatgames.burgers_7.apk",
          description: "An Online-Multiplayer game. Collect so much more burgers as you can. Version 1.6.0, size 28.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/battle-for-burgers.png",
        },
        {
          name: "Edge Roll",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/edge.roll_11.apk",
          description: "Tumble a cube across a crumbling tile bridge. One-thumb 3D arcade. Version 1.1.2, size 6.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/edge-roll.png",
        },
        {
          name: "LCDPet",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/today.notfeelingit.lcdpet_2.apk",
          description: "Tiny offline LCD-style virtual pet for Android Version 1.1, size 8.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/lcdpet.png",
        },
        {
          name: "Live Wallpaper Dino Game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.helloworld3003.livewallpaperdinogame_4.apk",
          description: "A fully playable, retro Chrome Dino runner game on your home screen. Version 1.4.0, size 11.8 MB. Open source (MIT). Direct download from F-Droid.",
        },
        {
          name: "Mobapp Game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.vipaol.mobapp.game_23.apk",
          description: "Minimalist physics arcade: speed, flips, built-in editor Version v0.9.7, size 375 KB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/mobapp-game.png",
        },
        {
          name: "Paper Loop",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/paper.loop_12.apk",
          description: "Grow your turf and slice rival sneks' tails — an offline territory game. Version 1.0.0, size 29.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/paper-loop.png",
        },
        {
          name: "Vector Pinball",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.dozingcatsoftware.bouncy_43.apk",
          description: "Pinball game Version 1.16.0, size 3.1 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/vector-pinball.png",
        },
        {
          name: "Stack Tower 3D",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/stack.tower3d_1.apk",
          description: "Stack sliding blocks into the tallest tower you can. One-tap 3D arcade. Version 1.0.0, size 4.3 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/stack-tower-3d.png",
        },
        {
          name: "Golden Ticket",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.golden_ticket.golden_ticket_35.apk",
          description: "Lottery simulation game - explore strategies without spending money Version 4.10.1, size 164.6 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/golden-ticket.png",
        },
        {
          name: "Mill",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.calcitem.sanmill_5584.apk",
          description: "A Mill Game which supports many rule variants, written in Flutter Version 7.4.6, size 53.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/mill.png",
        },
        {
          name: "Flang",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.tadris.flang_26.apk",
          description: "A board game similar to chess Version 1.23, size 7.9 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/flang.png",
        },
        {
          name: "Roboyard",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.z11.roboyard_140.apk",
          description: "Problem-solving game - find the optimal moves to move one robot to its target Version 52, size 11.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/roboyard.png",
        },
        {
          name: "HyleX (Entropy / Hyle 7)",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.jepfa.hyle_x_1010002.apk",
          description: "Chaos against Order: An Entropy / Hyle 7 like board game Version 1.1.0, size 22.0 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/hylex-entropy-hyle-7.png",
        },
        {
          name: "Tessel – A tile game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/net.vantulder.tessel_10023.apk",
          description: "Place tiles with matching colors to make shapes and fill the board. Version 1.0.23, size 3.4 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/tessel-a-tile-game.png",
        },
        {
          name: "Block'Buster",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.asafonov.blockbuster_12.apk",
          description: "Simple HTML5 arkanoid-type game Version 1.6, size 189 KB. Open source (MIT). Direct download from F-Droid.",
          logo: "/block-buster.png",
        },
        {
          name: "Pictionary Generator",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/red.pictionary_generator_123.apk",
          description: "A Pictionary-ish Word Generator Version 1.1.8, size 15.9 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/pictionary-generator.png",
        },
        {
          name: "Impostor MX",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.impostormx.org_42.apk",
          description: "Classic multiplayer party game, now digital and open source Version 2.2.0, size 22.7 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/impostor-mx.png",
        },
        {
          name: "Cat a shooter 😼",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.xolatgames.catashoot_6.apk",
          description: "Fly in the space by the cat 😼, and shoots off from enemies 🛸 Version 1.0.0, size 56.2 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/cat-a-shooter.png",
        },
        {
          name: "Tri PeaksSolitaire for Android",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.tri.peaks_4.apk",
          description: "TriPeaks Solitaire for Android is a card game. Version 1.2.1, size 1.5 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/tri-peakssolitaire-for-android.png",
        },
        {
          name: "Collective Club Maze",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.qwde.ccm_5.apk",
          description: "A game similar to the board game ricochet robots. Version first, size 53.7 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/collective-club-maze.png",
        },
        {
          name: "Blichess",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vovagorodok.blichess_29.apk",
          description: "Play lichess games over Bluetooth Version 8.0.0+ble2.5.1, size 59.2 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/blichess.png",
        },
        {
          name: "Turns of War",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.github.msx80.turnsofwar_3.apk",
          description: "A pixelart styled turn based strategy game Version 0.0.3, size 9.1 MB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/turns-of-war.png",
        },
        {
          name: "Tile Match",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/infrared.tilematch_1.apk",
          description: "Match, tap, and clear your way to victory! Version 1.0.0, size 14.1 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/tile-match.png",
        },
        {
          name: "FLARE",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.flare.app_115.apk",
          description: "An action RPG with gameplay alike to the games in the Diablo series Version 1.15, size 10.4 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/flare.png",
        },
        {
          name: "Frogue",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.necrashter.natural_revenge_4.apk",
          description: "3D FPS with Boss Fights and Randomized Weapons Version 1.0.2, size 19.8 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/frogue.png",
        },
        {
          name: "jSlide2",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/fdr.ioi.jslide2_1001110.apk",
          description: "A short 3D Platformer with an Online Highscore and viewable Replays. Version 1.0.10111_FDroid, size 27.3 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/jslide2.png",
        },
        {
          name: "Politrics",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.politrics_2.apk",
          description: "Politrics is a strategic board game inspired by Chess, where strategy and tactic Version 1.0.1, size 4.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/politrics.png",
        },
        {
          name: "Blidraughts",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vovagorodok.blidraughts_3.apk",
          description: "Play draughts games over Bluetooth Version 2.3.0+ble2.5.1, size 35.1 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/blidraughts.png",
        },
        {
          name: "Colors Overflow",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.colors.overflow_2.apk",
          description: "Colors Overflow is a very simple but very addictive board game developed by Velb Version 1.0.1, size 3.7 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/colors-overflow.png",
        },
        {
          name: "Ithaka Board Game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.ithaka.board.game_7.apk",
          description: "Ithaka board game is played on a four by four square grid with three pieces in e Version 1.5.1, size 3.9 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/ithaka-board-game.png",
        },
        {
          name: "Scribe4",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.scribe4_4.apk",
          description: "Scribe4 is a logical game developed by Mark Steere. Version 1.2.1, size 98 KB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/scribe4.png",
        },
        {
          name: "Tuty Fruty Slot for Android",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.tuty.fruty.slot_5.apk",
          description: "This is a playing for fun slot machine game (no gambling). It has five reels, th Version 1.12.1, size 647 KB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/tuty-fruty-slot-for-android.png",
        },
        {
          name: "DuckRun",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/de.informationsanarchistik.teapot.megamichi.duckrun_311.apk",
          description: "A game about a duck Version 3.1.1, size 55.7 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/duckrun.png",
        },
        {
          name: "Anarch RE",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/dev.serwin.AnarchRE_4.apk",
          description: "Public domain from-scratch suckless Doom clone Version 4, size 3.6 MB. Open source (CC0-1.0). Direct download from F-Droid.",
          logo: "/anarch-re.png",
        },
        {
          name: "Fish Rings Puzzle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/eu.veldsoft.fish.rings_6.apk",
          description: "Fish Rings Puzzle game developed by Velbazhd Software LLC (c) 2005-2026 Version 1.23, size 4.8 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/fish-rings-puzzle.png",
        },
        {
          name: "Cavern Cravers",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.game.caverncravers_32.apk",
          description: "A roguelike turn-based virtual board game Version 0.9.2, size 26.2 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/cavern-cravers.png",
        },
        {
          name: "Bouncy",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.ebraminio.bouncy_1.apk",
          description: "A tiny bouncing ball that plays musical notes when it hits the walls. Version 0.0.1, size 21 KB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/bouncy.png",
        },
        {
          name: "Bim!",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/bim.app_1600.apk",
          description: "An online multiplayer mobile game of the last man standing genre Version 16, size 30.9 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/bim.png",
        },
        {
          name: "SubSonicSter",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/rocks.langhaarschneider.subsonicster_12.apk",
          description: "Play Hitster card game with your own SubSonic music server Version 2.2.1, size 18.3 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/subsonicster.png",
        },
        {
          name: "Egg Returns Home",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.yepgoryo.EggReturnsHome_1.apk",
          description: "A simple platformer about an egg Version 1.6, size 82.9 MB. Open source (CC0-1.0). Direct download from F-Droid.",
          logo: "/egg-returns-home.png",
        },
        {
          name: "Word Tracer",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.wordtracer.app_22.apk",
          description: "A crossword-like puzzle game Version 1.0.22, size 6.4 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/word-tracer.png",
        },
        {
          name: "Collect the Cookies!",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/nodomain.collectthecookies_1.apk",
          description: "Collect cookies in this fun idle-ish game Version 1.0.0, size 40.7 MB. Open source (CC0-1.0). Direct download from F-Droid.",
          logo: "/collect-the-cookies.png",
        },
        {
          name: "BabbyPaint",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/dev.alexjyong.babbypaint_9.apk",
          description: "Simple little paint application for kids. Version 0.1.2, size 4.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/babbypaint.png",
        },
        {
          name: "WordleSolver",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.billthefarmer.solver_113.apk",
          description: "Solve Wordle and Gurgle puzzles Version 1.13, size 835 KB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/wordlesolver.png",
        },
        {
          name: "DropCount",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.jdanders.dropcount_1.apk",
          description: "A recreation of the classic Drop7 puzzle game for Android Version 1.0, size 5.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
        },
        {
          name: "Dungeon Crawl Stone Soup",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.develz.crawl_40.apk",
          description: "A roguelike adventure through dungeons in a quest to find the Orb of Zot Version 0.34.1-3-ga2c7840dd7, size 57.2 MB. Open source (GPL-2.0-or-later). Direct download from F-Droid.",
          logo: "/dungeon-crawl-stone-soup.png",
        },
        {
          name: "FinalRozGameNew",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.codeberg.rozworld.finalrozgamenew_1.apk",
          description: "A pixel art 2D speedrun platformer featuring 17 levels and isometric mechanics. Version 1.0.0, size 96.2 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/finalrozgamenew.png",
        },
        {
          name: "Latin Defense",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.github.bommbomm34.latindefense_10.apk",
          description: "Expand your own Roman Empire! Version 1.3.1, size 41.2 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/latin-defense.png",
        },
        {
          name: "Play Maker",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/nodomain.playmaker_23.apk",
          description: "Play or create your own platformer levels Version 1.15.2, size 42.7 MB. Open source (CC0-1.0). Direct download from F-Droid.",
          logo: "/play-maker.png",
        },
        {
          name: "Gurgle",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.billthefarmer.gurgle_136.apk",
          description: "Word game Version 1.36, size 1.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/gurgle.png",
        },
        {
          name: "Burger Party",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.agateau.burgerparty_36.apk",
          description: "Are you fast enough to put together the burgers ordered by your customers? Version 1.4.6, size 8.4 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/burger-party.png",
        },
        {
          name: "Africa Quiz",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.mufradat.africaquiz_1.apk",
          description: "Quiz game testing your knowledge of African capital cities Version 1.0, size 7.6 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/africa-quiz.png",
        },
        {
          name: "Sudoku (Privacy Friendly)",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.secuso.privacyfriendlysudoku_101.apk",
          description: "(SECUSO) Privacy Friendly Sudoku without permissions or advertising Version 3.2.6, size 5.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/sudoku-privacy-friendly.png",
        },
        {
          name: "Sudaku - Pattern-driven sudoku",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.gitea.theoden8.sudaku_11.apk",
          description: "Find patterns to solve sudoku - your sudoku workhorse handles the grunt work Version 0.1.1, size 48.4 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/sudaku-pattern-driven-sudoku.png",
        },
        {
          name: "Jigsaw",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/io.gitlab.derjosef.jigsaw_10302.apk",
          description: "A Jigsaw Puzzle Game Version 1.3.0, size 17.7 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/jigsaw.png",
        },
        {
          name: "Crossword",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.billthefarmer.crossword_126.apk",
          description: "Simple crossword solver Version 1.26, size 506 KB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/crossword.png",
        },
        {
          name: "Open Surge: retro game engine",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.opensurge2d.surgeengine_30650.apk",
          description: "A retro game engine with a fun platformer inspired by 16-bit Sonic games. Version 6.1.3.0-fdroid, size 43.0 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/open-surge-retro-game-engine.png",
        },
        {
          name: "Battleship Game (Privacy Friendly)",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.secuso.privacyfriendlybattleship_101.apk",
          description: "(SECUSO) Play the battleship game on your smartphone without ads or permissions. Version 2.0.0, size 5.6 MB. Open source (GPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/battleship-game-privacy-friendly.png",
        },
        {
          name: "Mancala",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.willie.mancala_12.apk",
          description: "Mancala Game Version 1.2, size 2.1 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/mancala.png",
        },
        {
          name: "Libre Memory Game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.quentin_bettoum.librememorygame_9.apk",
          description: "A memory game Version 1.2.0, size 61.8 MB. Open source (AGPL-3.0-only). Direct download from F-Droid.",
          logo: "/libre-memory-game.png",
        },
        {
          name: "Stendhal Game",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.stendhalgame.client_1049000.apk",
          description: "A multiplayer adventure with classic 2D graphics Version 1.49, size 11.2 MB. Open source (GPL-2.0-or-later). Direct download from F-Droid.",
          logo: "/stendhal-game.png",
        },
        {
          name: "Li-Ri",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/org.liri.liri_30106.apk",
          description: "Li-Ri is a arcade game where you drive a toy wood engine. Version 3.1.6, size 23.2 MB. Open source (GPL-2.0-or-later). Direct download from F-Droid.",
          logo: "/li-ri.png",
        },
        // ▼▼▼ BLANK PLACEHOLDER SLOTS — replace name/rating with real content anytime ▼▼▼
        {
          name: 'Car Simulator 2 (MOD)',
          rating: '4.5',
          downloadUrl: 'https://t.me/VeloCFilesBot?start=game1',
          logo: '/car-simulator-2.png',
          description: 'Car Simulator 2 MOD APK with Unlimited Money. Version 1.57.1, size 756 MB. Tap Download and the file will be sent to you through our Telegram bot.',
        },
        {
          name: "Flip Master",
          rating: "3.4",
          downloadUrl: "https://t.me/VeloCFilesBot?start=flip-master",
          description: "Flip Master (MOD, Unlimited Money) - you will control the character who jumps on the trampoline performing different tricks. But you need to do everything correctly and exclude his injuries and shortages. You can learn a lot of different tricks, set big records and open new maps.",
          logo: "/flip-master.png",
        },
        {
          name: "BURGER SIMULATOR Apk",
          rating: "3.3",
          downloadUrl: "https://t.me/VeloCFilesBot?start=burger-simulator",
          description: "Burger Simulator! [MOD, Unlimited Money] - A realistic simulator in which you have to start your burger empire from a small establishment. Set up your kitchen and dining room so that you can cook quickly and keep an eye on what's happening in the dining room, because customer feedback plays a big role in your progress.  Try to hire qualified employees, check the freshness and availability of products, and keep your burger joint clean.",
          logo: "/burger-simulator.jpg",
        },
        {
          name: "FRAG PRO SHOOTING (unlimited money)",
          rating: "3.9",
          downloadUrl: "https://t.me/VeloCFilesBot?start=frffrrag-pro-shooting",
          description: "FRAG suits players who want short matches that fit into a busy day. The game focuses on fast duels and team tactics without long waiting times, so you can jump in and out whenever you have a few minutes. Controls and views are built for phones, and both solo practice and online play are available. To get started, download FRAG and enter a match, then learn how each hero works as you build a squad that fits how you like to play. FRAG, also known as FRAG Pro Shooter, is developed by Oh BiBi.",
          logo: "/frffrrag-pro-shooting.jpg",
        },
        {
          name: "AeroPayout",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.aeropayout.game_11.apk",
          description: "Become a pilot in 7 days — buy tickets, advance seats, earn real rewards Version 1.0.11, size 3.0 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/aeropayout.png",
        },
        {
          name: "Bati: Fitness RPG",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.guiforge.bati_21100.apk",
          description: "Turn workouts into quests, boss fights and a village built by your training. Version 2.11.0, size 54.4 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/bati-fitness-rpg.png",
        },
        {
          name: "BreakThrough",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.halftab.breakthrough_2.apk",
          description: "Offline side-scrolling glass-breaking game Version 1.1, size 688 KB. Open source (Apache-2.0). Direct download from F-Droid.",
          logo: "/breakthrough.png",
        },
        {
          name: "Daybook: Daily Logic Puzzles",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.joebywan.daybook_137.apk",
          description: "New logic puzzles every day. No ads, no subscription, works offline. Version 0.1.137, size 2.4 MB. Open source (AGPL-3.0-or-later). Direct download from F-Droid.",
          logo: "/daybook-daily-logic-puzzles.png",
        },
        {
          name: "Planes Android",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.planes.android_39.apk",
          description: "Planes Android is a variant of the Battleships game for Android Version 0.5.0.4, size 8.1 MB. Open source (MIT). Direct download from F-Droid.",
          logo: "/planes-android.png",
        },
        {
          name: "Tents",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.tents_32.apk",
          description: "A logic puzzle game where goal is to place tents in the grid Version 1.0.2, size 8.6 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/tents.png",
        },
        {
          name: "Water Sort",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.sidhant.watersort_212.apk",
          description: "Relaxing color-sorting puzzle. Infinite levels. Zero tracking. No ads. Version 1.0.20, size 8.4 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/water-sort.png",
        },
        {
          name: "Mahjong Solitaire",
          rating: "—",
          downloadUrl: "https://f-droid.org/repo/com.vortessence.mahjong_6.apk",
          description: "A performance-oriented classic Mahjong Solitaire game. Version 1.2.3, size 18.2 MB. Open source (GPL-3.0-only). Direct download from F-Droid.",
          logo: "/mahjong-solitaire.png",
        },
        // ▲▲▲ Add more { name: '...', rating: '...' } lines here for more slots ▲▲▲
      ],
    },
    editing: {
      title: '🛠️ AI Editing Tools',
      items: [
        {
          name: "AI CHATBOT ASSISTANT",
          rating: "3.3",
          downloadUrl: "https://t.me/VeloCFilesBot?start=ai-chatbot-pro",
          description: "An AI chatbot assistant app is an intelligent application designed to answer questions, complete tasks, and hold human-like conversations using artificial intelligence. It helps streamline daily activities, improve productivity, and provide instant 24/7 support across various personal and professional tasks.",
          logo: "/ai-chatbot-pro.jpg",
        },
        {
          name: "VN EDITOR premium",
          rating: "4.6",
          downloadUrl: "https://t.me/VeloCFilesBot?start=vn-editor",
          description: "VN (also known as VN Video Editor or VlogNow) is an all‑in‑one editing app designed for TikTok, Instagram Reels, YouTube Shorts, and long‑form video creation. It is free to use and does not add a watermark",
          logo: "/vn-editor.jpg",
        },
        {
          name: "PICSART PRO ( UNLOCKED ALL )",
          rating: "4.1",
          downloadUrl: "https://t.me/VeloCFilesBot?start=picsart",
          description: "Picsart is an all-in-one photo and video editing app designed for creating social media graphics, collages, and digital art. It offers easy-to-use creative tools like AI background removal, artistic filters, custom stickers, and text overlays.",
          logo: "/picsart.jpg",
        },
        {
          name: "LIGHTROOM PREMIUM",
          rating: "4.3",
          downloadUrl: "https://t.me/VeloCFilesBot?start=lightroom",
          description: "Adobe Lightroom is a powerful photo editing software designed for enhancing, color grading, and organizing high-quality images. It allows both beginners and professional photographers to easily adjust lighting, apply custom presets, and refine photo details.",
          logo: "/lightroom.jpg",
        },
        {
          name: "REMINI PREMIUM",
          rating: "3.7",
          downloadUrl: "https://t.me/VeloCFilesBot?start=remini",
          description: "Remini is an AI-powered photo and video enhancer that restores blurry, low‑quality, or old images into sharp, high‑definition results. It uses advanced deep‑learning models to upscale, unblur, and improve details with one‑tap simplicity",
          logo: "/remini.jpg",
        },
        {
          name: "INSHOT PREMIUM",
          rating: "4.6",
          downloadUrl: "https://t.me/VeloCFilesBot?start=inshot",
          description: "InShot is a user-friendly video and photo editing app that lets you trim, merge, add music, and create stunning visuals effortlessly.",
          logo: "/inshot.jpg",
        },
        {
          name: "CAPCUT ULTRA Pro",
          rating: "3.9",
          downloadUrl: "https://t.me/VeloCFilesBot?start=capcut",
          description: "CapCut Pro is the premium subscription of CapCut, offering advanced video editing tools, AI features, cloud storage, and professional-grade effects for creators.",
          logo: "/capcut.jpg",
        },
        // ▲▲▲ Add more { name: '...', rating: '...' } lines here for more slots ▲▲▲
      ],
    },
  };

  const openDownload = (url: string) => {
    const m = url.match(/^https:\/\/t\.me\/([A-Za-z0-9_]+)\?start=([A-Za-z0-9_-]+)$/);
    if (m && /android/i.test(navigator.userAgent)) {
      const fallback = encodeURIComponent(url);
      window.location.href =
        `intent://resolve?domain=${m[1]}&start=${m[2]}#Intent;scheme=tg;package=org.telegram.messenger;S.browser_fallback_url=${fallback};end`;
      return;
    }
    window.location.href = url;
  };

  const openCategoryHub = (key: string) => {
    setActiveCategory(key);
    setCategorySearch('');
    setSelectedHubItem(null);
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
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden font-sans selection:bg-blue-500 selection:text-white" style={{ background: '#0a0a0d' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR — fixed top bar with logo + 3-dot menu
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(12,12,15,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(59,130,246,0.25)',
          boxShadow: '0 1px 24px rgba(0,0,0,0.35)',
        }}
      >
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-7">
          <span
            className="font-extrabold text-xl tracking-tight select-none"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Velo C
          </span>
          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-semibold text-gray-300 hover:text-blue-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => openOverlay('contact')}
              className="text-sm font-semibold text-gray-300 hover:text-blue-400 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => openOverlay('profile')}
              className="text-sm font-semibold text-gray-300 hover:text-blue-400 transition-colors"
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
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}
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
                background: isMenuOpen ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.25)',
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
                  border: '1px solid rgba(59,130,246,0.25)',
                  boxShadow: '0 8px 40px rgba(59,130,246,0.12), 0 4px 20px rgba(0,0,0,0.4)',
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
            background: activeOverlay === 'explore' || activeOverlay === 'contact' ? '#0a0a0d' : 'rgba(255,255,255,0.97)',
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
                  : activeOverlay === 'contact'
                  ? 'text-gray-300 hover:text-blue-400'
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
              <div className="w-full max-w-md">
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '2px solid rgba(59,130,246,0.3)' }}
                  >
                    📬
                  </div>
                  <div>
                    <h2
                      className="text-3xl font-extrabold mb-2"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Contact Us
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                      Found a broken link? Have a suggestion? Write it below — it goes straight to us.
                    </p>
                  </div>
                </div>

                {/* Feedback / Problem form */}
                <div className="w-full flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3.5 text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                    style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}
                  />
                  <input
                    type="email"
                    placeholder="Your email (so we can reply)"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3.5 text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                    style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}
                  />
                  <textarea
                    placeholder="Describe your problem or feedback..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={5}
                    className="w-full rounded-2xl px-4 py-3.5 text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 transition-colors resize-none"
                    style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}
                  />
                  <button
                    onClick={handleContactSubmit}
                    className="w-full py-4 rounded-2xl font-extrabold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                  >
                    Send Message
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center mt-6">
                  You can also message us directly on{' '}
                  <a
                    href="https://t.me/Thecrackedx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold"
                    style={{ color: '#8b5cf6' }}
                  >
                    Telegram
                  </a>.
                </p>
              </div>
            )}


          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY HUB — opens when a home page card's "Open ... Hub" button is tapped
      ══════════════════════════════════════════════════════════════════════ */}
      {activeCategory && categoryData[activeCategory] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${categoryData[activeCategory].title} hub`}
          className="fixed inset-0 z-[70] overflow-y-auto"
          style={{ background: '#0a0a14' }}
        >
          <div className="max-w-3xl mx-auto px-5 py-6">

            {/* Header — back button + card name */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 font-bold text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="text-xl">←</span> Back
              </button>
              <span
                className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                {categoryData[activeCategory].title}
              </span>
            </div>

            {/* Search bar — filters items within this category */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder={`Search in ${categoryData[activeCategory].title}...`}
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}
              />
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoryData[activeCategory].items
                .filter((item) => item.name.toLowerCase().includes(categorySearch.toLowerCase()))
                .map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSelectedHubItem(item)}
                    className="flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-all hover:scale-[1.03]"
                    style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.18)' }}
                  >
                    {item.logo ? (
                      <img src={item.logo} alt={item.name} loading="lazy" decoding="async" className="w-full aspect-square rounded-xl object-cover" />
                    ) : (
                    <div
                      className="w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1.5px dashed rgba(59,130,246,0.35)' }}
                    >
                      <span className="text-2xl text-blue-400/60">+</span>
                      <span className="text-[9px] text-gray-500 font-semibold">LOGO</span>
                    </div>
                    )}
                    <span className="font-bold text-gray-200 text-sm leading-tight">{item.name}</span>
                    <span className="text-xs text-yellow-400 font-semibold">★ {item.rating}</span>
                  </button>
                ))}
            </div>

            {categoryData[activeCategory].items.filter((item) =>
              item.name.toLowerCase().includes(categorySearch.toLowerCase())
            ).length === 0 && (
              <p className="text-center text-gray-500 mt-10">No results found.</p>
            )}
          </div>

          {/* ── ITEM DETAIL PAGE — opens when a specific item card is tapped ── */}
          {selectedHubItem && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[80] overflow-y-auto"
              style={{ background: '#0a0a14' }}
            >
              <div className="max-w-2xl mx-auto px-5 py-6">
                <button
                  onClick={() => setSelectedHubItem(null)}
                  className="flex items-center gap-2 font-bold text-gray-300 hover:text-blue-400 transition-colors mb-6"
                >
                  <span className="text-xl">←</span> Back
                </button>

                {selectedHubItem.logo ? (
                  <img src={selectedHubItem.logo} alt={selectedHubItem.name} className="w-40 h-40 mx-auto rounded-3xl object-cover mb-6" />
                ) : (
                <div
                  className="w-full aspect-video rounded-3xl flex flex-col items-center justify-center gap-2 mb-6"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1.5px dashed rgba(59,130,246,0.35)' }}
                >
                  <span className="text-4xl text-blue-400/60">+</span>
                  <span className="text-xs text-gray-500 font-semibold">ADD LOGO / SCREENSHOT</span>
                </div>
                )}

                <h2 className="text-2xl font-extrabold text-white mb-1">{selectedHubItem.name}</h2>
                <p className="text-yellow-400 font-semibold mb-5">★ {selectedHubItem.rating} rating</p>

                <div
                  className="rounded-2xl p-5 mb-6"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.18)' }}
                >
                  <p className="text-gray-400 leading-relaxed">
                    {selectedHubItem.description ?? 'Details coming soon.'}
                  </p>
                </div>

                {selectedHubItem.downloadUrl?.includes('t.me') && (
                  <div
                  className="rounded-2xl p-5 mb-5 text-center"
                  style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.75)' }}
                >
                  <p className="text-lg font-extrabold leading-snug" style={{ color: '#fcd34d' }}>
                    ⚠️ IMPORTANT: Install the Telegram app and turn on a VPN before you download. Both are compulsory.
                  </p>
                </div>
                )}
                <button
                  onClick={() =>
                    selectedHubItem.downloadUrl
                      ? openDownload(selectedHubItem.downloadUrl)
                      : setToast('Download will be available once this item is fully added.')
                  }
                  className="w-full py-4 rounded-2xl font-extrabold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                >
                  Download
                </button>
              </div>
            </div>
          )}
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
        {/* ══════════════ BLUE-PURPLE THEME BLOCK — HERO + SOCIAL + CARDS ══════════════ */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at top, #10122b 0%, #0a0a14 55%, #0a0a14 100%)' }}>

        {/* decorative glow orbs */}
        <div className="hero-glow-orb" style={{ width: 380, height: 380, top: -120, left: -80, background: 'radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)' }} />
        <div className="hero-glow-orb" style={{ width: 420, height: 420, top: 80, right: -140, background: 'radial-gradient(circle, rgba(139,92,246,0.32), transparent 70%)', animationDelay: '2s' }} />

        {/* Ambient flowing particle-wave background — behind all hero content */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="hero-wave hero-wave-1" d="M-100,120 C100,60 250,180 400,110 C550,40 700,160 850,90 C950,50 1050,100 1100,120" stroke="url(#waveGrad)" strokeWidth="1.5" strokeDasharray="1,9" fill="none" />
          <path className="hero-wave hero-wave-2" d="M-100,180 C120,240 260,120 420,190 C560,250 700,140 860,200 C960,240 1050,190 1100,180" stroke="url(#waveGrad)" strokeWidth="1.5" strokeDasharray="1,7" fill="none" opacity="0.7" />
          <path className="hero-wave hero-wave-3" d="M-100,90 C150,150 300,70 450,130 C600,190 750,80 900,140 C1000,175 1060,140 1100,90" stroke="url(#waveGrad)" strokeWidth="1.5" strokeDasharray="1,11" fill="none" opacity="0.5" />
          <path className="hero-wave hero-wave-4" d="M-100,230 C130,190 280,260 430,210 C580,160 730,240 880,200 C970,175 1050,200 1100,230" stroke="url(#waveGrad)" strokeWidth="1.5" strokeDasharray="1,8" fill="none" opacity="0.6" />
        </svg>

        {/* SECTION 1+2+3 — HERO (centered content with ambient animated orbs) */}
        <section className="pt-28 pb-16 px-6" style={{ position: 'relative', zIndex: 1 }}>
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-7">

            <span className="hero-fade-1 uppercase tracking-[0.3em] text-xs md:text-sm font-bold text-blue-400">
              Intelligence at Velocity
            </span>
              <h1 className="hero-fade-2 text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-none">
                Velo{' '}
                <span
                  className="text-glow"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  C
                </span>
              </h1>

              <p className="hero-fade-3 text-[1.05rem] md:text-lg text-gray-400 leading-relaxed max-w-lg font-medium">
                The ultimate destination for high-speed direct downloads — premium gaming configs,
                AI-powered editing tools, video assets, and exclusive packs for creators and gamers
                worldwide. Every file verified, optimized, zero hassle.
              </p>

              <div className="hero-fade-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setToast('🔒 Explore page is locked for now — coming soon!')}
                  className="px-9 py-4 rounded-full font-extrabold text-white text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 opacity-70"
                  style={{
                    background: 'linear-gradient(135deg, #4b5563, #374151)',
                  }}
                >
                  🔒 Explore Downloads
                </button>
              </div>

              {/* Stats row */}
              <div className="hero-fade-4 flex flex-wrap items-center justify-center gap-8 pt-4">
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
        </section>

        <ParticleShowcase />

        {/* SECTION 4 — SOCIAL ICONS */}
        <section className="flex justify-center items-center gap-10 pb-20">
          <a
            href="https://t.me/Thecrackedx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
          >
            <FaTelegram size={52} />
          </a>
          <a
            href="https://youtube.com/@thecrackedx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 transition-all duration-300 hover:scale-125 hover:text-blue-400 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
          >
            <FaYoutube size={52} />
          </a>
        </section>

        {/* SECTION 5 — CATEGORY CARDS */}
        <section className="px-6 pb-28 max-w-6xl mx-auto">
          <span className="block text-center uppercase tracking-[0.3em] text-xs md:text-sm font-bold text-blue-400 mb-3">
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
              onClick={() => openCategoryHub('gaming')}
            />
            <CategoryCard
              emoji="🛠️"
              title="AI Editing Tools"
              description="Best free video and photo editing apps."
              buttonLabel="Open Editing Hub"
              onClick={() => openCategoryHub('editing')}
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

        {/* SECTION 5.6 — ABOUT VELO C (long-form write-up on home page) */}
        <section id="about-section" className="px-6 pb-24 max-w-4xl mx-auto scroll-mt-24">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg"
              style={{ background: 'rgba(59,130,246,0.1)', border: '2px solid rgba(59,130,246,0.3)' }}
            >
              ⚡
            </div>
            <h2
              className="text-3xl font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About Velo C
            </h2>
            <p className="font-semibold text-gray-500">Intelligence at Velocity</p>
          </div>

          <div
            className="w-full rounded-3xl p-7 md:p-10 space-y-6 text-left"
            style={{
              background: 'rgba(59,130,246,0.03)',
              border: '1px solid rgba(59,130,246,0.18)',
              boxShadow: '0 4px 30px rgba(59,130,246,0.05)',
            }}
          >
            <section className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">🚀 Our Story</h3>
              <p className="text-gray-400 leading-relaxed">
                Velo C was born out of a simple frustration — every gamer and creator on the
                internet was tired of the same old story. You search for a gaming config, and
                you land on a broken link. You look for an editing tool, and you're bombarded
                with fake "download" buttons, five layers of ads, and shortened links that lead
                nowhere. We built Velo C to be the opposite of all that: one clean, fast,
                trustworthy hub where gamers, editors, and content creators could find exactly
                what they needed without wading through junk to get there.
              </p>
              <p className="text-gray-400 leading-relaxed">
                What started as a small personal project — a single creator sharing configs and
                tools with a handful of friends on Telegram — slowly grew into something much
                bigger. Every file that got shared was tested first. Every tool was verified to
                actually work before it was posted. That one habit, doing the boring work of
                quality-checking everything, is what separates Velo C from the dozens of
                copy-paste download sites out there.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">🎮 What We Offer</h3>
              <p className="text-gray-400 leading-relaxed">
                Velo C is organized around four pillars. First, <strong className="text-gray-200">Gaming APKs &amp; Mods</strong> —
                GFX tools, FPS configs, sensitivity setups, and performance boosters for titles
                like BGMI, Free Fire, and Call of Duty Mobile, tuned to squeeze the most
                performance out of low and mid-range devices. Second, <strong className="text-gray-200">AI Editing Tools</strong> —
                unlocked and premium versions of the apps creators actually use every day, from
                CapCut and Remini to AI face-swap and enhancement tools, so editing doesn't cost
                a subscription fee. Third, <strong className="text-gray-200">Video Resources</strong> —
                sound effects, overlays, transitions, and B-roll assets that save editors hours of
                searching stock libraries. And fourth, <strong className="text-gray-200">Premium Packs</strong> —
                curated bundles that combine multiple resources into one download for creators who
                want everything in one go.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">✅ Our Promise</h3>
              <p className="text-gray-400 leading-relaxed">
                Every single file on Velo C goes through the same three checks before it's ever
                posted: does it download properly, does it actually work as described, and is it
                safe to install. We don't believe in "trust me bro" links. If something breaks or
                stops working, our community lets us know through Telegram and we either fix it
                or take it down — no dead links sitting around for months. Speed matters too:
                every download on Velo C is routed for high-speed access, because nobody should
                have to wait ten minutes for a five-minute file.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">🌍 Community &amp; Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                Velo C isn't just a download site — it's slowly becoming a community. Thousands
                of gamers and creators from around the world check in regularly, not just to
                download something, but to see what's new, request tools they need, and share
                feedback that shapes what gets added next. That two-way relationship is the whole
                point. This platform grows because the people using it tell us what to build
                next, and we listen.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Looking ahead, the goal is simple: keep making Velo C the fastest, cleanest, and
                most reliable place on the internet to find gaming and creator tools — no
                clutter, no fake links, no nonsense. Whether you're a mobile gamer chasing better
                frame rates, a creator polishing your next video, or someone just discovering
                what's possible with AI-powered editing, Velo C is built for you. Every file
                verified. Every download optimized. Zero hassle. That's the promise, and that's
                what we intend to keep delivering — one update at a time.
              </p>
            </section>
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
              border: '1px solid rgba(59,130,246,0.18)',
              boxShadow: '0 4px 40px rgba(59,130,246,0.06), 0 2px 20px rgba(0,0,0,0.2)',
            }}
          >
            {/* LEFT — Velo C YouTube channel logo */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div
                className="about-channel-logo relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1d, #0f0f11)',
                  border: '2.5px solid rgba(59,130,246,0.5)',
                  boxShadow: '0 0 0 7px rgba(59,130,246,0.06), 0 0 32px rgba(59,130,246,0.2)',
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
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(59,130,246,0.1))',
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
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))',
                  border: '1px solid rgba(139,92,246,0.3)',
                  color: '#8b5cf6',
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
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
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
                      background: 'rgba(59,130,246,0.06)',
                      border: '1px solid rgba(59,130,246,0.18)',
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

        {/* SECTION 5.7 - CONTACT (replaced the advertisement box) */}
        <section id="contact-section" className="px-6 pb-20 max-w-5xl mx-auto">
          <div className="relative pt-4">
            <span className="vc-contact-blob vc-blob-a" aria-hidden="true" />
            <span className="vc-contact-blob vc-blob-b" aria-hidden="true" />

            <div className="vc-c-head relative text-center mb-10">
              <span className="vc-c-chip inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Contact
              </span>
              <h2
                className="text-3xl md:text-4xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Contact Us
              </h2>
              <p className="mt-3 text-gray-500 max-w-md mx-auto leading-relaxed">
                Found a broken link? Have a suggestion? Write it below, it goes straight to us.
              </p>
            </div>

            <div className="vc-contact-card relative max-w-2xl mx-auto rounded-3xl p-6 md:p-10">
              <div className="vc-fields flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="vc-field w-full rounded-2xl px-4 py-3.5 outline-none"
                />
                <input
                  type="email"
                  placeholder="Your email (so we can reply)"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="vc-field w-full rounded-2xl px-4 py-3.5 outline-none"
                />
                <textarea
                  placeholder="Describe your problem or feedback..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={5}
                  className="vc-field w-full rounded-2xl px-4 py-3.5 outline-none resize-none"
                />
                <button
                  onClick={handleContactSubmit}
                  className="vc-send w-full py-4 rounded-2xl font-extrabold"
                >
                  Send Message
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center mt-6">
                You can also message us directly on{' '}
                <a
                  href="https://t.me/Thecrackedx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vc-tg-link font-semibold"
                >
                  Telegram
                </a>
                .
              </p>
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
              style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
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
      eyebrow: 'JUST LAUNCHED',
      title: 'Welcome to Velo C',
      description: 'Your new hub for gaming configs, AI tools & creator resources. More drops coming soon.',
      icon: '01',
      className: 'explore-slide-cyan',
      action: () => window.open('https://t.me/Thecrackedx', '_blank', 'noopener,noreferrer'),
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
      eyebrow: 'HELP US GROW',
      title: 'Suggest What You Need',
      description: 'Tell us which configs or tools you want next — we\'ll add them first.',
      icon: '03',
      className: 'explore-slide-blue',
      action: () => setModal('suggestion' as ExploreModal),
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
        border: '1px solid rgba(59,130,246,0.18)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
      >
        {emoji}
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed -mt-2">{description}</p>

      <div className="w-full mt-2">
        <button
          onClick={onClick}
          className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
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
