import React from 'react';

const ResultsTab = () => {
    const stats = [
        { label: 'Average Score', value: '87%', color: 'text-slate-700' },
        { label: 'Overall Grade', value: 'A', color: 'text-green-600' },
        { label: 'Class Rank', value: '5 th', color: 'text-blue-600' },
        { label: 'Subjects', value: '6', color: 'text-slate-700' },
    ];

    const subjectResults = [
        { subject: 'Mathematics', teacher: 'Ms. Sarah Khan', u1: '96/100', u2: '86/100', grade: 'A+', remarks: 'Excellent progress in algebra.' },
        { subject: 'Science', teacher: 'Johnson', u1: '90/100', u2: '90/100', grade: 'A+', remarks: 'Good lab work. Needs Improvement in theory.' },
        { subject: 'English', teacher: 'Maddison', u1: '88/100', u2: '98/100', grade: 'A', remarks: 'Writing skills improving steadily.' },
        { subject: 'Hindi', teacher: 'Anbu', u1: '75/100', u2: '75/100', grade: 'B+', remarks: 'Need improvement to form sentence correctly.' },
        { subject: 'Computer Science', teacher: 'Anbu', u1: '81/100', u2: '89/100', grade: 'A', remarks: 'Excellent progress in algebra.' },
    ];

    const performanceTrends = [
        { subject: 'Mathematics', trend: '+3', value: '90%', type: 'up' },
        { subject: 'Science', trend: '+3', value: '89%', type: 'up' },
        { subject: 'English', trend: '+2', value: '90%', type: 'up' },
        { subject: 'Hindi', trend: '+4', value: '79%', type: 'down' },
        { subject: 'Computer Science', trend: '+1', value: '86%', type: 'up' },
    ];

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            {/* Top Stats Cards */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                            <h4 className={`text-2xl font-black ${stat.color} leading-none`}>{stat.value}</h4>
                            <p className="text-[11px] font-bold text-slate-300 uppercase mt-2 tracking-tight">{stat.label}</p>
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

            {/* Subject-wise Results Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
                    <div className="text-[#1C2B4E]">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-black text-[#1C2B4E]">Subject-wise Results</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/20">
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">Subject</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">U1</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">U2</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">Grade</th>
                                <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {subjectResults.map((row, i) => (
                                <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-[#1C2B4E] uppercase text-sm">{row.subject}</p>
                                        <p className="text-[10px] font-bold text-slate-300">{row.teacher}</p>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-black text-slate-600">{row.u1}</td>
                                    <td className="px-8 py-5 text-sm font-black text-slate-600">{row.u2}</td>
                                    <td className="px-8 py-5">
                                        <span className="bg-blue-50 text-[#004AAD] px-3 py-1.5 rounded-lg text-[11px] font-black border border-blue-100/50">
                                            {row.grade}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-[12px] font-semibold text-slate-400">
                                        {row.remarks}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-12">
                <h4 className="text-base font-black text-[#1C2B4E] mb-8">Performance Trend</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {performanceTrends.map((item, i) => (
                        <div key={i} className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100/50 flex flex-col items-center justify-center text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2 opacity-60">{item.subject}</p>
                            <div className={`flex items-center gap-1.5 mb-1.5 ${item.type === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                <svg className={`w-3.5 h-3.5 ${item.type === 'down' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                                </svg>
                                <span className="text-[11px] font-black">{item.trend}</span>
                            </div>
                            <p className="text-2xl font-black text-[#1C2B4E] leading-none">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultsTab;
