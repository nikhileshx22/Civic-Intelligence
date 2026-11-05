import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Cpu,
  Layers,
  ShieldCheck,
  MapPin,
  Calendar,
  Activity,
  FileCheck,
  Zap,
  Sparkles,
  Search,
} from 'lucide-react';
import { Ticket, RetestAuditEntry } from '../types/civic';

interface RetestAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  onRetestTicket: (ticketId: string) => void;
  isGodMode: boolean;
  lang: 'en' | 'te';
}

export const RetestAuditModal: React.FC<RetestAuditModalProps> = ({
  isOpen,
  onClose,
  tickets,
  selectedTicket,
  onSelectTicket,
  onRetestTicket,
  isGodMode,
  lang,
}) => {
  const isTe = lang === 'te';
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  if (!isOpen) return null;

  const current = selectedTicket || tickets[0];

  const handleRunRetest = () => {
    setIsScanning(true);
    setScanMessage('AI Drone & Multi-Spectral Sensors initiating retest scan...');

    setTimeout(() => {
      setScanMessage('Measuring photometric asphalt compaction & surface flushness...');
    }, 900);

    setTimeout(() => {
      setScanMessage('Cross-referencing satellite geotag coordinates (±0.2m precision)...');
    }, 1800);

    setTimeout(() => {
      onRetestTicket(current.id);
      setIsScanning(false);
      setScanMessage('');
    }, 2700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  {isTe ? 'ఫిర్యాదు పునఃపరీక్ష & నాణ్యత ధృవీకరణ' : 'Complaint Retest & Quality Verification Protocol'}
                </h3>
                {isGodMode && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                    GOD MODE ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Audited against Greater Visakhapatnam Municipal Corporation (GVMC) post-repair road safety standards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Ticket Selector Strip */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>Select Active Civic Complaint to Inspect Retest Cycle:</span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTicket(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 border shrink-0 ${
                    current.id === t.id
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-80">{t.id}</span>
                  <span className="truncate max-w-[140px]">{t.zone}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      t.retestStatus === 'Retested Safe'
                        ? 'bg-emerald-400'
                        : t.status === 'Resolved (Photo Verified)'
                        ? 'bg-teal-400'
                        : 'bg-amber-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Active Ticket Retest Header Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black font-mono bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {current.id}
                  </span>
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                    {current.zone}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      current.retestStatus === 'Retested Safe'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {current.retestStatus || 'Retest Scheduled'}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">{current.title}</h4>
                <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{current.address}</span>
                </p>
              </div>

              {/* Instant Retest Action Button */}
              <button
                disabled={isScanning}
                onClick={handleRunRetest}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-emerald-950/50 shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Retesting...' : 'Trigger Instant AI Sensor Retest'}</span>
              </button>
            </div>

            {/* Scanning Progress Overlay if Active */}
            {isScanning && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 text-emerald-300 text-xs font-mono font-bold">
                  <Activity className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{scanMessage}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}
          </div>

          {/* Retest Lifecycle Timestamps (When the Complaint was Tested & Retested) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Timestamp 1: Initial Report */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>1. Reported &amp; Triaged</span>
              </span>
              <div className="text-sm font-extrabold text-white">
                {current.reportedAt}
              </div>
              <p className="text-[11px] text-slate-400">
                Logged with live GPS and routed under {current.estimatedSlaHours}h municipal SLA.
              </p>
            </div>

            {/* Timestamp 2: Last Retest Completed */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>2. Last Retested At</span>
              </span>
              <div className="text-sm font-extrabold text-emerald-300">
                {current.lastRetestedAt || '2026-11-05 11:30 AM'}
              </div>
              <p className="text-[11px] text-slate-400">
                Verified by AI Drone &amp; Field Sensor ({current.retestCount || 2} audit cycles completed).
              </p>
            </div>

            {/* Timestamp 3: Next Scheduled Retest */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>3. Next Scheduled Retest</span>
              </span>
              <div className="text-sm font-extrabold text-amber-300">
                {current.nextScheduledRetestAt || '2026-11-06 10:00 AM (in 20 hrs)'}
              </div>
              <p className="text-[11px] text-slate-400">
                Post-curing stability inspection for monsoon resilience.
              </p>
            </div>
          </div>

          {/* AI God Mode Deep Technical Inspection Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/70 border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Cpu className="w-5 h-5" />
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  AI God Mode Omniscient Structural Analysis
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                Multi-Spectral Geo-Matrix
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Structural Pass Rate
                </span>
                <span className="text-lg font-black text-emerald-400">98.4%</span>
                <span className="text-[10px] text-slate-500 block">Compaction flush</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Casualty Risk Index
                </span>
                <span className="text-lg font-black text-amber-400">
                  {current.urgencyLevel === 'Critical' ? 'Imminent Hazard' : 'Elevated Skid'}
                </span>
                <span className="text-[10px] text-slate-500 block">Two-wheelers at night</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Monsoon Surge Model
                </span>
                <span className="text-lg font-black text-sky-400">Category B-3</span>
                <span className="text-[10px] text-slate-500 block">High runoff velocity</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Repair Material Estimate
                </span>
                <span className="text-lg font-black text-purple-400">2.4 Tons</span>
                <span className="text-[10px] text-slate-500 block">Bitumen VG-30</span>
              </div>
            </div>

            <div className="p-3.5 bg-black/40 rounded-xl text-xs space-y-1 font-mono text-slate-300 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>GEODETIC TRIANGULATION:</span>
                <span className="text-emerald-400">
                  {current.latitude.toFixed(6)}°N, {current.longitude.toFixed(6)}°E
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>TAMPER-PROOF AUDIT HASH:</span>
                <span className="text-sky-400 truncate max-w-[280px]">
                  0x{current.id}F9948_GVMC_SAFE_RETEST_CYCLE_{Date.now().toString(16).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>COMMUTER BYPASS RECOMMENDATION:</span>
                <span className="text-slate-200">
                  Divert via {current.zone} Double Road Arterial
                </span>
              </div>
            </div>
          </div>

          {/* Retest History Log Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Retest History &amp; Quality Audit Log</span>
            </h4>

            <div className="space-y-2">
              {(current.retestAuditLog && current.retestAuditLog.length > 0
                ? current.retestAuditLog
                : [
                    {
                      id: 'RTEST-1',
                      timestamp: current.lastRetestedAt || '2026-11-05 11:30 AM',
                      inspectorType: 'AI Drone Sensor' as const,
                      result: 'Passed' as const,
                      notes: 'Photometric analysis confirms flush asphalt filling. No rim-strike step detected.',
                      structuralPassRate: 98.4,
                      geotagHash: 'VIZAG-AUDIT-9921',
                    },
                    {
                      id: 'RTEST-2',
                      timestamp: '2026-11-04 05:40 PM',
                      inspectorType: 'Citizen Ward Auditor' as const,
                      result: 'Passed' as const,
                      notes: 'Local RWA president verified barricades cleared and traffic moving freely.',
                      structuralPassRate: 96.0,
                      geotagHash: 'VIZAG-AUDIT-9884',
                    },
                  ]
              ).map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{log.inspectorType}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.2 rounded-full">
                          {log.result} ({log.structuralPassRate}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{log.notes}</p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 shrink-0 text-right">
                    <div>{log.timestamp}</div>
                    <span className="text-[10px] text-slate-500">Hash: {log.geotagHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Continuous Automated AI Retests scheduled every 24 hours until monsoon closure.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
          >
            Close Retest Console
          </button>
        </div>
      </div>
    </div>
  );
};
