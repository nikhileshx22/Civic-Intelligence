import React, { useState, useRef, useMemo } from 'react';
import { Ticket, HazardCategory, AiTriageResult } from '../types/civic';
import { VIZAG_ZONES, CATEGORIES, SAMPLE_PRESETS } from '../data/mockData';
import { calculateDistanceMeters } from '../utils/geo';
import {
  Upload,
  Navigation,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  Zap,
  Check,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface ReportViewProps {
  tickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  onUpvoteTicket: (ticketId: string) => void;
  onNavigateToTracker: () => void;
  lang: 'en' | 'te';
}

interface NearbyDuplicateInfo extends Ticket {
  calculatedDistance: number;
}

export const ReportView: React.FC<ReportViewProps> = ({
  tickets,
  onAddTicket,
  onUpvoteTicket,
  onNavigateToTracker,
  lang,
}) => {
  const isTe = lang === 'te';

  const [photo, setPhoto] = useState(SAMPLE_PRESETS[0].url);
  const [category, setCategory] = useState<HazardCategory | 'Auto-Detect'>(
    SAMPLE_PRESETS[0].category
  );
  const [zone, setZone] = useState(SAMPLE_PRESETS[0].zone);
  const [lat, setLat] = useState(SAMPLE_PRESETS[0].lat);
  const [lng, setLng] = useState(SAMPLE_PRESETS[0].lng);
  const [address, setAddress] = useState(
    'Sector 4 Main Road, near Rythu Bazar, MVP Colony'
  );
  const [desc, setDesc] = useState(SAMPLE_PRESETS[0].desc);
  const [gpsStatus, setGpsStatus] = useState('Zone Coordinates Active');
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiTriageResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Proximity 200m Duplicate Detection
  const nearbyDuplicate = useMemo<NearbyDuplicateInfo | null>(() => {
    let closest: NearbyDuplicateInfo | null = null;
    let minDistance = Infinity;

    tickets.forEach((t) => {
      if (t.status === 'Resolved (Photo Verified)') return;
      const dist = calculateDistanceMeters(lat, lng, t.latitude, t.longitude);
      if (dist <= 200 && dist < minDistance) {
        minDistance = dist;
        closest = { ...t, calculatedDistance: dist };
      }
    });

    return closest;
  }, [lat, lng, tickets]);

  const handleCaptureLiveGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by browser. Using zone coordinates.');
      return;
    }

    setIsLocating(true);
    setGpsStatus('Locating via live GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGpsStatus(
          `GPS Locked (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} ±${Math.round(pos.coords.accuracy)}m)`
        );
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS error, using zone center:', err);
        const z = VIZAG_ZONES.find((item) => item.name === zone) || VIZAG_ZONES[0];
        setLat(z.lat);
        setLng(z.lng);
        setGpsStatus(`${z.name} Center Locked`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      if (loadEvt.target?.result) {
        setPhoto(loadEvt.target.result as string);
        setAiResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setPhoto(preset.url);
    setCategory(preset.category);
    setZone(preset.zone);
    setLat(preset.lat);
    setLng(preset.lng);
    setDesc(preset.desc);
    setAddress(`${preset.desc.split('near ')[1] || preset.zone}, Visakhapatnam`);
    setGpsStatus(`${preset.zone} Preset Locked (${preset.lat}, ${preset.lng})`);
    setAiResult(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!desc || desc.trim().length < 5) {
      setErrorMsg(
        isTe
          ? 'దయచేసి సమస్య వివరాలు లేదా ల్యాండ్‌మార్క్ వివరంగా నమోదు చేయండి (కనీసం 5 అక్షరాలు).'
          : 'Please enter a clear description or landmark (minimum 5 characters).'
      );
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo,
          category,
          zone,
          address,
          desc,
          nearbyMatch: nearbyDuplicate,
        }),
      });

      let triageData: AiTriageResult;
      if (res.ok) {
        const body = await res.json();
        triageData = body.data;
      } else {
        throw new Error('Triage API response failed');
      }

      setAiResult(triageData);

      // CRITICAL: If the AI detects it is NOT a valid municipal hazard, REJECT and DO NOT create ticket!
      if (!triageData.isValidHazard) {
        return;
      }

      // Valid municipal hazard confirmed by AI: Register new ticket
      const newId = `CP-${Math.floor(100 + Math.random() * 900)}`;
      const nowStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newTicket: Ticket = {
        id: newId,
        title: desc.slice(0, 50) + (desc.length > 50 ? '...' : ''),
        category:
          triageData.detectedCategory ||
          (category === 'Auto-Detect' ? 'Pothole / Road Damage' : category),
        zone,
        address: address || `${zone}, Visakhapatnam`,
        latitude: lat,
        longitude: lng,
        description: desc,
        imageUrl: photo,
        status: 'Pending',
        urgencyScore: triageData.urgencyScore || 8.5,
        urgencyLevel: triageData.urgencyLevel || 'High',
        upvotes: 1,
        reportedAt: nowStr,
        isSample: false,
        duplicateCount: triageData.isDuplicate ? 2 : 1,
        bundledTicketIds:
          triageData.isDuplicate && triageData.duplicateMatchTicketId
            ? [triageData.duplicateMatchTicketId]
            : [],
        assignedDepartment: triageData.assignedDepartment || `GVMC Engineering - ${zone}`,
        assignedOfficer: triageData.assignedOfficer || 'Sri. M. Varun Kumar (Ward Engineer)',
        estimatedSlaHours: triageData.estimatedSlaHours || 24,
        adminNotes:
          'Verified by AI Gatekeeper. Awaiting GVMC field crew verification.',
        retestCount: 0,
        retestStatus: 'Initial Inspection',
        lastRetestedAt: undefined,
        nextScheduledRetestAt: `${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-CA')} 10:00 AM (Post-Triage)`,
        retestAuditLog: [
          {
            id: `RTEST-${newId}-INIT`,
            timestamp: nowStr,
            inspectorType: 'AI Drone Sensor',
            result: 'Warning',
            notes:
              'Initial defect detected by AI Gatekeeper. Scheduled for GVMC field repair and 24h follow-up retest.',
            structuralPassRate: 35.0,
            geotagHash: `0x${newId}_INIT_LOG`,
          },
        ],
        godModeAnalysis: {
          structuralIntegrityScore: 35,
          casualtyRiskRating:
            triageData.urgencyLevel === 'Critical'
              ? 'Severe Hazard'
              : 'Moderate',
          monsoonErosionVulnerability: 'Class B-3 (Active Infiltration)',
          coastalSalinityIndex: '0.82 (High Saline Atmosphere)',
          rootCauseAnalysis:
            'Physical surface trauma requiring cold-mix compaction and sealing.',
          microCoordinates: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`,
          materialEstimation: '1.8 Tons Bitumen VG-30 + 0.8 cu.m Base Course',
          estimatedRepairCostINR: '₹14,200',
          emergencyBypassRoute: `Use alternate parallel lane in ${zone}`,
          satelliteAuditConfidence: 99.1,
        },
        aiVerificationDetails: {
          hazardFactors: triageData.hazardFactors || [
            'Severe two-wheeler skid hazard',
            'Transit corridor risk in ' + zone,
          ],
          triageReasoning:
            triageData.triageReasoning || 'AI validated genuine urban hazard.',
          photoProofStatus: 'Pending Resolution',
          commuterImpact:
            triageData.commuterImpact ||
            'Road obstruction impeding commuter transit.',
        },
      };

      onAddTicket(newTicket);
    } catch (err) {
      console.error('Triage submission error:', err);
      setErrorMsg(
        isTe
          ? 'సమర్పణ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
          : 'Triage analysis could not complete. Please check network and retry.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
            {isTe ? 'AI గేట్‌కీపర్ యాక్టివ్' : 'AI Hazard Gatekeeper Active'}
          </span>
          <span className="text-xs text-slate-500">
            {isTe ? 'కేవలం ప్రజా సమస్యలను మాత్రమే అనుమతిస్తుంది' : 'Detects real hazards & rejects non-hazard uploads'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isTe
            ? 'విశాఖపట్నంలో ప్రజా సమస్యను నివేదించండి'
            : 'Report a Civic Hazard in Visakhapatnam'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {isTe
            ? 'ఫోటో తీయండి, GPS లొకేషన్ ఎంచుకోండి; మా AI ఫోటోను పరీక్షించి నిజమైన ప్రమాదాలను మాత్రమే GVMC కి పంపుతుంది.'
            : 'Snap or upload photo, lock GPS coordinates; our AI gatekeeper strictly verifies physical infrastructure hazards and automatically rejects unrelated images.'}
        </p>
      </div>

      {/* 1-Click Quick Preset Selector (With Real Hazards & Non-Hazard Rejection Tests) */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1 text-sky-600" />
            {isTe ? '1-క్లిక్ టెస్ట్ దృశ్యాలు (ప్రమాదాలు & తిరస్కరణ టెస్ట్):' : '1-Click Test Scenarios (Hazards & AI Rejection Tests):'}
          </span>
          <span className="text-xs text-sky-700 hidden sm:inline">
            {isTe ? 'నిజమైన ప్రమాదం లేదా నాన్-హజార్డ్ తిరస్కరణను పరీక్షించండి' : 'Test genuine hazards or verify AI rejection of selfies/pets/food'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => {
            const isSelected = photo === preset.url;
            const isRejectTest = preset.label.startsWith('❌');

            return (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                  isSelected
                    ? isRejectTest
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                    : isRejectTest
                    ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 200m Proximity Duplicate Warning */}
      {nearbyDuplicate && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-200/80 rounded-xl text-amber-800 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-base font-bold text-amber-900 flex items-center flex-wrap gap-1.5">
                <span>
                  {isTe
                    ? 'సమీపంలో (200 మీటర్లలో) ఇదే సమస్య గుర్తించబడింది!'
                    : 'Nearby Duplicate Hazard Detected (within 200m)!'}
                </span>
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono font-bold">
                  {nearbyDuplicate.calculatedDistance}m away · Ticket #{nearbyDuplicate.id}
                </span>
              </h3>
              <p className="text-sm text-amber-800">
                {isTe
                  ? 'మీ స్థానానికి 200 మీటర్ల పరిధిలో ఇప్పటికే ఫిర్యాదు ఉంది. మద్దతు ఇవ్వడం వల్ల ప్రాధాన్యత వెంటనే పెరుగుతుంది!'
                  : 'A matching complaint was detected within 200 metres of your coordinates. Upvoting merges your report to escalate municipal priority immediately!'}
              </p>
              <p className="text-xs text-amber-900 font-medium">
                Existing: <strong>{nearbyDuplicate.title}</strong> ({nearbyDuplicate.upvotes} citizen votes)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                onUpvoteTicket(nearbyDuplicate.id);
                alert(`Merged report into existing Ticket #${nearbyDuplicate.id} with +1 Upvote!`);
                onNavigateToTracker();
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>
                {isTe
                  ? 'ఏకం చేసి ప్రాధాన్యత పెంచండి (+1 Upvote)'
                  : 'Merge & Boost Priority (+1 Upvote)'}
              </span>
            </button>
            <span className="text-xs text-amber-800 font-medium">
              {isTe
                ? 'లేదా కొత్త సమస్యగా కింద కొనసాగించండి'
                : 'or continue below to submit as distinct hazard'}
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6"
      >
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Photo Upload & Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            {isTe ? 'సమస్య ఫోటో' : 'Hazard Photograph'} <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-1 aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs relative">
              <img src={photo} alt="Hazard preview" className="w-full h-full object-cover" />
            </div>

            <div className="sm:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center space-x-2 border border-slate-300 shadow-2xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isTe ? 'ఫోటో అప్‌లోడ్ / స్నాప్' : 'Upload / Snap Photo'}</span>
                </button>
                <span className="text-xs text-slate-500">
                  {isTe ? 'కెమెరా లేదా ఫోటో ఫైల్' : 'JPG, PNG, or camera snap'}
                </span>
              </div>

              <input
                type="url"
                value={photo}
                onChange={(e) => {
                  setPhoto(e.target.value);
                  setAiResult(null);
                }}
                placeholder="Or paste direct image URL..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* GPS Geolocation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-800">
              {isTe ? 'సమస్య GPS లొకేషన్ & వైజాగ్ ప్రాంతం' : 'Hazard Geolocation & Vizag Zone'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleCaptureLiveGPS}
              disabled={isLocating}
              className="text-xs px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg border border-sky-200 transition-colors flex items-center space-x-1"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating
                  ? 'Detecting...'
                  : isTe
                  ? 'లైవ్ GPS గుర్తించండి'
                  : 'Capture Live GPS'}
              </span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-semibold text-slate-700">{gpsStatus}</span>
            </div>
            <span className="text-slate-500 font-mono">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Zone & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              {isTe ? 'వైజాగ్ ప్రాంతం (Zone / Ward)' : 'Zone / Ward Division'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={zone}
              onChange={(e) => {
                const zName = e.target.value;
                setZone(zName);
                const z = VIZAG_ZONES.find((item) => item.name === zName);
                if (z) {
                  setLat(z.lat);
                  setLng(z.lng);
                  setAddress(`${zName}, Visakhapatnam`);
                  setGpsStatus(`${zName} Ward Coordinates Loaded`);
                }
              }}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            >
              {VIZAG_ZONES.map((z) => (
                <option key={z.name} value={z.name}>
                  {z.name} — {z.ward}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              {isTe ? 'సమస్య వర్గం' : 'Category (or AI Auto-Classify)'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            >
              <option value="Auto-Detect">Auto-Detect via AI</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address / Landmark */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            {isTe ? 'నిర్దిష్ట ల్యాండ్‌మార్క్ లేదా వీధి పేరు' : 'Exact Street / Landmark Address'}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Sector 4 Main Road, near Rythu Bazar, MVP Colony"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            {isTe ? 'వివరణ & సమీప గుర్తులు' : 'Description & Specific Hazard Details'}{' '}
            <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe the hazard size, road obstruction, waterlogging, or risk to commuters..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-xl text-white font-bold text-base shadow-sm transition-all flex items-center justify-center space-x-2 ${
            isAnalyzing
              ? 'bg-sky-400 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700 hover:shadow-md'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>
                {isTe
                  ? 'AI గేట్‌కీపర్ ప్రమాదాన్ని తనిఖీ చేస్తోంది...'
                  : 'AI Gatekeeper Verifying Hazard & Checking 200m Radius...'}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>
                {isTe
                  ? 'AI తో తనిఖీ చేసి సమర్పించండి'
                  : 'Verify Hazard with AI Gatekeeper & Submit'}
              </span>
            </>
          )}
        </button>
      </form>

      {/* CASE 1: AI REJECTION CARD (When Non-Hazard Upload is Rejected) */}
      {aiResult && !aiResult.isValidHazard && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl shadow-md p-6 sm:p-8 space-y-5 animate-fadeIn">
          <div className="flex items-start justify-between gap-3 border-b border-rose-200 pb-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-rose-600 text-white rounded-2xl flex-shrink-0 shadow-sm">
                <XCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-rose-200 text-rose-900 font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono">
                    {isTe ? 'అప్‌లోడ్ తిరస్కరించబడింది' : 'Upload Rejected by AI Gatekeeper'}
                  </span>
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                    Ticket Creation Blocked
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-rose-950 tracking-tight">
                  {isTe
                    ? 'ప్రజా సమస్య కాని అప్‌లోడ్ గుర్తించబడింది'
                    : 'Non-Hazard Subject Detected — Report Not Created'}
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-rose-900 leading-relaxed">
            <div className="p-4 bg-white/80 rounded-2xl border border-rose-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Detected Subject: {aiResult.detectedObject || 'Non-Hazard Content'}</span>
              </div>
              <p className="font-medium text-slate-800 text-sm">
                {aiResult.rejectionReason}
              </p>
            </div>

            <div className="p-3.5 bg-rose-100/60 rounded-xl text-xs text-rose-800 space-y-1">
              <strong>
                {isTe ? 'సివిక్స్.AI నిబంధనలు:' : 'CivixAI Municipal Reporting Policy:'}
              </strong>
              <p>
                {isTe
                  ? 'సివిక్స్.AI కేవలం విశాఖపట్నంలోని రోడ్డు గుంతలు, చెత్త కుప్పలు, వీధి దీపాల వైఫల్యం, నీటి లీకేజీలు లేదా తెరిచిన మ్యాన్‌హోల్స్ వంటి నిజమైన భౌతిక సమస్యలను మాత్రమే నమోదు చేస్తుంది. సెల్ఫీలు, పెంపుడు జంతువులు, ఆహార ఫోటోలు లేదా ఇతర విషయాలు మున్సిపల్ క్యూను శుభ్రంగా ఉంచడానికి స్వయంచాలకంగా తిరస్కరించబడతాయి.'
                  : 'CivixAI strictly routes only real public infrastructure hazards (road craters, waste dumps, broken streetlights, water leaks, open drains) to GVMC municipal crews. Selfies, pets, food, indoor photos, and non-hazard subjects are automatically rejected to keep emergency municipal queues clean.'}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                applyPreset(SAMPLE_PRESETS[0]);
              }}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isTe ? 'నిజమైన రోడ్డు గుంతతో పరీక్షించండి' : 'Switch to Real Hazard (MVP Pothole)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors shadow-2xs flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-sky-600" />
              <span>{isTe ? 'వేరే ఫోటో అప్‌లోడ్ చేయండి' : 'Upload Different Photo'}</span>
            </button>
          </div>
        </div>
      )}

      {/* CASE 2: AI TRIAGE APPROVAL CARD (When Genuine Hazard is Verified) */}
      {aiResult && aiResult.isValidHazard && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-lg p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-extrabold">
                {isTe ? 'సివిక్స్.AI మున్సిపల్ విశ్లేషణ (ధృవీకరించబడింది)' : 'CivixAI AI Municipal Triage (Verified Hazard)'}
              </h3>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
              Hazard Verified &amp; Ticket Created
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {isTe ? 'ప్రమాద తీవ్రత స్కోర్' : 'AI Safety Hazard Score'}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-rose-600">
                  {aiResult.urgencyScore} / 10
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  {aiResult.urgencyLevel} Severity
                </span>
              </div>
              <p className="text-xs text-slate-600">{aiResult.commuterImpact}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {isTe ? 'GVMC అధికారి కేటాయింపు' : 'GVMC Ward Officer Routing'}
              </span>
              <div className="text-sm font-bold text-slate-900">{aiResult.assignedDepartment}</div>
              <div className="text-xs text-slate-700">Officer: {aiResult.assignedOfficer}</div>
              <div className="text-xs text-sky-700 font-bold">
                Target SLA: Within {aiResult.estimatedSlaHours} Hours
              </div>
            </div>
          </div>

          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-1">
            <span className="text-xs font-bold text-sky-900 uppercase">
              {isTe ? 'డూప్లికేట్ పరిశీలన ఫలితం' : 'Proximity Deduplication Result'}
            </span>
            <p className="text-sm text-sky-900">
              {aiResult.isDuplicate
                ? `Clustered with nearby Ticket #${aiResult.duplicateMatchTicketId} (${aiResult.duplicateConfidencePercent}% match confidence within 200m). Upvote priority boosted!`
                : 'No matching complaints within 200m radius. Registered as a new verified hazard in Visakhapatnam.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {isTe ? 'పరిష్కార తనిఖీ జాబితా' : 'Resolution Verification Checklist'}
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {aiResult.photoProofChecklist?.map((check: string, i: number) => (
                <li key={i} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onNavigateToTracker}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm flex items-center space-x-2"
            >
              <span>{isTe ? 'లైవ్ మ్యాప్‌లో చూడండి' : 'View on Live Map & GPS Tracker'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
