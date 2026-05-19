import { useState, useEffect, useRef } from "react";

const MILESTONE_DAYS = [1, 3, 7, 14, 30, 60, 90, 180, 365];

const QUOTES = [
  "Every day you choose yourself is a victory.",
  "You are not your worst moment. You are every moment you kept going.",
  "Progress, not perfection.",
  "The bravest thing you can do is begin again.",
  "Small steps still move you forward.",
  "Healing is not linear, but it's always real.",
  "You've survived every difficult day so far.",
  "Be patient with yourself. Growth takes time.",
  "Your future self is rooting for you.",
  "One more day is all you need.",
];

function getStreakDays(startDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((now - start) / 86400000));
}

function getStreakTime(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function getNextMilestone(days) {
  return MILESTONE_DAYS.find(m => m > days) || null;
}

function getMilestoneLabel(days) {
  if (days >= 365) return { label: "1 Year", emoji: "🏆" };
  if (days >= 180) return { label: "6 Months", emoji: "💎" };
  if (days >= 90) return { label: "90 Days", emoji: "🌟" };
  if (days >= 60) return { label: "60 Days", emoji: "✨" };
  if (days >= 30) return { label: "30 Days", emoji: "🔥" };
  if (days >= 14) return { label: "2 Weeks", emoji: "💫" };
  if (days >= 7) return { label: "1 Week", emoji: "⚡" };
  if (days >= 3) return { label: "3 Days", emoji: "🌱" };
  if (days >= 1) return { label: "1 Day", emoji: "🌤️" };
  return { label: "Just started", emoji: "🕊️" };
}

const gradients = [
  { name: "Ocean", value: "from-cyan-500 via-blue-500 to-indigo-600", glow: "#06b6d4" },
  { name: "Dusk", value: "from-pink-400 via-rose-400 to-orange-400", glow: "#f43f5e" },
  { name: "Cosmos", value: "from-violet-600 via-purple-600 to-indigo-700", glow: "#7c3aed" },
  { name: "Forest", value: "from-emerald-400 via-teal-500 to-cyan-600", glow: "#10b981" },
  { name: "Sky", value: "from-sky-400 via-blue-400 to-violet-400", glow: "#38bdf8" },
  { name: "Ember", value: "from-amber-400 via-orange-500 to-red-500", glow: "#f59e0b" },
  { name: "Bloom", value: "from-rose-400 via-pink-500 to-fuchsia-500", glow: "#f43f5e" },
  { name: "Jade", value: "from-green-400 via-emerald-500 to-teal-600", glow: "#22c55e" },
];

const icons = ["🌱", "🕊️", "🌅", "🌙", "🔥", "💪", "🧘", "🌿", "⚡", "✨", "💎", "🌊", "🦋", "🌸", "🎯", "📵", "🚭", "🍃"];

function Particle({ x, y, color }) {
  const style = {
    position: "absolute",
    left: x + "%",
    top: y + "%",
    width: Math.random() * 6 + 3 + "px",
    height: Math.random() * 6 + 3 + "px",
    borderRadius: "50%",
    background: color,
    opacity: 0,
    animation: `particleFly ${Math.random() * 1.5 + 1}s ease-out forwards`,
    animationDelay: Math.random() * 0.5 + "s",
    pointerEvents: "none",
  };
  return <div style={style} />;
}

function MilestoneOverlay({ tracker, onClose }) {
  const { days } = getStreakTime(tracker.startDate);
  const { label, emoji } = getMilestoneLabel(days);
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: tracker.glow,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes particleFly {
          0% { opacity:1; transform: translateY(0) scale(1); }
          100% { opacity:0; transform: translateY(-80px) scale(0.3); }
        }
        @keyframes milestoneIn {
          0% { opacity:0; transform: scale(0.7) translateY(20px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px ${tracker.glow}60; }
          50% { box-shadow: 0 0 80px ${tracker.glow}90; }
        }
      `}</style>
      <div
        className="relative overflow-hidden rounded-3xl p-10 text-center max-w-sm w-full mx-4"
        style={{
          background: "rgba(15,15,25,0.9)",
          border: `1px solid ${tracker.glow}40`,
          animation: "milestoneIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, pulse-glow 2s ease-in-out infinite",
        }}
        onClick={e => e.stopPropagation()}
      >
        {particles.map(p => <Particle key={p.id} {...p} />)}
        <div className="text-6xl mb-4">{emoji}</div>
        <div className="text-5xl font-bold text-white mb-2">{label}</div>
        <div className="text-lg font-semibold mb-4" style={{ color: tracker.glow }}>
          {tracker.title}
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {QUOTES[Math.floor(Math.random() * QUOTES.length)]}
        </p>
        <button
          className="w-full py-3 rounded-xl font-semibold text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${tracker.glow}80, ${tracker.glow}40)`, border: `1px solid ${tracker.glow}60` }}
          onClick={onClose}
        >
          Keep going ✨
        </button>
      </div>
    </div>
  );
}

