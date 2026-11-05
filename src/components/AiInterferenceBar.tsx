import React from 'react';
import { AiInterferenceAdvisory } from '../types/civic';
import { AlertTriangle, ShieldCheck, AlertOctagon, Volume2, VolumeX, Navigation } from 'lucide-react';

interface AiInterferenceBarProps {
  advisory: AiInterferenceAdvisory;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onNavigateToHazard?: (ticketId: string) => void;
  onDismiss?: () => void;
  isSimulating?: boolean;
}

export const AiInterferenceBar: React.FC<AiInterferenceBarProps> = ({
  advisory,
  audioEnabled,
  onToggleAudio,
  onNavigateToHazard,
  isSimulating,
}) => {
  const isDanger = advisory.alertLevel === 'danger';
  const isWarning = advisory.alertLevel === 'warning';
  const isSafe = advisory.alertLevel === 'safe';

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
        isDanger
          ? 'bg-rose-50 border-rose-300 text-rose-950'
          : isWarning
          ? 'bg-amber-50 border-amber-300 text-amber-950'
          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 ${
              isDanger
                ? 'bg-rose-600 text-white'
                : isWarning
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isDanger && <AlertOctagon className="w-5 h-5 animate-bounce" />}
            {isWarning && <AlertTriangle className="w-5 h-5" />}
            {isSafe && <ShieldCheck className="w-5 h-5" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md font-mono bg-white/80 border border-black/5 shadow-xs">
                {isDanger
                  ? 'AI Hazard Interference'
                  : isWarning
                  ? 'AI Caution Advisory'
                  : 'AI Route Guardian'}
              </span>
              {isSimulating && (
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                  Simulated Commute Active
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              {advisory.headline}
            </h3>

            <p className="text-sm opacity-90 leading-relaxed max-w-3xl">
              {advisory.detailedAdvisory}
            </p>

            <div className="pt-1 flex items-center space-x-2 text-xs font-semibold">
              <span className="opacity-75">Recommended Action:</span>
              <span className="underline decoration-1 underline-offset-2">
                {advisory.recommendedAction}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
          {advisory.nearestHazardId && onNavigateToHazard && (
            <button
              onClick={() => onNavigateToHazard(advisory.nearestHazardId!)}
              className="px-3 py-2 bg-white/90 hover:bg-white text-xs font-bold rounded-xl border border-black/10 transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span>Inspect on Map</span>
            </button>
          )}

          <button
            onClick={onToggleAudio}
            title={audioEnabled ? 'Mute Proximity Chime' : 'Enable Proximity Audio Chime'}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              audioEnabled
                ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                : 'bg-white/80 text-slate-700 border-black/10 hover:bg-white'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
