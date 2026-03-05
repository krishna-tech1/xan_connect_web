import React from 'react';

const HomeworkTab = () => {
    const stats = [
        { label: 'Total', value: '6', icon: null },
        {
            label: 'Submitted', value: '2', icon: (color) => (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            ), color: '#3B82F6', bgColor: 'bg-blue-50'
        },
        {
            label: 'Pending', value: '2', icon: (color) => (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ), color: '#EF4444', bgColor: 'bg-red-50'
        },
        {
            label: 'Grading', value: '2', icon: (color) => (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color }}>
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ), color: '#22C55E', bgColor: 'bg-green-50'
        },
    ];

    const assignments = [
        {
            title: 'Chapter 8 — Quadratic Equations Practice',
            subject: 'Mathematics',
            due: 'Due 27 Feb (2 days left)',
            status: 'Pending',
            attachments: '1 attachment',
            feedback: null
        },
        {
            title: 'Lab Report — Chemical Reactions',
            subject: 'Science',
            due: 'Due 26 Feb (1 day left)',
            status: 'Submitted',
            attachments: '2 attachments',
            feedback: 'Good observations. Improve conclusion section for the next report.'
        },
        {
            title: 'Chapter 5 Comprehension Questions',
            subject: 'Hindi',
            due: 'Due 22 Feb',
            status: 'Graded',
            attachments: '1 attachment',
            feedback: 'You are imrpoving on sentence formation day by day.Keep going'
        }
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Submitted': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Graded': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            {stat.icon && (
                                <div className={`w-5 h-5 flex items-center justify-center rounded-full`}>
                                    {stat.icon(stat.color)}
                                </div>
                            )}
                            <h4 className="text-2xl font-black text-[#1A202C] leading-none">{stat.value}</h4>
                        </div>
                        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Assignments List */}
            <div className="space-y-6 mb-12">
                {assignments.map((hw, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-[#1C2B4E] mb-2">{hw.title}</h3>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <div className="flex items-center gap-1.5 ">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            {hw.subject}
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {hw.due}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black tracking-tight border ${getStatusStyles(hw.status)}`}>
                                    {hw.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-8">
                                <button className="flex items-center gap-2 text-[#004AAD] font-black text-xs hover:underline decoration-2 underline-offset-4">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    {hw.attachments}
                                </button>
                                <button className="flex items-center gap-1 text-[#004AAD] font-black text-sm group hover:gap-2 transition-all">
                                    View Task
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {hw.feedback && (
                            <div className="bg-[#EEF2FF] px-8 py-4 border-t border-indigo-50/50">
                                <p className="text-xs font-bold text-slate-400">
                                    <span className="text-slate-300 mr-2 uppercase tracking-tight">Teacher Feedback:</span>
                                    <span className="text-[#1C2B4E]">{hw.feedback}</span>
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeworkTab;
