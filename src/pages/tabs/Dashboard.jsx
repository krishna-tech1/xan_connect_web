import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardTab = ({ user, onTabChange }) => {
    const [liveAnnouncements, setLiveAnnouncements] = useState([]);
    const [attendancePercent, setAttendancePercent] = useState('...');
    const [recentMarks, setRecentMarks] = useState([]);
    const [overallGrade, setOverallGrade] = useState('...');
    const [feeStats, setFeeStats] = useState({ pending: '...', subValue: 'Loading...' });
    const [homeworkCount, setHomeworkCount] = useState('...');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    const studentId = user?.studentId || user?.id;

    useEffect(() => {
        if (!studentId) return;

        const fetchData = async () => {
            try {
                // Fetch Announcements
                const annRes = await axios.get(`${API_URL}/api/portal/announcements`, {
                    params: { 
                        role: 'student', 
                        class: user?.details?.class ? `${user.details.class}-${user.details.section}` : null 
                    }
                });
                setLiveAnnouncements(annRes.data.slice(0, 3));

                // Fetch Homework Stats
                try {
                    const hwRes = await axios.get(`${API_URL}/api/portal/homework/student-view/${studentId}`);
                    const pendingCount = hwRes.data.filter(h => !h.submission).length;
                    setHomeworkCount(pendingCount);
                } catch (hwErr) {
                    console.error('Homework Fetch Error:', hwErr);
                    setHomeworkCount(0);
                }

                // Fetch Attendance for stat
                const attRes = await axios.get(`${API_URL}/api/portal/student-attendance/${studentId}`);
                const records = attRes.data;
                const total = records.length;
                const present = records.filter(r => r.status === 'Present').length;
                if (total > 0) {
                    setAttendancePercent(`${Math.round((present / total) * 100)}%`);
                } else {
                    setAttendancePercent('No Data');
                }

                // Fetch Marks for table & overall grade
                const marksRes = await axios.get(`${API_URL}/api/portal/student-marks/${studentId}`);
                const marksData = marksRes.data;
                setRecentMarks(marksData.slice(0, 5));
                
                const allVals = marksData.map(m => parseFloat(m.marks)).filter(v => !isNaN(v));
                if (allVals.length > 0) {
                    const avg = allVals.reduce((a, b) => a + b, 0) / allVals.length;
                    if (avg >= 90) setOverallGrade('A+');
                    else if (avg >= 80) setOverallGrade('A');
                    else if (avg >= 70) setOverallGrade('B+');
                    else if (avg >= 60) setOverallGrade('B');
                    else setOverallGrade('C');
                }

                // Fetch Fee Data
                const feeRes = await axios.get(`${API_URL}/api/portal/student-fees/${studentId}`);
                const feeData = feeRes.data;
                const pendingVal = parseFloat(feeData.stats.pending.replace(/[^\d.-]/g, ''));
                
                if (pendingVal <= 0) {
                    setFeeStats({
                        pending: 'Cleared',
                        subValue: 'No outstanding balance',
                        isPaid: true
                    });
                } else {
                    // Find nearest due date from breakdown if any
                    const breakdown = feeData.breakdown || [];
                    const withDates = breakdown.filter(b => b.period && b.period.includes('Due:'));
                    const nearestDue = withDates.length > 0 ? withDates[0].period : 'Termly';
                    
                    setFeeStats({
                        pending: feeData.stats.pending,
                        subValue: nearestDue,
                        isPaid: false
                    });
                }
            } catch (err) {
                console.error('Dashboard Data Fetch Error:', err);
            }
        };

        fetchData();
    }, [user, studentId]);

    const stats = [
        {
            id: 'attendance',
            label: 'Attendance',
            value: attendancePercent,
            subValue: parseFloat(attendancePercent) >= 90 ? 'Excellent' : 'Average',
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
            value: overallGrade,
            subValue: overallGrade.includes('A') ? 'Excellent' : 'Maintain',
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
            value: feeStats.pending,
            subValue: feeStats.subValue,
            iconSrc: (color) => (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    {feeStats.isPaid ? (
                        <path d="M20 6L9 17l-5-5" />
                    ) : (
                        <>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4" />
                            <path d="M12 16h.01" />
                        </>
                    )}
                </svg>
            ),
            bgColor: feeStats.isPaid ? '#E6F6EC' : '#FFF5F0',
            iconColor: feeStats.isPaid ? '#22C55E' : '#F6AD55',
            subValueColor: feeStats.isPaid ? '#22C55E' : '#E53E3E'
        },
        {
            id: 'homework',
            label: 'Homework Due',
            value: homeworkCount.toString(),
            subValue: `${homeworkCount} assignments pending`,
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
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shadow-inner relative group">
                            <img 
                                src={user?.photo_url || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=004AAD&color=fff&bold=true&size=128`} 
                                alt="Student"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black text-[#1C2B4E]">{user?.name}</h3>
                            <span className="bg-blue-50 text-[#004AAD] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100/50">Active</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1">
                            <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Class: {user?.class || 'N/A'}-{user?.section || ''}</span>
                            <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Roll No: {user?.rollNumber || 'N/A'}</span>
                            <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">ID: {user?.studentId || user?.id || 'N/A'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-70">Today's Presence</span>
                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-black text-emerald-600">Present</span>
                        </div>
                    </div>
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
                                {recentMarks.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-300 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-xl">
                                            No recent marks
                                        </td>
                                    </tr>
                                ) : (
                                    recentMarks.map((row, i) => {
                                        const marksVal = parseFloat(row.marks);
                                        const grade = !isNaN(marksVal) ? (marksVal >= 90 ? 'A+' : marksVal >= 80 ? 'A' : marksVal >= 70 ? 'B+' : 'B') : '—';
                                        return (
                                            <tr key={i} className="text-sm font-semibold text-[#2D3748]">
                                                <td className="py-4 pl-2 font-bold font-inter">{row.subject}</td>
                                                <td className="py-4 text-slate-400 font-inter">{row.exam_type}</td>
                                                <td className="py-4 text-slate-400 font-inter">{row.marks}</td>
                                                <td className="py-4 text-center">
                                                    <span className="bg-blue-50 text-[#004AAD] px-3 py-1 rounded-lg text-[11px] font-bold border border-blue-100/50 font-inter">
                                                        {grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Announcements */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-base font-bold text-[#1C2B4E]">Recent Announcements</h4>
                        <button 
                            onClick={() => onTabChange?.('announcements')}
                            className="text-[10px] font-black text-[#004AAD] uppercase tracking-widest hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-6">
                        {liveAnnouncements.length === 0 ? (
                            <div className="py-8 text-center text-slate-300 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-xl">
                                No new broadcasts
                            </div>
                        ) : liveAnnouncements.map((item, i) => (
                            <div 
                                key={item.id || i} 
                                onClick={() => onTabChange?.('announcements')}
                                className="flex justify-between items-start group cursor-pointer border-b border-white pb-1 last:border-0"
                            >
                                <div>
                                    <h5 className="text-[14px] font-bold text-[#2D3748] group-hover:text-[#004AAD] transition-colors font-inter line-clamp-1">{item.title}</h5>
                                    <p className="text-[10px] font-bold text-slate-300 mt-0.5 font-inter capitalize">
                                        {new Date(item.created_at).toLocaleDateString()} • {item.sender_name}
                                    </p>
                                </div>
                                <span className={`shrink-0 ml-3 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                                    item.type === 'warning' ? 'bg-rose-50 text-rose-500' :
                                    item.type === 'other' ? 'bg-emerald-50 text-emerald-500' :
                                    'bg-blue-50 text-[#004AAD]'
                                }`}>
                                    {item.type || 'Info'}
                                </span>
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
