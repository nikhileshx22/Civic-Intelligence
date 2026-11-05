import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  Activity,
  Radio,
  Clock,
  Compass,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Flame,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { UserLocation, Ticket } from '../types/civic';

interface ClassicInterferenceBannerProps {
  userLocation: UserLocation;
  tickets: Ticket[];
  isGodMode: boolean;
  onToggleGodMode: () => void;
  onOpenRetestModal: () => void;
  onTriggerGlobalRetest: () => void;
  lang: 'en' | 'te';
}

export const ClassicInterferenceBanner: React.FC<ClassicInterferenceBannerProps> = ({
  userLocation,
  tickets,
  isGodMode,
  onToggleGodMode,
  onOpenRetestModal,
  onTriggerGlobalRetest,
  lang,
}) => {
  const isTe = lang === 'te';

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format times: User local & Indian Standard Time (Vizag)
  const istString = currentTime.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const localTimeStr = currentTime.toLocaleTimeString([], {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Calculate retest metrics
  const retestedSafeCount = tickets.filter(
    (t) => t.retestStatus === 'Retested Safe' || t.status === 'Resolved (Photo Verified)'
  ).length;

  const dueRetestCount = tickets.filter(
    (t) => t.retestStatus === 'Retest Scheduled' || t.status === 'In Progress'
  ).length;

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-500 border shadow-xl ${
        isGodMode
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/80 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40'
          : 'bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/90 border-sky-500/30 text-slate-100 shadow-sky-950/30'
      }`}
    >
      {/* Ambient background glow & scanline */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Primary Top Bar: 2 Simple Words + Live Time & Telemetry */}
      <div className="p-4 sm:p-5 relative z-10 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: 2 Simple Words Badge & Live Interference Title */}
          <div className="flex items-center space-x-3.5">
            {/* Pulsing Beacon Icon */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border transition-all ${
                isGodMode
                  ? 'bg-emerald-950/90 border-emerald-400/50 text-emerald-300 shadow-emerald-500/20'
                  : 'bg-sky-950/90 border-sky-400/40 text-sky-300 shadow-sky-500/20'
              }`}
            >
              {isGodMode ? (
                <Cpu className="w-6 h-6 animate-pulse text-emerald-400" />
              ) : (
                <Radio className="w-6 h-6 animate-pulse text-sky-400" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                {/* THE 2 SIMPLE WORDS OF APP CAPACITY */}
                <div
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border shadow-inner ${
                    isGodMode
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-sky-500/20 text-sky-200 border-sky-400/40'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{isTe ? 'గుర్తించు · పరిష్కరించు' : 'DETECT · RESOLVE'}</span>
                </div>

                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
                  {isGodMode ? 'Omniscient Civic Core' : 'Autonomous Civic Radar'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
                <span>{isTe ? 'సివిక్స్.AI లైవ్ ఇంటెలిజెన్స్ సామర్థ్యం' : 'CivixAI Live Capacity Console'}</span>
                {isGodMode && (
                  <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    GOD MODE
                  </span>
                )}
              </h2>
            </div>
          </div>

          {/* Right: Live Location & Current Time Telemetry */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs w-full lg:w-auto">
            {/* Current Real Time Badge */}
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1.5 leading-none">
                <span className="font-bold text-white">{localTimeStr}</span>
                <span className="text-[10px] text-slate-400">({istString} IST)</span>
              </div>
            </div>

            {/* Current Live Location Coordinates Badge */}
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <div className="leading-none">
                <span className="font-bold text-slate-200">
                  {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
                </span>
                <span className="text-[10px] text-slate-400 ml-1.5">
                  (±{userLocation.accuracy}m)
                </span>
              </div>
            </div>

            {/* God Mode Toggle Switch */}
            <button
              onClick={onToggleGodMode}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 border shadow-md ${
                isGodMode
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/50 hover:text-emerald-300'
              }`}
              title="Activate AI God Mode: Deep multi-spectral hazard triage, casualty risk modeling & automated retest scheduling"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isGodMode ? 'God Mode: ON' : 'Enable God Mode'}</span>
            </button>
          </div>
        </div>

        {/* Capacity Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-white/10">
          {/* Pillar 1: Instant Geotag Triage */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-sky-400 text-xs font-semibold">
              <span className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>1. Multi-Spectral Triage</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">&lt;1.2s</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Instant hazard gatekeeper automatically rejects non-hazards and classifies craters, leaks, &amp; dark zones.
            </p>
          </div>

          {/* Pillar 2: 200m Spatial Radar */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold">
              <span className="flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5" />
                <span>2. 200m Spatial Radar</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Zero Dups</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Clusters duplicate reports within 200m into high-priority escalations instead of spamming municipal queues.
            </p>
          </div>

          {/* Pillar 3: Bilateral Photo Audit */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-teal-400 text-xs font-semibold">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Photo-Proof Audit</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Tamper-Proof</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Guarantees zero ghost ticket closures via geotagged before/after photographic proof audited by citizens.
            </p>
          </div>

          {/* Pillar 4: Autonomous Retest Schedule */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
              <span className="flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>4. Retest &amp; Quality</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {retestedSafeCount}/{tickets.length} Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              24h and 48h post-repair AI sensor re-audits certify that repaired asphalt or drains don't re-collapse.
            </p>
          </div>
        </div>

        {/* Retest Status & Quality Assurance Banner */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">
                  Complaint Retest &amp; Verification Protocol:
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {retestedSafeCount} Complaints Retested Safe
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Next automated municipal re-audit scheduled in{' '}
                <strong className="text-slate-200">03h 14m 20s</strong> for GVMC Zone 2 Engineering.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTriggerGlobalRetest}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl transition-colors font-semibold flex items-center space-x-1.5 border border-white/10"
              title="Run AI drone & sensor retest verification across all active tickets"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Retest All Complaints</span>
            </button>

            <button
              onClick={onOpenRetestModal}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors font-bold flex items-center space-x-1 shadow-sm"
            >
              <span>Inspect Retest Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
