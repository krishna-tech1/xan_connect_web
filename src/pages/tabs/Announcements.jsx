import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnnouncementsTab = ({ user }) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const studentClass = user?.details?.class && user?.details?.section
        ? `${user.details.class}-${user.details.section}`
        : null;

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/api/portal/announcements`, {
                    params: { role: 'student', class: studentClass }
                });
                setAnnouncements(res.data);
            } catch (err) {
                console.error('Announcements fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, [studentClass]);

    const getTypeStyle = (type) => {
        switch (type) {
            case 'warning': return { tag: 'Warning', tagColor: 'bg-orange-50 text-orange-600 border-orange-100' };
            case 'other': return { tag: 'Notice', tagColor: 'bg-green-50 text-green-600 border-green-100' };
            default: return { tag: 'Info', tagColor: 'bg-blue-50 text-blue-600 border-blue-100' };
        }
    };

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter space-y-6 pb-12">
            {loading ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-300 font-bold">
                    Loading announcements...
                </div>
            ) : announcements.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <p className="text-slate-300 font-bold text-sm">No announcements right now</p>
                </div>
            ) : (
                announcements.map((item, i) => {
                    const { tag, tagColor } = getTypeStyle(item.type);
                    return (
                        <div key={item.id || i} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden group hover:border-[#004AAD]/20 transition-all">
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1C2B4E] mb-2 group-hover:text-[#004AAD] transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {item.sender_name && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="capitalize">by {item.sender_name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border ${tagColor}`}>
                                        {tag}
                                    </span>
                                </div>

                                <p className="text-sm font-semibold text-slate-400 leading-relaxed">
                                    {item.message}
                                </p>

                                {item.target_type && item.target_type !== 'all' && (
                                    <div className="mt-4 pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
                                            Sent to: {item.target_type === 'class' ? item.target_class : item.target_type}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default AnnouncementsTab;
