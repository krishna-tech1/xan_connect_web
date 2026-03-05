import React, { useState } from 'react';

/**
 * MarkAttendance Component
 * 
 * Rebuilt to match the teacher portal's high-fidelity attendance registry design.
 * Features summary cards, date navigation, and interactive status buttons.
 */
const MarkAttendance = () => {
    const [students, setStudents] = useState([
        { roll: '001', name: 'Aaryan', status: 'Late' },
        { roll: '002', name: 'Ananya Singh', status: 'Half day' },
        { roll: '003', name: 'Diya Sharma', status: 'Present' },
        { roll: '004', name: 'Ishaan Gupta', status: 'Present' },
        { roll: '005', name: 'Manav Joshi', status: 'Present' },
        { roll: '006', name: 'Rahul Verma', status: 'Absent' },
        { roll: '007', name: 'Diya Sharma', status: 'Present' }, // Duplicate names as per reference
        { roll: '008', name: 'Ishaan Gupta', status: 'Present' },
        { roll: '009', name: 'Manav Joshi', status: 'Present' },
        { roll: '010', name: 'Rahul Verma', status: 'Present' },
    ]);

    const handleStatusChange = (index, newStatus) => {
        const updatedStudents = [...students];
        updatedStudents[index].status = newStatus;
        setStudents(updatedStudents);
    };

    const handleMarkAllPresent = () => {
        const allPresent = students.map(s => ({ ...s, status: 'Present' }));
        setStudents(allPresent);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-500';
            case 'Absent': return 'bg-rose-50 text-rose-500';
            case 'Late': return 'bg-orange-50 text-orange-400';
            case 'Half day': return 'bg-blue-50 text-blue-500';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    const stats = [
        { label: 'Total', value: '32', color: 'text-[#1C2B4E]' },
        { label: 'Present', value: '29', color: 'text-emerald-500' },
        { label: 'Absent', value: '2', color: 'text-rose-500' },
        { label: 'Late', value: '1', color: 'text-orange-400' },
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Top Stats & Actions */}
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                </button>
            </div>

            {/* Registry Table Container */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="text-[16px] font-black text-[#1C2B4E]">February 2026</h3>
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <button
                        onClick={handleMarkAllPresent}
                        className="bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-lg flex items-center gap-2 text-[13px] font-black transition-all hover:bg-emerald-100 leading-none"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Mark All Present
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-300 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 pl-2">Roll no</th>
                                <th className="pb-6">Name</th>
                                <th className="pb-6 text-center">Status</th>
                                <th className="pb-6 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student, idx) => (
                                <tr key={idx} className="group hover:bg-[#F8FAFC]/50 transition-colors">
                                    <td className="py-5 pl-2 text-[13px] font-bold text-slate-400">{student.roll}</td>
                                    <td className="py-5 text-[14px] font-black text-[#1C2B4E]">{student.name}</td>
                                    <td className="py-5 text-center">
                                        <span className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight inline-block min-w-[90px] ${getStatusColor(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="py-5 text-right pr-2">
                                        <div className="flex justify-end gap-2.5">
                                            {/* Present Button */}
                                            <button
                                                onClick={() => handleStatusChange(idx, 'Present')}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'Present' ? 'bg-emerald-500 text-white shadow-md' : 'bg-[#F8FAFC] text-slate-400 hover:bg-emerald-50'}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            {/* Absent Button */}
                                            <button
                                                onClick={() => handleStatusChange(idx, 'Absent')}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'Absent' ? 'bg-rose-500 text-white shadow-md' : 'bg-[#F8FAFC] text-slate-400 hover:bg-rose-50'}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            {/* Late Button */}
                                            <button
                                                onClick={() => handleStatusChange(idx, 'Late')}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'Late' ? 'bg-orange-500 text-white shadow-md' : 'bg-[#F8FAFC] text-slate-400 hover:bg-orange-50'}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                            {/* Half Day Button */}
                                            <button
                                                onClick={() => handleStatusChange(idx, 'Half day')}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'Half day' ? 'bg-blue-600 text-white shadow-md' : 'bg-[#F8FAFC] text-slate-400 hover:bg-blue-50'}`}
                                            >
                                                <span className="text-[11px] font-black">H</span>
                                            </button>
                                        </div>
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

export default MarkAttendance;
