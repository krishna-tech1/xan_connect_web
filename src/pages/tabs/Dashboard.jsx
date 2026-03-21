import React from 'react';

const DashboardTab = ({ user, onTabChange }) => {
    const stats = [
        {
            id: 'attendance',
            label: 'Attendance',
            value: '96%',
            subValue: 'Excellent',
            // Exact matching icon path for Attendance (List with checks)
            iconSrc: (color) => (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            ),
            bgColor: '#E6F6EC',
            iconColor: '#22C55E',
            subValueColor: '#22C55E'
        },
        {
            id: 'results',
            label: 'Overall Grade',
            value: 'A',
            subValue: 'Excellent',
            // Exact matching icon path for Overall Grade (Medal/Trophy)
            iconSrc: (color) => (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M8 21h8" />
                    <path d="M12 17v4" />
                    <path d="M7 4h10" />
                    <path d="M17 4v8a5 5 0 0 1-10 0V4" />
                    <path d="M15 9h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1" />
                    <path d="M9 9H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1" />
                </svg>
            ),
            bgColor: '#EBF3FF',
            iconColor: '#3182CE',
            subValueColor: '#CBD5E0'
        },
        {
            id: 'fees',
            label: 'Pending Fees',
            value: '₹12,500',
            subValue: 'Due: Mar 15',
            // Exact matching icon path for Fees (Rupee in Circle)
            iconSrc: (color) => (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 8h8" />
                    <path d="M8 12h8" />
                    <path d="M13 12L8 17" />
                    <path d="M12 8c0 4-5 4-5 4" />
                </svg>
            ),
            bgColor: '#FFF5F0',
            iconColor: '#F6AD55',
            subValueColor: '#E53E3E'
        },
        {
            id: 'homework',
            label: 'Homework Due',
            value: '2',
            subValue: '2 assignments pending',
            // Exact matching icon path for Homework (Pencil)
            iconSrc: (color) => (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
            ),
            bgColor: '#EEF2FF',
            iconColor: '#667EEA',
            subValueColor: '#E53E3E'
        }
    ];

    const results = [
        { subject: 'Mathematics', exam: 'Unit Test 2', marks: '76/100', grade: 'B+' },
        { subject: 'Science', exam: 'Unit Test 1', marks: '90/100', grade: 'B+' },
        { subject: 'English', exam: 'Unit Test 2', marks: '88/100', grade: 'B+' },
        { subject: 'Hindi', exam: 'Unit Test 2', marks: '75/100', grade: 'B+' },
        { subject: 'Computer', exam: 'Unit Test 1', marks: '88/100', grade: 'B+' },
    ];

    const upcoming = [
        { title: 'Mid-Term Exams', date: 'March 18 — March 25' },
        { title: 'PT Meeting', date: 'March 5, 10:00 AM' },
        { title: 'Annual Sports Day', date: 'March 15' },
        { title: 'Quarterly Exams', date: 'March 30 — April 6' },
    ];

    const homeworks = [
        { title: 'Chapter 8 — Quadratic Equations', subject: 'Mathematics', due: 'Feb 28', status: 'Pending' },
        { title: 'Lab Report — Chemical Reactions', subject: 'Science', due: 'Feb 27', status: 'Submitted' },
        { title: 'Essay — My Favorite Book', subject: 'English', due: 'Mar 1', status: 'Pending' },
    ];

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            <div className="mb-2">
            </div>

            {/* Profile Bar - ENHANCED */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between mb-10 group hover:border-[#004AAD]/10 transition-all duration-500">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
                            <svg className="w-10 h-10 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black text-[#1C2B4E]">{user?.name}</h3>
                            <span className="bg-blue-50 text-[#004AAD] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100/50">Active</span>
                        </div>
                        <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                            Class {user?.details?.class}-{user?.details?.section}
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            Roll No: {user?.details?.rollNumber}
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            ID: {user?.details?.studentId}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Attendance Today</span>
                        <span className="text-sm font-black text-green-500">Present</span>
                    </div>
                    <button className="bg-[#004AAD] hover:bg-[#003991] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 transition-all active:scale-95">
                        View Full Profile
                    </button>
                </div>
            </div>

            {/* Stats Grid - MATCHING IMAGE EXACTLY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bgColor }}>
                                {stat.iconSrc(stat.iconColor)}
                            </div>
                            <span className="text-[15px] font-bold text-[#4A5568]">{stat.label}</span>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-[26px] font-black text-[#1A202C] leading-none mb-2">{stat.value}</h4>
                            <p className="text-[13px] font-bold" style={{ color: stat.subValueColor }}>{stat.subValue}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Exam Results */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-base font-bold text-[#1C2B4E] mb-6">Recent Exam Results</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                                    <th className="pb-4 pl-2 font-inter">Subject</th>
                                    <th className="pb-4 font-inter">Exam</th>
                                    <th className="pb-4 font-inter">Marks</th>
                                    <th className="pb-4 text-center font-inter">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {results.map((row, i) => (
                                    <tr key={i} className="text-sm font-semibold text-[#2D3748]">
                                        <td className="py-4 pl-2 font-bold font-inter">{row.subject}</td>
                                        <td className="py-4 text-slate-400 font-inter">{row.exam}</td>
                                        <td className="py-4 text-slate-400 font-inter">{row.marks}</td>
                                        <td className="py-4 text-center">
                                            <span className="bg-blue-50 text-[#004AAD] px-3 py-1 rounded-lg text-[11px] font-bold border border-blue-100/50 font-inter">
                                                {row.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-base font-bold text-[#1C2B4E] mb-8">Upcoming</h4>
                    <div className="space-y-8">
                        {upcoming.map((item, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <h5 className="text-[15px] font-bold text-[#2D3748] font-inter">{item.title}</h5>
                                <p className="text-xs font-bold text-slate-300 font-inter">{item.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Homework Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-10">
                <h4 className="text-base font-bold text-[#1C2B4E] mb-6">Homework Status</h4>
                <div className="space-y-6">
                    {homeworks.map((hw, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div>
                                <h5 className="text-[14px] font-bold text-[#2D3748] group-hover:text-[#004AAD] transition-colors font-inter">{hw.title}</h5>
                                <p className="text-[12px] font-semibold text-slate-300 mt-0.5 font-inter">{hw.subject} • Due: {hw.due}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border font-inter ${hw.status === 'Pending'
                                ? 'bg-orange-50 text-orange-600 border-orange-100'
                                : 'bg-green-50 text-green-600 border-green-100'
                                }`}>
                                {hw.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;
