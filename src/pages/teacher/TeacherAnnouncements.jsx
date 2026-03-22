import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Users, User, Info, Clock, Trash2, Mail, MessageCircle, AlertTriangle, Flag, Inbox, Shield } from 'lucide-react';

const TeacherAnnouncements = ({ user }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [type, setType] = useState('info'); // info, warning, other
    const [announcements, setAnnouncements] = useState([]);
    const [view, setView] = useState('received'); // 'received' or 'sent'
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [assignedClasses, setAssignedClasses] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        if (user) {
            setupClasses();
            fetchAnnouncements();
        }
    }, [user, view]);

    const setupClasses = () => {
        const options = [];
        const seen = new Set();
        
        // 1. Add Class Teacher role
        const ct = String(user.class_teacher || '').trim();
        if (ct && ct.toUpperCase() !== 'NONE' && ct.toLowerCase() !== 'null') {
            options.push({ label: `${ct} (My Class)`, value: ct });
            seen.add(ct);
        }

        // 2. Add Subject Teacher classes (Deduplicated)
        const subjectsData = user.subjects || user.subjects_list;
        const subjects = Array.isArray(subjectsData) ? subjectsData : 
                        (typeof subjectsData === 'string' ? JSON.parse(subjectsData || '[]') : []);

        subjects.forEach(sub => {
            const className = sub.class || sub.className;
            if (className && !seen.has(className)) {
                options.push({ label: className, value: className });
                seen.add(className);
            }
        });

        setAssignedClasses(options);
        if (options.length > 0) setTargetClass(options[0].value);
    };

    const fetchAnnouncements = async () => {
        try {
            setFetching(true);
            const params = { role: 'teacher' };
            if (view === 'received') {
                params.class = user.class_teacher;
            } else {
                params.userId = user.id;
            }

            const response = await axios.get(`${API_URL}/api/portal/announcements`, { params });
            const data = view === 'received' 
                ? response.data.filter(a => a.sender_id !== user.id)
                : response.data.filter(a => a.sender_id === user.id);
            
            setAnnouncements(data);
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !message || !targetClass) return alert('Please fill in all fields');

        try {
            setLoading(true);
            await axios.post(`${API_URL}/api/portal/announcements`, {
                sender_id: user.id,
                sender_name: user.name,
                sender_role: 'teacher',
                target_type: 'class',
                target_class: targetClass,
                type: type,
                title,
                message
            });
            alert('Announcement posted successfully!');
            setTitle('');
            setMessage('');
            if (view === 'sent') fetchAnnouncements();
        } catch (err) {
            console.error('Send Error:', err);
            alert('Failed to post announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this broadcast?')) return;
        try {
            await axios.delete(`${API_URL}/api/portal/announcements/${id}`, {
                params: { userId: user.id }
            });
            fetchAnnouncements();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Compose Form */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 overflow-hidden sticky top-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#004AAD]">
                                <MessageCircle size={28} />
                            </div>
                            <h2 className="text-xl font-black text-[#1C2B4E]">Compose</h2>
                        </div>

                        <form onSubmit={handleSend} className="space-y-8">
                            {/* 1. Type */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">1. Announcement Type:</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'info', icon: Info, color: 'text-blue-500' },
                                        { id: 'warning', icon: AlertTriangle, color: 'text-rose-500' },
                                        { id: 'other', icon: Flag, color: 'text-emerald-500' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setType(t.id)}
                                            className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-3xl border-2 transition-all ${
                                                type === t.id ? 'border-[#004AAD] bg-blue-50/20' : 'border-slate-50 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                                            }`}
                                        >
                                            <t.icon size={20} className={t.color} />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">{t.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Subject */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1 leading-none">2. Subject Headline ({title.length}/25):</label>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={25}
                                    placeholder="Max 25 Characters"
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#004AAD] rounded-2xl px-6 py-4 font-bold text-sm outline-none transition-all placeholder:text-slate-200"
                                />
                            </div>

                            {/* 3. Description */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1 leading-none">3. Message Description ({message.length}/75):</label>
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={75}
                                    placeholder="Max 75 Characters"
                                    rows="3"
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#004AAD] rounded-2xl px-6 py-4 font-bold text-sm outline-none transition-all resize-none placeholder:text-slate-200"
                                ></textarea>
                            </div>

                            {/* Target Class */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Select Receiving Class:</label>
                                <select 
                                    value={targetClass}
                                    onChange={(e) => setTargetClass(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#004AAD] rounded-2xl px-6 py-4 font-bold text-sm outline-none transition-all cursor-pointer appearance-none text-[#1C2B4E]"
                                >
                                    {assignedClasses.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-[28px] font-black text-xs flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl ${
                                    loading ? 'bg-slate-100 text-slate-400' : 'bg-[#004AAD] text-white hover:bg-black shadow-blue-100'
                                }`}
                            >
                                {loading ? <Clock className="animate-spin" size={16} /> : <Send size={16} />}
                                Post Broadcast
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div className="w-full lg:w-2/3 space-y-8">
                    <div className="flex bg-white p-2.5 rounded-3xl border border-slate-100 shadow-sm w-fit max-w-full overflow-x-auto no-scrollbar">
                        <button 
                            onClick={() => setView('received')}
                            className={`px-10 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center gap-3 whitespace-nowrap ${
                                view === 'received' ? 'bg-[#004AAD] text-white shadow-lg' : 'text-slate-400 hover:text-[#004AAD] hover:bg-slate-50'
                            }`}
                        >
                            <Mail size={16} /> Inbox Messages
                        </button>
                        <button 
                            onClick={() => setView('sent')}
                            className={`px-10 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center gap-3 whitespace-nowrap ${
                                view === 'sent' ? 'bg-[#004AAD] text-white shadow-lg' : 'text-slate-400 hover:text-[#004AAD] hover:bg-slate-50'
                            }`}
                        >
                            <Send size={16} /> Sent Items
                        </button>
                    </div>

                    <div className="space-y-6">
                        {fetching ? (
                            <div className="py-24 text-center animate-pulse">
                                <Clock className="animate-spin mx-auto text-slate-100 mb-6" size={50} />
                                <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Updating Content...</p>
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="bg-white rounded-[40px] border border-slate-50 p-24 text-center">
                                <MessageCircle className="mx-auto text-slate-50 mb-8" size={80} />
                                <h3 className="text-2xl font-black text-slate-200">No content here</h3>
                            </div>
                        ) : (
                            announcements.map((ann) => (
                                <div key={ann.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-10 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex gap-4 items-center">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                                                ann.type === 'warning' ? 'bg-rose-500' : 
                                                ann.type === 'other' ? 'bg-emerald-500' : 'bg-[#004AAD]'
                                            }`}>
                                                {ann.type === 'info' ? <Info size={24} /> : ann.type === 'warning' ? <AlertTriangle size={24} /> : <Flag size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-[#004AAD] uppercase tracking-widest">{ann.sender_name}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{ann.target_class || ann.target_type}</span>
                                                </div>
                                                <p className="text-[12px] font-bold text-slate-300 tracking-tight">Post Date: {new Date(ann.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {ann.sender_id === user.id && (
                                            <button 
                                                onClick={() => handleDelete(ann.id)}
                                                className="p-3 text-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-[20px] font-black text-[#1C2B4E] mb-3 group-hover:text-[#004AAD] transition-colors line-clamp-2">{ann.title}</h3>
                                    <p className="text-[15px] font-bold text-slate-400 leading-relaxed whitespace-pre-wrap">{ann.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherAnnouncements;
