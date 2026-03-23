import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * TeacherDashboard Component
 */
const TeacherDashboard = ({ user, onTabChange }) => {
    const [liveAnnouncements, setLiveAnnouncements] = useState([]);
    const [classesCount, setClassesCount] = useState('...');
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    const staffId = user?.staffId || user?.id;

    useEffect(() => {
        if (!staffId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Announcements
                const annRes = await axios.get(`${API_URL}/api/portal/announcements`, {
                    params: { role: 'teacher', userId: staffId }
                });
                setLiveAnnouncements(annRes.data.slice(0, 3));

                // Fetch Dashboard Data (Classes count + Schedule)
                const dashRes = await axios.get(`${API_URL}/api/portal/teacher-dashboard-data/${staffId}`);
                setClassesCount(dashRes.data.classesToday);
                setScheduleData(dashRes.data.schedule);
            } catch (err) {
                console.error('Dash Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, staffId]);

    // UI Stats configuration
    const stats = [
        { label: 'Classes Today', value: classesCount, sub: classesCount === 'Not Allocated' ? 'Check timetable' : 'Allocated periods', subColor: classesCount === 'Not Allocated' ? 'text-rose-400' : 'text-emerald-500', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
        { label: 'Total Students', value: '187', sub: 'Calculated', subColor: 'text-slate-400', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110-8 4 4 0 010 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
        { label: 'Attendance Today', value: '94%', sub: '+2% vs last week', subColor: 'text-emerald-500', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' }
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] ${loading ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.iconColor}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <span className="text-[13px] font-black text-slate-500 tracking-tight">{stat.label}</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-3xl font-black text-[#1C2B4E]">{loading ? '...' : stat.value}</p>
                            {stat.sub && (
                                <p className={`text-[11px] font-black mt-1 ${stat.subColor}`}>{stat.sub}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section: Schedule */}
            <div className="grid grid-cols-1 gap-8">
                {/* Today's Schedule */}
                <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-[16px] font-black text-[#1C2B4E]">Today's Schedule</h3>
                        <span className="text-[10px] bg-slate-50 text-slate-400 font-black px-3 py-1 rounded-md uppercase tracking-widest">Live Updates</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-300 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4">Time</th>
                                    <th className="pb-4">Period</th>
                                    <th className="pb-4">Subject</th>
                                    <th className="pb-4 text-right">Class</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {scheduleData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-12 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">
                                            No Classes Allocated for Today
                                        </td>
                                    </tr>
                                ) : (
                                    scheduleData.map((item, i) => (
                                        <tr key={i} className="group">
                                            <td className="py-5 text-[13px] font-black text-[#1C2B4E]">{item.time}</td>
                                            <td className="py-5 font-bold text-slate-400">Period {item.period}</td>
                                            <td className="py-5 text-[13px] font-bold text-slate-400 group-hover:text-[#1C2B4E] transition-colors">{item.subject}</td>
                                            <td className="py-5 text-right">
                                                <span className="bg-blue-50 text-[#004AAD] text-[10px] font-black px-4 py-1.5 rounded-lg border border-blue-100">
                                                    {item.class}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[16px] font-black text-[#1C2B4E]">Announcements</h3>
                    <button 
                        onClick={() => onTabChange?.('announcements')}
                        className="text-[10px] font-black text-[#004AAD] uppercase tracking-widest hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="space-y-6">
                    {liveAnnouncements.length === 0 ? (
                        <p className="text-slate-300 font-bold text-xs py-4 text-center">No recent broadcasts</p>
                    ) : liveAnnouncements.map((ann, i) => (
                        <div 
                            key={ann.id || i} 
                            onClick={() => onTabChange?.('announcements')}
                            className="flex justify-between items-center group cursor-pointer"
                        >
                            <div>
                                <h4 className="text-[14px] font-black text-[#1C2B4E] group-hover:text-[#004AAD] transition-colors">{ann.title}</h4>
                                <p className="text-[11px] font-bold text-slate-300 mt-1 tracking-tight"> {new Date(ann.created_at).toLocaleDateString()} </p>
                            </div>
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg leading-none capitalize ${
                                ann.type === 'warning' ? 'bg-orange-50 text-orange-500' : 
                                ann.type === 'other' ? 'bg-emerald-50 text-emerald-500' : 
                                'bg-blue-50 text-[#004AAD]'
                            }`}>
                                {ann.type || 'Info'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
