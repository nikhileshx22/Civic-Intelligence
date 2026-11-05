import React, { useState } from 'react';
import { Ticket } from '../types/civic';
import { X, ThumbsUp, Flag, CheckCheck, ShieldAlert, Clock, Building } from 'lucide-react';

interface ResolutionAuditModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  lang: 'en' | 'te';
}

export const ResolutionAuditModal: React.FC<ResolutionAuditModalProps> = ({
  ticket,
  onClose,
  lang,
}) => {
  const [feedback, setFeedback] = useState<'approved' | 'flagged' | null>(null);
  const isTe = lang === 'te';

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span>{ticket.id}</span>
              <span>·</span>
              <span>{ticket.zone}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {isTe
                ? 'మునిసిపల్ ఫోటో-ప్రూఫ్ పరిష్కార ఆడిట్'
                : 'Municipal Photo-Proof Resolution Audit'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Side-by-Side Photo Proof */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {isTe ? 'ముందు (సమస్య ఉన్నప్పుడు)' : 'Before (Reported Hazard)'}
                </span>
                <span className="text-xs text-slate-500 font-mono">Reported</span>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                <img
                  src={ticket.imageUrl}
                  alt="Before repair"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {isTe ? 'తర్వాత (GVMC మరమ్మత్తు)' : 'After (GVMC Field Repair)'}
                </span>
                <span className="text-xs text-slate-500 font-mono">Field Verified</span>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                <img
                  src={
                    ticket.resolvedImageUrl ||
                    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80'
                  }
                  alt="After repair proof"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details Bar */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                <Building className="w-3.5 h-3.5 text-sky-600" />
                <span>{ticket.assignedDepartment}</span>
              </div>
              <span className="font-semibold text-slate-600">{ticket.assignedOfficer}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>{isTe ? 'లొకేషన్ చిరునామా:' : 'Location Address:'}</span>
              <span className="font-medium text-slate-800">{ticket.address}</span>
            </div>

            {ticket.adminNotes && (
              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">
                  {isTe ? 'అధికారిక తనిఖీ నోట్స్:' : 'Official Inspection Remarks:'}
                </span>
                <p className="text-slate-600 italic">"{ticket.adminNotes}"</p>
              </div>
            )}
          </div>

          {/* Citizen Verification Feedback Action */}
          {feedback ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center space-x-2.5">
              <CheckCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                {feedback === 'approved'
                  ? isTe
                    ? 'ధన్యవాదాలు! మీ పౌర ధృవీకరణ ఓటు పబ్లిక్ వార్డు లెడ్జర్‌లో నమోదు చేయబడింది.'
                    : 'Thank you! Your citizen resolution audit verification has been confirmed in the public ward ledger.'
                  : isTe
                  ? 'హెచ్చరిక నమోదు చేయబడింది. అసంపూర్ణ మరమ్మత్తుపై వార్డు ఇంజనీర్‌కు నోటీసు పంపబడింది.'
                  : 'Notice logged. Incomplete repair alert forwarded to the GVMC Superintending Engineer.'}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isTe ? 'పౌరుల ధృవీకరణ చర్య (Citizen Audit Action)' : 'Citizen RWA Verification Action'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFeedback('approved')}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 shadow-xs"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{isTe ? 'పరిష్కారాన్ని ధృవీకరించండి' : 'Confirm Resolution'}</span>
                </button>

                <button
                  onClick={() => setFeedback('flagged')}
                  className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>{isTe ? 'అసంపూర్ణ మరమ్మత్తుగా గుర్తించండి' : 'Flag Incomplete Repair'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
          >
            {isTe ? 'మూసివేయి' : 'Close Audit'}
          </button>
        </div>
      </div>
    </div>
  );
};
