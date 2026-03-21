import React from 'react';
import { Calendar, Edit3, Clock } from 'lucide-react';

/**
 * TeacherTimetable Component
 * 
 * Updated with specific school timings:
 * 1st: 8:45-9:30, 2nd: 9:30-10:25, Break: 10:25-10:40
 * 3rd: 10:40-11:35, 4th: 11:35-12:30, Lunch: 12:30-1:05
 * 5th: 1:05-2:00, 6th: 2:00-2:55, Break: 2:55-3:20
 * 7th: 3:20-4:15
 */
const TeacherTimetable = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Schedule data structure
    const schedule = [
        {
            period: '1st Period',
            time: '8:45 - 9:30',
            slots: [
                { subject: 'Mathematics', info: '10 - A' },
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Mathematics', info: '10 - A' },
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Mathematics', info: '10 - A' },
                null
            ]
        },
        {
            period: '2nd Period',
            time: '9:30 - 10:25',
            slots: [
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Mathematics', info: '10 - A' },
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Statistics', info: '11 - B' },
                null,
                { subject: 'Mathematics', info: '10 - A' }
            ]
        },
        // Break 1: 10:25 - 10:40
        { type: 'break', label: 'Short Break', time: '10:25 - 10:40' },
        {
            period: '3rd Period',
            time: '10:40 - 11:35',
            slots: [
                null,
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Mathematics', info: '10 - A' },
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Calculus', info: '12 - C' }
            ]
        },
        {
            period: '4th Period',
            time: '11:35 - 12:30',
            slots: [
                { subject: 'Mathematics', info: '10 - A' },
                null,
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Mathematics', info: '10 - A' },
                null
            ]
        },
        // Lunch: 12:30 - 1:05
        { type: 'break', label: 'Lunch Break', time: '12:30 - 1:05' },
        {
            period: '5th Period',
            time: '1:05 - 2:00',
            slots: [
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Mathematics', info: '10 - A' },
                null,
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Mathematics', info: '10 - A' }
            ]
        },
        {
            period: '6th Period',
            time: '2:00 - 2:55',
            slots: [
                null,
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Mathematics', info: '10 - A' },
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Mathematics', info: '10 - A' },
                { subject: 'Calculus', info: '12 - C' }
            ]
        },
        // Break 2: 2:55 - 3:20
        { type: 'break', label: 'Afternoon Break', time: '2:55 - 3:20' },
        {
            period: '7th Period',
            time: '3:20 - 4:15',
            slots: [
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Mathematics', info: '10 - A' },
                null,
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Mathematics', info: '10 - A' }
            ]
        }
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Header Actions */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-[#1C2B4E] tracking-tight">Academic Timetable</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Official weekly schedule for the current semester</p>
                </div>
                <button className="bg-[#004AAD] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 group">
                    <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
                    Edit / Update Timetable
                </button>
            </div>

            {/* Timetable Container */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-12 relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1200px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[180px_repeat(6,1fr)] gap-6 mb-12">
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
                            {schedule.map((row, rIdx) => {
                                if (row.type === 'break') {
                                    return (
                                        <div key={rIdx} className="flex items-center gap-6 py-2">
                                            <div className="w-[180px] h-[1px] bg-slate-50 flex-shrink-0"></div>
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
                                    <div key={rIdx} className="grid grid-cols-[180px_repeat(6,1fr)] gap-6 items-center group/row">
                                        <div className="flex flex-col gap-1.5 px-4">
                                            <span className="text-[13px] font-black text-[#1C2B4E] group-hover/row:text-[#004AAD] transition-colors">{row.period}</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter tabular-nums">{row.time}</span>
                                        </div>
                                        {row.slots.map((slot, sIdx) => (
                                            <div key={sIdx} className="h-[90px] relative">
                                                {slot ? (
                                                    <div className={`h-full rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-all bg-[#F8FAFC] border border-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 hover:-translate-y-1 group/slot cursor-pointer`}>
                                                        <span className="text-[13px] font-black text-[#1C2B4E] group-hover/slot:text-[#004AAD] transition-colors">
                                                            {slot.subject}
                                                        </span>
                                                        <div className="mt-2 px-3 py-1 bg-white border border-slate-50 rounded-lg shadow-sm">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                                {slot.info}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full rounded-3xl bg-slate-50/30 border border-dashed border-slate-100"></div>
                                                )}
                                            </div>
                                        ))}
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

export default TeacherTimetable;
