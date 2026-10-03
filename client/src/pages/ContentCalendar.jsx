import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Share2, 
  FileText, 
  CheckCircle2, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import NewsAPI from '../services/api';

export default function ContentCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const res = await NewsAPI.getCalendar();
      setEvents(res.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-cyan-400" />
            Editorial & Social Content Calendar
          </h1>
          <p className="text-xs text-slate-400">
            Visual schedule of planned news publications, scheduled WhatsApp broadcasts, and social posts.
          </p>
        </div>

        <button
          onClick={loadCalendar}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Schedule</span>
        </button>
      </div>

      {/* Calendar Timeline Deck */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-sm font-bold text-white">Upcoming Scheduled Queue</div>
          <div className="text-xs text-slate-400">{events.length} Items Scheduled</div>
        </div>

        {events.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No posts currently scheduled in the calendar queue.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((evt, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                    {evt.event_type === 'article' ? <FileText className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                        {evt.platform} • {evt.event_type}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                        {evt.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{evt.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{new Date(evt.scheduled_time).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
