import React, { useState } from 'react';
import { ShieldCheck, Info, Grid, Users, TrendingUp, Mic2 } from 'lucide-react';

interface AboutViewProps {
  lang: 'en' | 'te';
}

export const AboutView: React.FC<AboutViewProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leancanvas' | 'research' | 'economics' | 'pitch'>('overview');
  const isTe = lang === 'te';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            About CivixAI &amp; Team Syntax Squad
          </h1>
          <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
            Vizag Blueprint
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-600">
          Developed for Greater Visakhapatnam Municipal Corporation (GVMC) jurisdiction, Andhra Pradesh, India.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'overview', label: 'Mission & Innovation', icon: Info },
          { id: 'leancanvas', label: 'Lean Canvas', icon: Grid },
          { id: 'research', label: 'User Research & Personas', icon: Users },
          { id: 'economics', label: 'Market & Economics', icon: TrendingUp },
          { id: 'pitch', label: '30-Sec Elevator Pitch', icon: Mic2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">The Problem We Solve</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Urban residents in Visakhapatnam waste time and risk vehicular damage when reporting civic hazards because existing municipal channels lack live location hazard warnings, automated 200m deduplication, and verifiable photo proof of resolution.
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-700 border border-slate-200">
                <div>
                  <strong>Monsoon Reality:</strong> Heavy seasonal rains cause 3.4x spikes in asphalt craters across MVP Colony and Seethammadhara.
                </div>
                <div>
                  <strong>Duplicate Spam:</strong> Ward offices receive dozens of individual complaints for the exact same hole, confusing triage.
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">Our Solution (CivixAI)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A progressive civic platform uniting real-time GPS commuter hazard radar with AI proximity deduplication (200m auto-clustering) and tamper-proof before/after photo audits by local RWAs.
              </p>
              <div className="p-4 bg-sky-50 rounded-2xl text-xs space-y-2 text-sky-950 border border-sky-200">
                <div>
                  <strong>Live Route Guardian:</strong> Proactively interferes with audio and visual proximity advisories as you ride or drive.
                </div>
                <div>
                  <strong>Photo Verification Loop:</strong> Tickets cannot be closed without geotagged field repair proof audited by citizens.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lean Canvas */}
      {activeTab === 'leancanvas' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">CivixAI 1-Page Lean Canvas</h3>
            <p className="text-xs text-slate-500">Business and civic impact model for Visakhapatnam rollout</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">1. Problem</span>
              <p className="text-slate-600 leading-relaxed">
                - Citizens navigate dangerous unbarricaded road craters.<br />
                - Duplicates spam municipal desks.<br />
                - Ghost ticket closures break trust.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">2. Solution</span>
              <p className="text-slate-600 leading-relaxed">
                - Live commuter GPS hazard radar.<br />
                - 200m proximity clustering & upvoting.<br />
                - Citizen before/after photo verification loop.
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2">
              <span className="font-bold text-sky-900 uppercase tracking-wider block">3. UVP</span>
              <p className="text-sky-900 leading-relaxed font-semibold">
                Only solution combining live commuter GPS proximity interference with 200m deduplication and RWA photo-proof closure verification.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">4. Unfair Advantage</span>
              <p className="text-slate-600 leading-relaxed">
                - Hyperlocal Vizag RWA network density.<br />
                - Monsoon-calibrated regional hazard dataset.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">5. Segments</span>
              <p className="text-slate-600 leading-relaxed">
                <strong>Primary:</strong> Two-wheeler commuters in Vizag.<br />
                <strong>Early Adopters:</strong> RWA Secretaries in MVP & Seethammadhara.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Research */}
      {activeTab === 'research' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 animate-fadeIn">
          <h3 className="text-xl font-extrabold text-slate-900">User Research &amp; 3 Vizag Personas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                RK
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Ramesh Kumar (32)</h4>
                <p className="text-xs text-slate-500">Daily Two-Wheeler Commuter, MVP Colony</p>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Goal:</strong> Commute safely along Sector 4 to Siripuram without bending bike rims.</p>
                <p><strong>Frustration:</strong> Filed 3 complaints; closed with zero repairs.</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                SV
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Sita Varalakshmi (56)</h4>
                <p className="text-xs text-slate-500">RWA General Secretary, Seethammadhara North</p>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Goal:</strong> Keep colony clean and maintain leverage with GVMC ward engineers.</p>
                <p><strong>Frustration:</strong> 40 residents file duplicate tickets for 1 overflowing bin.</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                VN
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">V. Narayana Rao (44)</h4>
                <p className="text-xs text-slate-500">GVMC Ward 18 Field Supervisor</p>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Goal:</strong> Complete genuine repairs with clear contractor photo proof.</p>
                <p><strong>Frustration:</strong> Accusations of fake closures by sub-contractors.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Economics */}
      {activeTab === 'economics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 text-xs text-slate-600">
            <h3 className="text-base font-bold text-slate-900">Bottom-Up Market Sizing</h3>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <strong className="text-slate-800">TAM (Urban India RWAs):</strong>
              <p>~125,000 RWAs × ₹499/mo = ₹748 Crore / year</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <strong className="text-slate-800">SAM (Andhra Pradesh &amp; Telangana):</strong>
              <p>~8,500 active RWAs = ₹50.9 Crore / year</p>
            </div>
            <div className="p-3 bg-sky-50 text-sky-900 rounded-xl border border-sky-200 space-y-1 font-medium">
              <strong>SOM (MVP &amp; Seethammadhara initial cohort):</strong>
              <p>120 RWAs &amp; gated communities in Vizag Zone 2 &amp; 3 = ₹7.18 Lakhs / year</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 text-xs text-slate-600">
            <h3 className="text-base font-bold text-slate-900">Monthly MVP Infrastructure Cost</h3>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span>Cloud Hosting:</span>
              <span className="font-bold">₹0 (Free tier)</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span>Gemini AI Triage API:</span>
              <span className="font-bold">₹250 - ₹600 / mo</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span>Custom Domain &amp; SSL:</span>
              <span className="font-bold">₹90 / mo</span>
            </div>
            <div className="flex justify-between p-2.5 bg-sky-50 text-sky-900 font-bold rounded-xl border border-sky-200">
              <span>Total Running Cost for 1,000 Active Citizens:</span>
              <span>₹340 - ₹700 / month</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Pitch */}
      {activeTab === 'pitch' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-2 text-sky-700">
            <Mic2 className="w-5 h-5" />
            <h3 className="font-bold text-lg text-slate-900">30-Second Elevator Pitch</h3>
          </div>
          <blockquote className="p-5 bg-sky-50/70 rounded-2xl text-sm italic text-sky-950 border border-sky-200 leading-relaxed">
            "Every monsoon, thousands of Vizag commuters waste hours navigating dangerous potholes and overflowing drains because municipal channels are flooded with duplicate tickets and fake closures. CivixAI pairs real-time commuter GPS hazard radar with AI 200m proximity deduplication to turn scattered complaints into verified, high-priority municipal work orders backed by mandatory photo proof. We replace black-hole complaints with verifiable community safety."
          </blockquote>
        </div>
      )}
    </div>
  );
};
