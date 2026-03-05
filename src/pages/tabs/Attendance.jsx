import React from 'react';

const AttendanceTab = () => {
    const stats = [
        { label: 'Working Days', value: '22' },
        { label: 'Present', value: '22', color: 'text-green-600' },
        { label: 'Absent', value: '2', color: 'text-red-500' },
        { label: 'Percentage', value: '91%', color: 'text-blue-600' },
    ];

    const legend = [
        { label: 'Holiday', icon: 'H', bgColor: 'bg-[#EEF2FF]', textColor: 'text-[#6366F1]' },
        { label: 'Present', icon: 'P', bgColor: 'bg-[#E6F6EC]', textColor: 'text-[#22C55E]' },
        { label: 'Absent', icon: 'A', bgColor: 'bg-[#FFF1F2]', textColor: 'text-[#F43F5E]' },
        { label: 'Late', icon: 'L', bgColor: 'bg-[#FFF7ED]', textColor: 'text-[#F59E0B]' },
    ];

    const generateDays = () => {
        const days = [];
        // Add empty slots for the first row to align with the image (Sat is 1st)
        for (let i = 0; i < 5; i++) days.push(null);

        const data = [
            { day: 1, type: 'P' }, { day: 2, type: 'H' },
            { day: 3, type: 'P' }, { day: 4, type: 'P' }, { day: 5, type: 'P' }, { day: 6, type: 'P' }, { day: 7, type: 'A' }, { day: 8, type: 'P' }, { day: 1, type: 'H' },
            { day: 9, type: 'P' }, { day: 10, type: 'P' }, { day: 11, type: 'P' }, { day: 12, type: 'A' }, { day: 13, type: 'P' }, { day: 14, type: 'P' }, { day: 15, type: 'H' },
            { day: 16, type: 'L' }, { day: 17, type: 'P' }, { day: 18, type: 'P' }, { day: 19, type: 'P' }, { day: 20, type: 'P' }, { day: 22, type: 'P' }, { day: 21, type: 'H' },
            { day: 22, type: 'P' }, { day: 23, type: 'P' }, { day: 24, type: 'P' }, { day: 25, type: 'P' }, { day: 26, type: 'P' }, { day: 27, type: 'P' }, { day: 28, type: 'H' },
            { day: 29, type: 'P' }, { day: 30, type: 'P' }
        ];
        return [...days, ...data];
    };

    const days = generateDays();

    const getStatusStyles = (type) => {
        switch (type) {
            case 'P': return 'bg-[#E6F6EC] text-[#22C55E]';
            case 'H': return 'bg-[#EEF2FF] text-[#6366F1]';
            case 'A': return 'bg-[#FFF1F2] text-[#F43F5E]';
            case 'L': return 'bg-[#FFF7ED] text-[#F59E0B]';
            default: return 'bg-white';
        }
    };

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            {/* Top Stats & Download */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                            <h4 className="text-2xl font-black text-[#1A202C]">{stat.value}</h4>
                            <p className="text-[11px] font-bold text-slate-300 uppercase mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <button className="bg-[#004AAD] hover:bg-[#003991] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-blue-100 transition-all text-sm h-fit">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Report
                </button>
            </div>

            {/* Calendar Container */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                {/* Calendar Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-black text-[#1C2B4E]">February 2026</h3>
                        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {legend.map((item, i) => (
                            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${item.bgColor} border border-slate-100/10`}>
                                <span className={`text-[10px] font-black ${item.textColor}`}>{item.icon}</span>
                                <span className={`text-[10px] font-bold ${item.textColor} opacity-80 uppercase tracking-tight`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-8">
                    <div className="grid grid-cols-7 gap-y-4 gap-x-3">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-center text-[13px] font-bold text-slate-300 mb-2">{day}</div>
                        ))}

                        {days.map((item, i) => (
                            <div key={i} className="min-h-[80px]">
                                {item ? (
                                    <div className={`h-full rounded-xl flex flex-col items-center justify-between py-2.5 px-2 transition-all border border-transparent hover:border-slate-100 ${getStatusStyles(item.type)}`}>
                                        <span className="text-[13px] font-black opacity-60">{item.day}</span>
                                        <span className="text-xl font-black">{item.type}</span>
                                    </div>
                                ) : (
                                    <div className="h-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Late Arrival Records */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-12">
                <h4 className="text-lg font-black text-[#1C2B4E] mb-6">Late Arrival Records</h4>
                <div className="space-y-6">
                    <div>
                        <h5 className="text-[15px] font-black text-[#1C2B4E] mb-1">February 18, 2026</h5>
                        <p className="text-xs font-bold text-slate-300">Arrived at 9:30 AM (30 mins late)</p>
                        <div className="mt-4 bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-500">
                                <span className="text-slate-300 mr-2 uppercase tracking-tight">Reason:</span>
                                Went to hospital due to Fever
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTab;
