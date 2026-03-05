import React from 'react';

/**
 * AssignHomework Component
 * 
 * Rebuilt to match the teacher portal's high-fidelity homework dashboard design.
 * Features summary stats cards, a grid of assignment cards, and submission tracking.
 */
const AssignHomework = () => {
    // Data based on the reference image
    const homeworks = [
        {
            id: 1,
            title: 'Chapter 8 — Quadratic Equations Practice',
            class: 'Class 10 - A • Mathematics',
            due: 'Due Feb 27',
            attachments: '1 attachment',
            submissions: '38/42',
            progress: 90,
            status: 'Active'
        },
        {
            id: 2,
            title: 'Statistics Worksheet Set 4',
            class: 'Class 11 - B • Statistics',
            due: 'Due Mar 1',
            attachments: '1 attachment',
            submissions: '28/42',
            progress: 66,
            status: 'Completed'
        },
        {
            id: 3,
            title: 'Statistics Worksheet Set 4',
            class: 'Class 11 - B • Statistics',
            due: 'Due Mar 1',
            attachments: '1 attachment',
            submissions: '28/42',
            progress: 66,
            status: 'Completed'
        },
        {
            id: 4,
            title: 'Chapter 8 — Quadratic Equations Practice',
            class: 'Class 10 - A • Mathematics',
            due: 'Due Feb 27',
            attachments: '1 attachment',
            submissions: '38/42',
            progress: 90,
            status: 'Active'
        },
        {
            id: 5,
            title: 'Chapter 8 — Quadratic Equations Practice',
            class: 'Class 10 - A • Mathematics',
            due: 'Due Feb 27',
            attachments: '1 attachment',
            submissions: '28/42',
            progress: 66,
            status: 'Graded'
        },
        {
            id: 6,
            title: 'Statistics Worksheet Set 4',
            class: 'Class 11 - B • Statistics',
            due: 'Due Mar 1',
            attachments: '1 attachment',
            submissions: '28/42',
            progress: 95,
            status: 'Graded'
        },
    ];

    const stats = [
        { label: 'Total Assignments', value: '6', color: 'text-[#1C2B4E]' },
        { label: 'Active', value: '2', color: 'text-blue-500' },
        { label: 'Completed', value: '3', color: 'text-emerald-500' },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Active': return 'bg-orange-50 text-orange-400';
            case 'Completed': return 'bg-emerald-50 text-emerald-500';
            case 'Graded': return 'bg-blue-50 text-blue-500';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Top Summary Stats & Action */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6">
                <div className="flex flex-1 gap-4 overflow-x-auto pb-2 sm:pb-0">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex-1 min-w-[150px] bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm text-center">
                            <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="text-[13px] font-black text-slate-300 tracking-tight leading-none">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <button className="bg-[#004AAD] text-white px-10 py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 leading-none shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Homework
                </button>
            </div>

            {/* Homework Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {homeworks.map((hw) => (
                    <div key={hw.id} className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8 hover:shadow-md transition-all duration-300 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                                <h3 className="text-[15px] font-black text-[#1C2B4E] leading-tight">{hw.title}</h3>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="text-[12px] font-bold">{hw.class}</span>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight min-w-[70px] text-center ${getStatusStyles(hw.status)}`}>
                                {hw.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-6 mt-6 mb-8 text-[12px] font-bold text-slate-300">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{hw.due}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span>{hw.attachments}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Submissions</span>
                                <span className="text-[12px] font-black text-[#1C2B4E]">{hw.submissions}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#004AAD] rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${hw.progress}%` }}
                                    ></div>
                                </div>
                                <button className="w-8 h-8 rounded-lg bg-[#004AAD] text-white flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-110 active:scale-95 transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignHomework;
