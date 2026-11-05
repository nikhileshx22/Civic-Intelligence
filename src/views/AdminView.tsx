import React, { useState, useMemo } from 'react';
import { Ticket } from '../types/civic';
import { Shield, Filter, Eye, Edit3, X, CheckCircle2 } from 'lucide-react';

interface AdminViewProps {
  tickets: Ticket[];
  onUpdateTicketStatus: (
    ticketId: string,
    newStatus: Ticket['status'],
    notes: string,
    proofUrl?: string
  ) => void;
  onInspectTicket: (ticket: Ticket) => void;
  lang: 'en' | 'te';
}

export const AdminView: React.FC<AdminViewProps> = ({
  tickets,
  onUpdateTicketStatus,
  onInspectTicket,
  lang,
}) => {
  const isTe = lang === 'te';

  const [selectedDept, setSelectedDept] = useState('all');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [adminStatus, setAdminStatus] = useState<Ticket['status']>('In Progress');
  const [adminNotes, setAdminNotes] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  const totalCount = tickets.length;
  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const progressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(
    (t) => t.status === 'Resolved (Photo Verified)'
  ).length;
  const duplicatesSaved = tickets.reduce(
    (sum, t) => sum + (t.duplicateCount > 1 ? t.duplicateCount - 1 : 0),
    0
  );

  const departmentsList = [
    'GVMC Engineering (Zone 2 - MVP Ward 18)',
    'GVMC Public Health & Sanitation (Zone 3)',
    'GVMC Electrical Wing (Zone 2)',
    'GVMC Water Supply & Sewerage Division',
    'GVMC Engineering (Zone 2 Coastal Infrastructure)',
    'GVMC Town Planning & Discom Coordination',
    'GVMC Enforcement & Solid Waste Cell (Zone 5 Gajuwaka)',
    'GVMC Engineering (Zone 1 Madhurawada)',
  ];

  const filteredTickets = useMemo(() => {
    if (selectedDept === 'all') return tickets;
    return tickets.filter((t) => t.assignedDepartment.includes(selectedDept));
  }, [tickets, selectedDept]);

  const handleSave = () => {
    if (!editingTicket) return;
    onUpdateTicketStatus(editingTicket.id, adminStatus, adminNotes, proofUrl);
    alert(
      isTe
        ? `ఫిర్యాదు #${editingTicket.id} విజయవంతంగా "${adminStatus}" కు నవీకరించబడింది!`
        : `Ticket #${editingTicket.id} status successfully updated to "${adminStatus}"!`
    );
    setEditingTicket(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTe
              ? 'GVMC మున్సిపల్ అధికారుల నిర్వహణ పోర్టల్'
              : 'GVMC Municipal Officials Management Portal'}
          </h1>
        </div>
        <p className="text-sm text-slate-600">
          {isTe
            ? 'గ్రేటర్ విశాఖపట్నం మున్సిపల్ కార్పొరేషన్ • ఇంజనీరింగ్ & శానిటేషన్ కంట్రోల్ డెస్క్'
            : 'Greater Visakhapatnam Municipal Corporation · Engineering & Sanitation Control Desk'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">
            {isTe ? 'మొత్తం ఫిర్యాదులు' : 'Total Complaints'}
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-2xs bg-sky-50/30">
          <span className="text-xs font-bold text-sky-700 uppercase">
            {isTe ? 'పరిశీలనలో ఉన్నవి' : 'Pending Triage'}
          </span>
          <div className="text-2xl font-black text-sky-700 mt-1">{pendingCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/30">
          <span className="text-xs font-bold text-amber-700 uppercase">
            {isTe ? 'పని జరుగుతున్నవి' : 'In Progress'}
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1">{progressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/30">
          <span className="text-xs font-bold text-emerald-800 uppercase">
            {isTe ? 'పూర్తయినవి' : 'Photo Verified'}
          </span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{resolvedCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs bg-purple-50/30">
          <span className="text-xs font-bold text-purple-700 uppercase">
            {isTe ? 'డూప్లికేట్లు ఆదా' : 'Duplicates Saved'}
          </span>
          <div className="text-2xl font-black text-purple-700 mt-1">{duplicatesSaved}</div>
        </div>
      </div>

      {/* Department Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-bold text-slate-700">
            {isTe ? 'విభాగం వారీగా ఫిల్టర్:' : 'Filter by Department:'}
          </span>
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
        >
          <option value="all">
            {isTe ? 'అన్ని GVMC విభాగాలు' : 'All GVMC Departments'}
          </option>
          {departmentsList.map((d, i) => (
            <option key={i} value={d.split('(')[0].trim()}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4">ID &amp; Zone</th>
                <th className="px-5 py-4">Hazard Description</th>
                <th className="px-5 py-4">Department &amp; Officer</th>
                <th className="px-5 py-4">Priority &amp; Duplicates</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Official Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => {
                const isResolved = ticket.status === 'Resolved (Photo Verified)';
                const isInProgress = ticket.status === 'In Progress';
                return (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-sky-700 block">
                        {ticket.id}
                      </span>
                      <span className="text-xs text-slate-500">{ticket.zone}</span>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{ticket.title}</div>
                      <div className="text-xs text-slate-500 truncate">{ticket.address}</div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {ticket.assignedDepartment}
                      </div>
                      <div className="text-xs text-slate-500">{ticket.assignedOfficer}</div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-rose-600 block">
                        {ticket.urgencyScore} / 10 Urgency
                      </span>
                      <span className="text-xs text-amber-700 font-semibold">
                        {ticket.duplicateCount} citizen reports
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">
                        Retest: {ticket.retestStatus || 'Scheduled'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingTicket(ticket);
                          setAdminStatus(ticket.status);
                          setAdminNotes(ticket.adminNotes || '');
                          setProofUrl(ticket.resolvedImageUrl || '');
                        }}
                        className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg text-xs transition-colors border border-sky-200 mr-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                        Update
                      </button>
                      <button
                        onClick={() => onInspectTicket(ticket)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        Proof
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-sky-600 uppercase">
                  Ticket #{editingTicket.id}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {isTe
                    ? 'స్టేటస్ మార్చండి & ఫోటో రుజువు జతచేయండి'
                    : 'Update Status & Attach Photo Proof'}
                </h3>
              </div>
              <button
                onClick={() => setEditingTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isTe ? 'స్టేటస్ మార్పు' : 'Change Status'}
                </label>
                <select
                  value={adminStatus}
                  onChange={(e) => setAdminStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved (Photo Verified)">Resolved (Photo Verified)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isTe ? 'వార్డు అధికారి తనిఖీ నోట్స్' : 'Ward Officer Inspection Notes'}
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add progress update, bitumen mix batch dispatched, contractor remarks..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isTe
                    ? 'పరిష్కార ఫోటో అప్‌లోడ్ / లింక్'
                    : 'Attach Resolution Photo Proof URL'}
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="Paste resolved proof photo URL..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Required for "Resolved" status to enable public citizen photo audit.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingTicket(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-2xs"
              >
                Save Official Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
