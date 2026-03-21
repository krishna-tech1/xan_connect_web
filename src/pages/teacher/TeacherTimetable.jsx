import React, { useState, useEffect } from 'react';
import { Calendar, Edit3, Clock, Save, X, Loader, PlusCircle } from 'lucide-react';
import axios from 'axios';

const TeacherTimetable = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [timetableData, setTimetableData] = useState({});
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const periods = ['period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7'];
    
    const timeLabels = {
        period1: '8:45 - 9:30',
        period2: '9:30 - 10:25',
        break1: '10:25 - 10:40', // Short Break
        period3: '10:40 - 11:35',
        period4: '11:35 - 12:30',
        lunch: '12:30 - 1:05',   // Lunch
        period5: '1:05 - 2:00',
        period6: '2:00 - 2:55',
        break2: '2:55 - 3:20',   // Afternoon Break
        period7: '3:20 - 4:15'
    };

    useEffect(() => {
        if (user?.id) fetchTimetable();
    }, [user]);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/portal/timetable/${user.id}`);
            const data = {};
            response.data.forEach(row => {
                data[row.day] = row;
            });
            setTimetableData(data);
        } catch (err) {
            console.error('Error fetching timetable:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Save each day one by one
            for (const day of days) {
                const dayData = timetableData[day] || {};
                await axios.post(`${API_URL}/api/portal/timetable`, {
                    staffId: user.id,
                    day: day,
                    periods: {
                        period1: dayData.period1,
                        period2: dayData.period2,
                        period3: dayData.period3,
                        period4: dayData.period4,
                        period5: dayData.period5,
                        period6: dayData.period6,
                        period7: dayData.period7
                    }
                });
            }
            setIsEditing(false);
            alert('Timetable updated successfully!');
        } catch (err) {
            console.error('Error saving timetable:', err);
            alert('Failed to save timetable changes.');
        } finally {
            setSaving(false);
        }
    };

    const updateSlot = (day, period, field, value) => {
        setTimetableData(prev => {
            const dayData = prev[day] || {};
            const periodData = dayData[period] || { subject: '', class: '' };
            return {
                ...prev,
                [day]: {
                    ...dayData,
                    [period]: { ...periodData, [field]: value }
                }
            };
        });
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <Loader className="text-blue-200 animate-spin mb-4" size={40} />
                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Loading Timetable...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Header Actions */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-[#1C2B4E] tracking-tight">Academic Timetable</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">
                        {isEditing ? 'Editing Mode - Make changes and hit Save' : 'Official weekly schedule for the current semester'}
                    </p>
                </div>
                <div className="flex gap-4">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2 hover:bg-slate-200"
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#00b341] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-green-100 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-[#004AAD] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 group"
                        >
                            <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                            Edit / Update Timetable
                        </button>
                    )}
                </div>
            </div>

            {/* Timetable Container */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-12 relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1200px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[200px_repeat(6,1fr)] gap-6 mb-12">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Clock size={16} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Timings</span>
                            </div>
                            {days.map(day => (
                                <div key={day} className="text-[14px] font-black text-[#1C2B4E] text-center bg-slate-50 py-3 rounded-2xl border border-slate-100 shadow-sm">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Schedule Rows */}
                        <div className="space-y-6">
                            {[
                                { period: 'period1', label: '1st Period' },
                                { period: 'period2', label: '2nd Period' },
                                { type: 'break', label: 'Short Break', time: timeLabels.break1 },
                                { period: 'period3', label: '3rd Period' },
                                { period: 'period4', label: '4th Period' },
                                { type: 'break', label: 'Lunch Break', time: timeLabels.lunch },
                                { period: 'period5', label: '5th Period' },
                                { period: 'period6', label: '6th Period' },
                                { type: 'break', label: 'Afternoon Break', time: timeLabels.break2 },
                                { period: 'period7', label: '7th Period' }
                            ].map((row, rIdx) => {
                                if (row.type === 'break') {
                                    return (
                                        <div key={rIdx} className="flex items-center gap-6 py-2">
                                            <div className="w-[200px] h-[1px] bg-slate-50 flex-shrink-0"></div>
                                            <div className="flex-1 flex items-center gap-6 group">
                                                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-blue-50 transition-all duration-700"></div>
                                                <div className="flex items-center gap-3 px-8 py-3 bg-white border-2 border-slate-50 rounded-full shadow-sm">
                                                    <span className="text-[11px] font-black text-[#1C2B4E] uppercase tracking-[0.2em]">{row.label}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
                                                    <span className="text-[11px] font-bold text-slate-300 italic">{row.time}</span>
                                                </div>
                                                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-blue-50 transition-all duration-700"></div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={rIdx} className="grid grid-cols-[200px_repeat(6,1fr)] gap-6 items-center group/row">
                                        <div className="flex flex-col gap-1.5 px-4">
                                            <span className="text-[13px] font-black text-[#1C2B4E] group-hover/row:text-[#004AAD] transition-colors">{row.label}</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter tabular-nums">{timeLabels[row.period]}</span>
                                        </div>
                                        {days.map((day, sIdx) => {
                                            const slot = timetableData[day]?.[row.period];
                                            return (
                                                <div key={sIdx} className="h-[100px] relative">
                                                    {isEditing ? (
                                                        <div className="h-full rounded-2xl p-2 bg-blue-50/30 border-2 border-dashed border-blue-100 flex flex-col gap-2">
                                                            <input 
                                                                type="text"
                                                                placeholder="Subject"
                                                                className="w-full bg-white border border-slate-100 rounded-lg px-2 py-1 text-[11px] font-black text-[#1C2B4E] outline-none focus:border-blue-400"
                                                                value={slot?.subject || ''}
                                                                onChange={(e) => updateSlot(day, row.period, 'subject', e.target.value)}
                                                            />
                                                            <input 
                                                                type="text"
                                                                placeholder="Class"
                                                                className="w-full bg-white border border-slate-100 rounded-lg px-2 py-1 text-[9px] font-bold text-slate-400 uppercase outline-none focus:border-blue-400"
                                                                value={slot?.class || ''}
                                                                onChange={(e) => updateSlot(day, row.period, 'class', e.target.value)}
                                                            />
                                                        </div>
                                                    ) : slot && (slot.subject || slot.class) ? (
                                                        <div className={`h-full rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-all bg-[#F8FAFC] border border-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 hover:-translate-y-1 group/slot`}>
                                                            <span className="text-[13px] font-black text-[#1C2B4E] group-hover/slot:text-[#004AAD] transition-colors">
                                                                {slot.subject || '--'}
                                                            </span>
                                                            <div className="mt-2 px-3 py-1 bg-white border border-slate-50 rounded-lg shadow-sm">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                                    {slot.class || '--'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full rounded-3xl bg-slate-50/30 border border-dashed border-slate-100 flex items-center justify-center">
                                                            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest italic">Free</span>
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
            {/* Legend */}
            <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50 flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#004AAD] shadow-sm">
                    <Calendar size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-[#1C2B4E]">Master Schedule Controls</h4>
                    <p className="text-[11px] font-bold text-[#0047AB] uppercase tracking-widest mt-0.5 opacity-60 italic">Changes here reflect across your dashboard summary</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherTimetable;
