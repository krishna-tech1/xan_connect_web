import React from 'react';

/**
 * TeacherDashboard Component
 * 
 * Rebuilt to match the provided high-fidelity reference design.
 * Features a comprehensive overview for teachers including stats, schedule, tasks, and performance.
 */
const TeacherDashboard = ({ user }) => {
    // Hardcoded data based on the reference image
    const stats = [
        { label: 'Classes Today', value: '5', sub: '1 substitution', subColor: 'text-rose-500', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
        { label: 'Total Students', value: '187', sub: '', subColor: 'text-slate-400', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110-8 4 4 0 010 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
        { label: 'Attendance Today', value: '94%', sub: '+2% vs last week', subColor: 'text-emerald-500', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
        { label: 'Pending Tasks', value: '4', sub: '', subColor: 'text-slate-400', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' }
    ];

    const schedule = [
        { time: '9:00 am', subject: 'Mathematics', class: '10 - A' },
        { time: '10:00 am', subject: 'Statistics', class: '11 - C' },
        { time: '1:00 pm', subject: 'Calculus', class: '12 - B' },
        { time: '2:00 pm', subject: 'Mathematics', class: '10 - A' }
    ];

    const pendingWorks = [
        { title: 'Grade 10-A Math Test Papers', due: 'Due: Today', color: 'bg-rose-500' },
        { title: 'Upload homework for 9-C', due: 'Due: Today', color: 'bg-rose-500' },
        { title: 'Submit 11-A attendance correction', due: 'Due: Tomorrow', color: 'bg-orange-500' },
        { title: 'Review 12-A project submissions', due: 'Due: Mar 3', color: 'bg-emerald-500' }
    ];

    const announcements = [
        { title: 'Parent-Teacher Meeting on March 5th', time: '2 hours ago', type: 'Warning' },
        { title: 'Annual Sports Day — Volunteers Needed', time: '5 hours ago', type: 'Info' },
        { title: 'Mid-term exam schedule released', time: '1 day ago', type: 'Warning' }
    ];

    const snapshot = [
        { label: 'Avg. Score', value: '78%', trend: '+3%', trendColor: 'text-emerald-500' },
        { label: 'Pass Rate', value: '89%', trend: '+1%', trendColor: 'text-emerald-500' },
        { label: 'Attendance Avg.', value: '94%', trend: '+2%', trendColor: 'text-emerald-500' },
        { label: 'Homework Completion', value: '79%', trend: '-2', trendColor: 'text-rose-500' }
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.iconColor}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <span className="text-[13px] font-black text-slate-500 tracking-tight">{stat.label}</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-3xl font-black text-[#1C2B4E]">{stat.value}</p>
                            {stat.sub && (
                                <p className={`text-[11px] font-black mt-1 ${stat.subColor}`}>{stat.sub}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section: Schedule & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Schedule */}
                <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8">
                    <h3 className="text-[16px] font-black text-[#1C2B4E] mb-8">Today's Schedule</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-300 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4">Time</th>
                                    <th className="pb-4">Subject</th>
                                    <th className="pb-4 text-right">Class</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {schedule.map((item, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-5 text-[13px] font-black text-[#1C2B4E]">{item.time}</td>
                                        <td className="py-5 text-[13px] font-bold text-slate-400 group-hover:text-[#1C2B4E] transition-colors">{item.subject}</td>
                                        <td className="py-5 text-right">
                                            <span className="bg-blue-50 text-[#004AAD] text-[10px] font-black px-4 py-1.5 rounded-lg border border-blue-100">
                                                {item.class}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending Works */}
                <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8">
                    <h3 className="text-[16px] font-black text-[#1C2B4E] mb-8">Pending Works</h3>
                    <div className="space-y-6">
                        {pendingWorks.map((work, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${work.color}`}></div>
                                <div>
                                    <p className="text-[14px] font-black text-[#1C2B4E] leading-tight">{work.title}</p>
                                    <p className="text-[11px] font-bold text-slate-300 mt-1 uppercase tracking-tight">{work.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8">
                <h3 className="text-[16px] font-black text-[#1C2B4E] mb-8">Announcements</h3>
                <div className="space-y-6">
                    {announcements.map((ann, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <h4 className="text-[14px] font-black text-[#1C2B4E] group-hover:text-[#004AAD] transition-colors">{ann.title}</h4>
                                <p className="text-[11px] font-bold text-slate-300 mt-1 tracking-tight">{ann.time}</p>
                            </div>
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg leading-none ${ann.type === 'Warning' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'
                                }`}>
                                {ann.type}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Snapshot */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8">
                <h3 className="text-[16px] font-black text-[#1C2B4E] mb-8">Performance Snapshot</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {snapshot.map((item, i) => (
                        <div key={i} className="bg-[#F8FAFC] p-6 rounded-[12px] border border-slate-50 flex flex-col items-center justify-center text-center">
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-3 leading-none">{item.label}</p>
                            <div className="flex items-center gap-1.5 mb-1">
                                <svg className={`w-3 h-3 ${item.trendColor}`} fill="currentColor" viewBox="0 0 20 20">
                                    {item.trend.includes('+') ? (
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 4.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                    )}
                                </svg>
                                <span className={`text-[12px] font-black ${item.trendColor}`}>{item.trend}</span>
                            </div>
                            <p className="text-3xl font-black text-[#1C2B4E]">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
