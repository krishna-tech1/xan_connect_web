import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, Users, ChevronRight, BookOpen } from 'lucide-react';

const MyClasses = ({ user, onSelectClass }) => {
    const [classes, setClasses] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        if (!user) return;

        // The backend returns user.subjects (mapped from staff.subjects_list)
        const subjectsData = user.subjects || user.subjects_list;
        const subjects = Array.isArray(subjectsData) 
            ? subjectsData 
            : (typeof subjectsData === 'string' ? JSON.parse(subjectsData || '[]') : []);

        const uniqueClasses = [];
        const seen = new Set();
        
        // Add assigned individual subjects
        subjects.forEach(item => {
            const key = `${item.class || item.className}`;
            if (!seen.has(key)) {
                uniqueClasses.push({
                    grade: key,
                    subject: item.subject,
                    type: 'Subject Teacher'
                });
                seen.add(key);
            }
        });

        // Add class teacher role as a primary box if exists
        const ct = String(user.class_teacher || '').trim();
        if (ct && ct.toUpperCase() !== 'NONE' && ct.toLowerCase() !== 'null' && !seen.has(ct)) {
            uniqueClasses.unshift({
                grade: ct,
                subject: 'All Subjects (Class Teacher)',
                type: 'Class Teacher'
            });
        }

        setClasses(uniqueClasses);
        fetchCounts(uniqueClasses.map(c => c.grade));
    }, [user]);

    const fetchCounts = async (classList) => {
        if (classList.length === 0) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/api/portal/class-counts`, {
                params: { classes: classList.join(',') }
            });
            setCounts(response.data);
        } catch (err) {
            console.error('Failed to fetch counts:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center animate-pulse">
                <Loader className="text-[#0047AB] animate-spin mb-6" size={48} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Assigned Classes...</p>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="py-24 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm mx-auto max-w-2xl px-10">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <BookOpen size={40} className="text-slate-200" />
                </div>
                <h2 className="text-2xl font-black text-[#1C2B4E] mb-3">No Classes Assigned</h2>
                <p className="text-slate-400 font-bold text-sm leading-relaxed">
                    You currently don't have any assigned classes or subjects. Please contact the administration if this is an error.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((cls, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => onSelectClass(cls.grade)}
                        className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                    >
                        {/* Status Tag */}
                        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            cls.type === 'Class Teacher' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                        }`}>
                            {cls.type}
                        </div>

                        <div className="p-10 pb-8 flex-1">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0047AB] group-hover:text-white transition-colors duration-500">
                                <BookOpen size={24} strokeWidth={2.5} />
                            </div>
                            
                            <h3 className="text-[20px] font-black text-[#1C2B4E] tracking-tight mb-2 uppercase">{cls.grade}</h3>
                            <p className="text-[14px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{cls.subject}</p>

                            <div className="mt-8 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Users size={16} strokeWidth={2.5} />
                                </div>
                                <span className="text-[13px] font-black text-[#1C2B4E] tracking-tight">
                                    {counts[cls.grade] || 0} Students Enrolled
                                </span>
                            </div>
                        </div>

                        <div className="px-10 py-6 border-t border-slate-50 flex justify-between items-center group-hover:bg-slate-50/50 transition-colors">
                            <span className="text-[11px] font-black text-[#004AAD] uppercase tracking-widest">View Roster</span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#004AAD] group-hover:translate-x-1 transition-all">
                                <ChevronRight size={20} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyClasses;
