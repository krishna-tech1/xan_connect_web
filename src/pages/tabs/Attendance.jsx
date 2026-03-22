import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceTab = ({ user }) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1); // 1-indexed
    const [year, setYear] = useState(today.getFullYear());
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const studentId = user?.details?.studentId || user?.id;

    useEffect(() => {
        if (!studentId) return;
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/api/portal/student-attendance/${studentId}`, {
                    params: { month, year }
                });
                setRecords(res.data);
            } catch (err) {
                console.error('Attendance fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [studentId, month, year]);

    // Build a lookup: { 'YYYY-MM-DD': status }
    const attendanceMap = {};
    records.forEach(r => { attendanceMap[r.date] = r; });

    // Stats
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;
    const total = records.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    // Calendar building
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0=Sun
    // Convert to Mon-first: Sun=6, Mon=0, ...
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const calendarCells = [];
    for (let i = 0; i < startOffset; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
        const mm = String(month).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        const dateStr = `${year}-${mm}-${dd}`;
        calendarCells.push({ day: d, dateStr, record: attendanceMap[dateStr] || null });
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'bg-[#E6F6EC] text-[#22C55E]';
            case 'Absent': return 'bg-[#FFF1F2] text-[#F43F5E]';
            case 'Late': return 'bg-[#FFF7ED] text-[#F59E0B]';
            default: return 'bg-slate-50 text-slate-300';
        }
    };

    const getStatusLabel = (status) => {
        if (!status) return '–';
        return status[0]; // P, A, L
    };

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    const prevMonth = () => {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const lateRecords = records.filter(r => r.status === 'Late');

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            {/* Top Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Working Days', value: total },
                        { label: 'Present', value: present, color: 'text-green-600' },
                        { label: 'Absent', value: absent, color: 'text-red-500' },
                        { label: 'Percentage', value: `${percentage}%`, color: 'text-blue-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                            <h4 className={`text-2xl font-black ${stat.color || 'text-[#1A202C]'}`}>{loading ? '...' : stat.value}</h4>
                            <p className="text-[11px] font-bold text-slate-300 uppercase mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                {/* Calendar Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-black text-[#1C2B4E]">{monthNames[month - 1]} {year}</h3>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {[
                            { label: 'Present', icon: 'P', bgColor: 'bg-[#E6F6EC]', textColor: 'text-[#22C55E]' },
                            { label: 'Absent', icon: 'A', bgColor: 'bg-[#FFF1F2]', textColor: 'text-[#F43F5E]' },
                            { label: 'Late', icon: 'L', bgColor: 'bg-[#FFF7ED]', textColor: 'text-[#F59E0B]' },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${item.bgColor}`}>
                                <span className={`text-[10px] font-black ${item.textColor}`}>{item.icon}</span>
                                <span className={`text-[10px] font-bold ${item.textColor} uppercase tracking-tight`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-8">
                    <div className="grid grid-cols-7 gap-y-4 gap-x-3">
                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                            <div key={day} className="text-center text-[13px] font-bold text-slate-300 mb-2">{day}</div>
                        ))}
                        {calendarCells.map((cell, i) => (
                            <div key={i} className="min-h-[70px]">
                                {cell ? (
                                    <div className={`h-full rounded-xl flex flex-col items-center justify-between py-2.5 px-2 transition-all border border-transparent hover:border-slate-100 ${getStatusStyle(cell.record?.status)}`}>
                                        <span className="text-[13px] font-black opacity-60">{cell.day}</span>
                                        <span className="text-xl font-black">{getStatusLabel(cell.record?.status)}</span>
                                    </div>
                                ) : (
                                    <div className="h-full" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Late Arrival Records */}
            {lateRecords.length > 0 && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-12">
                    <h4 className="text-lg font-black text-[#1C2B4E] mb-6">Late Arrival Records</h4>
                    <div className="space-y-6">
                        {lateRecords.map((rec, i) => (
                            <div key={i}>
                                <h5 className="text-[15px] font-black text-[#1C2B4E] mb-1">{new Date(rec.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</h5>
                                {rec.remarks && (
                                    <div className="mt-2 bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-500">
                                            <span className="text-slate-300 mr-2 uppercase tracking-tight">Remarks:</span>
                                            {rec.remarks}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && records.length === 0 && (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center text-slate-300 font-bold text-sm">
                    No attendance records found for {monthNames[month - 1]} {year}
                </div>
            )}
        </div>
    );
};

export default AttendanceTab;
