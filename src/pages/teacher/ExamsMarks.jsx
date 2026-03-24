import React, { useState, useEffect } from 'react';
import { Shield, Search, Loader, Save, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ExamsMarks = ({ user }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedClassOption, setSelectedClassOption] = useState('');
    const [classOptions, setClassOptions] = useState([]);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        if (user) {
            const subjectsData = user.subjects || user.subjects_list;
            const subjects = Array.isArray(subjectsData) 
                ? subjectsData 
                : (typeof subjectsData === 'string' ? JSON.parse(subjectsData || '[]') : []);

            const options = subjects.map(sub => {
                const className = sub.class || sub.className || '';
                return {
                    label: `${className} (${sub.subject})`,
                    value: `${className}|${sub.subject}`,
                    className: className,
                    subject: sub.subject
                };
            }).filter(opt => opt.className); // Filter out empty classes

            setClassOptions(options);
            
            if (options.length > 0) {
                setSelectedClassOption(options[0].value);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (selectedClassOption) {
            fetchMarks();
        }
    }, [selectedClassOption]);

    const fetchMarks = async () => {
        try {
            setLoading(true);
            const [fullClassName, subject] = selectedClassOption.split('|');
            
            // Robustly parse class and section (e.g. "10th Std A" -> class="10th Std", section="A")
            const parts = fullClassName.trim().split(' ');
            let className = '';
            let section = '';

            if (parts.length > 1) {
                section = parts.pop();
                className = parts.join(' ');
            } else {
                className = parts[0];
                section = '';
            }

            const response = await axios.get(`${API_URL}/api/portal/marks`, {
                params: { className, section, subject }
            });
            
            // Map the data to a format the table expects
            const mapped = response.data.map(m => ({
                studentId: m.studentId,
                name: `${m.firstName} ${m.lastName}`,
                u1: m.u1_marks || '',
                u1_remarks: m.u1_remarks || '',
                u2: m.u2_marks || '',
                u2_remarks: m.u2_remarks || '',
                u3: m.u3_marks || '',
                u3_remarks: m.u3_remarks || '',
                grade: calculateGrade(m.u1_marks) // Default to U1 grade for now
            }));
            
            setStudents(mapped);
        } catch (err) {
            console.error('Error fetching marks:', err);
            toast.error('Failed to load marks.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarksChange = (idx, field, value) => {
        const updated = [...students];
        updated[idx][field] = value;
        // Re-calculate grade if u1/u2/u3 changes (simple logic for now)
        if (field === 'u1' || field === 'u2' || field === 'u3') {
            updated[idx].grade = calculateGrade(value);
        }
        setStudents(updated);
    };

    const calculateGrade = (marks) => {
        const m = parseInt(marks);
        if (isNaN(m)) return '--';
        if (m >= 90) return 'A+';
        if (m >= 80) return 'A';
        if (m >= 70) return 'B+';
        if (m >= 60) return 'B';
        if (m >= 50) return 'C';
        return 'D';
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const [fullClassName, subject] = selectedClassOption.split('|');
            // Robustly parse class and section
            const parts = fullClassName.trim().split(' ');
            let className = '';
            let section = '';

            if (parts.length > 1) {
                section = parts.pop();
                className = parts.join(' ');
            } else {
                className = parts[0];
                section = '';
            }

            // Prepare records for upsert (separate records for U1, U2, U3)
            const records = [];
            students.forEach(s => {
                if (s.u1) records.push({ studentId: s.studentId, className, section, subject, examType: 'U1', marks: s.u1, remarks: s.u1_remarks, staffId: user.id });
                if (s.u2) records.push({ studentId: s.studentId, className, section, subject, examType: 'U2', marks: s.u2, remarks: s.u2_remarks, staffId: user.id });
                if (s.u3) records.push({ studentId: s.studentId, className, section, subject, examType: 'U3', marks: s.u3, remarks: s.u3_remarks, staffId: user.id });
            });

            if (records.length === 0) {
                toast.info('No changes to save.');
                setSaving(false);
                return;
            }

            await axios.post(`${API_URL}/api/portal/marks`, { records });
            toast.success('Marks updated successfully!');
        } catch (err) {
            console.error('Save error:', err);
            toast.error('Failed to save marks.');
        } finally {
            setSaving(false);
        }
    };

    const stats = [
        { label: 'Total Students', value: students.length, color: 'text-[#1C2B4E]' },
        { label: 'Graded (U1)', value: students.filter(s => s.u1).length, color: 'text-emerald-500' },
        { label: 'Pending (U1)', value: students.filter(s => !s.u1).length, color: 'text-rose-500' },
        { label: 'Avg Score (U1)', value: students.length ? Math.round(students.reduce((acc, s) => acc + (parseInt(s.u1) || 0), 0) / (students.filter(s => s.u1).length || 1)) : 0, color: 'text-orange-400' },
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm gap-6">
                <div>
                    <h2 className="text-2xl font-black text-[#1C2B4E] tracking-tight">Academic Performance</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1.5 italic">Enter and manage marks for your subject classes</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <div className="pl-4 text-slate-300">
                        <Shield size={18} />
                    </div>
                    <select 
                        value={selectedClassOption}
                        onChange={(e) => setSelectedClassOption(e.target.value)}
                        className="bg-transparent border-none outline-none font-black text-[#1C2B4E] text-sm pr-10 py-2 cursor-pointer appearance-none min-w-[220px]"
                    >
                        {classOptions.length > 0 ? (
                            classOptions.map((opt, idx) => (
                                <option key={idx} value={opt.value}>{opt.label}</option>
                            ))
                        ) : (
                            <option value="">No subject classes assigned</option>
                        )}
                    </select>
                </div>
            </div>

            {/* Top Summary Stats & Action */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6">
                <div className="flex flex-1 gap-4 min-w-[600px]">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex-1 bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm text-center">
                            <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="text-[11px] font-black text-slate-300 tracking-tight leading-none uppercase">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="bg-[#1C2B4E] text-white px-10 py-5 rounded-[24px] font-black text-sm shadow-xl shadow-slate-200 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 group hover:bg-[#000]"
                >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
                    Save Records
                </button>
            </div>

            {/* Marks Entry Table */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="flex justify-between items-center mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <h3 className="text-lg font-black text-[#1C2B4E] uppercase tracking-wider">Exam Registry</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-orange-50 text-orange-500 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight">
                            Unit Exams (U1-U3)
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    {loading ? (
                         <div className="py-20 flex flex-col items-center justify-center animate-pulse">
                            <Loader className="text-blue-200 animate-spin mb-4" size={40} />
                            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Loading Students...</p>
                         </div>
                    ) : students.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-300 text-[11px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                                    <th className="pb-8 pl-4">ID</th>
                                    <th className="pb-8">Name</th>
                                    <th className="pb-8 text-center">U1 (100)</th>
                                    <th className="pb-8 text-center">U2 (100)</th>
                                    <th className="pb-8 text-center">U3 (100)</th>
                                    <th className="pb-8">Teacher Remarks</th>
                                    <th className="pb-8 text-right pr-4">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.map((student, idx) => (
                                    <tr key={idx} className="group hover:bg-[#F8FAFC]/50 transition-all duration-300">
                                        <td className="py-6 pl-4 text-[12px] font-black text-slate-300 font-mono italic">{student.studentId}</td>
                                        <td className="py-6">
                                            <div className="text-[14px] font-black text-[#1C2B4E]">{student.name}</div>
                                        </td>

                                        {/* U1 Score */}
                                        <td className="py-6 text-center">
                                            <input
                                                type="text"
                                                value={student.u1}
                                                maxLength={3}
                                                onChange={(e) => handleMarksChange(idx, 'u1', e.target.value)}
                                                className="w-16 h-12 bg-slate-50 border-2 border-transparent rounded-xl text-center text-sm font-black text-[#1C2B4E] focus:bg-white focus:border-blue-100 focus:outline-none transition-all"
                                            />
                                        </td>

                                        {/* U2 Score */}
                                        <td className="py-6 text-center">
                                            <input
                                                type="text"
                                                value={student.u2}
                                                maxLength={3}
                                                onChange={(e) => handleMarksChange(idx, 'u2', e.target.value)}
                                                className="w-16 h-12 bg-slate-50 border-2 border-transparent rounded-xl text-center text-sm font-black text-[#1C2B4E] focus:bg-white focus:border-blue-100 focus:outline-none transition-all"
                                            />
                                        </td>

                                        {/* U3 Score */}
                                        <td className="py-6 text-center">
                                            <input
                                                type="text"
                                                value={student.u3}
                                                maxLength={3}
                                                onChange={(e) => handleMarksChange(idx, 'u3', e.target.value)}
                                                className="w-16 h-12 bg-slate-50 border-2 border-transparent rounded-xl text-center text-sm font-black text-[#1C2B4E] focus:bg-white focus:border-blue-100 focus:outline-none transition-all"
                                            />
                                        </td>

                                        {/* Remarks */}
                                        <td className="py-6 pr-4 min-w-[250px]">
                                            <input
                                                type="text"
                                                placeholder="Add academic observation..."
                                                value={student.u1_remarks}
                                                onChange={(e) => handleMarksChange(idx, 'u1_remarks', e.target.value)}
                                                className="w-full h-12 bg-slate-50 border-2 border-transparent rounded-xl px-5 text-[12px] font-bold text-slate-500 focus:bg-white focus:border-blue-100 focus:outline-none transition-all"
                                            />
                                        </td>

                                        {/* Grade Badge */}
                                        <td className="py-6 text-right pr-4">
                                            <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                                                student.grade === 'A+' || student.grade === 'A' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' :
                                                student.grade === 'B+' || student.grade === 'B' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                                                'bg-slate-50 text-slate-400 border border-slate-100'
                                            }`}>
                                                {student.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 mx-4 flex flex-col items-center">
                            <AlertCircle size={40} className="text-slate-200 mb-4" />
                            <p className="text-slate-300 font-bold text-lg">No students found for this subject class.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamsMarks;
