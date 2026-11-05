import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Ticket,
  UserLocation,
  AiInterferenceAdvisory,
} from './types/civic';
import {
  INITIAL_VIZAG_TICKETS,
  VIZAG_ZONES,
  CATEGORIES,
  SIMULATED_ROUTES,
  TRANSLATIONS,
} from './data/mockData';
import {
  calculateDistanceMeters,
  calculateBearing,
  playHazardAlertChime,
} from './utils/geo';
import { InteractiveMap } from './components/InteractiveMap';
import { AiInterferenceBar } from './components/AiInterferenceBar';
import { LiveLocationTracker } from './components/LiveLocationTracker';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ResolutionAuditModal } from './components/ResolutionAuditModal';
import { RetestAuditModal } from './components/RetestAuditModal';
import { CivicLiveBackground } from './components/CivicLiveBackground';
import { ClassicInterferenceBanner } from './components/ClassicInterferenceBanner';
import { CivixLogo } from './components/CivixLogo';
import { ReportView } from './views/ReportView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import {
  ShieldAlert,
  MapPin,
  Camera,
  Activity,
  Shield,
  FileText,
  RotateCcw,
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'home' | 'tracker' | 'report' | 'admin' | 'about'>('home');

  // Persisted Tickets State
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('civixai_tickets') || localStorage.getItem('civicpulse_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    return INITIAL_VIZAG_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('civixai_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('Error writing localStorage:', e);
    }
  }, [tickets]);

  // Selected Filter States
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Modals
  const [auditModalTicket, setAuditModalTicket] = useState<Ticket | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isRetestModalOpen, setIsRetestModalOpen] = useState(false);
  const [retestActiveTicket, setRetestActiveTicket] = useState<Ticket | null>(null);

  // AI God Mode state
  const [isGodMode, setIsGodMode] = useState(true);

  // Retest ticket handler
  const handleRetestTicket = (ticketId: string) => {
    const now = new Date();
    const formattedNow =
      now.toLocaleDateString('en-CA') +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const formattedNext =
      nextDate.toLocaleDateString('en-CA') + ' 10:00 AM (Post-Curing)';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const freshEntry = {
            id: `RTEST-${ticketId}-${Date.now().toString(36).toUpperCase()}`,
            timestamp: formattedNow,
            inspectorType: isGodMode
              ? ('AI Drone Sensor' as const)
              : ('Citizen Ward Auditor' as const),
            result: 'Passed' as const,
            notes: isGodMode
              ? `God Mode sensor audit: Photometric surface variance < 1.8mm. Structural compaction rating 98.9%. Safety clearance certified.`
              : `CivixAI retest completed. Municipal repairs passed compaction and obstacle clearance standards.`,
            structuralPassRate: Number((98.0 + Math.random() * 1.8).toFixed(1)),
            geotagHash: `0x${ticketId}_GEO_${Math.floor(Math.random() * 8999 + 1000)}`,
          };
          const updatedLogs = [freshEntry, ...(t.retestAuditLog || [])];
          return {
            ...t,
            retestCount: (t.retestCount || 0) + 1,
            retestStatus: 'Retested Safe' as const,
            lastRetestedAt: formattedNow,
            nextScheduledRetestAt: formattedNext,
            retestAuditLog: updatedLogs,
          };
        }
        return t;
      })
    );
  };

  // Global retest trigger
  const handleTriggerGlobalRetest = () => {
    const now = new Date();
    const formattedNow =
      now.toLocaleDateString('en-CA') +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTickets((prev) =>
      prev.map((t) => ({
        ...t,
        retestCount: (t.retestCount || 1) + 1,
        retestStatus: 'Retested Safe' as const,
        lastRetestedAt: formattedNow,
        nextScheduledRetestAt: '2026-11-08 10:00 AM',
      }))
    );
    alert(
      `AI God Mode Drone Fleet initiated autonomous retest sweep across Visakhapatnam! All active complaint zones retested & verified safe at ${formattedNow}.`
    );
  };

  // Live Location State
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: 17.7445,
    lng: 83.3375, // Starting near MVP Colony Sector 4
    accuracy: 8,
    speed: 0,
    heading: 210,
    altitude: 18,
    timestamp: Date.now(),
    isTracking: false,
    mode: 'real',
  });

  const [focusLocationTrigger, setFocusLocationTrigger] = useState(0);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);

  // Commuter Route Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simRouteId, setSimRouteId] = useState(SIMULATED_ROUTES[0].id);
  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simStepRef = useRef(0);

  // Simple Mode Toggle
  const [isSimpleMode, setIsSimpleMode] = useState(false);

  // Reset to Baseline
  const handleResetData = () => {
    if (window.confirm('Reset all tickets and status to Visakhapatnam baseline dataset?')) {
      setTickets(INITIAL_VIZAG_TICKETS);
      localStorage.setItem('civixai_tickets', JSON.stringify(INITIAL_VIZAG_TICKETS));
      setSelectedTicket(null);
      alert('All complaints reset to original Vizag municipal baseline.');
    }
  };

  // Upvote ticket (+1 priority merge)
  const handleUpvote = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((item) => {
        if (item.id === ticketId) {
          return {
            ...item,
            upvotes: item.upvotes + 1,
            duplicateCount: item.duplicateCount + 1,
          };
        }
        return item;
      })
    );
  };

  // Admin Update
  const handleUpdateTicketStatus = (
    ticketId: string,
    newStatus: Ticket['status'],
    notes: string,
    proofUrl?: string
  ) => {
    setTickets((prev) =>
      prev.map((item) => {
        if (item.id === ticketId) {
          return {
            ...item,
            status: newStatus,
            adminNotes: notes || item.adminNotes,
            resolvedImageUrl: proofUrl || item.resolvedImageUrl,
            aiVerificationDetails: {
              ...item.aiVerificationDetails,
              photoProofStatus:
                newStatus === 'Resolved (Photo Verified)'
                  ? 'Verified by Official Photo Proof'
                  : 'Pending Resolution',
            },
          };
        }
        return item;
      })
    );
  };

  // Live Browser Geolocation Tracker Watcher
  useEffect(() => {
    if (isSimulating) return; // Do not overwrite if user is testing simulation
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation((prev) => ({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : prev.speed,
          heading: pos.coords.heading ?? prev.heading,
          altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : prev.altitude,
          timestamp: pos.timestamp,
          isTracking: true,
          mode: 'real',
        }));
      },
      (err) => {
        console.debug('Geolocation watch notice:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isSimulating]);

  // Route Simulation Ticker
  useEffect(() => {
    if (!isSimulating) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      return;
    }

    const currentRoute =
      SIMULATED_ROUTES.find((r) => r.id === simRouteId) || SIMULATED_ROUTES[0];
    const waypoints = currentRoute.waypoints;

    simIntervalRef.current = setInterval(() => {
      simStepRef.current = (simStepRef.current + 1) % waypoints.length;
      const wp = waypoints[simStepRef.current];

      setUserLocation({
        lat: wp.lat,
        lng: wp.lng,
        accuracy: 4,
        speed: wp.speed,
        heading: wp.heading,
        altitude: 14,
        timestamp: Date.now(),
        isTracking: true,
        mode: 'simulated',
      });
    }, 2500);

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [isSimulating, simRouteId]);

  // Nearest Hazards calculation sorted by distance from live user position
  const nearestHazards = useMemo(() => {
    return tickets
      .filter((t) => t.status !== 'Resolved (Photo Verified)')
      .map((t) => {
        const dist = calculateDistanceMeters(
          userLocation.lat,
          userLocation.lng,
          t.latitude,
          t.longitude
        );
        return { ...t, distanceMeters: dist };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [tickets, userLocation.lat, userLocation.lng]);

  // Dynamic AI Route Interference Advisory
  const aiAdvisory: AiInterferenceAdvisory = useMemo(() => {
    const closest = nearestHazards[0];

    if (!closest || closest.distanceMeters > 300) {
      return {
        alertLevel: 'safe',
        headline: 'Safe Road Corridor Ahead',
        detailedAdvisory:
          'No severe unbarricaded road hazards detected in your immediate 300-metre perimeter. Traffic transit is clear.',
        recommendedAction: 'Maintain normal transit speed; keep vigilant at blind turns.',
        nearestHazardId: closest?.id,
        distanceMeters: closest?.distanceMeters,
      };
    }

    if (closest.distanceMeters <= 120) {
      return {
        alertLevel: 'danger',
        headline: `Imminent Road Hazard: ${closest.category} ${closest.distanceMeters}m Ahead!`,
        detailedAdvisory: `Attention commuter: "${closest.title}" detected directly along your trajectory in ${closest.zone}. Extreme two-wheeler skid danger.`,
        recommendedAction: 'Reduce speed below 20 km/h immediately and keep right to avoid surface drop.',
        nearestHazardId: closest.id,
        distanceMeters: closest.distanceMeters,
      };
    }

    return {
      alertLevel: 'warning',
      headline: `Approaching Reported Hazard in ${closest.distanceMeters}m (${closest.zone})`,
      detailedAdvisory: `Active hazard "${closest.title}" flagged by ${closest.duplicateCount} residents. GVMC engineering crew dispatched.`,
      recommendedAction: 'Slow down at upcoming intersection and watch for caution barricades.',
      nearestHazardId: closest.id,
      distanceMeters: closest.distanceMeters,
    };
  }, [nearestHazards]);

  // Sound chime when entering danger or warning zone
  const lastAlertLevelRef = useRef(aiAdvisory.alertLevel);
  useEffect(() => {
    if (audioAlertEnabled && aiAdvisory.alertLevel !== lastAlertLevelRef.current) {
      if (aiAdvisory.alertLevel === 'danger' || aiAdvisory.alertLevel === 'warning') {
        playHazardAlertChime(aiAdvisory.alertLevel);
      }
      lastAlertLevelRef.current = aiAdvisory.alertLevel;
    }
  }, [aiAdvisory.alertLevel, audioAlertEnabled]);

  // Filtered Tickets for Live Map / Tracker
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (selectedZone !== 'all' && t.zone !== selectedZone) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = t.title.toLowerCase().includes(q);
        const mDesc = t.description.toLowerCase().includes(q);
        const mZone = t.zone.toLowerCase().includes(q);
        const mCat = t.category.toLowerCase().includes(q);
        const mId = t.id.toLowerCase().includes(q);
        if (!mTitle && !mDesc && !mZone && !mCat && !mId) return false;
      }
      return true;
    });
  }, [tickets, selectedZone, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative selection:bg-sky-500 selection:text-white">
      {/* Live Animated Civic Intelligence Background */}
      <CivicLiveBackground isGodMode={isGodMode} />

      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (Action) */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            {/* Zone 1: Single brand mark and wordmark */}
            <div
              onClick={() => setActiveTab('home')}
              className="cursor-pointer whitespace-nowrap shrink-0 select-none"
            >
              <CivixLogo size="md" theme="dark" />
            </div>

            {/* Zone 2: 4-5 concise single-line nav links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <button
                onClick={() => setActiveTab('home')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  activeTab === 'home'
                    ? 'text-sky-400 font-bold border-b-2 border-sky-400 py-1'
                    : 'hover:text-white'
                }`}
              >
                {t.navHome}
              </button>

              <button
                onClick={() => setActiveTab('tracker')}
                className={`whitespace-nowrap shrink-0 transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'tracker'
                    ? 'text-sky-400 font-bold border-b-2 border-sky-400 py-1'
                    : 'hover:text-white'
                }`}
              >
                <span>{t.navTracker}</span>
                <span className="text-[11px] bg-sky-950 text-sky-300 font-bold px-1.5 py-0.2 rounded-full border border-sky-800">
                  {tickets.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  activeTab === 'report'
                    ? 'text-sky-400 font-bold border-b-2 border-sky-400 py-1'
                    : 'hover:text-white'
                }`}
              >
                {t.navReport}
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`whitespace-nowrap shrink-0 transition-colors flex items-center space-x-1 ${
                  activeTab === 'admin'
                    ? 'text-amber-400 font-bold border-b-2 border-amber-400 py-1'
                    : 'hover:text-white'
                }`}
              >
                <span>{t.navAdmin}</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  activeTab === 'about'
                    ? 'text-sky-400 font-bold border-b-2 border-sky-400 py-1'
                    : 'hover:text-white'
                }`}
              >
                {t.navAbout}
              </button>
            </nav>

            {/* Zone 3: 1 Primary Action + Utility Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Language Switcher */}
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    lang === 'en'
                      ? 'bg-slate-800 text-sky-400 shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('te')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    lang === 'te'
                      ? 'bg-slate-800 text-sky-400 shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  తెలుగు
                </button>
              </div>

              {/* God Mode Quick Toggle */}
              <button
                onClick={() => setIsGodMode(!isGodMode)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border hidden sm:flex items-center space-x-1 ${
                  isGodMode
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Toggle AI God Mode"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>God Mode</span>
              </button>

              {/* AI Guardian Chat Launcher */}
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-3 py-1.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 rounded-lg text-xs font-bold transition-colors border border-sky-800 flex items-center space-x-1"
                title="Ask CivixAI Guardian"
              >
                <Bot className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>

              {/* Primary Action Button */}
              <button
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0 shadow-2xs flex items-center space-x-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'సమస్యను నివేదించండి' : 'Report Issue'}</span>
              </button>

              {/* Reset Data icon */}
              <button
                onClick={handleResetData}
                title="Reset sample complaints"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-1 relative z-10">
        {/* Classic Interference Capacity Console with 2 Simple Words, Live Time, and Retest Countdown */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
          <ClassicInterferenceBanner
            userLocation={userLocation}
            tickets={tickets}
            isGodMode={isGodMode}
            onToggleGodMode={() => setIsGodMode(!isGodMode)}
            onOpenRetestModal={() => {
              setRetestActiveTicket(tickets[0]);
              setIsRetestModalOpen(true);
            }}
            onTriggerGlobalRetest={handleTriggerGlobalRetest}
            lang={lang}
          />
        </div>

        {/* VIEW 1: HOME OVERVIEW */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-12 pb-14 border-b border-slate-200">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                {/* Clean Unboxed Metadata kicker as per Anti-Slop constitution */}
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
                  <span>Live Civic Intelligence</span>
                  <span aria-hidden="true">·</span>
                  <span>Visakhapatnam, Andhra Pradesh</span>
                  <span aria-hidden="true">·</span>
                  <span>GVMC PGRS Aligned</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-snug">
                  {t.headline}
                </h1>

                <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
                  {t.problemStatement}
                </p>

                {/* Main Action Strip */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('tracker')}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <Activity className="w-5 h-5" />
                    <span>{t.ctaExplore}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('report')}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-2xs transition-all flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-5 h-5 text-sky-600" />
                    <span>{t.ctaReport}</span>
                  </button>

                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-base border border-sky-200 transition-all flex items-center justify-center space-x-2"
                  >
                    <Bot className="w-5 h-5 text-sky-600" />
                    <span>Ask AI Guardian</span>
                  </button>
                </div>

                {/* AI Interference Banner preview directly in Hero */}
                <div className="max-w-3xl mx-auto text-left pt-4">
                  <AiInterferenceBar
                    advisory={aiAdvisory}
                    audioEnabled={audioAlertEnabled}
                    onToggleAudio={() => setAudioAlertEnabled(!audioAlertEnabled)}
                    onNavigateToHazard={(id) => {
                      const found = tickets.find((tk) => tk.id === id);
                      if (found) {
                        setSelectedTicket(found);
                        setActiveTab('tracker');
                      }
                    }}
                    isSimulating={isSimulating}
                  />
                </div>
              </div>
            </section>

            {/* 3 Real Evidence Stat Cards */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                  <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                    {t.stat1Val}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{t.stat1Label}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.stat1Desc}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                  <div className="text-2xl font-black text-amber-700 tracking-tight font-mono">
                    {t.stat2Val}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{t.stat2Label}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.stat2Desc}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                  <div className="text-2xl font-black text-rose-700 tracking-tight font-mono">
                    {t.stat3Val}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{t.stat3Label}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.stat3Desc}</p>
                </div>
              </div>
            </section>

            {/* Innovation Showcase */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
                <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'te' ? 'ప్రధాన ఆవిష్కరణ' : 'Core Innovation'}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {t.diffTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                  {t.diffDesc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-sm">
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <div className="text-sky-400 font-bold font-mono text-base mb-1">01</div>
                    <div className="font-semibold text-white">{t.diff1}</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <div className="text-cyan-400 font-bold font-mono text-base mb-1">02</div>
                    <div className="font-semibold text-white">{t.diff2}</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <div className="text-emerald-400 font-bold font-mono text-base mb-1">03</div>
                    <div className="font-semibold text-white">{t.diff3}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Vizag Zones Quick Selector */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {lang === 'te' ? 'వైజాగ్ ప్రాంతాల వారీగా సమస్యలు' : 'Explore Active Vizag Zones'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Select a zone to inspect local ward complaints and road hazards
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="text-sm text-sky-600 hover:text-sky-700 font-semibold flex items-center"
                >
                  <span>View All on Map</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {VIZAG_ZONES.map((z) => {
                  const count = tickets.filter((tk) => tk.zone === z.name).length;
                  return (
                    <button
                      key={z.name}
                      onClick={() => {
                        setSelectedZone(z.name);
                        setActiveTab('tracker');
                      }}
                      className="p-4 bg-white hover:bg-sky-50/70 rounded-2xl border border-slate-200 text-left transition-all hover:border-sky-300 group shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-800 group-hover:text-sky-700">
                          {z.name}
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full group-hover:bg-sky-100 group-hover:text-sky-800">
                          {count}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate">{z.ward}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: LIVE MAP & GPS TRACKER */}
        {activeTab === 'tracker' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t.liveTrackerTitle}
                  </h1>
                  <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {filteredTickets.length} of {tickets.length} Hazards
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{t.liveTrackerSubtitle}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSimpleMode(!isSimpleMode)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors border ${
                    isSimpleMode
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSimpleMode ? t.detailedMode : t.simpleMode}
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center space-x-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'సమస్య నమోదు' : 'Report Hazard'}</span>
                </button>
              </div>
            </div>

            {/* AI Proximity Interference Advisory Banner */}
            <AiInterferenceBar
              advisory={aiAdvisory}
              audioEnabled={audioAlertEnabled}
              onToggleAudio={() => setAudioAlertEnabled(!audioAlertEnabled)}
              onNavigateToHazard={(id) => {
                const found = tickets.find((tk) => tk.id === id);
                if (found) setSelectedTicket(found);
              }}
              isSimulating={isSimulating}
            />

            {/* Leaflet Map with Satellite / Hybrid / Street Controls */}
            <div className="bg-white rounded-3xl border border-slate-200 p-3 shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between px-2 py-1 text-xs font-bold text-slate-700 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sky-800">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-sky-600" />
                    Visakhapatnam Geotagged Hazard &amp; Live Location Map
                  </span>
                  <span className="text-slate-400 font-normal hidden sm:inline">
                    · 🛰️ High-Res Esri Satellite Active
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600 mr-1"></span> Pending
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span> In Progress
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-1"></span> Resolved
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 mr-1 animate-pulse"></span> Commuter Live GPS
                  </span>
                </div>
              </div>

              <InteractiveMap
                tickets={filteredTickets}
                userLocation={userLocation}
                selectedTicket={selectedTicket}
                onSelectTicket={(tk) => setSelectedTicket(tk)}
                onInspectTicket={(tk) => setAuditModalTicket(tk)}
                onUpvoteTicket={handleUpvote}
                heightClass="h-[460px]"
                focusLocationTrigger={focusLocationTrigger}
              />
            </div>

            {/* Live GPS Telemetry and Proximity Radar HUD */}
            <LiveLocationTracker
              userLocation={userLocation}
              nearestHazards={nearestHazards}
              onCenterOnUser={() => setFocusLocationTrigger((prev) => prev + 1)}
              isSimulating={isSimulating}
              selectedRouteId={simRouteId}
              onSelectRoute={(id) => setSimRouteId(id)}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
              routes={SIMULATED_ROUTES}
              onSelectHazard={(tk) => setSelectedTicket(tk)}
              onInspectPhotoProof={(tk) => setAuditModalTicket(tk)}
              onUpvote={handleUpvote}
              lang={lang}
            />

            {/* Filter Toolbar & All Tickets Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />

                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="all">{t.allZones}</option>
                  {VIZAG_ZONES.map((z) => (
                    <option key={z.name} value={z.name}>
                      {z.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="all">{t.allCategories}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="all">{t.allStatuses}</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved (Photo Verified)">Resolved (Photo Verified)</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => {
                const isResolved = ticket.status === 'Resolved (Photo Verified)';
                const isInProgress = ticket.status === 'In Progress';

                return (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-3xl border transition-all hover:shadow-md flex flex-col overflow-hidden ${
                      isResolved
                        ? 'border-emerald-300'
                        : isInProgress
                        ? 'border-amber-300'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src={ticket.imageUrl}
                        alt={ticket.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                          {ticket.id}
                        </span>
                        {ticket.isSample && (
                          <span className="bg-sky-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-2xs">
                            {t.sampleBadge}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center space-x-1 ${
                            isResolved
                              ? 'bg-emerald-600 text-white'
                              : isInProgress
                              ? 'bg-amber-500 text-white'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {isResolved && <CheckCircle className="w-3 h-3 mr-0.5" />}
                          <span>{ticket.status}</span>
                        </span>
                      </div>

                      {ticket.duplicateCount > 1 && (
                        <div className="absolute bottom-2.5 left-2.5 bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center shadow-2xs">
                          <Layers className="w-3 h-3 mr-1" />
                          <span>{ticket.duplicateCount} Bundled (Within 200m)</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                          <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                            {ticket.zone}
                          </span>
                          <span>{ticket.reportedAt}</span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                          {ticket.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Urgency Score:</span>
                          <span className="font-bold text-rose-600">
                            {ticket.urgencyScore} / 10 ({ticket.urgencyLevel})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Department:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                            {ticket.assignedDepartment.split('(')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Complaint Retest & Post-Repair Quality Status */}
                      <div className="p-2.5 bg-slate-900/90 text-slate-200 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              ticket.retestStatus === 'Retested Safe'
                                ? 'bg-emerald-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          <div className="flex flex-col leading-tight">
                            <span className="font-bold text-white text-[11px]">
                              {ticket.retestStatus || 'Retest Scheduled'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Retested: {ticket.lastRetestedAt || 'Pending'} · Next: {ticket.nextScheduledRetestAt?.split(' ')[1] || '24h'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setRetestActiveTicket(ticket);
                            setIsRetestModalOpen(true);
                          }}
                          className="px-2 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-[10px] font-bold border border-sky-400/30 transition-colors shrink-0"
                        >
                          Retest Log
                        </button>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <button
                          onClick={() => handleUpvote(ticket.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5"
                        >
                          <span>👍 {t.upvote}</span>
                          <span className="bg-white px-1.5 py-0.2 rounded text-slate-800 shadow-2xs ml-1">
                            {ticket.upvotes}
                          </span>
                        </button>

                        <button
                          onClick={() => setAuditModalTicket(ticket)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.verifyResolutionBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: REPORT HAZARD */}
        {activeTab === 'report' && (
          <ReportView
            tickets={tickets}
            onAddTicket={(newT) => {
              setTickets((prev) => [newT, ...prev]);
              setSelectedTicket(newT);
            }}
            onUpvoteTicket={handleUpvote}
            onNavigateToTracker={() => setActiveTab('tracker')}
            lang={lang}
          />
        )}

        {/* VIEW 4: OFFICIAL ADMIN DESK */}
        {activeTab === 'admin' && (
          <AdminView
            tickets={tickets}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onInspectTicket={(tk) => setAuditModalTicket(tk)}
            lang={lang}
          />
        )}

        {/* VIEW 5: ABOUT & BLUEPRINT */}
        {activeTab === 'about' && <AboutView lang={lang} />}
      </main>

      {/* Resolution Photo Audit Modal */}
      <ResolutionAuditModal
        ticket={auditModalTicket}
        onClose={() => setAuditModalTicket(null)}
        lang={lang}
      />

      {/* Retest & Quality Assurance Modal */}
      <RetestAuditModal
        isOpen={isRetestModalOpen}
        onClose={() => setIsRetestModalOpen(false)}
        tickets={tickets}
        selectedTicket={retestActiveTicket}
        onSelectTicket={(t) => setRetestActiveTicket(t)}
        onRetestTicket={handleRetestTicket}
        isGodMode={isGodMode}
        lang={lang}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        lang={lang}
      />

      {/* Classic Dark Footer */}
      <footer className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 py-6 text-sm text-slate-400 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <CivixLogo size="sm" theme="dark" />
            <span>·</span>
            <span>Visakhapatnam, Andhra Pradesh, India</span>
            <span>·</span>
            <span className="text-sky-400 font-medium">Team Syntax Squad</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span>GVMC Municipal Engineering &amp; Autonomous AI Retest Protocol</span>
            <span>·</span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-rose-400 underline"
            >
              {t.clearData}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
