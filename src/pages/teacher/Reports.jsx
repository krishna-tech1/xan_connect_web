import React from 'react';

/**
 * Reports Component
 * 
 * Rebuilt to match the teacher portal's performance analytics dashboard design.
 * Features top-level KPIs, a comprehensive class performance summary table,
 * and detailed subject-wise breakdown cards.
 */
const Reports = () => {
    const kpis = [
        { label: 'Overall Avg.', value: '79%', trend: '+ 3% from last term', icon: 'clock', color: 'text-orange-400', bg: 'bg-orange-50' },
        { label: 'Pass Rate', value: '5', trend: '+ 3%', icon: 'trending-up', color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Students', value: '187', trend: '', icon: 'users', color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Avg. Attendance', value: '94%', trend: '', icon: 'calendar', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    const classSummary = [
        { class: '10 - A', students: 42, avg: '95%', pass: '91%', top: 95, attendance: '94%', passColor: 'bg-emerald-50 text-emerald-500' },
        { class: '11 - B', students: 38, avg: '85%', pass: '93%', top: 96, attendance: '91%', passColor: 'bg-emerald-50 text-emerald-500' },
        { class: '9 - C', students: 45, avg: '91%', pass: '88%', top: 91, attendance: '89%', passColor: 'bg-blue-50 text-blue-500' },
        { class: '12 - A', students: 39, avg: '81%', pass: '84%', top: 90, attendance: '95%', passColor: 'bg-blue-50 text-blue-500' },
    ];

    const subjectDetails = [
        { subject: 'Algebra', class: '10 - A', avg: '80%', highest: 98, lowest: 35, pass: '92%' },
        { subject: 'Statistics', class: '11 - B', avg: '80%', highest: 98, lowest: 35, pass: '92%' },
        { subject: 'Calculus', class: '12 - A', avg: '80%', highest: 98, lowest: 35, pass: '92%' },
        { subject: 'Mathematics', class: '9 - C', avg: '80%', highest: 98, lowest: 35, pass: '92%' },
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Top KPIs Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white p-8 rounded-[16px] border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                                {kpi.icon === 'clock' && (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {kpi.icon === 'trending-up' && (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                )}
                                {kpi.icon === 'users' && (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                                {kpi.icon === 'calendar' && (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-[13px] font-black text-slate-400">{kpi.label}</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#1C2B4E] mb-1">{kpi.value}</h2>
                        {kpi.trend && (
                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest leading-none flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                                {kpi.trend}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Class Performance Table Card */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-10">
                <h3 className="text-[16px] font-black text-[#1C2B4E] mb-10">Class Performance Summary</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-300 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 pl-2">Class</th>
                                <th className="pb-6 text-center">Students</th>
                                <th className="pb-6 text-center">Avg Score</th>
                                <th className="pb-6 text-center">Pass Rate</th>
                                <th className="pb-6 text-center">Top Score</th>
                                <th className="pb-6 text-right pr-2">Attendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {classSummary.map((item, i) => (
                                <tr key={i} className="group hover:bg-[#F8FAFC]/50 transition-colors">
                                    <td className="py-7 pl-2 text-[15px] font-black text-[#1C2B4E]">{item.class}</td>
                                    <td className="py-7 text-center text-[14px] font-bold text-slate-400">{item.students}</td>
                                    <td className="py-7 text-center text-[15px] font-black text-[#1C2B4E]">{item.avg}</td>
                                    <td className="py-7 text-center">
                                        <span className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight min-w-[80px] inline-block ${item.passColor}`}>
                                            {item.pass}
                                        </span>
                                    </td>
                                    <td className="py-7 text-center text-[14px] font-black text-[#1C2B4E]">{item.top}</td>
                                    <td className="py-7 text-right pr-2 text-[14px] font-black text-[#1C2B4E]">{item.attendance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Subject-wise Detailed Cards */}
            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar lg:grid lg:grid-cols-4 lg:overflow-visible">
                {subjectDetails.map((sub, i) => (
                    <div key={i} className="min-w-[280px] bg-white rounded-[16px] border border-slate-100 shadow-sm p-8 hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                            <h4 className="text-[16px] font-black text-[#1C2B4E]">{sub.subject}</h4>
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{sub.class}</span>
                        </div>

                        <div className="space-y-5 flex-1">
                            <div className="flex justify-between items-center group/item">
                                <span className="text-[13px] font-bold text-slate-300">Average</span>
                                <span className="text-[14px] font-black text-[#1C2B4E] group-hover/item:text-[#004AAD] transition-colors">{sub.avg}</span>
                            </div>
                            <div className="flex justify-between items-center group/item">
                                <span className="text-[13px] font-bold text-slate-300">Highest</span>
                                <span className="text-[14px] font-black text-emerald-500">{sub.highest}</span>
                            </div>
                            <div className="flex justify-between items-center group/item">
                                <span className="text-[13px] font-bold text-slate-300">Lowest</span>
                                <span className="text-[14px] font-black text-rose-500">{sub.lowest}</span>
                            </div>
                            <div className="flex justify-between items-center group/item">
                                <span className="text-[13px] font-bold text-slate-300">Pass Rate</span>
                                <span className="text-[14px] font-black text-[#1C2B4E]">{sub.pass}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
