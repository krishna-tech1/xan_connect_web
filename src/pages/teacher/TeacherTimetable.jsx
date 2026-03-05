import React from 'react';

/**
 * TeacherTimetable Component
 * 
 * Rebuilt to match the teacher portal's specific schedule design.
 * Features class-wise slots, substitute indicators, and lunch/break dividers.
 */
const TeacherTimetable = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Schedule data based on teacher reference image
    // null represents an empty slot
    const schedule = [
        {
            time: '9:00 am',
            slots: [
                { subject: 'Statistics', info: '11 - B' },
                null,
                null,
                null,
                { subject: 'Statistics', info: 'Mr. Anil Sharma' },
                { subject: 'Mathematics', info: '10 - A' }
            ]
        },
        {
            time: '10:00 am',
            slots: [
                null,
                { subject: 'Mathematics', info: '10 - A' },
                null,
                { subject: 'Mathematics', info: '10 - A' },
                null,
                null
            ]
        },
        // Break (10:45 pm - 11:00 am) - Note: image says pm, likely typo for am
        {
            time: '11:00 am',
            slots: [
                null,
                null,
                null,
                { subject: 'Statistics', info: '11 - B' },
                null,
                { subject: 'Statistics', info: '11 - B' }
            ]
        },
        {
            time: '12:00 pm',
            slots: [
                null,
                { subject: 'Statistics', info: '11 - B' },
                { subject: 'Mathematics', info: '10 - A' },
                null,
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Calculus', info: '12 - C' }
            ]
        },
        // Lunch (12:30 pm - 1:00 pm)
        {
            time: '1:00 pm',
            slots: [
                null,
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Substitute', info: '7 - A', isSubstitute: true },
                null,
                { subject: 'Mathematics', info: '10 - A' },
                null
            ]
        },
        {
            time: '2:00 pm',
            slots: [
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Mathematics', info: '9 - A' },
                { subject: 'Calculus', info: '12 - C' },
                { subject: 'Calculus', info: '12 - C' },
                null,
                null
            ]
        }
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Print Action */}
            <div className="flex justify-end">
                <button className="bg-[#004AAD] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 leading-none">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                    </svg>
                    Print
                </button>
            </div>

            {/* Timetable Container */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[120px_repeat(6,1fr)] gap-6 mb-10">
                            <div></div>
                            {days.map(day => (
                                <div key={day} className="text-[13px] font-black text-slate-300 text-center uppercase tracking-widest">{day}</div>
                            ))}
                        </div>

                        {/* Schedule Rows */}
                        <div className="space-y-6">
                            {schedule.map((row, rIdx) => (
                                <React.Fragment key={rIdx}>
                                    <div className="grid grid-cols-[120px_repeat(6,1fr)] gap-6 items-center">
                                        <div className="text-[14px] font-black text-[#1C2B4E]">{row.time}</div>
                                        {row.slots.map((slot, sIdx) => (
                                            <div key={sIdx} className="h-[75px]">
                                                {slot ? (
                                                    <div className={`h-full rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all ${slot.isSubstitute
                                                            ? 'bg-orange-50 border border-orange-100'
                                                            : 'bg-[#F8FAFC] border border-slate-50'
                                                        }`}>
                                                        <span className={`text-[13px] font-black ${slot.isSubstitute ? 'text-orange-600' : 'text-[#1C2B4E]'}`}>
                                                            {slot.subject}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-tight">
                                                            {slot.info}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="h-full"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dividers */}
                                    {rIdx === 1 && (
                                        <div className="flex items-center gap-4 py-2 opacity-60">
                                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                                                Break <span className="lowercase font-bold opacity-60 ml-1">(10:45 am - 11:00 am)</span>
                                            </span>
                                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                                        </div>
                                    )}

                                    {rIdx === 3 && (
                                        <div className="flex items-center gap-4 py-2 opacity-60">
                                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                                                Lunch <span className="lowercase font-bold opacity-60 ml-1">(12:30 pm - 1:00 pm)</span>
                                            </span>
                                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherTimetable;