function RelapseModal({ tracker, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="rounded-3xl p-8 max-w-sm w-full mx-4"
        style={{ background: "rgba(15,15,25,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="text-4xl text-center mb-4">🤍</div>
        <h3 className="text-xl font-bold text-white text-center mb-3">Are you sure?</h3>
        <p className="text-gray-300 text-sm text-center leading-relaxed mb-2">
          Resetting doesn't erase the progress you've made. Every day you fought was real.
        </p>
        <p className="text-gray-400 text-xs text-center mb-6">
          Your highest streak will be preserved. This is not failure — this is the beginning of a new chapter.
        </p>
        <div className="space-y-3">
          <button
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}
            onClick={onConfirm}
          >
            Reset streak
          </button>
          <button
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={onCancel}
          >
            I'm staying strong 💪
          </button>
        </div>
      </div>
    </div>
  );
}

function CircularProgress({ days, max = 90, glow }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(days / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width="130" height="130" className="transform -rotate-90">
      <defs>
        <linearGradient id={`grad-${glow.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={glow} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="65" cy="65" r={radius} fill="none" stroke={`url(#grad-${glow.replace("#", "")})`} strokeWidth="8" />
      <circle
        cx="65" cy="65" r={radius}
        fill="none"
        stroke={glow}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${glow}80)` }}
      />
    </svg>
  );
}

function TrackerCard({ tracker, onRelapse, onClick }) {
  const [time, setTime] = useState(getStreakTime(tracker.startDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getStreakTime(tracker.startDate)), 1000);
    return () => clearInterval(id);
  }, [tracker.startDate]);

  const { label } = getMilestoneLabel(time.days);
  const next = getNextMilestone(time.days);
  const toNext = next ? next - time.days : null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${tracker.glow}30`,
        backdropFilter: "blur(20px)",
        transition: "all 0.3s ease",
      }}
      onClick={() => onClick(tracker)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = tracker.glow + "60";
        e.currentTarget.style.boxShadow = `0 20px 60px ${tracker.glow}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = tracker.glow + "30";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{ background: `radial-gradient(circle at top right, ${tracker.glow}, transparent 70%)` }}
      />
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{tracker.icon}</span>
              <span className="font-semibold text-white text-sm">{tracker.title}</span>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: tracker.glow + "20", color: tracker.glow }}
            >
              {label}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <CircularProgress days={time.days} glow={tracker.glow} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-white leading-none">{time.days}</div>
                <div className="text-xs text-gray-400">days</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          {[
            { val: String(time.hours).padStart(2, "0"), label: "hrs" },
            { val: String(time.minutes).padStart(2, "0"), label: "min" },
            { val: String(time.seconds).padStart(2, "0"), label: "sec" },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="flex-1 text-center rounded-xl py-2"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div className="text-white font-mono font-bold text-lg leading-none">{val}</div>
              <div className="text-gray-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Best: <span className="text-gray-300 font-semibold">{tracker.longestStreak}d</span>
          </span>
          {toNext && (
            <span style={{ color: tracker.glow }}>
              {toNext}d to {next}d milestone
            </span>
          )}
        </div>

        <button
          className="mt-4 w-full py-2 rounded-xl text-xs font-medium transition-all"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "rgba(239,68,68,0.7)",
          }}
          onClick={e => { e.stopPropagation(); onRelapse(tracker); }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
        >
          Reset streak
        </button>
      </div>
    </div>
  );
}

function CreateTrackerModal({ onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("🌱");
  const [gradient, setGradient] = useState(gradients[0]);
  const [quote, setQuote] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: Date.now().toString(),
      title: title.trim(),
      icon,
      gradient: gradient.value,
      glow: gradient.glow,
      quote: quote || QUOTES[Math.floor(Math.random() * QUOTES.length)],
      startDate: new Date().toISOString(),
      longestStreak: 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: "rgba(12,12,20,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">New tracker</h3>
          <button className="text-gray-500 hover:text-white" onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Title</label>
            <input
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="e.g. Alcohol free, Social media detox..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Icon</label>
            <div className="grid grid-cols-9 gap-1.5">
              {icons.map(i => (
                <button
                  key={i}
                  className="rounded-lg p-1.5 text-lg transition-all"
                  style={{
                    background: icon === i ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                    border: icon === i ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                  }}
                  onClick={() => setIcon(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Color theme</label>
            <div className="grid grid-cols-4 gap-2">
              {gradients.map(g => (
                <button
                  key={g.name}
                  className="rounded-xl p-2 text-xs font-medium transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${g.glow}40, ${g.glow}15)`,
                    border: gradient.name === g.name ? `1px solid ${g.glow}80` : "1px solid transparent",
                    color: gradient.name === g.name ? g.glow : "rgba(255,255,255,0.5)",
                  }}
                  onClick={() => setGradient(g)}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Start date</label>
            <input
              type="date"
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", colorScheme: "dark" }}
              value={startDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Motivational quote (optional)</label>
            <input
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="A word to remind yourself why..."
              value={quote}
              onChange={e => setQuote(e.target.value)}
            />
          </div>

          <button
            className="w-full py-3.5 rounded-xl font-semibold text-white mt-2"
            style={{
              background: title.trim() ? `linear-gradient(135deg, ${gradient.glow}80, ${gradient.glow}40)` : "rgba(255,255,255,0.1)",
              border: `1px solid ${gradient.glow}40`,
              opacity: title.trim() ? 1 : 0.5,
            }}
            onClick={handleSave}
            disabled={!title.trim()}
          >
            Start tracking
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailView({ tracker, onBack, onRelapse }) {
  const [time, setTime] = useState(getStreakTime(tracker.startDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getStreakTime(tracker.startDate)), 1000);
    return () => clearInterval(id);
  }, [tracker.startDate]);

  const { label, emoji } = getMilestoneLabel(time.days);
  const next = getNextMilestone(time.days);
  const progressToNext = next ? Math.min(((time.days / next) * 100), 100) : 100;
  const quote = tracker.quote || QUOTES[0];

  const heatmapDays = Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    const dayDiff = Math.floor((d - new Date(tracker.startDate)) / 86400000);
    return { date: d, active: dayDiff >= 0 && dayDiff <= time.days };
  });

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center gap-4">
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.07)" }}
          onClick={onBack}
        >
          ←
        </button>
        <h2 className="text-white font-semibold">{tracker.title}</h2>
      </div>

      <div className="px-5 mb-6">
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${tracker.glow}20, ${tracker.glow}08)`,
            border: `1px solid ${tracker.glow}30`,
            boxShadow: `0 30px 80px ${tracker.glow}15`,
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 50% 0%, ${tracker.glow}, transparent 70%)` }}
          />
          <div className="relative">
            <div className="text-5xl mb-3">{tracker.icon}</div>
            <div className="text-7xl font-bold text-white mb-1">{time.days}</div>
            <div className="text-gray-400 text-sm mb-4">days clean</div>
            <div className="flex justify-center gap-6 mb-6">
              {[
                { val: String(time.hours).padStart(2, "0"), label: "hours" },
                { val: String(time.minutes).padStart(2, "0"), label: "minutes" },
                { val: String(time.seconds).padStart(2, "0"), label: "seconds" },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-mono font-bold text-white">{val}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: tracker.glow + "20", color: tracker.glow }}
            >
              {emoji} {label}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xs text-gray-500 mb-1">Current streak</div>
            <div className="text-2xl font-bold text-white">{time.days}</div>
            <div className="text-xs text-gray-400">days</div>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xs text-gray-500 mb-1">Best streak</div>
            <div className="text-2xl font-bold" style={{ color: tracker.glow }}>{tracker.longestStreak}</div>
            <div className="text-xs text-gray-400">days</div>
          </div>
        </div>
      </div>

      {next && (
        <div className="px-5 mb-6">
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-400">Next milestone</span>
              <span className="text-xs font-semibold" style={{ color: tracker.glow }}>{next} days</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: progressToNext + "%",
                  background: `linear-gradient(90deg, ${tracker.glow}80, ${tracker.glow})`,
                  boxShadow: `0 0 8px ${tracker.glow}60`,
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{next - time.days} days to go</div>
          </div>
        </div>
      )}

      <div className="px-5 mb-6">
        <div className="text-xs text-gray-500 mb-3">Last 90 days</div>
        <div className="flex flex-wrap gap-1">
          {heatmapDays.map((d, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm transition-all"
              style={{
                background: d.active ? tracker.glow + "90" : "rgba(255,255,255,0.06)",
                boxShadow: d.active ? `0 0 4px ${tracker.glow}40` : "none",
              }}
              title={d.date.toLocaleDateString()}
            />
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div
          className="rounded-2xl p-5"
          style={{
            background: `linear-gradient(135deg, ${tracker.glow}10, transparent)`,
            border: `1px solid ${tracker.glow}20`,
          }}
        >
          <div className="text-xs text-gray-500 mb-2">Reminder</div>
          <p className="text-gray-200 text-sm leading-relaxed italic">"{quote}"</p>
        </div>
      </div>

      <div className="px-5">
        <button
          className="w-full py-3.5 rounded-xl font-medium transition-all text-sm"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "rgba(239,68,68,0.8)",
          }}
          onClick={() => onRelapse(tracker)}
        >
          Reset streak
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [trackers, setTrackers] = useState(() => {
    try {
      const saved = localStorage.getItem("recovery_trackers_v2");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [view, setView] = useState("home");
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [relapseTarget, setRelapseTarget] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const lastMilestones = useRef({});

  useEffect(() => {
    localStorage.setItem("recovery_trackers_v2", JSON.stringify(trackers));
  }, [trackers]);

  useEffect(() => {
    const id = setInterval(() => setQuoteIndex(i => (i + 1) % QUOTES.length), 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    trackers.forEach(t => {
      const days = getStreakDays(t.startDate);
      const last = lastMilestones.current[t.id];
      const hit = MILESTONE_DAYS.find(m => m === days);
      if (hit && last !== hit) {
        lastMilestones.current[t.id] = hit;
        setTimeout(() => setMilestone(t), 500);
      }
    });
  }, [trackers]);

  const handleRelapse = (tracker) => setRelapseTarget(tracker);

  const confirmRelapse = () => {
    if (!relapseTarget) return;
    setTrackers(prev => prev.map(t =>
      t.id === relapseTarget.id
        ? { ...t, startDate: new Date().toISOString(), longestStreak: Math.max(t.longestStreak, getStreakDays(t.startDate)) }
        : t
    ));
    if (selectedTracker?.id === relapseTarget.id) {
      setSelectedTracker(prev => ({
        ...prev,
        startDate: new Date().toISOString(),
        longestStreak: Math.max(prev.longestStreak, getStreakDays(prev.startDate))
      }));
    }
    setRelapseTarget(null);
  };

  const handleCreate = (data) => {
    setTrackers(prev => [...prev, data]);
    setShowCreate(false);
  };

  const openDetail = (tracker) => {
    setSelectedTracker(tracker);
    setView("detail");
  };

  const totalDays = trackers.reduce((sum, t) => sum + getStreakDays(t.startDate), 0);

  return (
    <div
      className="min-h-screen max-w-md mx-auto"
      style={{ background: "linear-gradient(180deg, #060610 0%, #0a0a1a 100%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes floatUp {
          0% { opacity:0; transform: translateY(16px); }
          100% { opacity:1; transform: translateY(0); }
        }
        @keyframes quoteSlide {
          0% { opacity: 0; transform: translateY(8px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        .tracker-card { animation: floatUp 0.5s ease forwards; }
        .quote-text { animation: quoteSlide 8s ease infinite; }
      `}</style>

      {milestone && <MilestoneOverlay tracker={milestone} onClose={() => setMilestone(null)} />}
      {relapseTarget && <RelapseModal tracker={relapseTarget} onConfirm={confirmRelapse} onCancel={() => setRelapseTarget(null)} />}
      {showCreate && <CreateTrackerModal onSave={handleCreate} onClose={() => setShowCreate(false)} />}

      {view === "detail" && selectedTracker ? (
        <DetailView
          tracker={selectedTracker}
          onBack={() => { setView("home"); setSelectedTracker(null); }}
          onRelapse={handleRelapse}
        />
      ) : (
        <>
          <div className="px-5 pt-10 pb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-white">Your journey</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  {trackers.length === 0
                    ? "Add your first tracker below"
                    : `${trackers.length} active ${trackers.length === 1 ? "tracker" : "trackers"}`}
                </p>
              </div>
              {trackers.length > 0 && (
                <div
                  className="rounded-2xl px-4 py-2 text-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="text-lg font-bold text-white">{totalDays}</div>
                  <div className="text-xs text-gray-500">total days</div>
                </div>
              )}
            </div>

            {trackers.length === 0 ? (
              <div
                className="mt-8 rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}
              >
                <div className="text-4xl mb-3"></div>
                <p className="text-white font-medium mb-1">Every journey starts here</p>
                <p className="text-gray-500 text-sm">Tap the button below to create your first tracker and begin counting your days.</p>
              </div>
            ) : (
              <div
                className="mt-5 rounded-2xl px-4 py-3.5 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", minHeight: 44 }}
              >
                <p key={quoteIndex} className="text-gray-300 text-sm italic leading-relaxed quote-text">
                  "{QUOTES[quoteIndex]}"
                </p>
              </div>
            )}
          </div>

          <div className="px-5 space-y-4 pb-8">
            {trackers.map((t, i) => (
              <div key={t.id} className="tracker-card" style={{ animationDelay: i * 0.08 + "s", animationFillMode: "both", opacity: 0 }}>
                <TrackerCard tracker={t} onRelapse={handleRelapse} onClick={openDetail} />
              </div>
            ))}

            <button
              className="w-full py-5 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.4)",
              }}
              onClick={() => setShowCreate(true)}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              <span style={{ fontSize: 18 }}>+</span>
              <span>Add new tracker</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}