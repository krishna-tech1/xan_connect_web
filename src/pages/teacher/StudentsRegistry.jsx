import React, { useState, useEffect } from 'react';
import { User, Calendar, Award, MessageCircle, ChevronDown, Search, Loader, Shield } from 'lucide-react';
import axios from 'axios';

const StudentsRegistry = ({ user, initialFilter, onMessageStudent }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(initialFilter || '');
    const [classOptions, setClassOptions] = useState([]);
    const [studentAttendance, setStudentAttendance] = useState(null);
    const [studentMarks, setStudentMarks] = useState([]);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        if (selectedStudent) {
            const fetchStudentDetails = async () => {
                try {
                    // Fetch Attendance
                    const attRes = await axios.get(`${API_URL}/api/portal/student-attendance/${selectedStudent.studentId}`);
                    const records = attRes.data;
                    const present = records.filter(r => r.status === 'Present').length;
                    setStudentAttendance(records.length > 0 ? Math.round((present / records.length) * 100) : 'N/A');

                    // Fetch Marks
                    const marksRes = await axios.get(`${API_URL}/api/portal/student-marks/${selectedStudent.studentId}`);
                    const subjectsData = user.subjects || user.subjects_list;
                    const teacherSubjects = Array.isArray(subjectsData) 
                        ? subjectsData.map(s => s.subject.toLowerCase())
                        : (typeof subjectsData === 'string' ? JSON.parse(subjectsData || '[]').map(s => s.subject.toLowerCase()) : []);

                    // Filter marks to only show HIS/HER subjects
                    const filteredMarks = marksRes.data.filter(m => teacherSubjects.includes(m.subject.toLowerCase()));
                    setStudentMarks(filteredMarks);
                } catch (err) {
                    console.error('Error fetching student stats:', err);
                }
            };
            fetchStudentDetails();
        } else {
            setStudentAttendance(null);
            setStudentMarks([]);
        }
    }, [selectedStudent]);

    useEffect(() => {
        if (user) {
            const options = [];
            
            // 1. Add Class Teacher role (Default)
            const ct = String(user.class_teacher || '').trim();
            if (ct && ct.toUpperCase() !== 'NONE' && ct.toLowerCase() !== 'null') {
                options.push({ 
                    label: `${ct} (Class Teacher)`, 
                    value: ct 
                });
            }

            // 2. Add Subject Teacher roles
            const subjectsData = user.subjects || user.subjects_list;
            const subjects = Array.isArray(subjectsData) 
                ? subjectsData 
                : (typeof subjectsData === 'string' ? JSON.parse(subjectsData || '[]') : []);

            subjects.forEach(sub => {
                const className = sub.class || sub.className;
                if (className && !options.find(o => o.value === className)) {
                    options.push({ 
                        label: `${className} (${sub.subject})`, 
                        value: className 
                    });
                }
            });

            setClassOptions(options);
            
            // Priority: Initial Filter > First Option
            if (initialFilter && options.find(o => o.value === initialFilter)) {
                setSelectedClass(initialFilter);
            } else if (options.length > 0 && !selectedClass) {
                setSelectedClass(options[0].value);
            } else if (options.length === 0) {
                setLoading(false);
            }
        }
    }, [user, initialFilter]);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
        }
    }, [selectedClass]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            // Robustly parse class and section (e.g. "10th Std A" -> class="10th Std", section="A")
            const parts = selectedClass.trim().split(' ');
            let className = '';
            let section = '';

            if (parts.length > 1) {
                section = parts.pop();
                className = parts.join(' ');
            } else {
                className = parts[0];
                section = ''; // Or handle as null
            }

            const response = await axios.get(`${API_URL}/api/portal/students`, {
                params: { className, section }
            });
            setStudents(response.data);
            setSelectedStudent(null);
        } catch (err) {
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm gap-6">
                <div>
                    <h2 className="text-2xl font-black text-[#1C2B4E] tracking-tight">Student Directory</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1.5 italic">View performance profiles for your assigned classes</p>
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

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left Side: Student List */}
                <div className={`flex-1 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 h-fit transition-all duration-500 ${!selectedStudent ? 'xl:max-w-4xl' : ''}`}>
                    <div className="flex justify-between items-center mb-10 px-2">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <h3 className="text-lg font-black text-[#1C2B4E] uppercase tracking-wider">Attendance & Marks</h3>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <Search size={14} /> Search Student
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center animate-pulse">
                                <Loader className="text-blue-200 animate-spin mb-4" size={40} />
                                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Fetching Records...</p>
                            </div>
                        ) : students.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-300 text-[11px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                                        <th className="pb-8 pl-4">Photo</th>
                                        <th className="pb-8">Student Name</th>
                                        <th className="pb-8 text-center">Class</th>
                                        <th className="pb-8 text-center">Roll No</th>
                                        <th className="pb-8 text-right pr-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/50">
                                    {students.map((student, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => setSelectedStudent(student)}
                                            className={`group cursor-pointer transition-all ${selectedStudent?.studentId === student.studentId
                                                ? 'bg-[#F8FAFC]'
                                                : 'hover:bg-[#F8FAFC]/50'
                                                }`}
                                        >
                                            <td className="py-6 pl-4">
                                                <img 
                                                    src={student.photo_url || `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=0047AB&color=fff`} 
                                                    alt="Photo" 
                                                    className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                                                />
                                            </td>
                                            <td className="py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-black text-[#1C2B4E]">{student.firstName} {student.lastName}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{student.email || 'No email provided'}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-black text-slate-400">{student.class}</span>
                                            </td>
                                            <td className="py-6 text-center text-[13px] font-bold text-slate-900 group-hover:text-[#0047AB] transition-colors font-mono">
                                                {student.studentId}
                                            </td>
                                            <td className="py-6 text-right pr-4">
                                                <span className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight bg-emerald-50 text-emerald-500 border border-emerald-100">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-20 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 mx-4">
                                <p className="text-slate-300 font-bold text-lg">No students found for this class.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Student Profile */}
                {selectedStudent ? (
                    <div className="w-full xl:w-[450px] flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 flex flex-col items-center relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100px] -z-10"></div>
                            
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="absolute top-8 right-8 text-slate-200 hover:text-rose-500 transition-colors bg-white p-2 rounded-xl shadow-sm border border-slate-50"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-[14px] font-black text-slate-300 uppercase tracking-[0.3em] mb-12">Performance Summary</h3>

                            <div className="flex flex-col items-center mb-12 text-center">
                                <img 
                                    src={selectedStudent.photo_url || `https://ui-avatars.com/api/?name=${selectedStudent.firstName}+${selectedStudent.lastName}&background=0047AB&color=fff`} 
                                    alt="Profile" 
                                    className="w-28 h-28 rounded-[40px] mb-6 object-cover border-4 border-white shadow-xl ring-1 ring-slate-100"
                                />
                                <h4 className="text-[22px] font-black text-[#1C2B4E] tracking-tight">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                                <p className="text-[12px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em] flex items-center gap-3">
                                    ID {selectedStudent.studentId} <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> Sec {selectedStudent.section}
                                </p>
                            </div>

                            <div className="w-full space-y-4">
                                {(() => {
                                    const allVals = studentMarks.map(m => parseFloat(m.marks)).filter(v => !isNaN(v));
                                    const avg = allVals.length > 0 ? Math.round(allVals.reduce((a, b) => a + b, 0) / allVals.length) : null;
                                    const subjectName = studentMarks.length > 0 ? studentMarks[0].subject : '';

                                    return [
                                        { label: 'Attendance', value: studentAttendance === 'N/A' ? 'No Records' : `${studentAttendance}%`, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50', show: true },
                                        { 
                                            label: 'Average Score', 
                                            value: avg !== null ? `${avg}/100` : 'None', 
                                            icon: Award, 
                                            color: 'text-[#004AAD]', 
                                            bg: 'bg-blue-50',
                                            show: studentMarks.length > 0 
                                        },
                                        { label: 'Date of Birth', value: selectedStudent.dob || 'Not Set', icon: User, color: 'text-orange-500', bg: 'bg-orange-50', show: true }
                                    ].filter(item => item.show).map((item, idx) => (
                                        <div key={idx} className="bg-[#F8FAFC] rounded-3xl p-6 flex items-center gap-6 group hover:bg-slate-100/50 transition-all border border-white hover:border-slate-100/50">
                                            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-white`}>
                                                <item.icon size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 font-inter">{item.label}</p>
                                                <p className="text-[16px] font-black text-[#1C2B4E] font-inter">
                                                    {item.value}
                                                    {item.label === 'Average Score' && studentMarks.length > 0 && (
                                                        <span className="text-[10px] font-bold ml-2 text-slate-300">({subjectName})</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>

                            <button 
                                onClick={() => onMessageStudent(selectedStudent)}
                                className="w-full mt-10 bg-[#1C2B4E] text-white py-5 rounded-3xl flex items-center justify-center gap-3 font-black text-[14px] shadow-xl shadow-slate-100 hover:bg-[#000] active:scale-[0.98] transition-all group"
                            >
                                <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                                Parent Contact Channel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="hidden xl:flex flex-1 items-center justify-center h-[600px] border-2 border-dashed border-slate-50 rounded-[40px] bg-slate-50/10">
                         <div className="text-center">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-100 mx-auto shadow-sm mb-6">
                                <Search size={40} />
                            </div>
                            <h4 className="text-[14px] font-black text-slate-200 uppercase tracking-[0.3em]">No Student Selected</h4>
                            <p className="text-slate-200 font-bold mt-2 text-xs">Select a student from the list to view profile</p>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const X = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default StudentsRegistry;
