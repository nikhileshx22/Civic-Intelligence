import React from 'react';
import { UserLocation, Ticket } from '../types/civic';
import { formatDistance } from '../utils/geo';
import {
  Compass,
  Gauge,
  MapPin,
  Crosshair,
  Play,
  Square,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Layers,
} from 'lucide-react';

interface LiveLocationTrackerProps {
  userLocation: UserLocation | null;
  nearestHazards: Array<Ticket & { distanceMeters: number }>;
  onCenterOnUser: () => void;
  isSimulating: boolean;
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onToggleSimulation: () => void;
  routes: Array<{ id: string; name: string; description: string }>;
  onSelectHazard: (ticket: Ticket) => void;
  onInspectPhotoProof: (ticket: Ticket) => void;
  onUpvote: (ticketId: string) => void;
  lang: 'en' | 'te';
}

export const LiveLocationTracker: React.FC<LiveLocationTrackerProps> = ({
  userLocation,
  nearestHazards,
  onCenterOnUser,
  isSimulating,
  selectedRouteId,
  onSelectRoute,
  onToggleSimulation,
  routes,
  onSelectHazard,
  onInspectPhotoProof,
  onUpvote,
  lang,
}) => {
  const isTe = lang === 'te';

  return (
    <div className="space-y-6">
      {/* Live Telemetry HUD Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3.5 h-3.5 rounded-full bg-sky-500 animate-ping absolute inset-0 opacity-75"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-sky-600 relative"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                  {isTe ? 'లైవ్ GPS కమ్యూటర్ టెలిమెట్రీ' : 'Live Commuter GPS Telemetry'}
                </h3>
                <span className="text-xs bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded border border-sky-200">
                  {userLocation?.mode === 'simulated'
                    ? isTe
                      ? 'సిమ్యులేషన్ మోడ్'
                      : 'Simulated Route'
                    : isTe
                    ? 'నిజమైన బ్రౌజర్ GPS'
                    : 'Real Browser GPS'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTe
                  ? 'ప్రయాణ మార్గంలో రోడ్డు గుంతలు మరియు ప్రమాదాలను నిజ సమయంలో గమనిస్తుంది'
                  : 'Monitors real-time coordinates, speed, and 200m hazard proximity'}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onCenterOnUser}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-200"
            >
              <Crosshair className="w-3.5 h-3.5 text-sky-600" />
              <span>{isTe ? 'నా లొకేషన్ చూపించు' : 'Center on Me'}</span>
            </button>

            <button
              onClick={onToggleSimulation}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs ${
                isSimulating
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isSimulating ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>{isTe ? 'సిమ్యులేషన్ ఆపు' : 'Stop Route'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{isTe ? 'టెస్ట్ ప్రయాణం ప్రారంభించు' : 'Test Commute Route'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Telemetry Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>{isTe ? 'GPS కోఆర్డినేట్స్' : 'Current Coordinates'}</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-sm truncate">
              {userLocation
                ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : '17.7431, 83.3364'}
            </div>
            <div className="text-[11px] text-slate-500">
              {isTe ? 'ఖచ్చితత్వం:' : 'Accuracy:'} ±{userLocation?.accuracy || 12}m
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 font-semibold">
              <Gauge className="w-3.5 h-3.5 text-amber-600" />
              <span>{isTe ? 'ప్రయాణ వేగం' : 'Transit Speed'}</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-sm">
              {userLocation?.speed ? `${Math.round(userLocation.speed)} km/h` : '0 km/h (Stationary)'}
            </div>
            <div className="text-[11px] text-slate-500">
              {isTe ? 'సగటు ప్రయాణ వేగం' : 'Two-wheeler / Walk speed'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 font-semibold">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTe ? 'దిశ (Compass)' : 'Compass Bearing'}</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-sm">
              {userLocation?.heading ? `${Math.round(userLocation.heading)}° Direction` : 'Facing South-West'}
            </div>
            <div className="text-[11px] text-slate-500">
              {isTe ? 'ప్రయాణ దిశ' : 'Relative heading'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 font-semibold">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>{isTe ? '200మీ క్లస్టర్ రాడార్' : '200m Cluster Radar'}</span>
            </div>
            <div className="font-bold text-slate-800 text-sm">
              {nearestHazards.filter((h) => h.distanceMeters <= 200).length} {isTe ? 'సమీప సమస్యలు' : 'Hazards in 200m'}
            </div>
            <div className="text-[11px] text-slate-500">
              {isTe ? 'డూప్లికేట్ జోన్ పరిధి' : 'Auto-merge radius'}
            </div>
          </div>
        </div>

        {/* Route Selector when Simulation is available */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-600">
            {isTe ? 'టెస్ట్ ప్రయాణ మార్గం ఎంచుకోండి:' : 'Select Commuter Simulation Route:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {routes.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectRoute(r.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  selectedRouteId === r.id
                    ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Proximity Hazard Radar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                {isTe ? 'సమీప మున్సిపల్ ప్రమాదాల రాడార్' : 'Proximity Hazard Radar (Closest to You)'}
              </h3>
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {nearestHazards.length} {isTe ? 'గుర్తించబడ్డాయి' : 'Monitored'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTe
                ? 'మీ ప్రస్తుత లొకేషన్ నుండి దూరం ఆధారంగా క్రమబద్ధీకరించబడింది'
                : 'Live distances dynamically computed relative to your current GPS coordinates'}
            </p>
          </div>
        </div>

        {nearestHazards.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">
              {isTe ? 'సమీపంలో ఎలాంటి రోడ్డు ప్రమాదాలు లేవు' : 'All clear! No civic hazards detected within 500m'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearestHazards.map((hazard) => {
              const isImminent = hazard.distanceMeters <= 100;
              const isClose = hazard.distanceMeters <= 200;
              const isResolved = hazard.status === 'Resolved (Photo Verified)';

              return (
                <div
                  key={hazard.id}
                  className={`bg-white rounded-2xl border transition-all hover:shadow-md p-4 flex flex-col justify-between space-y-3 ${
                    isImminent && !isResolved
                      ? 'border-rose-400 bg-rose-50/20'
                      : isClose && !isResolved
                      ? 'border-amber-400 bg-amber-50/15'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs flex items-center space-x-1 ${
                          isImminent && !isResolved
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isClose && !isResolved
                            ? 'bg-amber-500 text-white'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        <span>{formatDistance(hazard.distanceMeters)} away</span>
                      </span>

                      <span className="text-slate-500 font-semibold">{hazard.zone}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                      {hazard.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {hazard.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">GVMC Officer:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[150px]">
                        {hazard.assignedOfficer.split('(')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => onSelectHazard(hazard)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>Focus Pin</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onUpvote(hazard.id)}
                        className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg transition-colors border border-sky-200"
                      >
                        👍 +1 ({hazard.upvotes})
                      </button>

                      <button
                        onClick={() => onInspectPhotoProof(hazard)}
                        className="py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Proof
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
