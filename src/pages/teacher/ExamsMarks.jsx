import React, { useState } from 'react';

/**
 * ExamsMarks Component
 * 
 * Rebuilt to match the teacher portal's high-fidelity marks entry design.
 * Features a comprehensive table for academic performance recording.
 */
const ExamsMarks = () => {
    const [students, setStudents] = useState([
        { roll: '001', name: 'Aaryan', u1: '96/100', u2: '86/100', u3: '', remarks: '', grade: 'A+' },
        { roll: '002', name: 'Ananya Singh', u1: '90/100', u2: '90/100', u3: '', remarks: '', grade: 'A+' },
        { roll: '003', name: 'Diya Sharma', u1: '88/100', u2: '98/100', u3: '', remarks: '', grade: 'A' },
        { roll: '004', name: 'Ishaan Gupta', u1: '75/100', u2: '75/100', u3: '', remarks: '', grade: 'B+' },
        { roll: '005', name: 'Manav Joshi', u1: '81/100', u2: '89/100', u3: '', remarks: '', grade: 'B' },
        { roll: '006', name: 'Rahul Verma', u1: '90/100', u2: '90/100', u3: '', remarks: '', grade: 'A' },
        { roll: '003', name: 'Diya Sharma', u1: '88/100', u2: '98/100', u3: '', remarks: '', grade: 'A' },
        { roll: '004', name: 'Ishaan Gupta', u1: '75/100', u2: '75/100', u3: '', remarks: '', grade: 'B' },
        { roll: '006', name: 'Rahul Verma', u1: '81/100', u2: '89/100', u3: '', remarks: '', grade: 'C' },
    ]);

    const handleMarksChange = (idx, field, value) => {
        const updated = [...students];
        updated[idx][field] = value;
        setStudents(updated);
    };

    const stats = [
        { label: 'Total', value: '32', color: 'text-[#1C2B4E]' },
        { label: 'Present', value: '29', color: 'text-emerald-500' },
        { label: 'Absent', value: '2', color: 'text-rose-500' },
        { label: 'Late', value: '1', color: 'text-orange-400' },
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Top Summary Stats & Action */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6">
                <div className="flex flex-1 gap-4 min-w-[600px]">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex-1 bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm text-center">
                            <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="text-[13px] font-black text-slate-300 tracking-tight leading-none">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <button className="bg-[#004AAD] text-white px-10 py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 leading-none">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Marks
                </button>
            </div>

            {/* Marks Entry Table */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-[16px] font-black text-[#1C2B4E]">Marks Entry</h3>
                    <span className="bg-orange-50 text-orange-500 px-4 py-2 rounded-lg text-[12px] font-black">
                        Grading in Progress
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-300 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 pl-2">Roll no</th>
                                <th className="pb-6">Name</th>
                                <th className="pb-6 text-center">U1</th>
                                <th className="pb-6 text-center">U2</th>
                                <th className="pb-6 text-center">U3</th>
                                <th className="pb-6">Remarks</th>
                                <th className="pb-6 text-right pr-6">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student, idx) => (
                                <tr key={idx} className="group hover:bg-[#F8FAFC]/50 transition-colors">
                                    <td className="py-5 pl-2 text-[13px] font-bold text-slate-400">{student.roll}</td>
                                    <td className="py-5 text-[14px] font-black text-[#1C2B4E]">{student.name}</td>

                                    {/* U1 Score */}
                                    <td className="py-5 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="text"
                                                value={student.u1}
                                                onChange={(e) => handleMarksChange(idx, 'u1', e.target.value)}
                                                className="w-20 bg-transparent text-center text-[13px] font-black text-slate-500 focus:outline-none"
                                            />
                                        </div>
                                    </td>

                                    {/* U2 Score */}
                                    <td className="py-5 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="text"
                                                value={student.u2}
                                                onChange={(e) => handleMarksChange(idx, 'u2', e.target.value)}
                                                className="w-20 bg-transparent text-center text-[13px] font-black text-slate-500 focus:outline-none"
                                            />
                                        </div>
                                    </td>

                                    {/* U3 Input Field */}
                                    <td className="py-5 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="text"
                                                placeholder="--"
                                                className="w-16 h-10 bg-[#F8FAFC] border border-slate-100 rounded-lg text-center text-[13px] font-black text-[#1C2B4E] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </td>

                                    {/* Remarks Text Input */}
                                    <td className="py-5">
                                        <input
                                            type="text"
                                            className="w-full h-10 bg-[#F8FAFC] border border-slate-100 rounded-lg px-4 text-[13px] font-bold text-slate-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                                        />
                                    </td>

                                    {/* Grade Badge */}
                                    <td className="py-5 text-right pr-6">
                                        <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-[12px] font-black inline-block min-w-[40px] text-center">
                                            {student.grade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamsMarks;
