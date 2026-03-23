import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Loader, Download } from 'lucide-react';

/**
 * Timetable Component for Students
 * 
 * Fetches the official class timetable assigned by the Admin.
 */
const Timetable = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [timetableData, setTimetableData] = useState({});
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const periods = ['period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7'];
    
    const timeLabels = {
        period1: '8:45 - 9:30',
        period2: '9:30 - 10:25',
        break1: '10:25 - 10:40',
        period3: '10:40 - 11:35',
        period4: '11:35 - 12:30',
        lunch: '12:30 - 1:05',
        period5: '1:05 - 2:00',
        period6: '2:00 - 2:55',
        break2: '2:55 - 3:20',
        period7: '3:20 - 4:15'
    };

    useEffect(() => {
        if (user?.class) fetchTimetable();
    }, [user]);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/portal/timetable/student/${user.class}/${user.section}`);
            const data = {};
            response.data.forEach(row => {
                data[row.day] = row;
            });
            setTimetableData(data);
        } catch (err) {
            console.error('Error fetching student timetable:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <Loader className="text-blue-200 animate-spin mb-4" size={40} />
                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Accessing Schedule...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-[#1C2B4E] tracking-tight">Class {user.class} — {user.section}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 italic">
                        Weekly Academic Schedule for {new Date().getFullYear()}
                    </p>
                </div>
                <button className="bg-[#004AAD] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 group">
                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    Offline Copy
                </button>
            </div>

            {/* Timetable Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-12">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1200px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[180px_repeat(6,1fr)] gap-6 mb-12">
                            <div className="flex items-center gap-2 text-slate-300 px-4">
                                <Clock size={16} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Time</span>
                            </div>
                            {days.map(day => (
                                <div key={day} className="text-[14px] font-black text-[#1C2B4E] text-center bg-slate-50 py-3 rounded-2xl border border-slate-100 shadow-sm">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        <div className="space-y-6">
                            {[
                                { period: 'period1', label: 'Period 1' },
                                { period: 'period2', label: 'Period 2' },
                                { type: 'divider', label: 'Recess', time: '15 Mins' },
                                { period: 'period3', label: 'Period 3' },
                                { period: 'period4', label: 'Period 4' },
                                { type: 'divider', label: 'Lunch Break', time: '35 Mins' },
                                { period: 'period5', label: 'Period 5' },
                                { period: 'period6', label: 'Period 6' },
                                { type: 'divider', label: 'Evening Break', time: '25 Mins' },
                                { period: 'period7', label: 'Period 7' }
                            ].map((row, rIdx) => {
                                if (row.type === 'divider') {
                                    return (
                                        <div key={rIdx} className="flex items-center gap-6 py-2">
                                            <div className="w-[180px] h-[1px] flex-shrink-0"></div>
                                            <div className="flex-1 h-[1px] bg-slate-50 border-t border-dashed border-slate-200 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-1.5 flex items-center gap-3 border border-slate-100 rounded-full">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{row.label}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-100"></span>
                                                    <span className="text-[9px] font-bold text-slate-200">{row.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={rIdx} className="grid grid-cols-[180px_repeat(6,1fr)] gap-6 items-center">
                                        <div className="flex flex-col gap-1 px-4 border-l-2 border-slate-100">
                                            <span className="text-[13px] font-black text-[#1C2B4E]">{row.label}</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter tabular-nums">{timeLabels[row.period]}</span>
                                        </div>
                                        {days.map((day, dIdx) => {
                                            const slot = timetableData[day]?.[row.period];
                                            return (
                                                <div key={dIdx} className="h-[90px]">
                                                    {slot && (slot.subject || slot.teacher) ? (
                                                        <div className="h-full rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-[#F9FAFB] border border-white hover:border-[#0047AB]/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 group">
                                                            <span className="text-[13px] font-black text-[#1C2B4E] group-hover:text-[#004AAD] transition-colors">{slot.subject || '--'}</span>
                                                            <span className="text-[10px] font-bold text-slate-300 mt-1 truncate w-full">{slot.teacher || '--'}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full rounded-2xl bg-slate-50/40 border border-dashed border-slate-100 flex items-center justify-center">
                                                            <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">Free</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timetable;
