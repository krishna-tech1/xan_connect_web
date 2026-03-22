import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Loader, CheckCircle, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * MarkAttendance Component
 * 
 * Updated to fetch real students from the portal API.
 */
const MarkAttendance = ({ user }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [classOptions, setClassOptions] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

    const [systemSettings, setSystemSettings] = useState({ academic_start_date: '', academic_reset_message: '' });
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/portal/settings`);
            setSystemSettings(response.data);
        } catch (err) {
            console.error('Failed to fetch system settings:', err);
        }
    };
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        console.log('Attendance Init - User:', user.name, 'ClassTeacher:', user.class_teacher);
        
        const options = [];
        const ct = String(user.class_teacher || '').trim();
        
        if (ct && ct.toUpperCase() !== 'NONE' && ct.toLowerCase() !== 'null') {
            options.push({ 
                label: `${ct} (My Class)`, 
                value: ct 
            });
        }

        setClassOptions(options);

        if (options.length > 0) {
            setSelectedClass(options[0].value);
        } else {
            setLoading(false);
        }
    }, [user]);

    const today = new Date().toISOString().split('T')[0];
    const isToday = attendanceDate === today;
    const isFuture = attendanceDate > today;

    useEffect(() => {
        if (selectedClass) {
            fetchAttendanceData();
        } else if (classOptions.length > 0) {
             // Fallback if classOptions exists but selectedClass hasn't updated yet
             setSelectedClass(classOptions[0].value);
        } else if (!loading) {
            // If no class and not loading, we'll hit the restricted view
        }
    }, [selectedClass, attendanceDate, classOptions]);

    const changeDate = (offset) => {
        const d = new Date(attendanceDate);
        d.setDate(d.getDate() + offset);
        const newDate = d.toISOString().split('T')[0];
        setAttendanceDate(newDate);
    };

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const parts = selectedClass.trim().split(' ');
            let className = '';
            let section = '';

            if (parts.length > 1) {
                section = parts.pop();
                className = parts.join(' ');
            } else {
                className = parts[0];
                section = '';
            }

            // Fetch students AND existing attendance in parallel (or the combined endpoint)
            const response = await axios.get(`${API_URL}/api/portal/attendance`, {
                params: { className, section, date: attendanceDate }
            });
            
            // Map students to include attendance status (default to Present if null)
            const mapped = response.data.map(s => ({
                studentId: s.studentId,
                name: `${s.firstName} ${s.lastName}`,
                status: s.status || 'Present',
                isExisting: !!s.status
            }));
            setStudents(mapped);
        } catch (err) {
            console.error('Error fetching attendance data:', err);
            toast.error('Failed to load attendance records.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (index, newStatus) => {
        if (!isToday) return; // Only today is editable
        const updated = [...students];
        updated[index].status = newStatus;
        setStudents(updated);
    };

    const handleMarkAllPresent = () => {
        if (!isToday) return; 
        const updated = students.map(s => ({ ...s, status: 'Present' }));
        setStudents(updated);
        toast.info('All marked as Present.');
    };

    const markAsHoliday = () => {
        if (!isToday) return;
        const updated = students.map(s => ({ ...s, status: 'Holiday' }));
        setStudents(updated);
        toast.success('Day marked as Holiday.');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
            case 'Absent': return 'bg-rose-50 text-rose-500 border-rose-100';
            case 'Holiday': return 'bg-indigo-50 text-indigo-500 border-indigo-100';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    const stats = [
        { label: 'Total', value: students.length, color: 'text-[#1C2B4E]' },
        { label: 'Present', value: students.filter(s => s.status === 'Present').length, color: 'text-emerald-500' },
        { label: 'Absent', value: students.filter(s => s.status === 'Absent').length, color: 'text-rose-500' },
        { label: 'Holiday', value: students.filter(s => s.status === 'Holiday').length, color: 'text-indigo-500' },
    ];

    const handleSave = async () => {
        if (!isToday) {
            toast.warning('Submission is only allowed for the current date.');
            return;
        }

        try {
            setSaving(true);
            const parts = selectedClass.trim().split(' ');
            let className = '';
            let section = '';
            if (parts.length > 1) { section = parts.pop(); className = parts.join(' '); } else { className = parts[0]; }

            const records = students.map(s => ({
                studentId: s.studentId,
                className,
                section,
                date: attendanceDate,
                status: s.status,
                staffId: user.id
            }));

            await axios.post(`${API_URL}/api/portal/attendance`, { records });
            toast.success('Attendance report submitted successfully!');
            fetchAttendanceData(); // Refresh
        } catch (err) {
            console.error('Save Error:', err);
            toast.error('Failed to submit attendance.');
        } finally {
            setSaving(false);
        }
    };

    if (!loading && classOptions.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center text-rose-500 mb-8 border border-rose-100 shadow-sm">
                    <Shield size={48} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-[#1C2B4E] mb-3 tracking-tight">Access Restricted</h2>
                <p className="max-w-md text-slate-400 font-bold leading-relaxed uppercase tracking-widest text-[11px] px-8">
                    Only assigned <span className="text-[#0047AB]">Class Teachers</span> can access this attendance registry. Your role currently does not include class management permissions.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* System Notice Banner */}
            {systemSettings.academic_reset_message && (
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 rounded-[24px] text-white shadow-lg animate-in slide-in-from-top duration-700">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Important Announcement</p>
                            <p className="text-sm font-black tracking-tight">{systemSettings.academic_reset_message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header with Selection */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-[#0047AB] shadow-inner border border-blue-100/50">
                        <CalendarIcon size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#1C2B4E] tracking-tight">Attendance Registry</h2>
                        <h3 className="text-[12px] font-black text-[#004AAD] uppercase tracking-[0.2em] mt-2 bg-blue-50/50 px-4 py-1.5 rounded-lg border border-blue-100/50 inline-block shadow-sm animate-pulse-slow">
                            Your Class {selectedClass} Attendance
                        </h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 italic flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                           Secure Academic Database • Active Feed
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <div className="pl-4 text-slate-300">
                        <Shield size={18} />
                    </div>
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-transparent border-none outline-none font-black text-[#1C2B4E] text-sm pr-10 py-2 cursor-pointer appearance-none min-w-[200px]"
                    >
                        {classOptions.map((opt, idx) => (
                            <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Warning for Past/Future Dates */}
            {!isToday && (
                <div className={`p-4 rounded-2xl flex items-center gap-4 border ${isFuture ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-blue-50 border-blue-100 text-[#0047AB]'}`}>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center font-black">!</div>
                    <p className="text-xs font-black uppercase tracking-widest">
                        {isFuture ? 'Future Date - You cannot post attendance for upcoming days.' : 'Archived View - You are viewing past records. Editing is restricted.'}
                    </p>
                </div>
            )}

            {/* Top Stats & Actions */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6">
                <div className="flex flex-1 gap-4 min-w-[600px]">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex-1 bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm text-center">
                            <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="text-[13px] font-black text-slate-300 tracking-tight leading-none uppercase">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={handleSave}
                    disabled={!isToday || saving}
                    className={`px-10 py-5 rounded-[24px] font-black text-sm shadow-xl flex items-center gap-3 transition-all active:scale-95 leading-none ${
                        !isToday ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' : 'bg-[#1C2B4E] text-white hover:bg-black shadow-slate-200'
                    }`}
                >
                    {saving ? <Loader size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                    {isToday ? 'Submit Report' : 'Disabled'}
                </button>
            </div>

            {/* Registry Table Container */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-[24px] border border-slate-100 shadow-inner">
                        <button 
                            onClick={() => changeDate(-1)}
                            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0047AB] hover:shadow-md transition-all border border-slate-100"
                        >
                            <ChevronLeft size={20} strokeWidth={3} />
                        </button>
                        
                        <div className="relative group cursor-pointer">
                            <input 
                                type="date"
                                value={attendanceDate}
                                max={today}
                                min={systemSettings.academic_start_date || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <h3 className="text-[15px] font-black text-[#1C2B4E] uppercase tracking-wider mx-6 min-w-[180px] text-center border-b-2 border-dashed border-slate-200 group-hover:border-[#0047AB] transition-all">
                                {new Date(attendanceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                        </div>

                        <button 
                            onClick={() => changeDate(1)}
                            disabled={isToday}
                            className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-all border border-slate-100 ${
                                isToday ? 'opacity-30 cursor-not-allowed' : 'text-slate-400 hover:text-[#0047AB] hover:shadow-md'
                            }`}
                        >
                            <ChevronRight size={20} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleMarkAllPresent}
                            disabled={!isToday}
                            className={`px-8 py-3.5 rounded-2xl flex items-center gap-3 text-[12px] font-black transition-all border ${
                                !isToday 
                                ? 'bg-slate-50 text-slate-300 border-slate-100' 
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100/50'
                            }`}
                        >
                            <CheckCircle size={18} strokeWidth={3} />
                            Mark All Present
                        </button>
                        
                        <button
                            onClick={markAsHoliday}
                            disabled={!isToday}
                            className={`px-8 py-3.5 rounded-2xl flex items-center gap-3 text-[12px] font-black transition-all border ${
                                !isToday 
                                ? 'bg-slate-50 text-slate-300 border-slate-100' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100/50 text-indigo-500'
                            }`}
                        >
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                            Holiday
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center animate-pulse">
                            <div className="w-16 h-16 border-4 border-slate-100 border-t-[#0047AB] rounded-full animate-spin mb-6"></div>
                            <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Accessing Secure Records...</p>
                        </div>
                    ) : students.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-300 text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-50">
                                    <th className="pb-10 pl-6">ID</th>
                                    <th className="pb-10">Name</th>
                                    <th className="pb-10 text-center">Status</th>
                                    <th className="pb-10 text-right pr-6">Attendance Controller</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.map((student, idx) => (
                                    <tr key={idx} className="group hover:bg-[#F8FAFC]/80 transition-all">
                                        <td className="py-7 pl-6">
                                            <span className="text-[12px] font-black text-slate-300 font-mono tracking-tighter">#{student.studentId}</span>
                                        </td>
                                        <td className="py-7">
                                            <p className="text-[15px] font-black text-[#1C2B4E]">{student.name}</p>
                                        </td>
                                        <td className="py-7 text-center">
                                            <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] inline-block min-w-[110px] border shadow-sm ${getStatusColor(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-7 text-right pr-4">
                                            <div className="flex justify-end gap-3">
                                                {['Present', 'Absent', 'Holiday'].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleStatusChange(idx, s)}
                                                        disabled={!isToday}
                                                        className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-all border-2 ${
                                                            student.status === s 
                                                            ? (s === 'Present' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' :
                                                               s === 'Absent' ? 'bg-rose-500 border-rose-500 text-white shadow-lg' :
                                                               'bg-indigo-600 border-indigo-600 text-white shadow-lg')
                                                            : 'bg-slate-50 border-transparent text-slate-300 hover:border-slate-200'
                                                        } ${!isToday ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title={s}
                                                    >
                                                        {s === 'Present' ? <CheckCircle size={18} strokeWidth={3} /> :
                                                         s === 'Absent' ? <XIcon size={18} strokeWidth={3} /> :
                                                         <div className="w-3 h-3 rounded-full bg-white"></div>}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-24 text-center bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-100 mx-6">
                            <Shield size={40} className="mx-auto text-slate-200 mb-6" />
                            <p className="text-slate-300 font-black text-sm uppercase tracking-widest">No Student Records Found</p>
                            <p className="text-slate-300/50 font-bold text-xs mt-2 uppercase tracking-tight">Database query returned zero results for this class configuration</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CalendarIcon = ({ size, strokeWidth }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const XIcon = ({ size, strokeWidth }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const ClockIcon = ({ size, strokeWidth }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export default MarkAttendance;
